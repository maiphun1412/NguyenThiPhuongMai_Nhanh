export function getAnonymousSessionId() {
  if (typeof window === "undefined") return "";

  let sessionId = localStorage.getItem("chat_session_id");

  if (!sessionId) {
    sessionId =
      "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
    localStorage.setItem("chat_session_id", sessionId);
  }

  return sessionId;
}

export function clearAnonymousSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem("chat_session_id");
}