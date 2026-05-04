"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();

  const hiddenOnPages = [
    "/tro-ly-ai",
    "/chat-embed",
    "/chat-history",
    "/extracted-info",
    "/admin-login",
  ];

  const shouldHide = hiddenOnPages.some((path) => pathname.startsWith(path));

  if (shouldHide) {
    return null;
  }

  return <ChatWidget />;
}