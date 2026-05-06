import { get, push, ref, set } from "firebase/database";
import { realtimeDb } from "./firebase";

export type FirebaseMessage = {
  id: string;
  name: string;
  sessionKey: string;
  role: "user" | "bot";
  message: string;
  images?: string[];
  createdAt: number;
};

type SaveMessageParams = {
  sessionId: string;
  name: string;
  sessionKey: string;
  role: "user" | "bot";
  message: string;
  images?: string[];
};

const USER_ID = "maiphuong";

const BASE_PATH = `nhanhtravel-website/${USER_ID}/chats`;

export async function saveMessageToFirebase({
  sessionId,
  name,
  sessionKey,
  role,
  message,
  images = [],
}: SaveMessageParams) {
  const messagesRef = ref(realtimeDb, `${BASE_PATH}/${sessionId}/messages`);
  const newMessageRef = push(messagesRef);

  await set(newMessageRef, {
    name,
    sessionKey,
    role,
    message,
    images,
    createdAt: Date.now(),
  });
}

export async function getMessagesFromFirebase(
  sessionId: string
): Promise<FirebaseMessage[]> {
  const messagesRef = ref(realtimeDb, `${BASE_PATH}/${sessionId}/messages`);
  const snapshot = await get(messagesRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<string, Omit<FirebaseMessage, "id">>;

  return Object.entries(data)
    .map(([id, value]) => ({
      id,
      name: value.name || "",
      sessionKey: value.sessionKey || "",
      role: value.role || "user",
      message: value.message || "",
      images: value.images || [],
      createdAt: value.createdAt || 0,
    }))
    .sort((a, b) => a.createdAt - b.createdAt);
}

type SaveTrialFormParams = {
  conversationId: string;
  sessionKey: string;
  fullName: string;
  email: string;
  phone: string;
  company: string;
  service: string;
  companySize: string;
  note: string;
};

const TRIAL_FORM_PATH = `nhanhtravel-website/${USER_ID}/trial-forms`;

export async function saveTrialFormToFirebase({
  conversationId,
  sessionKey,
  fullName,
  email,
  phone,
  company,
  service,
  companySize,
  note,
}: SaveTrialFormParams) {
  const formRef = ref(realtimeDb, TRIAL_FORM_PATH);
  const newRef = push(formRef);

  await set(newRef, {
    conversationId,
    sessionKey,
    fullName,
    email,
    phone,
    company,
    service,
    companySize,
    note,
    createdAt: Date.now(),
    status: "new",
  });
}