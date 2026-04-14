"use client";

import { useEffect, useRef, useState } from "react";

import {
  getMessagesFromFirebase,
  saveMessageToFirebase,
} from "../../src/lib/chatService";
import {
  answerMap,
  defaultBotMessage,
  quickQuestions,
  type ConversationItem,
  type Message,
  type Step,
} from "../../src/lib/chatbot-data";
import {
  buildPreviewTitle,
  generateConversationId,
  getConversationListForSession,
  getCurrentConversationId,
  getOrCreateChatSessionId,
  saveConversationListForSession,
  setCurrentConversationId,
} from "../../src/lib/chat-conversation";

const DEMO_REGISTER_URL =
  "https://demo.nhanhtravel.com/RegisterDemo/register_demo_form";

const REGISTER_QUESTION = "Đăng ký sử dụng demo";

const FOLLOW_UP_MAP: Record<string, string[]> = {
  "Nhanh Travel là gì?": [
    "Nhanh Travel có gì hay?",
    "Phần mềm này phù hợp với ai?",
    "Có thể quản lý tour như thế nào?",
  ],
  "Nhanh Travel có gì hay?": [
    "Phần mềm này phù hợp với ai?",
    "Có hỗ trợ chăm sóc khách hàng không?",
    "Có tích hợp báo giá, đơn hàng không?",
  ],
  "Phần mềm này phù hợp với ai?": [
    "Có thể quản lý tour như thế nào?",
    "Có hỗ trợ chăm sóc khách hàng không?",
    "Đăng ký sử dụng demo",
  ],
  "Có thể quản lý tour như thế nào?": [
    "Có tích hợp báo giá, đơn hàng không?",
    "Có hỗ trợ chăm sóc khách hàng không?",
    "Đăng ký sử dụng demo",
  ],
  "Có hỗ trợ chăm sóc khách hàng không?": [
    "Có tích hợp báo giá, đơn hàng không?",
    "Đăng ký sử dụng demo",
  ],
  "Có tích hợp báo giá, đơn hàng không?": ["Đăng ký sử dụng demo"],
};

const INITIAL_SUGGESTIONS = Array.from(
  new Set([...quickQuestions, REGISTER_QUESTION])
);

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] =
    useState<string[]>(INITIAL_SUGGESTIONS);

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");

const welcomeMessage: Message = {
  id: 1,
  role: "bot",
  text: "Xin chào 👋 Chào mừng bạn đến với Nhanh Travel. Mình có thể hỗ trợ bạn tìm hiểu phần mềm, tính năng nổi bật và hướng dẫn đăng ký dùng thử demo.",
};
const [messages, setMessages] = useState<Message[]>([welcomeMessage]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, step, suggestedQuestions]);

  
useEffect(() => {
  setShowWelcomeBubble(true);

  const timer = setTimeout(() => {
    setShowWelcomeBubble(false);
  }, 10000); // 10 giây

  return () => clearTimeout(timer);
}, []);

  const getActiveSession = () => {
    const sessionKey = getOrCreateChatSessionId();
    return { sessionKey };
  };

  const goToRegisterDemo = () => {
    window.open(DEMO_REGISTER_URL, "_blank", "noopener,noreferrer");
  };

  const buildNextSuggestions = (question: string) => {
    const followUps = FOLLOW_UP_MAP[question];

    if (followUps && followUps.length > 0) {
      return Array.from(new Set([...followUps, REGISTER_QUESTION]));
    }

    return INITIAL_SUGGESTIONS;
  };

  const updateConversationMeta = (
    conversationId: string,
    updater: (item: ConversationItem) => ConversationItem
  ) => {
    const { sessionKey } = getActiveSession();
    if (!sessionKey) return;

    const currentList = getConversationListForSession(sessionKey);
    const nextList = currentList.map((item) =>
      item.id === conversationId ? updater(item) : item
    );

    nextList.sort((a, b) => b.updatedAt - a.updatedAt);

    saveConversationListForSession(sessionKey, nextList);
    setConversations(nextList);
  };

  const refreshConversationList = () => {
    const { sessionKey } = getActiveSession();
    if (!sessionKey) {
      setConversations([]);
      return [];
    }

    const list = getConversationListForSession(sessionKey).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );
    setConversations(list);
    return list;
  };

  const loadConversationById = async (conversationId: string) => {
    try {
      const oldMessages = await getMessagesFromFirebase(conversationId);

      setActiveConversationId(conversationId);
      setCurrentConversationId(conversationId);

      if (oldMessages.length > 0) {
        setMessages(
          oldMessages.map((msg, index) => ({
            id: index + 1,
            role: msg.role,
            text: msg.message,
          }))
        );
      } else {
        setMessages([defaultBotMessage]);
      }

      setStep("chat");
      setSuggestedQuestions(INITIAL_SUGGESTIONS);
      setShowSuggestions(true);
    } catch (error) {
      console.error("Lỗi khi load conversation:", error);
      setMessages([defaultBotMessage]);
      setStep("chat");
    }
  };

  const createNewConversation = async () => {
    const { sessionKey } = getActiveSession();
    if (!sessionKey) return;

    const newConversation: ConversationItem = {
      id: generateConversationId(),
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const currentList = getConversationListForSession(sessionKey);
    const nextList = [newConversation, ...currentList].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    saveConversationListForSession(sessionKey, nextList);
    setConversations(nextList);
    setActiveConversationId(newConversation.id);
    setCurrentConversationId(newConversation.id);

    setMessages([defaultBotMessage]);
    setChatInput("");
    setPreviewImage(null);
    setIsTyping(false);
    setStep("chat");
    setShowSuggestions(true);
    setSuggestedQuestions(INITIAL_SUGGESTIONS);

    try {
      await saveMessageToFirebase({
        sessionId: newConversation.id,
        name: "anonymous",
        sessionKey,
        role: "bot",
        message: defaultBotMessage.text || "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo conversation mới:", error);
    }
  };

  const ensureConversationReady = async () => {
    if (activeConversationId && activeConversationId.trim() !== "") {
      return activeConversationId;
    }

    const savedConversationId = getCurrentConversationId();
    if (savedConversationId && savedConversationId.trim() !== "") {
      setActiveConversationId(savedConversationId);
      return savedConversationId;
    }

    const list = refreshConversationList();
    if (list.length > 0) {
      const selectedId = list[0].id;
      setActiveConversationId(selectedId);
      setCurrentConversationId(selectedId);
      return selectedId;
    }

    await createNewConversation();

    const newId = getCurrentConversationId();
    return newId || "";
  };

  const maybePromoteConversationTitle = (
    conversationId: string,
    sourceText: string
  ) => {
    updateConversationMeta(conversationId, (item) => {
      const shouldReplace =
        item.title === "Cuộc trò chuyện mới" || item.title.trim() === "";

      return {
        ...item,
        title: shouldReplace ? buildPreviewTitle(sourceText) : item.title,
        updatedAt: Date.now(),
      };
    });
  };

  useEffect(() => {
    const boot = async () => {
      const sessionKey = getOrCreateChatSessionId();
      if (!sessionKey) return;

      const list = getConversationListForSession(sessionKey).sort(
        (a, b) => b.updatedAt - a.updatedAt
      );

      setConversations(list);

      if (list.length === 0) return;

      const currentConversationId = getCurrentConversationId();
      const selectedId = list.some((item) => item.id === currentConversationId)
        ? currentConversationId
        : list[0].id;

      await loadConversationById(selectedId);
    };

    boot();
  }, []);

  const fakeBotReply = async (
    question: string,
    answer: string,
    images: string[] = []
  ) => {
    const sessionKey = getOrCreateChatSessionId();
    if (!sessionKey) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    await saveMessageToFirebase({
      sessionId: conversationId,
      name: "anonymous",
      sessionKey,
      role: "user",
      message: question,
    });

    maybePromoteConversationTitle(conversationId, question);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: question,
      },
    ]);

    setIsTyping(true);

    setTimeout(async () => {
      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "bot",
          text: answer,
          images,
        },
      ]);

      await saveMessageToFirebase({
        sessionId: conversationId,
        name: "anonymous",
        sessionKey,
        role: "bot",
        message: answer,
      });

      updateConversationMeta(conversationId, (item) => ({
        ...item,
        updatedAt: Date.now(),
      }));

      setSuggestedQuestions(buildNextSuggestions(question));
      setIsTyping(false);
      setStep("chat");
      setShowSuggestions(true);
    }, 800);
  };

  const openTrialFormInline = async (questionText: string) => {
    const sessionKey = getOrCreateChatSessionId();
    if (!sessionKey) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    const botText =
      "Mình sẽ mở trang đăng ký demo để bạn điền thông tin chi tiết nhé.";

    await saveMessageToFirebase({
      sessionId: conversationId,
      name: "anonymous",
      sessionKey,
      role: "user",
      message: questionText,
    });

    await saveMessageToFirebase({
      sessionId: conversationId,
      name: "anonymous",
      sessionKey,
      role: "bot",
      message: botText,
    });

    maybePromoteConversationTitle(conversationId, questionText);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: questionText,
      },
      {
        id: prev.length + 2,
        role: "bot",
        text: botText,
      },
    ]);

    setStep("chat");
    setSuggestedQuestions(INITIAL_SUGGESTIONS);

    setTimeout(() => {
      goToRegisterDemo();
    }, 500);
  };

  const handleQuickQuestion = async (question: string) => {
    setShowSuggestions(false);

    if (
      question === "Làm sao để đăng ký dùng thử 15 ngày?" ||
      question === REGISTER_QUESTION
    ) {
      await openTrialFormInline(question);
      return;
    }

    const answer = answerMap[question] ?? {
      text: "Xin chào, bạn vui lòng chọn các câu hỏi có sẵn bên dưới để được hỗ trợ.",
    };

    await fakeBotReply(question, answer.text, answer.images || []);
  };

  const handleSendCustomMessage = async () => {
    const value = chatInput.trim();
    if (!value || isTyping) return;

    setShowSuggestions(false);

    const sessionKey = getOrCreateChatSessionId();
    if (!sessionKey) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    await saveMessageToFirebase({
      sessionId: conversationId,
      name: "anonymous",
      sessionKey,
      role: "user",
      message: value,
    });

    maybePromoteConversationTitle(conversationId, value);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: value,
      },
    ]);

    setChatInput("");
    setIsTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: value }),
      });

      const data = await res.json();
      const botAnswer =
        data.answer || "Xin lỗi, tôi chưa có câu trả lời phù hợp.";

      await saveMessageToFirebase({
        sessionId: conversationId,
        name: "anonymous",
        sessionKey,
        role: "bot",
        message: botAnswer,
      });

      updateConversationMeta(conversationId, (item) => ({
        ...item,
        updatedAt: Date.now(),
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "bot",
          text: botAnswer,
        },
      ]);

      if (data.action === "open_trial_form") {
        goToRegisterDemo();
        return;
      }

      setSuggestedQuestions(INITIAL_SUGGESTIONS);
      setStep("chat");
      setShowSuggestions(true);
    } catch (error) {
      console.error("Lỗi khi gọi API chat:", error);

      const errorText =
        "Đã có lỗi xảy ra khi xử lý câu hỏi. Bạn vui lòng thử lại sau.";

      await saveMessageToFirebase({
        sessionId: conversationId,
        name: "anonymous",
        sessionKey,
        role: "bot",
        message: errorText,
      });

      updateConversationMeta(conversationId, (item) => ({
        ...item,
        updatedAt: Date.now(),
      }));

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "bot",
          text: errorText,
        },
      ]);

      setSuggestedQuestions(INITIAL_SUGGESTIONS);
      setStep("chat");
      setShowSuggestions(true);
    } finally {
      setIsTyping(false);
    }
  };

if (!open) {
  return (
    <>
      {showWelcomeBubble && (
  <div className="fixed bottom-24 right-6 z-50">
    <div className="relative w-[260px] rounded-2xl border border-[#e6f0ff] bg-white px-4 py-3 text-[13px] leading-[20px] text-[#334155] shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
      {/* Mũi tên nhỏ */}
      <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 rounded-[2px] border-b border-r border-[#e6f0ff] bg-white" />

      <div className="font-semibold text-[#1677ff]">Xin chào 👋</div>
      <div className="mt-1">
        Chào mừng bạn đến với Nhanh Travel. Mình có thể hỗ trợ bạn tìm hiểu
        tính năng và đăng ký dùng thử demo.
      </div>

      <button
        type="button"
        onClick={() => setShowWelcomeBubble(false)}
        className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full border border-[#dbe4f0] bg-white text-[14px] text-[#6b7280] shadow-sm transition hover:bg-[#f8fafc]"
      >
        ×
      </button>
    </div>
  </div>
)}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setShowWelcomeBubble(false);
        }}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#1677ff] bg-white chat-glow transition hover:scale-110"
      >
        <img
          src="/trangchu/chatbox.jpg"
          alt="chat"
          className="h-full w-full rounded-full object-cover"
        />
      </button>
    </>
  );
}

  return (
    <>
      <div
        className={`fixed bottom-4 right-4 z-50 max-w-[calc(100vw-16px)] transition-all duration-300 sm:bottom-5 sm:right-5 ${
          isExpanded
            ? "w-[92vw] sm:w-[760px] lg:w-[980px]"
            : "w-[390px] sm:w-[400px]"
        }`}
      >
        <div className="chat-soft-card relative overflow-visible rounded-[22px] border border-[#ebeff5] bg-[#fefefe]">
          <div className="relative z-10 flex items-center justify-between px-4 pb-3 pt-4">
  <div className="flex items-center gap-2">
    <img
      src="/trangchu/chatbox.jpg"
      alt="avatar"
      className="h-8 w-8 rounded-full object-cover"
    />
    <img
      src="/trangchu/logo.png"
      alt="Nhanh Travel"
      className="h-5 w-auto object-contain"
    />
  </div>

  <div className="flex items-center gap-2">
    

    <button
      type="button"
      onClick={() => setIsExpanded((prev) => !prev)}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#d8dee8] bg-white text-[#4b5563] transition hover:scale-105 hover:border-[#bfdcff] hover:bg-[#f6fbff]"
      title={isExpanded ? "Thu nhỏ" : "Mở rộng"}
    >
      {isExpanded ? "⤡" : "⤢"}
    </button>

    <button
  type="button"
  onClick={() => {
    setOpen(false);
    setShowWelcomeBubble(false);
  }}
      className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#d8dee8] bg-white text-[#6b7280] transition hover:scale-105 hover:border-[#bfdcff] hover:bg-[#f6fbff]"
      title="Đóng"
    >
      ×
    </button>
  </div>
</div>

          <div
            className={`relative z-10 overflow-hidden transition-all duration-300 ${
              isExpanded ? "h-[78vh]" : "h-[610px]"
            }`}
          >
            {step === "chat" && (
              <div className="flex h-full">
                <div className="flex min-w-0 flex-1 flex-col">
                  {!isExpanded && null}

                  <div className="chat-scrollbar flex-1 overflow-y-auto px-5 pb-3 pt-4">
                    <div className="space-y-3">
                      {messages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${
                            msg.role === "user"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`animate-[fadeIn_.25s_ease] px-4 py-3 text-[13px] leading-[22px] shadow-sm ${
                              msg.role === "user"
                                ? "max-w-[76%] rounded-[16px] rounded-tr-[8px] bg-[#eef8ff] text-[#374151]"
                                : "max-w-[88%] rounded-[16px] rounded-tl-[8px] border border-[#edf1f5] bg-white text-[#333b48]"
                            }`}
                          >
                            <div>
                              {msg.text && <div>{msg.text}</div>}

                              {msg.images && msg.images.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 gap-2">
                                  {msg.images.map((img, index) => (
                                    <button
                                      key={index}
                                      type="button"
                                      onClick={() => setPreviewImage(img)}
                                      className="cursor-pointer overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white"
                                    >
                                      <img
                                        src={img}
                                        alt={`Giao diện ${index + 1}`}
                                        className="h-[80px] w-full object-cover"
                                      />
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}

                      {isTyping && (
                        <div className="flex justify-start">
                          <div className="rounded-[16px] rounded-tl-[8px] border border-[#edf1f5] bg-white px-4 py-3 shadow-sm">
                            <div className="flex items-center gap-1">
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:-0.2s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9ca3af] [animation-delay:-0.1s]" />
                              <span className="h-2 w-2 animate-bounce rounded-full bg-[#9ca3af]" />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="shrink-0 px-3 pb-1 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowSuggestions((prev) => !prev)}
                      className="mb-2 flex cursor-pointer items-center gap-1 px-1 text-[12px] font-medium text-[#0099FF]"
                    >
                      <span>Câu hỏi gợi ý</span>
                      <span
                        className={`inline-block text-[10px] transition-transform duration-200 ${
                          showSuggestions ? "rotate-180" : "rotate-0"
                        }`}
                      >
                        ⌃
                      </span>
                    </button>

                    {showSuggestions && (
                      <div className="space-y-2">
                        <QuestionGrid
                          items={suggestedQuestions}
                          onClick={handleQuickQuestion}
                          className="mb-1"
                          isExpanded={isExpanded}
                        />

                        
                      </div>
                    )}
                  </div>

                  <div className="shrink-0">
                    <ChatInput
                      value={chatInput}
                      onChange={setChatInput}
                      onSend={handleSendCustomMessage}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-[900px]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute right-2 top-2 z-10 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[20px] text-[#111827] shadow"
            >
              ×
            </button>

            <img
              src={previewImage}
              alt="Xem ảnh lớn"
              className="max-h-[90vh] w-full rounded-[16px] object-contain"
            />
          </div>
        </div>
      )}
    </>
  );
}

function QuestionGrid({
  items,
  onClick,
  className = "",
  isExpanded = false,
}: {
  items: string[];
  onClick: (item: string) => void | Promise<void>;
  className?: string;
  isExpanded?: boolean;
}) {
  return (
    <div
      className={`mx-auto w-full ${
        isExpanded ? "max-w-none px-1" : "max-w-[366px]"
      } ${className}`}
    >
      <div className="flex flex-wrap justify-start gap-x-2 gap-y-2">
        {items.map((item) => {
  const isDemo = item === "Đăng ký sử dụng demo";

  return (
    <button
      key={item}
      type="button"
      onClick={() => onClick(item)}
      className={
        isDemo
          ? `
            cursor-pointer whitespace-nowrap rounded-[14px]
            border-2 border-[#38bdf8]   /* 👈 VIỀN ĐẬM */
            bg-[linear-gradient(135deg,#eef8ff,#dff3ff)]
            px-3 py-[7px] text-[11px] font-semibold leading-[16px]
            text-[#0b63c9]
            shadow-[0_4px_12px_rgba(14,116,255,0.15)]
            transition hover:scale-[1.04] hover:border-[#0ea5e9] hover:shadow-[0_6px_16px_rgba(14,116,255,0.25)]
          `
          : `
            cursor-pointer whitespace-nowrap rounded-[14px] border border-[#a8dbff] bg-white
            px-3 py-[7px] text-[11px] font-medium leading-[16px] text-[#2e3137]
            transition hover:scale-[1.02] hover:border-[#bfdcff] hover:bg-[#f6fbff]
          `
      }
    >
      {item}
    </button>
  );
})}
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSend,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void | Promise<void>;
}) {
  return (
    <div className="overflow-visible px-4 pb-5 pt-2">
      <div className="chat-input-glow">
        <div className="relative z-10 overflow-visible rounded-[18px] border border-[#edf1f5] bg-white px-3 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <input
              value={value}
              onChange={(e) => onChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") onSend();
              }}
              placeholder="Nhập tin nhắn của bạn"
              className="min-w-0 flex-1 bg-transparent text-[12px] text-[#111827] outline-none placeholder:text-[#b9bec7]"
            />

            <button
              type="button"
              onClick={() => onSend()}
              className="flex h-7 w-7 cursor-pointer shrink-0 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6]"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.9"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2L11 13" />
                <path d="M22 2L15 22L11 13L2 9L22 2Z" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}