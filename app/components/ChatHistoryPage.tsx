"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { limitToLast, onValue, orderByChild, query, ref } from "firebase/database";
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

type ReadStateMap = Record<string, number>;

const CHAT_HISTORY_PATH = "nhanhtravel-website/maiphuong/chats";
const READ_STORAGE_KEY = "nhanh_travel_chat_history_read_state";

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

function extractCustomerNameFromMessage(text?: string) {
  const value = String(text || "").replace(/\s+/g, " ").trim();

  if (!value) return "";

  const patterns = [
    /(?:tên\s+là|tên\s+mình\s+là|mình\s+tên\s+là|em\s+tên\s+là|tên\s+em\s+là|anh\s+tên\s+là|chị\s+tên\s+là|tôi\s+tên\s+là|họ\s+tên|họ\s+và\s+tên)\s*[:\-]?\s*([A-Za-zÀ-ỹ\s]{2,80})/i,
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
    .map((item) => extractCustomerNameFromMessage(item.message))
    .find((name) => name && !isAnonymousName(name)) || "";

const firstNamedUserMessage = messages.find(
  (item) =>
    item.role === "USER" &&
    item.name &&
    !isAnonymousName(item.name)
);

const extractedNameFromMessage =
  messages
    .map((item) => extractCustomerNameFromMessage(item.message))
    .find((name) => name && !isAnonymousName(name)) || "";

  return {
    id,
  customerName:
  extractedNameFromUserMessage ||
  firstNamedUserMessage?.name ||
  (!isAnonymousName(data.customerName) ? data.customerName : "") ||
  (!isAnonymousName(data.name) ? data.name : "") ||
  firstUserMessage?.name ||
  firstMessage?.name ||
  "Khách hàng",
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

function getDisplayCustomerName(conversation: ChatConversation, index?: number) {
  if (!isAnonymousName(conversation.customerName)) {
    return conversation.customerName;
  }

  if (typeof index === "number") {
    return `Ẩn danh (${index + 1})`;
  }

  return "Ẩn danh";
}

function getLastMessage(conversation: ChatConversation) {
  return conversation.messages[conversation.messages.length - 1]?.message || "";
}

function getSessionTitle(conversation: ChatConversation) {
  const shortId = conversation.id.replace("conv_", "").slice(0, 10);
  return `Session #${shortId}`;
}

function getLatestUserMessageTime(conversation: ChatConversation) {
  const userMessages = conversation.messages.filter(
    (message) => message.role === "USER"
  );

  return userMessages[userMessages.length - 1]?.createdAt || 0;
}

function hasNewCustomerMessage(
  conversation: ChatConversation,
  readStateMap: ReadStateMap
) {
  const lastReadAt = readStateMap[conversation.id] || 0;
  const latestUserMessageAt = getLatestUserMessageTime(conversation);

  return latestUserMessageAt > lastReadAt;
}

function getUnreadUserCount(
  conversation: ChatConversation,
  readStateMap: ReadStateMap
) {
  const lastReadAt = readStateMap[conversation.id] || 0;

  return conversation.messages.filter(
    (message) => message.role === "USER" && message.createdAt > lastReadAt
  ).length;
}

function getInitials(name: string) {
  const cleanName = name.trim();
  const lowerName = cleanName.toLowerCase();

  if (
    !cleanName ||
    lowerName === "anonymous" ||
    lowerName.startsWith("ẩn danh")
  ) {
    return "KH";
  }

  const words = cleanName
    .split(/\s+/)
    .filter((word) => !/^\(\d+\)$/.test(word));

  if (words.length === 0) return "KH";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();

  return `${words[0][0] || ""}${words[words.length - 1][0] || ""}`.toUpperCase();
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
function normalizePhone(value: string) {
  return value.replace(/\D/g, "");
}

function messageMatchesContactTarget(
  message: ChatMessage,
  phone: string,
  email: string
) {
  const text = message.message.toLowerCase();
  const messagePhone = normalizePhone(message.message);
  const targetPhone = normalizePhone(phone);
  const targetEmail = email.toLowerCase().trim();

  return Boolean(
    (targetEmail && text.includes(targetEmail)) ||
      (targetPhone && messagePhone.includes(targetPhone))
  );
}
function highlightContactTarget(text: string, phone: string, email: string) {
  const targets = [email, phone].filter(Boolean);

  if (targets.length === 0) return text;

  const escapedTargets = targets.map((item) =>
    item.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  );

  const regex = new RegExp(`(${escapedTargets.join("|")})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    const isTarget = targets.some(
      (target) => target.toLowerCase() === part.toLowerCase()
    );

    if (!isTarget) return part;

    return (
      <mark key={`${part}-${index}`} style={styles.highlightText}>
        {part}
      </mark>
    );
  });
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

function BotIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M8 7.5h8a4 4 0 0 1 4 4v3.8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-3.8a4 4 0 0 1 4-4Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.5V4.8M9.2 12.5h.1M14.7 12.5h.1M9.5 15.7h5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18Z"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <path
        d="M12 7.5v5l3.2 2"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function ChatHistoryPage() {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [selectedId, setSelectedId] = useState("");
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [readStateMap, setReadStateMap] = useState<ReadStateMap>({});
  const messageRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const [highlightPhone, setHighlightPhone] = useState("");
const [highlightEmail, setHighlightEmail] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(READ_STORAGE_KEY);
      if (saved) {
        setReadStateMap(JSON.parse(saved));
      }
    } catch (error) {
      console.error("LOAD_READ_STATE_ERROR", error);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(readStateMap));
    } catch (error) {
      console.error("SAVE_READ_STATE_ERROR", error);
    }
  }, [readStateMap]);

  const filteredConversations = useMemo(() => {
    const search = keyword.trim().toLowerCase();

    if (!search) return conversations;

    return conversations.filter((conversation) => {
      const text = [
        conversation.id,
        conversation.sessionKey,
        conversation.customerName,
        conversation.customerPhone,
        conversation.customerEmail,
        ...conversation.messages.map((message) => message.message),
      ]
        .join(" ")
        .toLowerCase();

      return text.includes(search);
    });
  }, [conversations, keyword]);

  const selectedConversation = useMemo(() => {
    return (
      filteredConversations.find((item) => item.id === selectedId) ||
      filteredConversations[0] ||
      null
    );
  }, [filteredConversations, selectedId]);
useEffect(() => {
  if (!selectedConversation) return;

  let shouldScroll = false;
  let phone = "";
  let email = "";

  try {
    const params = new URLSearchParams(window.location.search);
    shouldScroll = params.get("scrollToContact") === "1";

    phone = localStorage.getItem("nhanh_travel_scroll_contact_phone") || "";
    email = localStorage.getItem("nhanh_travel_scroll_contact_email") || "";
    setHighlightPhone(phone);
setHighlightEmail(email);
  } catch (error) {
    console.error("READ_SCROLL_CONTACT_ERROR", error);
  }

  if (!shouldScroll) return;
  if (!phone && !email) return;

  const targetMessage = selectedConversation.messages.find((message) =>
    messageMatchesContactTarget(message, phone, email)
  );

  if (!targetMessage) return;

  const timer = window.setTimeout(() => {
    messageRefs.current[targetMessage.id]?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }, 500);

  return () => window.clearTimeout(timer);
}, [selectedConversation]);
  

  const anonymousIndexMap = useMemo(() => {
  const map = new Map<string, number>();
  let count = 1;

  const anonymousConversations = [...conversations]
    .filter((conversation) => isAnonymousName(conversation.customerName))
    .sort((a, b) => {
      const timeA = a.createdAt || a.updatedAt || 0;
      const timeB = b.createdAt || b.updatedAt || 0;

      return timeA - timeB;
    });

  anonymousConversations.forEach((conversation) => {
    map.set(conversation.id, count);
    count += 1;
  });

  return map;
}, [conversations]);

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
      (snapshot) => {
        const rawValue = snapshot.val() || {};

        const nextConversations = Object.entries(rawValue)
          .map(([id, value]) =>
            normalizeConversation(id, value as FirebaseConversation)
          )
          .filter((item) => item.messages.length > 0)
          .sort((a, b) => b.updatedAt - a.updatedAt);

        setConversations(nextConversations);

        setSelectedId((current) => {
  let targetId = "";

  try {
    const params = new URLSearchParams(window.location.search);
    targetId =
      params.get("conversationId") ||
      localStorage.getItem("nhanh_travel_selected_chat_id") ||
      "";
  } catch (error) {
    console.error("READ_SELECTED_CHAT_ERROR", error);
  }

  if (targetId && nextConversations.some((item) => item.id === targetId)) {
    return targetId;
  }

  if (current && nextConversations.some((item) => item.id === current)) {
    return current;
  }

  return nextConversations[0]?.id || "";
});

        setLoading(false);
      },
      (error) => {
        console.error("Firebase chat history error:", error);
        setLoadError("Không thể tải lịch sử chat từ Firebase.");
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  function handleSelectConversation(conversation: ChatConversation) {
    setSelectedId(conversation.id);

    setReadStateMap((prev) => ({
      ...prev,
      [conversation.id]: getLatestUserMessageTime(conversation),
    }));
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
            <div style={styles.logoSub}>Lịch sử chat khách hàng</div>
          </div>
        </div>

        <nav style={styles.nav}>
          <a
            href="/chat-history"
            style={{ ...styles.navLink, ...styles.navLinkActive }}
          >
            Tất cả đoạn chat
          </a>
          <a href="/extracted-info" style={styles.navLink}>
            Thông tin trích xuất
          </a>
        </nav>

        <div style={styles.searchBox}>
          <SearchIcon />
          <input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Tìm kiếm đoạn chat..."
            style={styles.searchInput}
          />
        </div>
      </header>

      <main style={styles.main}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarHeader}>
            <div>
              <div style={styles.sidebarTitle}>Danh sách lịch sử chat</div>
              <div style={styles.sidebarSubtitle}>
                {filteredConversations.length} cuộc trò chuyện
              </div>
            </div>
          </div>

          <div style={styles.sessionList}>
            {loading ? (
              <div style={styles.emptyBox}>Đang tải dữ liệu...</div>
            ) : loadError ? (
              <div style={styles.errorBox}>{loadError}</div>
            ) : filteredConversations.length === 0 ? (
              <div style={styles.emptyBox}>Chưa có đoạn chat phù hợp.</div>
            ) : (
              filteredConversations.map((conversation, index) => {
                const active = selectedConversation?.id === conversation.id;
                const hasUnread = hasNewCustomerMessage(
                  conversation,
                  readStateMap
                );
                const unreadCount = getUnreadUserCount(
                  conversation,
                  readStateMap
                );

                const displayIndex =
                  (anonymousIndexMap.get(conversation.id) || index + 1) - 1;
                const displayName = getDisplayCustomerName(
                  conversation,
                  displayIndex
                );

                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => handleSelectConversation(conversation)}
                    style={{
                      ...styles.sessionItem,
                      ...(active ? styles.sessionItemActive : {}),
                    }}
                  >
                    <div style={styles.avatarWrap}>
                      <div style={styles.avatar}>{getInitials(displayName)}</div>

                      {hasUnread ? <span style={styles.unreadDot} /> : null}
                    </div>

                    <div style={styles.sessionContent}>
                      <div style={styles.sessionTop}>
                        <div style={styles.sessionName}>{displayName}</div>

                        {hasUnread ? (
                          <span style={styles.newBadge}>
                            {unreadCount > 0 ? unreadCount : ""}
                          </span>
                        ) : null}
                      </div>

                      <div style={styles.sessionTitle}>
                        {getSessionTitle(conversation)}
                      </div>

                      <div style={styles.sessionPreview}>
                        {getLastMessage(conversation)}
                      </div>

                      <div style={styles.sessionTime}>
                        <ClockIcon />
                        {formatDate(conversation.updatedAt)}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </aside>

        <section style={styles.detail}>
          {!selectedConversation ? (
            <div style={styles.noSelected}>
              <div style={styles.noSelectedIcon}>
                <MessageIcon />
              </div>
              <div>Chọn một cuộc chat để xem chi tiết.</div>
            </div>
          ) : (
            <>
              <div style={styles.detailHeader}>
                <div style={styles.detailHeaderLeft}>
                  <div style={styles.detailTitle}>
                    {getSessionTitle(selectedConversation)}
                  </div>

                  <div style={styles.detailMetaLine}>
                    <span style={styles.detailMetaLabel}>Conversation:</span>{" "}
                    <span style={styles.detailMetaValue}>
                      {selectedConversation.id}
                    </span>
                  </div>

                  <div style={styles.detailMetaLine}>
                    <span style={styles.detailMetaLabel}>Session:</span>{" "}
                    <span style={styles.detailMetaValue}>
                      {selectedConversation.sessionKey}
                    </span>
                  </div>

                  <div style={styles.detailMetaLine}>
                    <span style={styles.detailMetaLabel}>Bắt đầu:</span>{" "}
                    <span style={styles.detailMetaValue}>
                      {formatDate(selectedConversation.createdAt)}
                    </span>
                  </div>
                </div>

                <div style={styles.detailHeaderRight}>
                  <span style={styles.updateBadge}>
                    Cập nhật: {formatDate(selectedConversation.updatedAt)}
                  </span>

                  <span style={styles.totalBadge}>
                    {selectedConversation.messages.length} tin nhắn
                  </span>
                </div>
              </div>

              <div style={styles.transcript}>
                <div style={styles.dateDivider}>
                  <span>{formatDate(selectedConversation.createdAt)}</span>
                </div>

                {selectedConversation.messages.map((message) => {
                  const isUser = message.role === "USER";
                  const isBot = message.role === "BOT";

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
    <div
      style={{
        ...styles.messageBubble,
        ...(isUser
          ? styles.customerBubble
          : isBot
            ? styles.agentBubble
            : styles.staffBubble),
      }}
    >
      {highlightContactTarget(message.message, highlightPhone, highlightEmail)}
    </div>

    <div style={styles.messageMeta}>
      <span style={styles.inlineIcon}>
        {isUser ? (
          <UserIcon />
        ) : isBot ? (
          <BotIcon />
        ) : (
          <MessageIcon />
        )}
      </span>
      {isUser ? "Khách hàng" : isBot ? "Trợ lý AI" : "Nhân viên"} ·{" "}
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
    width: "310px",
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
    position: "relative",
    width: "100%",
    display: "flex",
    gap: "12px",
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

  avatarWrap: {
    position: "relative",
    flexShrink: 0,
  },

  avatar: {
    width: "42px",
    height: "42px",
    borderRadius: "15px",
    background: "linear-gradient(145deg, #2b5fd9, #5e8fff)",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "15px",
    fontWeight: 800,
    boxShadow: "0 8px 18px rgba(43,95,217,0.18)",
  },

  unreadDot: {
    position: "absolute",
    top: "-2px",
    right: "-2px",
    width: "10px",
    height: "10px",
    borderRadius: "999px",
    background: "#ef4444",
    border: "2px solid #ffffff",
    boxShadow: "0 0 0 5px rgba(239,68,68,0.12)",
  },

  sessionContent: {
    minWidth: 0,
    flex: 1,
  },

  sessionTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "8px",
    alignItems: "center",
    marginBottom: "2px",
  },

  sessionName: {
    minWidth: 0,
    fontSize: "16px",
    lineHeight: "20px",
    fontWeight: 800,
    color: "#0f172a",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  newBadge: {
    minWidth: "22px",
    height: "22px",
    borderRadius: "999px",
    background: "#ef4444",
    color: "#ffffff",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "12px",
    fontWeight: 800,
    flexShrink: 0,
  },

  sessionTitle: {
    fontSize: "13px",
    color: "#2b5fd9",
    fontWeight: 700,
    marginBottom: "5px",
  },

  sessionPreview: {
    fontSize: "14px",
    lineHeight: "19px",
    color: "#475569",
    display: "-webkit-box",
    WebkitLineClamp: 2,
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
  },

  sessionTime: {
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    marginTop: "7px",
    fontSize: "12px",
    color: "#64748b",
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
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
    color: "#64748b",
    fontSize: "17px",
  },

  noSelectedIcon: {
    width: "58px",
    height: "58px",
    borderRadius: "20px",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#2b5fd9",
    background: "#e8efff",
    border: "1px solid #d7e3ff",
  },

  detailHeader: {
    padding: "18px 20px",
    background: "#ffffff",
    borderBottom: "1px solid #edf2fa",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: "18px",
  },

  detailHeaderLeft: {
    minWidth: 0,
    flex: 1,
  },

  detailTitle: {
    fontSize: "20px",
    lineHeight: "24px",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "10px",
  },

  detailMetaLine: {
    marginTop: "6px",
    fontSize: "14px",
    lineHeight: "20px",
    color: "#475569",
    wordBreak: "break-word",
  },

  detailMetaLabel: {
    fontWeight: 700,
    color: "#334155",
  },

  detailMetaValue: {
    color: "#64748b",
  },

  detailHeaderRight: {
    flexShrink: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    gap: "10px",
  },

  updateBadge: {
    borderRadius: "999px",
    background: "#eef1f5",
    color: "#475569",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  totalBadge: {
    borderRadius: "999px",
    background: "#dfe6ff",
    color: "#1e3a8a",
    padding: "10px 16px",
    fontSize: "13px",
    fontWeight: 800,
    whiteSpace: "nowrap",
  },

  transcript: {
    padding: "22px 24px 26px",
    background: "#f8faff",
  },

  dateDivider: {
    display: "flex",
    justifyContent: "center",
    margin: "4px 0 20px",
  },

  messageRow: {
    display: "flex",
    width: "100%",
    marginBottom: "14px",
  },

  messageGroup: {
    maxWidth: "72%",
    display: "flex",
    flexDirection: "column",
    gap: "5px",
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

  staffBubble: {
    background: "#edf3ff",
    color: "#1e3a8a",
    borderTopRightRadius: "5px",
    border: "1px solid #d7e3ff",
  },

  messageMeta: {
    marginTop: "5px",
    fontSize: "12px",
    color: "#64748b",
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
  },

  inlineIcon: {
    display: "inline-flex",
    color: "#64748b",
  },
};