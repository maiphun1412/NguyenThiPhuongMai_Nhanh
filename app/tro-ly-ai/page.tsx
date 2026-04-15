"use client";

import { useRouter } from "next/navigation";
import ChatWidget from "../components/ChatWidget";

export default function TroLyAiPage() {
  const router = useRouter();

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

        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-[#d8dee8] bg-white px-4 py-2 text-[13px] font-medium text-[#4b5563] transition hover:bg-[#f8fbff]"
        >
          Quay lại
        </button>
      </header>

      <div className="mx-auto max-w-[1200px] px-4 py-6 md:px-6">
        <div className="rounded-[24px] border border-[#ebeff5] bg-white shadow-[0_18px_40px_rgba(15,23,42,0.06)]">
          <ChatWidget mode="page" />
        </div>
      </div>
    </main>
  );
}