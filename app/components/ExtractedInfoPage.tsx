"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { limitToLast, onValue, query, ref } from "firebase/database";
import { db } from "../../src/lib/firebase";

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
  name?: string;
  customerName?: string;
  phone?: string;
  customerPhone?: string;
  email?: string;
  customerEmail?: string;
  sessionKey?: string;
  messages?: Record<string, FirebaseMessage>;
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
};

type ScrollTarget = "email" | "phone" | "any";

const CHAT_HISTORY_PATH = "nhanhtravel-website/maiphuong/chats";

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

function normalizeConversation(
  id: string,
  data: FirebaseConversation
): ChatConversation {
  const messages = normalizeMessages(data.messages);

  const firstMessage = messages[0];
  const lastMessage = messages[messages.length - 1];
  const firstUserMessage = messages.find((item) => item.role === "USER");

  return {
    id,
    customerName:
      data.customerName ||
      data.name ||
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

function getLastMessage(conversation: ChatConversation) {
  return conversation.messages[conversation.messages.length - 1]?.message || "";
}

function getSessionTitle(conversation: ChatConversation) {
  const shortId = conversation.id.replace("conv_", "").slice(0, 10);
  return `Session #${shortId}`;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}
const IGNORED_COMPANY_PHONES = [
  "0909991205",
  "84909991205",
];

function extractNameFromText(text: string) {
  const patterns = [
    /(?:tên mình là|mình tên là|em tên là|tên em là|anh tên là|chị tên là|tôi tên là|mình là|em là|tôi là)\s+([A-Za-zÀ-ỹ\s]{2,40})/i,
    /(?:họ tên|hoten|họ và tên)\s*(?:là|:|-)?\s*([A-Za-zÀ-ỹ\s]{2,40})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match?.[1]) {
      return match[1]
        .replace(/\s+/g, " ")
        .replace(/(số điện thoại|email|gmail|zalo|phone|sdt).*$/i, "")
        .trim();
    }
  }

  return "";
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

  const name =
    conversation.customerName && conversation.customerName !== "anonymous"
      ? conversation.customerName
      : extractedName || conversation.customerName || "Chưa xác định";

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

  return {
    name,
    phone,
    email,
    hasAnyInfo: Boolean(phone || email),
  };
}

function hasContactInfo(info: ExtractedCustomerInfo) {
  return Boolean(info.email || info.phone);
}

function messageContainsExtractedInfo(
  message: ChatMessage,
  info: ExtractedCustomerInfo,
  target: ScrollTarget
) {
  const text = message.message.toLowerCase();
  const email = info.email.toLowerCase();
  const phoneDigits = normalizePhone(info.phone);
  const messageDigits = normalizePhone(message.message);

  if (target === "email") {
    return Boolean(email && text.includes(email));
  }

  if (target === "phone") {
    return Boolean(phoneDigits && messageDigits.includes(phoneDigits));
  }

  return Boolean(
    (email && text.includes(email)) ||
      (phoneDigits && messageDigits.includes(phoneDigits))
  );
}

function highlightExtractedInfo(
  text: string,
  info: ExtractedCustomerInfo
): ReactNode[] {
  const highlights = [info.email, info.phone]
    .filter(Boolean)
    .filter((value) => value !== "anonymous")
    .filter((value) => value !== "Chưa xác định");

  if (highlights.length === 0) return [text];

  const escaped = highlights.map((value) =>
    value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isHighlight = highlights.some(
      (value) => value.toLowerCase() === part.toLowerCase()
    );

    if (!isHighlight) return part;

    return (
      <mark key={`${part}-${index}`} style={styles.highlightText}>
        {part}
      </mark>
    );
  });
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M7.2 4.8 9.6 4l2.1 4.6-1.4 1.1c.9 1.9 2.4 3.5 4.2 4.4l1.2-1.5 4.5 2.1-.8 2.5c-.3.9-1.2 1.5-2.1 1.4C10.8 18.2 5.8 13.2 5.5 6.8c0-.9.7-1.7 1.7-2Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
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
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
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

export default function ExtractedInfoPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const conversationsWithInfo = useMemo(() => {
    return conversations
      .map((conversation) => ({
        conversation,
        info: extractCustomerInfo(conversation),
      }))
      .filter(({ info }) => hasContactInfo(info));
  }, [conversations]);

  const filteredItems = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return conversationsWithInfo;

    return conversationsWithInfo.filter(({ conversation, info }) => {
      const text = [
        conversation.id,
        conversation.sessionKey,
        conversation.customerName,
        info.name,
        info.phone,
        info.email,
        ...conversation.messages.map((message) => message.message),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [conversationsWithInfo, keyword]);

  const selectedItem = useMemo(() => {
    return (
      filteredItems.find((item) => item.conversation.id === selectedId) ||
      filteredItems[0] ||
      null
    );
  }, [filteredItems, selectedId]);

  const selectedConversation = selectedItem?.conversation || null;
  const selectedInfo = selectedItem?.info || null;

  useEffect(() => {
    setLoading(true);
    setLoadError("");

    const conversationsRef = query(ref(db, CHAT_HISTORY_PATH), limitToLast(50));

    const unsubscribe = onValue(
      conversationsRef,
      (snapshot) => {
        const rawValue = snapshot.val() || {};

        const nextConversations = Object.entries(rawValue)
          .map(([id, value]) =>
            normalizeConversation(id, value as FirebaseConversation)
          )
          .filter((item) => item.messages.length > 0)
          .sort((a, b) => b.updatedAt - a.updatedAt);

        setConversations(nextConversations);

        const firstContactConversation = nextConversations.find((conversation) =>
          hasContactInfo(extractCustomerInfo(conversation))
        );

        setSelectedId((current) => {
          if (current) return current;
          return firstContactConversation?.id || "";
        });

        setLoading(false);
      },
      (error) => {
        console.error("Firebase extracted info error:", error);
        setLoadError("Không thể tải dữ liệu trích xuất từ Firebase.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!selectedConversation || !selectedInfo) return;

    const timer = window.setTimeout(() => {
      scrollToExtractedMessage("any");
    }, 250);

    return () => window.clearTimeout(timer);
  }, [selectedConversation?.id, selectedInfo?.email, selectedInfo?.phone]);

  function findTargetMessageId(target: ScrollTarget) {
    if (!selectedConversation || !selectedInfo) return "";

    const targetMessage = selectedConversation.messages.find((message) =>
      messageContainsExtractedInfo(message, selectedInfo, target)
    );

    return targetMessage?.id || "";
  }

  function scrollToExtractedMessage(target: ScrollTarget) {
    const targetMessageId = findTargetMessageId(target);

    if (!targetMessageId) return;

    const element = messageRefs.current[targetMessageId];

    if (!element) return;

    element.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }

  function handleSaveToCrm() {
    if (!selectedInfo || !selectedConversation) return;

    alert(
      `Thông tin chuẩn bị lưu CRM:\nTên: ${selectedInfo.name}\nEmail: ${
        selectedInfo.email || "Chưa có"
      }\nSĐT: ${selectedInfo.phone || "Chưa có"}`
    );
  }

  return (
    <div style={styles.page}>
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

        <div style={styles.searchBox}>
          <SearchIcon />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm email, số điện thoại, nội dung..."
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div style={styles.sidebarTitle}>Chat có thông tin liên hệ</div>
            <div style={styles.sidebarSubtitle}>
              {filteredItems.length} phiên có email hoặc số điện thoại
            </div>
          </div>

          <div style={styles.sessionList}>
            {loading ? (
              <div style={styles.emptyBox}>Đang tải dữ liệu...</div>
            ) : loadError ? (
              <div style={styles.errorBox}>{loadError}</div>
            ) : filteredItems.length === 0 ? (
              <div style={styles.emptyBox}>
                Chưa có đoạn chat nào chứa email hoặc số điện thoại.
              </div>
            ) : (
              filteredItems.map(({ conversation, info }) => {
                const active = selectedConversation?.id === conversation.id;

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => setSelectedId(conversation.id)}
                    style={{
                      ...styles.sessionItem,
                      ...(active ? styles.sessionItemActive : {}),
                    }}
                  >
                    <div style={styles.sessionTop}>
                      <span style={styles.sessionName}>
                        {getSessionTitle(conversation)}
                      </span>

                      <span style={styles.newBadge}>Đã trích xuất</span>
                    </div>

                    <div style={styles.sessionExtract}>
                      {info.email
                        ? `Email: ${info.email}`
                        : `SĐT: ${info.phone}`}
                    </div>

                    <div style={styles.sessionContactRow}>
                      {info.phone ? (
                        <span style={styles.miniChip}>☎ {info.phone}</span>
                      ) : null}

                      {info.email ? (
                        <span style={styles.miniChip}>✉ {info.email}</span>
                      ) : null}
                    </div>

                    <div style={styles.sessionTime}>
                      {formatDate(conversation.updatedAt)}
                    </div>

                    <div style={styles.sessionPreview}>
                      {getLastMessage(conversation)}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section style={styles.detail}>
          {!selectedConversation || !selectedInfo ? (
            <div style={styles.noSelected}>
              Chọn một phiên chat để xem thông tin.
            </div>
          ) : (
            <>
              <div style={styles.cards}>
                <div style={styles.infoCard}>
                  <div style={styles.cardIconBlue}>
                    <UserIcon />
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardLabel}>Họ và tên</div>
                    <div style={styles.cardValue}>{selectedInfo.name}</div>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={!selectedInfo.email}
                  onClick={() => scrollToExtractedMessage("email")}
                  style={{
                    ...styles.infoCard,
                    ...styles.infoCardButton,
                    ...(!selectedInfo.email ? styles.infoCardDisabled : {}),
                  }}
                >
                  <div style={styles.cardIconSoft}>
                    <MailIcon />
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardLabel}>Email</div>
                    <div style={styles.cardValue}>
                      {selectedInfo.email || "Chưa có"}
                    </div>
                    {selectedInfo.email ? (
                      <div style={styles.cardHint}>Bấm để tới đoạn chat</div>
                    ) : null}
                  </div>
                </button>

                <button
                  type="button"
                  disabled={!selectedInfo.phone}
                  onClick={() => scrollToExtractedMessage("phone")}
                  style={{
                    ...styles.infoCard,
                    ...styles.infoCardButton,
                    ...(!selectedInfo.phone ? styles.infoCardDisabled : {}),
                  }}
                >
                  <div style={styles.cardIconOrange}>
                    <PhoneIcon />
                  </div>

                  <div style={styles.cardContent}>
                    <div style={styles.cardLabel}>Số điện thoại</div>
                    <div style={styles.cardValue}>
                      {selectedInfo.phone || "Chưa có"}
                    </div>
                    {selectedInfo.phone ? (
                      <div style={styles.cardHint}>Bấm để tới đoạn chat</div>
                    ) : null}
                  </div>
                </button>
              </div>

              <div style={styles.detailMetaBox}>
                <div>
                  <div style={styles.detailTitle}>
                    {getSessionTitle(selectedConversation)}
                  </div>

                  <div style={styles.detailSub}>
                    Conversation: {selectedConversation.id}
                  </div>

                  <div style={styles.detailSub}>
                    Session: {selectedConversation.sessionKey}
                  </div>
                </div>

                <div style={styles.timePill}>
                  Cập nhật: {formatDate(selectedConversation.updatedAt)}
                </div>
              </div>

              <div style={styles.transcript}>
                <div style={styles.dateDivider}>
                  <span>{formatDate(selectedConversation.createdAt)}</span>
                </div>

                {selectedConversation.messages.map((message) => {
                  const isUser = message.role === "USER";
                  const isTargetMessage = messageContainsExtractedInfo(
                    message,
                    selectedInfo,
                    "any"
                  );

                  return (
                    <div
                      key={message.id}
                      ref={(element) => {
                        messageRefs.current[message.id] = element;
                      }}
                      style={{
                        ...styles.messageRow,
                        justifyContent: isUser ? "flex-start" : "flex-end",
                      }}
                    >
                      <div
                        style={{
                          ...styles.messageGroup,
                          alignItems: isUser ? "flex-start" : "flex-end",
                        }}
                      >
                        {isTargetMessage ? (
                          <div style={styles.foundLabel}>
                            Thông tin liên hệ được tìm thấy tại đây
                          </div>
                        ) : null}

                        <div
                          style={{
                            ...styles.messageBubble,
                            ...(isUser
                              ? styles.customerBubble
                              : styles.agentBubble),
                            ...(isTargetMessage
                              ? styles.targetMessageBubble
                              : {}),
                          }}
                        >
                          {highlightExtractedInfo(message.message, selectedInfo)}
                        </div>

                        <div style={styles.messageMeta}>
                          {isUser ? "Khách hàng" : "Trợ lý AI"} •{" "}
                          {formatDate(message.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              
            </>
          )}
        </section>
      </main>
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
    zIndex: 10,
    height: "68px",
    display: "flex",
    alignItems: "center",
    gap: "24px",
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

  searchBox: {
    width: "340px",
    height: "40px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "0 13px",
    borderRadius: "999px",
    background: "#f7f9fc",
    border: "1px solid #dbe3f0",
    color: "#64748b",
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
    display: "flex",
    alignItems: "flex-start",
    overflow: "visible",
    padding: "18px",
    gap: "18px",
  },

  sidebar: {
    width: "350px",
    flexShrink: 0,
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.05)",
    position: "sticky",
    top: "86px",
    maxHeight: "calc(100vh - 104px)",
  },

  sidebarHeader: {
    padding: "18px 18px 15px",
    borderBottom: "1px solid #edf2fa",
    background: "#fbfcff",
  },

  sidebarTitle: {
    fontSize: "18px",
    lineHeight: "22px",
    fontWeight: 800,
    color: "#0f172a",
  },

  sidebarSubtitle: {
    marginTop: "3px",
    fontSize: "13px",
    color: "#64748b",
  },

  sessionList: {
    maxHeight: "calc(100vh - 180px)",
    overflowY: "auto",
  },

  sessionItem: {
    width: "100%",
    textAlign: "left",
    border: "none",
    borderBottom: "1px solid #edf2fa",
    background: "#ffffff",
    padding: "14px 15px",
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
    transition: "background 0.18s ease",
  },

  sessionItemActive: {
    background: "#eef4ff",
    boxShadow: "inset 4px 0 0 #2b5fd9",
  },

  sessionTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    alignItems: "flex-start",
    marginBottom: "6px",
  },

  sessionName: {
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 800,
    color: "#0f172a",
  },

  newBadge: {
    flexShrink: 0,
    color: "#2b5fd9",
    background: "#e8efff",
    borderRadius: "999px",
    padding: "4px 8px",
    textTransform: "uppercase",
    fontSize: "11px",
    fontWeight: 800,
  },

  sessionExtract: {
    fontSize: "15px",
    color: "#475569",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    marginBottom: "8px",
  },

  sessionContactRow: {
    display: "flex",
    flexWrap: "wrap",
    gap: "6px",
    marginBottom: "8px",
  },

  miniChip: {
    maxWidth: "100%",
    display: "inline-flex",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    borderRadius: "999px",
    background: "#f1f5ff",
    color: "#1e3a8a",
    border: "1px solid #dbe7ff",
    padding: "4px 8px",
    fontSize: "12px",
    fontWeight: 700,
  },

  sessionTime: {
    fontSize: "13px",
    color: "#64748b",
    marginBottom: "8px",
  },

  sessionPreview: {
    fontSize: "14px",
    lineHeight: "19px",
    color: "#334155",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  emptyBox: {
    padding: "18px",
    fontSize: "15px",
    color: "#64748b",
  },

  errorBox: {
    margin: "14px",
    padding: "12px",
    borderRadius: "14px",
    background: "#fef2f2",
    color: "#b91c1c",
    border: "1px solid #fecaca",
    fontSize: "14px",
  },

  detail: {
    flex: 1,
    minWidth: 0,
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    borderRadius: "24px",
    overflow: "hidden",
    boxShadow: "0 16px 36px rgba(15, 23, 42, 0.05)",
  },

  noSelected: {
    minHeight: "calc(100vh - 104px)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "17px",
  },

  cards: {
    padding: "18px 20px",
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: "14px",
    background: "#ffffff",
  },

  infoCard: {
    minWidth: 0,
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: "#ffffff",
    border: "1px solid #dbe3f0",
    borderRadius: "18px",
    padding: "14px",
    boxShadow: "0 8px 22px rgba(15, 23, 42, 0.04)",
    textAlign: "left",
    fontFamily: '"Times New Roman", Times, serif',
  },

  infoCardButton: {
    cursor: "pointer",
  },

  infoCardDisabled: {
    opacity: 0.65,
    cursor: "default",
  },

  cardIconBlue: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1e3a8a",
    background: "#dfe6ff",
    flexShrink: 0,
  },

  cardIconSoft: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#1e3a8a",
    background: "#e8efff",
    flexShrink: 0,
  },

  cardIconOrange: {
    width: "40px",
    height: "40px",
    borderRadius: "999px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9a3412",
    background: "#ffedd5",
    flexShrink: 0,
  },

  cardContent: {
    minWidth: 0,
  },

  cardLabel: {
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "0.05em",
  },

  cardValue: {
    color: "#0f172a",
    fontSize: "16px",
    fontWeight: 800,
    marginTop: "4px",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  cardHint: {
    marginTop: "3px",
    color: "#2b5fd9",
    fontSize: "12px",
    fontWeight: 700,
  },

  detailMetaBox: {
    margin: "0 20px",
    padding: "16px 18px",
    borderRadius: "18px",
    background: "#fbfcff",
    border: "1px solid #dbe3f0",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "16px",
  },

  detailTitle: {
    fontSize: "20px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "6px",
  },

  detailSub: {
    fontSize: "14px",
    color: "#64748b",
    marginTop: "4px",
    wordBreak: "break-word",
  },

  timePill: {
    flexShrink: 0,
    borderRadius: "999px",
    background: "#eef1f5",
    color: "#475569",
    padding: "8px 14px",
    fontSize: "13px",
    fontWeight: 800,
  },

  transcript: {
    padding: "20px 24px 24px",
    background: "#f8faff",
  },

  dateDivider: {
    display: "flex",
    justifyContent: "center",
    margin: "6px 0 20px",
  },

  messageRow: {
    display: "flex",
    width: "100%",
    marginBottom: "14px",
    scrollMarginTop: "92px",
  },

  messageGroup: {
    maxWidth: "72%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
  },

  foundLabel: {
    width: "fit-content",
    borderRadius: "999px",
    background: "#fff7ed",
    color: "#c2410c",
    border: "1px solid #fed7aa",
    padding: "5px 9px",
    fontSize: "12px",
    fontWeight: 800,
  },

  messageBubble: {
    padding: "12px 15px",
    borderRadius: "20px",
    fontSize: "15px",
    lineHeight: "22px",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.05)",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",
  },

  customerBubble: {
    background: "#ffffff",
    color: "#0f172a",
    borderTopLeftRadius: "5px",
    border: "1px solid #dbe3f0",
  },

  agentBubble: {
    background: "#2b5fd9",
    color: "#ffffff",
    borderTopRightRadius: "5px",
    border: "1px solid #2b5fd9",
  },

  targetMessageBubble: {
    borderColor: "#f97316",
    boxShadow: "0 0 0 4px rgba(249, 115, 22, 0.12)",
  },

  messageMeta: {
    marginTop: "4px",
    fontSize: "12px",
    color: "#64748b",
  },

  highlightText: {
    background: "#fff1c2",
    color: "#78350f",
    padding: "0 4px",
    borderRadius: "4px",
    fontWeight: 800,
  },

  footer: {
    padding: "18px 20px",
    background: "#ffffff",
    borderTop: "1px solid #dbe3f0",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "16px",
  },

  notice: {
    color: "#64748b",
    fontSize: "14px",
  },

  actions: {
    display: "flex",
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

  saveButton: {
    border: "none",
    background: "#2b5fd9",
    color: "#ffffff",
    borderRadius: "12px",
    padding: "9px 16px",
    fontSize: "15px",
    fontWeight: 800,
    cursor: "pointer",
    fontFamily: '"Times New Roman", Times, serif',
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
  },
};