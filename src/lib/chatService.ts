import { get, push, ref, set } from "firebase/database";
import { db } from "./firebase";

export type FirebaseMessage = {
  id: string;
  name: string;
  phone: string;
  role: "user" | "bot";
  message: string;
  createdAt: number;
};

type SaveMessageParams = {
  sessionId: string;
  name: string;
  phone: string;
  role: "user" | "bot";
  message: string;
};

const BASE_PATH = "nhanhtravel-website/maiphuong/chats";

export async function saveMessageToFirebase({
  sessionId,
  name,
  phone,
  role,
  message,
}: SaveMessageParams) {
  const messagesRef = ref(db, `${BASE_PATH}/${sessionId}/messages`);
  const newMessageRef = push(messagesRef);

  await set(newMessageRef, {
    name,
    phone,
    role,
    message,
    createdAt: Date.now(),
  });
}

export async function getMessagesFromFirebase(
  sessionId: string
): Promise<FirebaseMessage[]> {
  const messagesRef = ref(db, `${BASE_PATH}/${sessionId}/messages`);
  const snapshot = await get(messagesRef);

  if (!snapshot.exists()) return [];

  const data = snapshot.val() as Record<
    string,
    Omit<FirebaseMessage, "id">
  >;

  return Object.entries(data)
    .map(([id, value]) => ({
      id,
      name: value.name || "",
      phone: value.phone || "",
      role: value.role || "user",
      message: value.message || "",
      createdAt: value.createdAt || 0,
    }))
    .sort((a, b) => a.createdAt - b.createdAt);
}