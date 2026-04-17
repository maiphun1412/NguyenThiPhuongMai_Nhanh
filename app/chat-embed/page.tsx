"use client";

import ChatWidget from "@/app/components/ChatWidget";

export default function ChatEmbedPage() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-white">
      <ChatWidget mode="embed" />
    </main>
  );
}