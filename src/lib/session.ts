function normalizeCustomerKey(name: string, phone: string) {
  const normalizedName = name.trim().toLowerCase().replace(/\s+/g, " ");
  const normalizedPhone = phone.replace(/\D/g, "");
  return `${normalizedName}_${normalizedPhone}`;
}

type CustomerSessionMap = Record<string, string>;

function getCustomerSessionMap(): CustomerSessionMap {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem("chat_customer_sessions");
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCustomerSessionMap(sessionMap: CustomerSessionMap) {
  if (typeof window === "undefined") return;
  localStorage.setItem("chat_customer_sessions", JSON.stringify(sessionMap));
}

export function getSessionId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem("chat_session_id") || "";
}

export function getOrCreateSessionIdForCustomer(name: string, phone: string) {
  if (typeof window === "undefined") return "";

  const customerKey = normalizeCustomerKey(name, phone);
  const sessionMap = getCustomerSessionMap();

  let sessionId = sessionMap[customerKey];

  if (!sessionId) {
    sessionId =
      "session_" + Date.now() + "_" + Math.random().toString(36).slice(2, 9);
    sessionMap[customerKey] = sessionId;
    saveCustomerSessionMap(sessionMap);
  }

  localStorage.setItem("chat_session_id", sessionId);
  localStorage.setItem("chat_customer_name", name.trim());
  localStorage.setItem("chat_customer_phone", phone.replace(/\D/g, ""));

  return sessionId;
}

export function saveCustomerInfo(name: string, phone: string) {
  if (typeof window === "undefined") return;

  localStorage.setItem("chat_customer_name", name.trim());
  localStorage.setItem("chat_customer_phone", phone.replace(/\D/g, ""));
}

export function getCustomerInfo() {
  if (typeof window === "undefined") {
    return { name: "", phone: "" };
  }

  return {
    name: localStorage.getItem("chat_customer_name") || "",
    phone: localStorage.getItem("chat_customer_phone") || "",
  };
}

export function clearCurrentChatSession() {
  if (typeof window === "undefined") return;

  localStorage.removeItem("chat_session_id");
  localStorage.removeItem("chat_customer_name");
  localStorage.removeItem("chat_customer_phone");
}