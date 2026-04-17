"use client";

import { usePathname } from "next/navigation";
import ChatWidget from "./ChatWidget";

export default function ConditionalChatWidget() {
  const pathname = usePathname();

  const hiddenPaths = ["/chat-embed"];

  const shouldHideChatWidget = hiddenPaths.includes(pathname);

  if (shouldHideChatWidget) {
    return null;
  }

  return <ChatWidget />;
}