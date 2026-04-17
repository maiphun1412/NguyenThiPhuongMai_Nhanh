"use client";

import { useEffect } from "react";
import ChatWidget from "../components/ChatWidget";

export default function TroLyAiPage() {
  useEffect(() => {
    const STYLE_ID = "hide-floating-chat-on-tro-ly-ai";

    const hideFloatingChat = () => {
      const selectors = [
        "#nhanh-chat-widget-button",
        "#nhanh-chat-widget",
        'iframe[src*="chat-embed"]',
        '[data-chat-widget="floating"]',
      ];

      selectors.forEach((selector) => {
        document.querySelectorAll(selector).forEach((el) => {
          if (el instanceof HTMLElement) {
            el.style.display = "none";
            el.style.visibility = "hidden";
            el.style.opacity = "0";
            el.style.pointerEvents = "none";
          }
        });
      });
    };

    // Gắn CSS ẩn cứng
    if (!document.getElementById(STYLE_ID)) {
      const style = document.createElement("style");
      style.id = STYLE_ID;
      style.innerHTML = `
        #nhanh-chat-widget-button,
        #nhanh-chat-widget,
        iframe[src*="chat-embed"],
        [data-chat-widget="floating"] {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
        }
      `;
      document.head.appendChild(style);
    }

    hideFloatingChat();

    // Theo dõi nếu script bơm icon lại thì ẩn tiếp
    const observer = new MutationObserver(() => {
      hideFloatingChat();
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observer.disconnect();
      document.getElementById(STYLE_ID)?.remove();
    };
  }, []);

  return (
    <main className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-[#eef2f7] bg-white px-6 md:px-10">
        <div>
          <h1 className="text-[22px] font-extrabold text-[#1457c7]">
            Trợ lý AI Nhanh Travel
          </h1>
          <p className="mt-1 text-[13px] text-[#6b7280]">
            Hỏi đáp nhanh về phần mềm, tính năng và hướng dẫn sử dụng
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <div className="rounded-[24px] border border-[#ebeff5] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <ChatWidget mode="page" />
        </div>
      </div>
    </main>
  );
}