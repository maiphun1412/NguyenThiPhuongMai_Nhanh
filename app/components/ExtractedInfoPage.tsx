"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import {
  get,
  limitToLast,
  onValue,
  orderByChild,
  query,
  ref,
} from "firebase/database";
import { realtimeDb } from "../../src/lib/firebase";

type FirebaseMessage = {
  createdAt?: number | string;
  message?: string;
  name?: string;
  role?: string;
  sessionKey?: string;
};

type FirebaseConversation = {
  createdAt?: number | string;
  updatedAt?: number | string;
  lastMessageTime?: number | string;
  name?: string;
  customerName?: string;
  phone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  sessionKey?: string;
  messages?: Record<string, FirebaseMessage>;
};

type FirebaseExtractedInfo = {
  conversationId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  updatedAt?: number | string;
};

type ChatMessage = {
  id: string;
  createdAt: number;
  message: string;
  name: string;
  role: "USER" | "BOT" | "STAFF";
  sessionKey: string;
};

type ChatConversation = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  sessionKey: string;
  createdAt: number;
  updatedAt: number;
  messages: ChatMessage[];
};

type ExtractedCustomerInfo = {
  name: string;
  phone: string;
  email: string;
  hasAnyInfo: boolean;
  isAnonymous: boolean;
};

type ExportRow = {
  stt: number;
  name: string;
  phone: string;
  email: string;
  updatedAt: string;
};

type ActionMenu = {
  id: string;
  type: "phone" | "email" | "more";
} | null;

const CHAT_HISTORY_PATH = "nhanhtravel-website/maiphuong/chats";
const EXTRACTED_INFO_PATH = "nhanhtravel-website/maiphuong/extracted-info";
const IGNORED_COMPANY_PHONES = ["0909991205", "84909991205"];

function toTime(value: unknown) {
  if (!value) return 0;
  if (typeof value === "number") return value;

  const parsed = new Date(String(value)).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

function normalizeRole(role?: string): "USER" | "BOT" | "STAFF" {
  const value = String(role || "").toLowerCase();

  if (value === "user" || value === "customer") return "USER";
  if (value === "staff" || value === "admin") return "STAFF";

  return "BOT";
}

function isAnonymousName(name?: string) {
  const value = String(name || "").trim().toLowerCase();

  return (
    !value ||
    value === "anonymous" ||
    value === "khách hàng" ||
    value === "khach hang" ||
    value === "chưa xác định" ||
    value === "chua xac dinh"
  );
}

function normalizeMessages(
  messages?: Record<string, FirebaseMessage>
): ChatMessage[] {
  if (!messages) return [];

  return Object.entries(messages)
    .map(([id, item]) => ({
      id,
      createdAt: toTime(item.createdAt),
      message: String(item.message || ""),
      name: String(item.name || "anonymous"),
      role: normalizeRole(item.role),
      sessionKey: String(item.sessionKey || ""),
    }))
    .filter((item) => item.message.trim())
    .sort((a, b) => a.createdAt - b.createdAt);
}

function extractNameFromText(text?: string) {
  const value = String(text || "").replace(/\s+/g, " ").trim();

  if (!value) return "";

  const patterns = [
    /(?:tên\s+là|tên\s+mình\s+là|mình\s+tên\s+là|em\s+tên\s+là|tên\s+em\s+là|anh\s+tên\s+là|chị\s+tên\s+là|tôi\s+tên\s+là|họ\s+tên|họ\s+và\s+tên|hoten)\s*[:\-]?\s*([A-Za-zÀ-ỹ\s]{2,80})/i,
    /(?:mình\s+là|em\s+là|tôi\s+là|anh\s+là|chị\s+là)\s+([A-Za-zÀ-ỹ\s]{2,80})/i,
    /(?:chào|dạ chào|xin chào)\s+(?:chị|anh)?\s*([A-ZÀ-Ỹ][A-Za-zÀ-ỹ]+(?:\s+[A-ZÀ-Ỹ][A-Za-zÀ-ỹ]+){1,5})/i,
  ];

  for (const pattern of patterns) {
    const match = value.match(pattern);

    if (match?.[1]) {
      const name = match[1]
        .replace(
          /(?:số điện thoại|sdt|sđt|phone|email|gmail|zalo|chị|anh|em|ạ|ơi|có|cần|quan tâm|muốn|test).*$/i,
          ""
        )
        .replace(/[,.!:;|\-]+$/g, "")
        .trim();

      if (name.split(/\s+/).length >= 2) {
        return name;
      }
    }
  }

  return "";
}

function normalizeConversation(
  id: string,
  data: FirebaseConversation
): ChatConversation {
  const messages = normalizeMessages(data.messages);

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];
  const firstUserMessage = messages.find((item) => item.role === "USER");

  const extractedNameFromUserMessage =
    messages
      .filter((item) => item.role === "USER")
      .map((item) => extractNameFromText(item.message))
      .find((name) => name && !isAnonymousName(name)) || "";

  const firstNamedUserMessage = messages.find(
    (item) => item.role === "USER" && item.name && !isAnonymousName(item.name)
  );

  return {
    id,
    customerName:
      data.customerName ||
      extractedNameFromUserMessage ||
      firstNamedUserMessage?.name ||
      (!isAnonymousName(data.name) ? data.name || "" : "") ||
      firstUserMessage?.name ||
      firstMessage?.name ||
      "anonymous",
    customerPhone: data.customerPhone || data.phone || "",
    customerEmail: data.customerEmail || data.email || "",
    sessionKey:
      data.sessionKey ||
      firstMessage?.sessionKey ||
      lastMessage?.sessionKey ||
      id,
    createdAt: toTime(data.createdAt) || firstMessage?.createdAt || 0,
    updatedAt:
  toTime(data.lastMessageTime) ||
  toTime(data.updatedAt) ||
  lastMessage?.createdAt ||
  firstMessage?.createdAt ||
  0,
    messages,
  };
}

function formatDate(value: number) {
  if (!value) return "Không rõ thời gian";
  return new Date(value).toLocaleString("vi-VN");
}

function formatShortDate(value: number) {
  if (!value) return "Không rõ";
  return new Date(value).toLocaleDateString("vi-VN");
}

function getSessionTitle(conversation: ChatConversation) {
  const shortId = conversation.id.replace("conv_", "").slice(0, 10);
  return `Session #${shortId}`;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function getPhoneForAction(phone: string) {
  const digits = normalizePhone(phone);

  if (!digits) return "";
  if (digits.startsWith("84")) return `+${digits}`;
  if (digits.startsWith("0")) return digits;

  return digits;
}

function extractCustomerInfo(
  conversation: ChatConversation
): ExtractedCustomerInfo {
  const userText = conversation.messages
    .filter((message) => message.role === "USER")
    .map((message) => message.message)
    .join(" ");

  const allText = conversation.messages
    .map((message) => message.message)
    .join(" ");

  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const phoneRegex =
    /(?:\(?\+?84\)?|84|0)(?:\s|\.|-)?(?:[0-9]{2,3})(?:\s|\.|-)?(?:[0-9]{3})(?:\s|\.|-)?(?:[0-9]{3,4})/;

  const extractedName =
    extractNameFromText(userText) || extractNameFromText(allText);

  const name = conversation.customerName || extractedName || "Ẩn danh";

  const email =
    conversation.customerEmail ||
    userText.match(emailRegex)?.[0] ||
    allText.match(emailRegex)?.[0] ||
    "";

  const rawPhone =
    conversation.customerPhone ||
    userText.match(phoneRegex)?.[0] ||
    allText.match(phoneRegex)?.[0] ||
    "";

  const normalizedRawPhone = normalizePhone(rawPhone);

  const phone = IGNORED_COMPANY_PHONES.includes(normalizedRawPhone)
    ? ""
    : rawPhone;

  const isAnonymous = isAnonymousName(name);

  return {
    name: isAnonymous ? "Ẩn danh" : name,
    phone,
    email,
    hasAnyInfo: Boolean(phone || email),
    isAnonymous,
  };
}

function hasContactInfo(info: ExtractedCustomerInfo) {
  return Boolean(info.email || info.phone);
}

function escapeCsvCell(value: string | number) {
  const text = String(value ?? "");
  return `"${text.replace(/"/g, '""')}"`;
}

function escapeHtml(value: string | number) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M10.8 18.1a7.3 7.3 0 1 1 0-14.6 7.3 7.3 0 0 1 0 14.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="m16.2 16.2 4.3 4.3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M5.2 18.3A8.2 8.2 0 1 1 8 20l-3.3.7.5-2.4Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 11.2h7M8.5 14h4.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function SaveIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 4.5h11.2L19 7.3v12.2H5v-15Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M8 4.5v6h7v-6M8 19.5v-5h8v5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.2 4.8 9.6 4l2.1 4.6-1.4 1.1c.9 1.9 2.4 3.5 4.2 4.4l1.2-1.5 4.5 2.1-.8 2.5c-.3.9-1.2 1.5-2.1 1.4C10.8 18.2 5.8 13.2 5.5 6.8c0-.9.7-1.7 1.7-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M4.5 6.5h15v11h-15v-11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="m5 7 7 6 7-6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 12.2a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M4.8 20.2c.8-3.4 3.5-5.4 7.2-5.4s6.4 2 7.2 5.4"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DotsIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 6.8h.01M12 12h.01M12 17.2h.01"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ExtractedInfoPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<ActionMenu>(null);

  const conversationsWithInfo = useMemo(() => {
    return conversations
      .map((conversation) => ({
        conversation,
        info: extractCustomerInfo(conversation),
      }))
      .filter(({ info }) => hasContactInfo(info));
  }, [conversations]);

  const anonymousIndexMap = useMemo(() => {
    const map = new Map<string, number>();
    let count = 1;

    const anonymousItems = [...conversationsWithInfo]
      .filter(({ info }) => info.isAnonymous)
      .sort((a, b) => {
        const timeA = a.conversation.createdAt || a.conversation.updatedAt || 0;
        const timeB = b.conversation.createdAt || b.conversation.updatedAt || 0;

        return timeA - timeB;
      });

    anonymousItems.forEach(({ conversation }) => {
      map.set(conversation.id, count);
      count += 1;
    });

    return map;
  }, [conversationsWithInfo]);

  function getDisplayExtractedName(
    conversation: ChatConversation,
    info: ExtractedCustomerInfo
  ) {
    if (!info.isAnonymous) return info.name;

    const index = anonymousIndexMap.get(conversation.id);

    return index ? `Ẩn danh (${index})` : "Ẩn danh";
  }

  const filteredItems = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return conversationsWithInfo;

    return conversationsWithInfo.filter(({ conversation, info }) => {
      const displayName = getDisplayExtractedName(conversation, info);

      const text = [
        conversation.id,
        conversation.sessionKey,
        conversation.customerName,
        displayName,
        info.name,
        info.phone,
        info.email,
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [conversationsWithInfo, keyword, anonymousIndexMap]);

  useEffect(() => {
    setLoading(true);
    setLoadError("");

   const conversationsRef = query(
  ref(realtimeDb, CHAT_HISTORY_PATH),
  orderByChild("lastMessageTime"),
  limitToLast(50)
);
    const unsubscribe = onValue(
      conversationsRef,
      async (snapshot) => {
        try {
          const rawValue = snapshot.val() || {};

          const extractedSnapshot = await get(
            ref(realtimeDb, EXTRACTED_INFO_PATH)
          );

          const extractedValue =
            (extractedSnapshot.val() || {}) as Record<
              string,
              FirebaseExtractedInfo
            >;

          const nextConversations = Object.entries(rawValue)
            .map(([id, value]) => {
              const conversationData = value as FirebaseConversation;
              const extractedInfo = extractedValue[id];

              return normalizeConversation(id, {
                ...conversationData,
                customerName:
                  extractedInfo?.customerName || conversationData.customerName,
                customerPhone:
                  extractedInfo?.phone || conversationData.customerPhone,
                customerEmail:
                  extractedInfo?.email || conversationData.customerEmail,
                phone: extractedInfo?.phone || conversationData.phone,
                email: extractedInfo?.email || conversationData.email,
                updatedAt:
  extractedInfo?.updatedAt ||
  conversationData.lastMessageTime ||
  conversationData.updatedAt ||
  conversationData.createdAt,
              });
            })
            .filter((item) => item.messages.length > 0)
            .sort((a, b) => b.updatedAt - a.updatedAt);

          setConversations(nextConversations);
          setLoading(false);
        } catch (error) {
          console.error("Firebase extracted info merge error:", error);
          setLoadError("Không thể tải dữ liệu trích xuất từ Firebase.");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Firebase extracted info error:", error);
        setLoadError("Không thể tải dữ liệu trích xuất từ Firebase.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  async function handleCopy(text: string, label: string) {
    if (!text) return;

    try {
      await navigator.clipboard.writeText(text);
      alert(`Đã copy ${label}.`);
    } catch (error) {
      console.error("COPY_ERROR", error);
      alert("Không thể copy tự động. Bạn vui lòng copy thủ công.");
    }
  }

  function handleViewChatDetail(
    conversation: ChatConversation,
    info: ExtractedCustomerInfo
  ) {
    try {
      localStorage.setItem("nhanh_travel_selected_chat_id", conversation.id);
      localStorage.setItem("nhanh_travel_scroll_contact_phone", info.phone || "");
      localStorage.setItem("nhanh_travel_scroll_contact_email", info.email || "");
    } catch (error) {
      console.error("SAVE_SELECTED_CHAT_ERROR", error);
    }

    window.location.href = `/chat-history?conversationId=${encodeURIComponent(
      conversation.id
    )}&scrollToContact=1`;
  }

  function handleCall(phone: string) {
    const phoneForAction = getPhoneForAction(phone);
    if (!phoneForAction) return;

    window.location.href = `tel:${phoneForAction}`;
  }

  function handleOpenZalo(phone: string) {
    const phoneDigits = normalizePhone(phone);
    if (!phoneDigits) return;

    window.open(
      `https://zalo.me/${phoneDigits}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleOpenGmail(email: string) {
    if (!email) return;

    const url = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
      email
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }

  function handleOpenMailTo(email: string) {
    if (!email) return;

    window.location.href = `mailto:${email}`;
  }

  function toggleActionMenu(id: string, type: "phone" | "email" | "more") {
    setOpenMenu((current) => {
      if (current?.id === id && current.type === type) return null;
      return { id, type };
    });
  }

    function buildExportRows(): ExportRow[] {
  return filteredItems.map(({ conversation, info }, index) => ({
    stt: index + 1,
    name: getDisplayExtractedName(conversation, info),
    phone: info.phone || "",
    email: info.email || "",
    updatedAt: formatDate(conversation.updatedAt),
  }));
}

  function handleOpenExportPreview() {
    if (filteredItems.length === 0) {
      alert("Chưa có dữ liệu để xuất.");
      return;
    }

    setPreviewOpen(true);
  }

  function handleExportCsv() {
    const rows = buildExportRows();

    if (rows.length === 0) {
      alert("Chưa có dữ liệu để xuất.");
      return;
    }

    const header = [
  "STT",
  "Họ và tên",
  "Số điện thoại",
  "Email",
  "Session",
  "Conversation",
  "Ngày cập nhật",
];

   const body = rows.map((row) => [
  row.stt,
  row.name,
  row.phone,
  row.email,
  row.updatedAt,
]);

    const csv = [header, ...body]
      .map((row) => row.map((cell) => escapeCsvCell(cell)).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `danh-sach-thong-tin-trich-xuat-${Date.now()}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  function handleExportPdf() {
    const rows = buildExportRows();

    if (rows.length === 0) {
      alert("Chưa có dữ liệu để xuất.");
      return;
    }

   const tableRows = rows
  .map(
    (row) => `
      <tr>
        <td>${row.stt}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.phone || "Chưa có")}</td>
        <td>${escapeHtml(row.email || "Chưa có")}</td>
        <td>${escapeHtml(row.updatedAt)}</td>
      </tr>
    `
  )
  .join("");

    const html = `
      <!doctype html>
      <html lang="vi">
        <head>
          <meta charset="utf-8" />
          <title>Danh sách thông tin trích xuất</title>
          <style>
            * { box-sizing: border-box; }

            body {
              margin: 0;
              padding: 32px;
              font-family: "Times New Roman", Times, serif;
              color: #111827;
              background: #ffffff;
            }

            .header {
              margin-bottom: 22px;
              border-bottom: 2px solid #2b5fd9;
              padding-bottom: 14px;
            }

            h1 {
              margin: 0;
              font-size: 24px;
              line-height: 32px;
              color: #0f172a;
            }

            .meta {
              margin-top: 6px;
              font-size: 14px;
              color: #475569;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              font-size: 13px;
              font-family: "Times New Roman", Times, serif;
            }

            th {
              background: #e8efff;
              color: #0f172a;
              font-weight: 700;
              text-align: left;
              border: 1px solid #cbd5e1;
              padding: 8px;
            }

            td {
              border: 1px solid #cbd5e1;
              padding: 8px;
              vertical-align: top;
              word-break: break-word;
            }

            tr:nth-child(even) td { background: #f8faff; }

            @media print {
              body { padding: 18px; }

              @page {
                size: A4 landscape;
                margin: 12mm;
              }
            }
          </style>
        </head>

        <body>
          <div class="header">
            <h1>Danh sách thông tin trích xuất</h1>
            <div class="meta">
              Tổng số: ${rows.length} khách hàng • Ngày xuất: ${escapeHtml(
      new Date().toLocaleString("vi-VN")
    )}
            </div>
          </div>

          <table>
            <tr>
  <th style="width: 42px;">STT</th>
  <th>Họ và tên</th>
  <th>Số điện thoại</th>
  <th>Email</th>
  <th>Ngày cập nhật</th>
</tr>

            <tbody>
              ${tableRows}
            </tbody>
          </table>

          <script>
            window.onload = function () {
              window.focus();
              window.print();
            };
          </script>
        </body>
      </html>
    `;

    const printWindow = window.open("", "_blank", "width=1200,height=800");

    if (!printWindow) {
      alert("Trình duyệt đang chặn popup. Vui lòng cho phép popup để xuất PDF.");
      return;
    }

    printWindow.document.open();
    printWindow.document.write(html);
    printWindow.document.close();
  }

  return (
    <div style={styles.page} onClick={() => setOpenMenu(null)}>
      <header style={styles.topbar}>
        <div style={styles.logoGroup}>
          <div style={styles.logoIcon}>
            <MessageIcon />
          </div>

          <div>
            <div style={styles.logo}>ChatAdmin</div>
            <div style={styles.logoSub}>Thông tin trích xuất</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <a href="/chat-history" style={styles.navLink}>
            Tất cả đoạn chat
          </a>

          <a
            href="/extracted-info"
            style={{ ...styles.navLink, ...styles.navLinkActive }}
          >
            Thông tin trích xuất
          </a>
        </nav>

        <div style={styles.searchBox} onClick={(event) => event.stopPropagation()}>
          <SearchIcon />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm tên khách hàng / sđt / email..."
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.main}>
        <section style={styles.crmCard}>
          <div style={styles.cardHeader}>
            <div>
              <div style={styles.cardTitle}>Danh sách thông tin trích xuất</div>
              <div style={styles.cardSubtitle}>
                {filteredItems.length} khách hàng có email hoặc số điện thoại
              </div>
            </div>

            <div style={styles.cardHeaderActions}>
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  handleOpenExportPreview();
                }}
                style={styles.exportButton}
              >
                <SaveIcon />
                Xuất danh sách
              </button>
            </div>
          </div>

          <div style={styles.tableWrap}>
            <table style={styles.crmTable}>
              <thead>
                <tr>
                  <th style={{ ...styles.tableTh, width: "46px" }} />
                  <th style={styles.tableTh}>Tên khách hàng</th>
                  <th style={styles.tableTh}>Số điện thoại</th>
                  <th style={styles.tableTh}>Email</th>
                  <th style={styles.tableTh}>Nguồn</th>
                  <th style={styles.tableTh}>Thông tin có được</th>
                  <th style={styles.tableTh}>Ngày cập nhật</th>
                  <th style={{ ...styles.tableTh, width: "84px" }}>Ghi chú</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={8} style={styles.emptyCell}>
                      Đang tải dữ liệu...
                    </td>
                  </tr>
                ) : loadError ? (
                  <tr>
                    <td colSpan={8} style={styles.errorCell}>
                      {loadError}
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={8} style={styles.emptyCell}>
                      Chưa có khách hàng nào chứa email hoặc số điện thoại.
                    </td>
                  </tr>
                ) : (
                  filteredItems.map(({ conversation, info }) => {
                    const displayName = getDisplayExtractedName(
                      conversation,
                      info
                    );
                    const phoneMenuOpen =
                      openMenu?.id === conversation.id &&
                      openMenu.type === "phone";
                    const emailMenuOpen =
                      openMenu?.id === conversation.id &&
                      openMenu.type === "email";
                    const moreMenuOpen =
                      openMenu?.id === conversation.id &&
                      openMenu.type === "more";

                    return (
                      <tr key={conversation.id} style={styles.tableRow}>
                        <td style={styles.tableTd}>
                          <div style={styles.circleIcon}>
                            <UserIcon />
                          </div>
                        </td>

                        <td style={styles.tableTd}>
                          <div style={styles.customerName}>{displayName}</div>
                          <div style={styles.sessionText}>
                            {getSessionTitle(conversation)}
                          </div>
                        </td>

                        <td style={styles.tableTd}>
                          {info.phone ? (
                            <div style={styles.actionCell}>
                              <button
                                type="button"
                                style={styles.contactButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleActionMenu(conversation.id, "phone");
                                }}
                              >
                                <PhoneIcon />
                                {info.phone}
                              </button>

                              {phoneMenuOpen ? (
                                <div
                                  style={styles.actionMenu}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() =>
                                      handleCopy(info.phone, "số điện thoại")
                                    }
                                  >
                                    Copy số điện thoại
                                  </button>
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() => handleCall(info.phone)}
                                  >
                                    Gọi điện
                                  </button>
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() => handleOpenZalo(info.phone)}
                                  >
                                    Nhắn Zalo
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <span style={styles.mutedText}>Chưa có</span>
                          )}
                        </td>

                        <td style={styles.tableTd}>
                          {info.email ? (
                            <div style={styles.actionCell}>
                              <button
                                type="button"
                                style={styles.contactButton}
                                onClick={(event) => {
                                  event.stopPropagation();
                                  toggleActionMenu(conversation.id, "email");
                                }}
                              >
                                <MailIcon />
                                {info.email}
                              </button>

                              {emailMenuOpen ? (
                                <div
                                  style={styles.actionMenu}
                                  onClick={(event) => event.stopPropagation()}
                                >
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() =>
                                      handleCopy(info.email, "email")
                                    }
                                  >
                                    Copy email
                                  </button>
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() => handleOpenGmail(info.email)}
                                  >
                                    Gửi bằng Gmail
                                  </button>
                                  <button
                                    type="button"
                                    style={styles.actionMenuItem}
                                    onClick={() => handleOpenMailTo(info.email)}
                                  >
                                    Mở ứng dụng mail
                                  </button>
                                </div>
                              ) : null}
                            </div>
                          ) : (
                            <span style={styles.mutedText}>Chưa có</span>
                          )}
                        </td>

                        <td style={styles.tableTd}>
                          <span style={styles.sourceBadge}>Chatbot</span>
                        </td>

                        <td style={styles.tableTd}>
                          <span style={styles.statusBadge}>
                            {info.phone && info.email
                              ? "SĐT + Email"
                              : info.phone
                                ? "Chỉ SĐT"
                                : "Chỉ Email"}
                          </span>
                        </td>

                        <td style={styles.tableTd}>
                          <span style={styles.dateText}>
                            {formatShortDate(conversation.updatedAt)}
                          </span>
                        </td>

                        <td style={styles.tableTd}>
                          <div style={styles.actionCell}>
                            <button
                              type="button"
                              style={styles.moreButton}
                              onClick={(event) => {
                                event.stopPropagation();
                                toggleActionMenu(conversation.id, "more");
                              }}
                            >
                              <DotsIcon />
                            </button>

                            {moreMenuOpen ? (
                              <div
                                style={{
                                  ...styles.actionMenu,
                                  right: 0,
                                  left: "auto",
                                }}
                                onClick={(event) => event.stopPropagation()}
                              >
                                <button
                                  type="button"
                                  style={styles.actionMenuItem}
                                  onClick={() =>
                                    handleViewChatDetail(conversation, info)
                                  }
                                >
                                  Xem chi tiết đoạn chat
                                </button>

                                <button
                                  type="button"
                                  style={styles.actionMenuItem}
                                  onClick={() =>
                                    handleCopy(conversation.id, "mã hội thoại")
                                  }
                                >
                                  Copy mã hội thoại
                                </button>

                                <button
                                  type="button"
                                  style={styles.actionMenuItem}
                                  onClick={() =>
                                    handleCopy(conversation.sessionKey, "mã phiên")
                                  }
                                >
                                  Copy mã phiên
                                </button>
                              </div>
                            ) : null}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {previewOpen ? (
        <ExportPreviewModal
          rows={buildExportRows()}
          onClose={() => setPreviewOpen(false)}
          onExportCsv={handleExportCsv}
          onExportPdf={handleExportPdf}
        />
      ) : null}
    </div>
  );
}

function ExportPreviewModal({
  rows,
  onClose,
  onExportCsv,
  onExportPdf,
}: {
  rows: ExportRow[];
  onClose: () => void;
  onExportCsv: () => void;
  onExportPdf: () => void;
}) {
  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modalBox}>
        <div style={styles.modalHeader}>
          <div>
            <div style={styles.modalTitle}>Xem trước danh sách xuất</div>
            <div style={styles.modalSubtitle}>
              {rows.length} dòng dữ liệu • Font Times New Roman
            </div>
          </div>

          <button type="button" onClick={onClose} style={styles.modalClose}>
            ×
          </button>
        </div>

        <div style={styles.previewTableWrap}>
          <table style={styles.previewTable}>
            <thead>
              <tr>
  <th style={styles.previewTh}>STT</th>
  <th style={styles.previewTh}>Họ và tên</th>
  <th style={styles.previewTh}>Số điện thoại</th>
  <th style={styles.previewTh}>Email</th>
  <th style={styles.previewTh}>Ngày cập nhật</th>
</tr>
            </thead>

            <tbody>
              {rows.map((row) => (
  <tr key={`${row.phone || row.email || row.name}-${row.stt}`}>
    <td style={styles.previewTd}>{row.stt}</td>
    <td style={styles.previewTd}>{row.name}</td>
    <td style={styles.previewTd}>{row.phone || "Chưa có"}</td>
    <td style={styles.previewTd}>{row.email || "Chưa có"}</td>
    <td style={styles.previewTd}>{row.updatedAt}</td>
  </tr>
))}
            </tbody>
          </table>
        </div>

        <div style={styles.modalFooter}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Đóng
          </button>

          <div style={styles.exportActions}>
            <button type="button" onClick={onExportCsv} style={styles.csvButton}>
              Xuất CSV
            </button>

            <button type="button" onClick={onExportPdf} style={styles.pdfButton}>
              Xuất PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#f5f7fb",
    color: "#111827",
    fontFamily: '"Times New Roman", Times, serif',
  },

  topbar: {
    position: "sticky",
    top: 0,
    zIndex: 20,
    height: "68px",
    display: "flex",
    alignItems: "center",
    gap: "18px",
    padding: "0 24px",
    background: "#ffffff",
    borderBottom: "1px solid #dbe3f0",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.04)",
  },

  logoGroup: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    minWidth: "210px",
  },

  logoIcon: {
    width: "38px",
    height: "38px",
    borderRadius: "14px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2b5fd9",
    background: "#e8efff",
    border: "1px solid #d7e3ff",
  },

  logo: {
    fontSize: "18px",
    lineHeight: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  logoSub: {
    fontSize: "12px",
    color: "#64748b",
    marginTop: "1px",
  },

  nav: {
    display: "flex",
    height: "100%",
    alignItems: "center",
    gap: "24px",
    flex: 1,
  },

  navLink: {
    height: "100%",
    display: "inline-flex",
    alignItems: "center",
    color: "#64748b",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: 700,
    borderBottom: "3px solid transparent",
    paddingTop: "3px",
  },

  navLinkActive: {
    color: "#2b5fd9",
    borderBottomColor: "#2b5fd9",
  },

  exportButton: {
    height: "38px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "7px",
    border: "1px solid #cbd8ee",
    background: "#ffffff",
    color: "#2b5fd9",
    borderRadius: "999px",
    padding: "0 13px",
    fontSize: "13px",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
    fontFamily: '"Times New Roman", Times, serif',
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.04)",
  },

  searchBox: {
    width: "330px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 13px",
    borderRadius: "999px",
    background: "#f7f9fc",
    border: "1px solid #dbe3f0",
    color: "#64748b",
    flexShrink: 0,
  },

  searchInput: {
    width: "100%",
    border: "none",
    outline: "none",
    background: "transparent",
    fontSize: "15px",
    color: "#111827",
    fontFamily: '"Times New Roman", Times, serif',
  },

  main: {
    padding: "18px",
    maxWidth: "1440px",
    margin: "0 auto",
  },

  crmCard: {
    width: "100%",
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    borderRadius: "24px",
    overflow: "visible",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.05)",
  },

  cardHeaderActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    flexShrink: 0,
  },

  cardHeader: {
    padding: "18px 20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    borderBottom: "1px solid #edf2fa",
    background: "#ffffff",
    borderTopLeftRadius: "24px",
    borderTopRightRadius: "24px",
  },

  cardTitle: {
    fontSize: "20px",
    lineHeight: "25px",
    fontWeight: 800,
    color: "#0f172a",
  },

  cardSubtitle: {
    marginTop: "3px",
    fontSize: "14px",
    color: "#64748b",
  },

  headerPill: {
    borderRadius: "999px",
    background: "#e8efff",
    color: "#2b5fd9",
    padding: "8px 13px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  tableWrap: {
    width: "100%",
    overflow: "visible",
  },

  crmTable: {
    width: "100%",
    minWidth: "1080px",
    borderCollapse: "collapse",
    fontFamily: '"Times New Roman", Times, serif',
  },

  tableTh: {
    background: "#e8f3ff",
    color: "#334155",
    textAlign: "left",
    padding: "14px 14px",
    fontSize: "14px",
    fontWeight: 800,
    borderBottom: "1px solid #dbe3f0",
    whiteSpace: "nowrap",
  },

  tableRow: {
    background: "#ffffff",
    transition: "background 0.18s ease",
  },

  tableTd: {
    borderBottom: "1px solid #edf2fa",
    padding: "13px 14px",
    verticalAlign: "middle",
    fontSize: "14px",
    color: "#334155",
    position: "relative",
  },

  circleIcon: {
    width: "28px",
    height: "28px",
    borderRadius: "999px",
    border: "1px solid #d7e3ff",
    color: "#2b5fd9",
    background: "#e8efff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
  },

  customerName: {
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "3px",
    whiteSpace: "nowrap",
  },

  sessionText: {
    color: "#2b5fd9",
    fontSize: "13px",
    fontWeight: 700,
  },

  contactButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "1px solid #dbe7ff",
    background: "#f1f5ff",
    color: "#1e3a8a",
    borderRadius: "999px",
    padding: "6px 10px",
    fontSize: "14px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
    whiteSpace: "nowrap",
  },

  actionCell: {
    position: "relative",
    width: "fit-content",
  },

  actionMenu: {
    position: "absolute",
    top: "calc(100% + 8px)",
    left: 0,
    zIndex: 50,
    minWidth: "178px",
    borderRadius: "14px",
    border: "1px solid #dbe3f0",
    background: "#ffffff",
    boxShadow: "0 18px 42px rgba(15, 23, 42, 0.14)",
    padding: "6px",
  },

  actionMenuItem: {
    width: "100%",
    border: "none",
    background: "transparent",
    color: "#334155",
    padding: "9px 10px",
    borderRadius: "10px",
    textAlign: "left",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: 700,
    fontFamily: '"Times New Roman", Times, serif',
  },

  sourceBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#e9fbff",
    color: "#0891b2",
    padding: "7px 12px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  statusBadge: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "999px",
    background: "#eaffea",
    color: "#25a244",
    padding: "7px 12px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  dateText: {
    color: "#475569",
    fontSize: "14px",
    whiteSpace: "nowrap",
  },

  mutedText: {
    color: "#94a3b8",
    fontSize: "14px",
  },

  moreButton: {
    width: "30px",
    height: "30px",
    borderRadius: "10px",
    border: "none",
    background: "transparent",
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
  },

  emptyCell: {
    padding: "26px",
    textAlign: "center",
    color: "#64748b",
    fontSize: "15px",
  },

  errorCell: {
    padding: "22px",
    color: "#b91c1c",
    fontSize: "15px",
    background: "#fef2f2",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 999,
    background: "rgba(15, 23, 42, 0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "24px",
  },

  modalBox: {
    width: "min(1180px, 96vw)",
    maxHeight: "88vh",
    background: "#ffffff",
    borderRadius: "22px",
    border: "1px solid #dbe3f0",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.22)",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    fontFamily: '"Times New Roman", Times, serif',
  },

  modalHeader: {
    padding: "18px 20px",
    borderBottom: "1px solid #e5edf7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
    background: "#fbfcff",
  },

  modalTitle: {
    fontSize: "21px",
    lineHeight: "26px",
    fontWeight: 800,
    color: "#0f172a",
  },

  modalSubtitle: {
    marginTop: "4px",
    fontSize: "14px",
    color: "#64748b",
  },

  modalClose: {
    width: "34px",
    height: "34px",
    borderRadius: "999px",
    border: "1px solid #dbe3f0",
    background: "#ffffff",
    color: "#475569",
    fontSize: "22px",
    lineHeight: "30px",
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
  },

  previewTableWrap: {
    overflow: "auto",
    padding: "16px 20px",
    background: "#ffffff",
  },

  previewTable: {
    width: "100%",
    minWidth: "980px",
    borderCollapse: "collapse",
    fontFamily: '"Times New Roman", Times, serif',
    fontSize: "14px",
  },

  previewTh: {
    background: "#e8efff",
    border: "1px solid #cbd5e1",
    color: "#0f172a",
    textAlign: "left",
    padding: "10px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  previewTd: {
    border: "1px solid #dbe3f0",
    color: "#111827",
    padding: "9px 10px",
    verticalAlign: "top",
    maxWidth: "260px",
    wordBreak: "break-word",
  },

  modalFooter: {
    padding: "14px 20px",
    borderTop: "1px solid #e5edf7",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "14px",
    background: "#fbfcff",
  },

  exportActions: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },

  cancelButton: {
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#111827",
    borderRadius: "12px",
    padding: "9px 16px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
  },

  csvButton: {
    border: "1px solid #cbd8ee",
    background: "#ffffff",
    color: "#2b5fd9",
    borderRadius: "12px",
    padding: "9px 16px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
  },

  pdfButton: {
    border: "none",
    background: "#2b5fd9",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "10px 18px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
    boxShadow: "0 10px 22px rgba(43, 95, 217, 0.18)",
  },
};