import type { ConversationItem } from "./chatbot-data";

export const CONVERSATION_MAP_KEY = "chat_session_conversations";
export const CURRENT_CONVERSATION_ID_KEY = "chat_current_conversation_id";
export const CHAT_SESSION_KEY = "chat_session_id";

export function getOrCreateChatSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem(CHAT_SESSION_KEY);

  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    localStorage.setItem(CHAT_SESSION_KEY, sessionId);
  }

  return sessionId;
}

export function clearChatSessionId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CHAT_SESSION_KEY);
}

export function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

export function getConversationMap(): Record<string, ConversationItem[]> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(CONVERSATION_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveConversationMap(map: Record<string, ConversationItem[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATION_MAP_KEY, JSON.stringify(map));
}

export function getConversationListForSession(sessionKey: string) {
  const map = getConversationMap();
  return map[sessionKey] || [];
}

export function saveConversationListForSession(
  sessionKey: string,
  conversations: ConversationItem[]
) {
  const map = getConversationMap();
  map[sessionKey] = conversations;
  saveConversationMap(map);
}

export function getCurrentConversationId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CURRENT_CONVERSATION_ID_KEY) || "";
}

export function setCurrentConversationId(conversationId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_CONVERSATION_ID_KEY, conversationId);
}

export function clearCurrentConversationId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_CONVERSATION_ID_KEY);
}

export function buildPreviewTitle(text: string) {
  const cleaned = text.trim();
  if (!cleaned) return "Cuộc trò chuyện mới";
  return cleaned.length > 32 ? `${cleaned.slice(0, 32)}...` : cleaned;
}