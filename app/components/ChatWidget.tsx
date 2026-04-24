"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

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
import { faqData, type FaqItem } from "../../src/lib/faq-data";

const DEMO_REGISTER_URL =
  "https://demo.nhanhtravel.com/RegisterDemo/register_demo_form";

const REGISTER_QUESTION = "Đăng ký sử dụng demo";
const GUIDE_QUESTION = "Hướng dẫn sử dụng";

type ChatWidgetProps = {
  mode?: "popup" | "page" | "embed";
};

const FIXED_SUGGESTIONS = [GUIDE_QUESTION, REGISTER_QUESTION];

function normalizeText(text?: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.filter((item) => item && item.trim() !== "")));
}

function isFixedSuggestion(question: string) {
  const normalized = normalizeText(question);
  return FIXED_SUGGESTIONS.some(
    (item) => normalizeText(item) === normalized
  );
}

function getParentFaqQuestions() {
  return faqData
    .filter((item) => item.isParent)
    .map((item) => item.question)
    .filter(Boolean);
}

function getFaqItemByQuestion(question: string) {
  const normalizedQuestion = normalizeText(question);

  return faqData.find(
    (item) => normalizeText(item.question) === normalizedQuestion
  );
}

function getChildQuestionsByParent(parentQuestion: string) {
  const normalizedParent = normalizeText(parentQuestion);

  return faqData
    .filter(
      (item) =>
        normalizeText(item.parentQuestion) === normalizedParent &&
        normalizeText(item.question) !== normalizedParent
    )
    .map((item) => item.question);
}

function getAskedQuestionsFromMessages(sourceMessages: Message[]) {
  return sourceMessages
    .filter(
      (msg) =>
        msg.role === "user" &&
        typeof msg.text === "string" &&
        msg.text.trim() !== ""
    )
    .map((msg) => normalizeText(msg.text));
}

function getUserQuestionCount(sourceMessages: Message[]) {
  return sourceMessages.filter(
    (msg) =>
      msg.role === "user" &&
      typeof msg.text === "string" &&
      msg.text.trim() !== ""
  ).length;
}

function scoreQuestionMatch(input: string, candidate: string) {
  const a = normalizeText(input);
  const b = normalizeText(candidate);

  if (!a || !b) return 0;
  if (a === b) return 100;
  if (a.includes(b) || b.includes(a)) return 80;

  const aWords = a.split(" ").filter(Boolean);
  const bWords = b.split(" ").filter(Boolean);

  let sameWords = 0;
  for (const word of aWords) {
    if (bWords.includes(word)) sameWords++;
  }

  return sameWords;
}

function findBestFaqItem(question: string) {
  let bestItem: FaqItem | undefined;
  let bestScore = 0;

  for (const item of faqData) {
    const score = scoreQuestionMatch(question, item.question);
    if (score > bestScore) {
      bestScore = score;
      bestItem = item;
    }
  }

  return { bestItem, bestScore };
}

function getInitialDynamicSuggestions() {
  const parentQuestions = getParentFaqQuestions();

  const fromParents = parentQuestions.slice(0, 3);
  const fromQuickQuestions = quickQuestions.slice(0, 5);

  return uniqueStrings([...fromParents, ...fromQuickQuestions]).slice(0, 8);
}

function buildDynamicSuggestionsFromFaq(
  latestUserQuestion: string,
  sourceMessages: Message[]
) {
  const asked = new Set(getAskedQuestionsFromMessages(sourceMessages));
  const userQuestionCount = getUserQuestionCount(sourceMessages);
  const { bestItem, bestScore } = findBestFaqItem(latestUserQuestion);

  const suggestions: string[] = [];

  if (bestItem && bestScore >= 2) {
    const parentQuestion =
      bestItem.parentQuestion && bestItem.parentQuestion.trim() !== ""
        ? bestItem.parentQuestion
        : bestItem.question;

    const sameGroupChildren = getChildQuestionsByParent(parentQuestion);

    suggestions.push(
      ...sameGroupChildren.filter(
        (question) => normalizeText(question) !== normalizeText(latestUserQuestion)
      )
    );

    if (
      normalizeText(parentQuestion) !== normalizeText(latestUserQuestion) &&
      !bestItem.isParent
    ) {
      suggestions.unshift(parentQuestion);
    }
  }

  const scoredGlobalQuestions = faqData
    .map((item) => ({
      question: item.question,
      score: scoreQuestionMatch(latestUserQuestion, item.question),
    }))
    .sort((a, b) => b.score - a.score)
    .map((item) => item.question);

  suggestions.push(...scoredGlobalQuestions);

  const cleaned = uniqueStrings(
    suggestions.filter((question) => {
      const normalizedQuestion = normalizeText(question);

      if (!normalizedQuestion) return false;
      if (isFixedSuggestion(question)) return false;
      if (asked.has(normalizedQuestion)) return false;

      return true;
    })
  );

  const topDynamic = cleaned.slice(0, 8);

  if (topDynamic.length > 0) {
    return topDynamic;
  }

  const initialFallback = getInitialDynamicSuggestions().filter(
    (question) => !asked.has(normalizeText(question))
  );

  if (initialFallback.length > 0) {
    return initialFallback.slice(0, 8);
  }

  if (userQuestionCount >= 10) {
    return ["Có case thực tế không?", "Giá và gói như thế nào?", "Triển khai bao lâu?"];
  }

  return getInitialDynamicSuggestions();
}

function buildSuggestedQuestions(
  latestUserQuestion: string | null,
  sourceMessages: Message[]
) {
  const userQuestionCount = getUserQuestionCount(sourceMessages);

  const dynamicSuggestions = latestUserQuestion
    ? buildDynamicSuggestionsFromFaq(latestUserQuestion, sourceMessages)
    : getInitialDynamicSuggestions();

  const orderedFixed =
    userQuestionCount >= 10
      ? [REGISTER_QUESTION, GUIDE_QUESTION]
      : [GUIDE_QUESTION, REGISTER_QUESTION];

  const merged = uniqueStrings([...dynamicSuggestions, ...orderedFixed]);

  return merged.length > 0 ? merged : orderedFixed;
}

function renderMessageText(text?: string) {
  if (!text) return null;

  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (/^https?:\/\/[^\s]+$/.test(part)) {
      return (
        <a
  key={index}
  href={part}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    color: "#1677ff",
    textDecoration: "underline",
    fontWeight: 400,
  }}
  className="break-all hover:opacity-80"
>
  {part}
</a>
      );
    }

    return <span key={index}>{part}</span>;
  });
}

export default function ChatWidget({ mode = "popup" }: ChatWidgetProps) {
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("chat");
  const [showWelcomeBubble, setShowWelcomeBubble] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>(
    buildSuggestedQuestions(null, [])
  );

  const closeEmbedWidget = () => {
    setShowWelcomeBubble(false);

    if (typeof window !== "undefined" && window.parent !== window) {
      window.parent.postMessage({ type: "NHANH_CHAT_CLOSE" }, "*");
      return;
    }

    setOpen(false);
  };

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");

  const isPageMode = mode === "page";
  const isEmbedMode = mode === "embed";

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
    if (pathname !== "/") {
      setShowWelcomeBubble(false);
      return;
    }

    if (isPageMode) {
      setShowWelcomeBubble(false);
      return;
    }

    setShowWelcomeBubble(true);

    const timer = setTimeout(() => {
      setShowWelcomeBubble(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [pathname, isPageMode]);

  useEffect(() => {
    if (isEmbedMode) {
      setOpen(true);
      setShowWelcomeBubble(false);
    }
  }, [isEmbedMode]);

  const getActiveSession = () => {
    const sessionKey = getOrCreateChatSessionId();
    return { sessionKey };
  };

  const goToRegisterDemo = () => {
    window.open(DEMO_REGISTER_URL, "_blank", "noopener,noreferrer");
  };

  const goToGuidePage = () => {
    setShowWelcomeBubble(false);

    if (typeof window !== "undefined" && window.parent !== window) {
      window.open("/huong-dan-su-dung", "_blank", "noopener,noreferrer");
      return;
    }

    setOpen(false);
    window.open("/huong-dan-su-dung", "_blank", "noopener,noreferrer");
  };

  const goToFullChatPage = () => {
    setShowWelcomeBubble(false);

    if (typeof window !== "undefined" && window.parent !== window) {
      window.open("/tro-ly-ai", "_blank", "noopener,noreferrer");
      return;
    }

    setOpen(false);
    window.open("/tro-ly-ai", "_blank", "noopener,noreferrer");
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
        const mappedMessages = oldMessages.map((msg, index) => ({
          id: index + 1,
          role: msg.role,
          text: msg.message,
        })) as Message[];

        setMessages(mappedMessages);

        const latestUserMessage = [...mappedMessages]
          .reverse()
          .find((msg) => msg.role === "user" && msg.text)?.text;

        setSuggestedQuestions(
          buildSuggestedQuestions(latestUserMessage || null, mappedMessages)
        );
      } else {
        setMessages([defaultBotMessage]);
        setSuggestedQuestions(buildSuggestedQuestions(null, []));
      }

      setStep("chat");
      setShowSuggestions(true);
    } catch (error) {
      console.error("Lỗi khi load conversation:", error);
      setMessages([defaultBotMessage]);
      setSuggestedQuestions(buildSuggestedQuestions(null, []));
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
    setSuggestedQuestions(buildSuggestedQuestions(null, []));

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

      if (list.length === 0) {
        setSuggestedQuestions(buildSuggestedQuestions(null, []));
        return;
      }

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

    const nextUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      text: question,
    };

    setMessages((prev) => [...prev, nextUserMessage]);
    setChatInput("");
    setIsTyping(true);

    setTimeout(async () => {
      const botMessage: Message = {
        id: messages.length + 2,
        role: "bot",
        text: answer,
        images,
      };

      setMessages((prev) => [...prev, botMessage]);

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

      const nextSourceMessages: Message[] = [...messages, nextUserMessage, botMessage];

      setSuggestedQuestions(
        buildSuggestedQuestions(question, nextSourceMessages)
      );
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

    const nextUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      text: questionText,
    };

    const nextBotMessage: Message = {
      id: messages.length + 2,
      role: "bot",
      text: botText,
    };

    setMessages((prev) => [...prev, nextUserMessage, nextBotMessage]);

    const nextSourceMessages: Message[] = [...messages, nextUserMessage, nextBotMessage];

    setStep("chat");
    setShowSuggestions(true);
    setSuggestedQuestions(
      buildSuggestedQuestions(questionText, nextSourceMessages)
    );

    setTimeout(() => {
      goToRegisterDemo();
    }, 500);
  };

  const handleQuickQuestion = async (question: string) => {
    setShowSuggestions(true);

    if (question === GUIDE_QUESTION) {
      const sessionKey = getOrCreateChatSessionId();
      if (!sessionKey) return;

      const conversationId = await ensureConversationReady();
      if (!conversationId) return;

      const botText =
        "Mình sẽ mở trang hướng dẫn sử dụng để bạn xem chi tiết nhé.";

      await saveMessageToFirebase({
        sessionId: conversationId,
        name: "anonymous",
        sessionKey,
        role: "user",
        message: question,
      });

      await saveMessageToFirebase({
        sessionId: conversationId,
        name: "anonymous",
        sessionKey,
        role: "bot",
        message: botText,
      });

      maybePromoteConversationTitle(conversationId, question);

      const nextUserMessage: Message = {
        id: messages.length + 1,
        role: "user",
        text: question,
      };

      const nextBotMessage: Message = {
        id: messages.length + 2,
        role: "bot",
        text: botText,
      };

      setMessages((prev) => [...prev, nextUserMessage, nextBotMessage]);

      const nextSourceMessages: Message[] = [...messages, nextUserMessage, nextBotMessage];

      setStep("chat");
      setSuggestedQuestions(
        buildSuggestedQuestions(question, nextSourceMessages)
      );

      setTimeout(() => {
        goToGuidePage();
      }, 200);

      return;
    }

    if (
      question === "Làm sao để đăng ký dùng thử 15 ngày?" ||
      question === REGISTER_QUESTION
    ) {
      await openTrialFormInline(question);
      return;
    }

    const matchedFaq = getFaqItemByQuestion(question);
    const predefinedAnswer = answerMap[question];

    const answerText =
      predefinedAnswer?.text ||
      matchedFaq?.answer ||
      "Xin chào, bạn vui lòng chọn các câu hỏi có sẵn bên dưới để được hỗ trợ.";

    const answerImages = predefinedAnswer?.images || [];

    await fakeBotReply(question, answerText, answerImages);
  };

  const handleSendCustomMessage = async () => {
    const value = chatInput.trim();
    if (!value || isTyping) return;

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

    const nextUserMessage: Message = {
      id: messages.length + 1,
      role: "user",
      text: value,
    };

    setMessages((prev) => [...prev, nextUserMessage]);

    setChatInput("");
    setIsTyping(true);
    setShowSuggestions(true);

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

      const nextBotMessage: Message = {
        id: messages.length + 2,
        role: "bot",
        text: botAnswer,
      };

      setMessages((prev) => [...prev, nextBotMessage]);

      const nextSourceMessages: Message[] = [...messages, nextUserMessage, nextBotMessage];
      const backendSuggestions = Array.isArray(data?.suggestions)
        ? data.suggestions.filter(
            (item: unknown): item is string =>
              typeof item === "string" && item.trim().length > 0
          )
        : [];

      const localSuggestions = buildDynamicSuggestionsFromFaq(
        value,
        nextSourceMessages
      );

      const mergedDynamicSuggestions = uniqueStrings([
        ...backendSuggestions,
        ...localSuggestions,
      ]).slice(0, 8);

      const userQuestionCount = getUserQuestionCount(nextSourceMessages);
      const orderedFixed =
        userQuestionCount >= 10
          ? [REGISTER_QUESTION, GUIDE_QUESTION]
          : [GUIDE_QUESTION, REGISTER_QUESTION];

      const finalSuggestions = uniqueStrings([
        ...mergedDynamicSuggestions,
        ...orderedFixed,
      ]);

      setSuggestedQuestions(finalSuggestions);
      setStep("chat");
      setShowSuggestions(true);

      if (data.action === "open_trial_form") {
        goToRegisterDemo();
        return;
      }
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

      const nextBotMessage: Message = {
        id: messages.length + 2,
        role: "bot",
        text: errorText,
      };

      setMessages((prev) => [...prev, nextBotMessage]);

      const nextSourceMessages: Message[] = [...messages, nextUserMessage, nextBotMessage];

      setSuggestedQuestions(
        buildSuggestedQuestions(value, nextSourceMessages)
      );
      setStep("chat");
      setShowSuggestions(true);
    } finally {
      setIsTyping(false);
    }
  };

  if (!open && !isPageMode) {
    if (isEmbedMode) return null;

    return (
      <>
        {showWelcomeBubble && (
          <div className="fixed bottom-24 right-6 z-50">
            <div className="relative w-[260px] rounded-2xl border border-[#e6f0ff] bg-white px-4 py-3 text-[13px] leading-[20px] text-[#334155] shadow-[0_12px_32px_rgba(15,23,42,0.12)]">
              <div className="absolute -bottom-2 right-6 h-4 w-4 rotate-45 rounded-[2px] border-b border-r border-[#e6f0ff] bg-white" />

              <div className="font-semibold text-[#1677ff]">Xin chào 👋</div>
              <div className="mt-1">
                Chào mừng bạn đến với Nhanh Travel. Mình có thể hỗ trợ bạn tìm
                hiểu tính năng và đăng ký dùng thử demo.
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
            setShowSuggestions(true);
            setSuggestedQuestions(buildSuggestedQuestions(null, []));
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
        className={`transition-all duration-300 ${
          isPageMode || isEmbedMode
            ? "relative h-full w-full"
            : `fixed bottom-4 right-4 z-50 max-w-[calc(100vw-16px)] sm:bottom-5 sm:right-5 ${
                isExpanded
                  ? "w-[92vw] sm:w-[760px] lg:w-[980px]"
                  : "w-[420px] sm:w-[440px]"
              }`
        }`}
      >
        <div
          className={
            isEmbedMode
              ? "flex h-full w-full flex-col bg-white"
              : "chat-soft-card relative overflow-visible rounded-[22px] border border-[#ebeff5] bg-[#fefefe]"
          }
        >
          <div className="relative z-10 flex items-center justify-between px-4 pb-2 pt-2">
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
              {!isPageMode && (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.parent !== window) {
                      window.parent.postMessage(
                        { type: "NHANH_CHAT_HIDE_LAUNCHER" },
                        "*"
                      );
                    }
                    goToFullChatPage();
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-[#d8dee8] bg-white text-[#4b5563] transition hover:scale-110 hover:border-[#7c3aed] hover:text-[#7c3aed]"
                  title="Mở trang chat riêng"
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                  </svg>
                </button>
              )}

              {!isPageMode && (
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined" && window.parent !== window) {
                      window.parent.postMessage(
                        { type: "NHANH_CHAT_EXPAND" },
                        "*"
                      );
                      return;
                    }

                    setIsExpanded((prev) => !prev);
                  }}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#d8dee8] bg-white text-[#4b5563] transition hover:scale-105 hover:border-[#bfdcff] hover:bg-[#f6fbff]"
                  title="Mở rộng"
                >
                  ⤢
                </button>
              )}

              {!isPageMode && (
                <button
                  type="button"
                  onClick={closeEmbedWidget}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border border-[#d8dee8] bg-white text-[#6b7280] transition hover:scale-105 hover:border-[#bfdcff] hover:bg-[#f6fbff]"
                  title="Đóng"
                >
                  ×
                </button>
              )}
            </div>
          </div>

          <div
            className={`relative z-10 overflow-hidden transition-all duration-300 ${
              isEmbedMode ? "h-full" : isExpanded ? "h-[78vh]" : "h-[640px]"
            }`}
          >
            {step === "chat" && (
              <div className="flex h-full">
                <div className="flex min-w-0 w-full flex-1 flex-col">
                  <div className="chat-scrollbar flex-1 overflow-y-auto px-2 pb-0 pt-4">
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
                                ? "max-w-[80%] rounded-[16px] rounded-tr-[8px] bg-[#eef8ff] text-[#374151]"
                                : "max-w-[95%] rounded-[16px] rounded-tl-[8px] border border-[#edf1f5] bg-white text-[#333b48]"
                            }`}
                          >
                            <div>
                              {msg.text && (
                                <div className="whitespace-pre-line">
                                  {renderMessageText(msg.text)}
                                </div>
                              )}

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

                  <div className="shrink-0 px-3 py-0">
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
              src={previewImage ?? ""}
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
}: {
  items: string[];
  onClick: (item: string) => void | Promise<void>;
  className?: string;
}) {
  return (
    <div className={`w-full px-1 ${className}`}>
      <div className="flex w-full flex-wrap justify-start gap-2">
        {items.map((item) => {
          const isDemo = item === "Đăng ký sử dụng demo";
          const isGuide = item === "Hướng dẫn sử dụng";

          return (
            <button
              key={item}
              type="button"
              onClick={() => onClick(item)}
              className={
                isDemo
                  ? `
      cursor-pointer whitespace-nowrap rounded-[14px]
      border-2 border-[#38bdf8]
      bg-[linear-gradient(135deg,#eef8ff,#dff3ff)]
      px-3 py-[7px] text-[11px] font-semibold leading-[16px]
      text-[#0b63c9]
      shadow-[0_4px_12px_rgba(14,116,255,0.15)]
      transition hover:scale-[1.04] hover:border-[#0ea5e9] hover:shadow-[0_6px_16px_rgba(14,116,255,0.25)]
    `
                  : isGuide
                  ? `
      cursor-pointer whitespace-nowrap rounded-[14px]
      border-2 border-[#7c3aed]
      bg-[linear-gradient(135deg,#f5f3ff,#ede9fe)]
      px-3 py-[7px] text-[11px] font-semibold leading-[16px]
      text-[#5b21b6]
      shadow-[0_4px_12px_rgba(124,58,237,0.16)]
      transition hover:scale-[1.04] hover:border-[#6d28d9] hover:shadow-[0_6px_16px_rgba(124,58,237,0.22)]
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
        <div className="relative z-10 overflow-visible rounded-[18px] border border-[#edf1f5] bg-white px-3 py-2 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
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