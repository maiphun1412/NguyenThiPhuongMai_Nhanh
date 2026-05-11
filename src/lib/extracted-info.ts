import { ref, update } from "firebase/database";
import { realtimeDb } from "./firebase";

export type ExtractedInfo = {
  conversationId?: string;
  customerName?: string;
  phone?: string;
  email?: string;
  updatedAt?: number;
};

const USER_ID = "nhanhtravel-chatai";

const BASE_PATH = `${USER_ID}/extracted-info`;

export function extractContactInfo(text: string): ExtractedInfo {
  if (!text) return {};

  const phoneRegex = /(?:\+84|84|0)(?:[\s.-]?\d){8,10}/g;

  const emailRegex =
    /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

  const phones = text.match(phoneRegex);
  const emails = text.match(emailRegex);

  const phone = phones?.[0]
    ?.replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(/-/g, "");

  const email = emails?.[0];

  return {
    ...(phone ? { phone } : {}),
    ...(email ? { email } : {}),
  };
}

export async function saveExtractedInfoFromMessage(params: {
  conversationId: string;
  messageText: string;
  customerName?: string;
}) {
  const { conversationId, messageText, customerName } = params;

  const extracted = extractContactInfo(messageText);

  if (!extracted.phone && !extracted.email && !customerName) {
    return;
  }

  const extractedRef = ref(realtimeDb, `${BASE_PATH}/${conversationId}`);

  await update(extractedRef, {
    conversationId,
    ...extracted,
    ...(customerName ? { customerName } : {}),
    updatedAt: Date.now(),
  });
}