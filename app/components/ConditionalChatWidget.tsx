"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();

  if (pathname === "/tro-ly-ai" || pathname === "/chat-embed") {
    return null;
  }

  return <ChatWidget />;
}