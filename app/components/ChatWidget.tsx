"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  saveCustomerInfo,
  getCustomerInfo,
  clearCurrentChatSession,
} from "../../src/lib/session";
import {
  getMessagesFromFirebase,
  saveMessageToFirebase,
} from "../../src/lib/chatService";

type Step = "lead" | "chat";

type Message = {
  id: number;
  role: "bot" | "user";
  text?: string;
  images?: string[];
};

type AnswerItem = {
  text: string;
  images?: string[];
};

type ConversationItem = {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
};

const quickQuestions = [
  "Nhanh Travel là gì?",
  "Phù hợp với loại hình nào?",
  "Xem giao diện thực tế.",
  "Địa chỉ văn phòng ở đâu?",
  "Quản lý tour ghép/đoàn thế nào?",
  "Có App cho khách hàng không?",
  "Bảng giá chi tiết.",
  "Có tính năng kế toán/Hoa hồng không?",
  "Quản lý công nợ nhà cung cấp.",
  "CRM quản lý khách hàng.",
];

const answerMap: Record<string, AnswerItem> = {
  "Nhanh Travel là gì?": {
    text: "Nhanh Travel là nền tảng quản trị doanh nghiệp du lịch toàn diện, giúp số hóa toàn bộ quy trình vận hành từ bán hàng, chăm sóc khách hàng, điều hành tour đến quản lý tài chính. Hệ thống tích hợp CRM, quản lý báo giá, đơn hàng, điều hành tour, nhà cung cấp, công nợ, KPI nhân sự và báo cáo kinh doanh trên cùng một nền tảng duy nhất.",
  },

  "Phù hợp với loại hình nào?": {
    text: "Phần mềm phù hợp với nhiều mô hình kinh doanh du lịch như: công ty du lịch nội địa, inbound, outbound, khu du lịch, nhà xe, khách sạn, hướng dẫn viên, đại lý vé và các đơn vị cung cấp dịch vụ du lịch. Ngoài ra hệ thống có thể tùy biến theo quy mô từ nhỏ đến lớn.",
  },

  "Xem giao diện thực tế.": {
    text: "Dưới đây là một số giao diện thực tế của hệ thống Nhanh Travel:",
    images: [
      "/chatbox/gd1.png",
      "/chatbox/gd2.png",
      "/chatbox/gd3.png",
      "/chatbox/gd4.png",
    ],
  },

  "Địa chỉ văn phòng ở đâu?": {
    text: "Văn phòng của Nhanh Travel hiện đặt tại 2A Nguyễn Sỹ Sách, Phường Tân Sơn, Thành phố Hồ Chí Minh, thuộc Công ty Cổ phần Đầu tư Phát triển Vigo. Nếu anh/chị cần hỗ trợ nhanh hoặc muốn được tư vấn trực tiếp, có thể liên hệ qua hotline (+84) 90 999 1205. Đội ngũ Nhanh Travel luôn sẵn sàng giải đáp thông tin, demo hệ thống và tư vấn giải pháp phù hợp với nhu cầu của doanh nghiệp. Anh/chị cũng có thể ghé trực tiếp văn phòng để trải nghiệm thực tế và trao đổi chi tiết hơn nhé!",
  },

  "Quản lý tour ghép/đoàn thế nào?": {
    text: "Hệ thống hỗ trợ quản lý cả tour riêng và tour ghép. Doanh nghiệp có thể quản lý lịch khởi hành, số lượng khách, xe, tài xế, hướng dẫn viên, dịch vụ đi kèm và điều phối toàn bộ quá trình vận hành tour một cách tập trung và chính xác.",
  },

  "Có App cho khách hàng không?": {
    text: "Có. Nhanh Travel có thể triển khai App khách hàng mang thương hiệu riêng của doanh nghiệp, giúp khách dễ dàng đặt tour, xem lịch trình, nhận thông báo, tích điểm, thanh toán và theo dõi toàn bộ dịch vụ ngay trên điện thoại. Việc sở hữu ứng dụng riêng không chỉ nâng cao trải nghiệm người dùng mà còn giúp doanh nghiệp xây dựng hình ảnh chuyên nghiệp và kết nối với khách hàng một cách hiệu quả hơn.",
  },

  "Bảng giá chi tiết.": {
    text: "Bảng giá của Nhanh Travel gồm nhiều gói như Starter, Business và Enterprise với mức giá và số lượng user khác nhau. Mỗi gói đều tích hợp đầy đủ các tính năng quản lý khách hàng, đơn hàng, nhà cung cấp và điều hành tour, giúp doanh nghiệp dễ dàng lựa chọn giải pháp phù hợp với nhu cầu.",
     images: [
      "/chatbox/banggia.png",
          ],
  },

  "Có tính năng kế toán/Hoa hồng không?": {
    text: "Hệ thống hỗ trợ quản lý tài chính bao gồm: thu chi, công nợ, doanh thu, lợi nhuận, KPI và hoa hồng nhân sự. Doanh nghiệp có thể theo dõi hiệu quả kinh doanh theo từng tour, từng nhân viên và từng giai đoạn.",
  },

  "Quản lý công nợ nhà cung cấp.": {
    text: "Hệ thống cho phép quản lý nhà cung cấp theo từng loại dịch vụ như xe, khách sạn, nhà hàng, hướng dẫn viên... Đồng thời theo dõi công nợ chi tiết giúp doanh nghiệp kiểm soát chi phí và dòng tiền hiệu quả.",
  },

  "CRM quản lý khách hàng.": {
    text: "CRM giúp lưu trữ toàn bộ thông tin khách hàng, lịch sử giao dịch, phân loại nhóm khách, chăm sóc sau bán và theo dõi hành vi khách hàng. Ngoài ra có thể tích hợp Zalo, SMS, Email để tự động hóa marketing và chăm sóc khách hàng.",
  },
};

const defaultBotMessage: Message = {
  id: 1,
  role: "bot",
  text: "Em chào anh chị! Anh chị quan tâm các dịch vụ nào của Nhanhtravel ạ ?",
};

const CONVERSATION_MAP_KEY = "chat_customer_conversations";
const CURRENT_CONVERSATION_ID_KEY = "chat_current_conversation_id";

function normalizeCustomerKey(name: string, phone: string) {
  return `${name.trim().toLowerCase().replace(/\s+/g, " ")}_${phone
    .replace(/\D/g, "")
    .trim()}`;
}

function generateConversationId() {
  return `conv_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function getConversationMap(): Record<string, ConversationItem[]> {
  if (typeof window === "undefined") return {};

  try {
    const raw = localStorage.getItem(CONVERSATION_MAP_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveConversationMap(map: Record<string, ConversationItem[]>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CONVERSATION_MAP_KEY, JSON.stringify(map));
}

function getConversationListForCustomer(customerKey: string) {
  const map = getConversationMap();
  return map[customerKey] || [];
}

function saveConversationListForCustomer(
  customerKey: string,
  conversations: ConversationItem[]
) {
  const map = getConversationMap();
  map[customerKey] = conversations;
  saveConversationMap(map);
}

function getCurrentConversationId() {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(CURRENT_CONVERSATION_ID_KEY) || "";
}

function setCurrentConversationId(conversationId: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(CURRENT_CONVERSATION_ID_KEY, conversationId);
}

function clearCurrentConversationId() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_CONVERSATION_ID_KEY);
}

function buildPreviewTitle(text: string) {
  const cleaned = text.trim();
  if (!cleaned) return "Cuộc trò chuyện mới";
  return cleaned.length > 32 ? `${cleaned.slice(0, 32)}...` : cleaned;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lead");
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showInlineTrialForm, setShowInlineTrialForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [activeConversationId, setActiveConversationId] = useState("");

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [leadForm, setLeadForm] = useState({
    fullName: "",
    phone: "",
    agreed: true,
  });

  const [trialForm, setTrialForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    companySize: "",
    note: "",
    agreed: true,
  });

  const [messages, setMessages] = useState<Message[]>([defaultBotMessage]);

  const canStartLead = useMemo(() => {
    const cleanedPhone = leadForm.phone.replace(/\D/g, "");

    return (
      leadForm.fullName.trim() !== "" &&
      cleanedPhone.length >= 9 &&
      cleanedPhone.length <= 12 &&
      leadForm.agreed
    );
  }, [leadForm]);

  const canSubmitTrial = useMemo(() => {
    const cleanedPhone = trialForm.phone.replace(/\D/g, "");

    return (
      trialForm.fullName.trim() !== "" &&
      trialForm.email.trim() !== "" &&
      cleanedPhone.length >= 9 &&
      cleanedPhone.length <= 12 &&
      trialForm.company.trim() !== "" &&
      trialForm.service.trim() !== "" &&
      trialForm.companySize.trim() !== "" &&
      trialForm.agreed
    );
  }, [trialForm]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, step, showInlineTrialForm]);

  const getActiveCustomer = () => {
    const { name, phone } = getCustomerInfo();
    const customerKey =
      name && phone ? normalizeCustomerKey(name, phone) : "";

    return { name, phone, customerKey };
  };

  const updateConversationMeta = (
    conversationId: string,
    updater: (item: ConversationItem) => ConversationItem
  ) => {
    const { customerKey } = getActiveCustomer();
    if (!customerKey) return;

    const currentList = getConversationListForCustomer(customerKey);
    const nextList = currentList.map((item) =>
      item.id === conversationId ? updater(item) : item
    );

    nextList.sort((a, b) => b.updatedAt - a.updatedAt);

    saveConversationListForCustomer(customerKey, nextList);
    setConversations(nextList);
  };

  const refreshConversationList = () => {
    const { customerKey } = getActiveCustomer();
    if (!customerKey) {
      setConversations([]);
      return [];
    }

    const list = getConversationListForCustomer(customerKey).sort(
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
      setShowInlineTrialForm(false);
    } catch (error) {
      console.error("Lỗi khi load conversation:", error);
      setMessages([defaultBotMessage]);
      setStep("chat");
    }
  };

  const createNewConversation = async () => {
    const { name, phone, customerKey } = getActiveCustomer();
    if (!name || !phone || !customerKey) {
      setStep("lead");
      return;
    }

    const newConversation: ConversationItem = {
      id: generateConversationId(),
      title: "Cuộc trò chuyện mới",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    const currentList = getConversationListForCustomer(customerKey);
    const nextList = [newConversation, ...currentList].sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    saveConversationListForCustomer(customerKey, nextList);
    setConversations(nextList);
    setActiveConversationId(newConversation.id);
    setCurrentConversationId(newConversation.id);

    setMessages([defaultBotMessage]);
    setChatInput("");
    setShowInlineTrialForm(false);
    setPreviewImage(null);
    setIsTyping(false);
    setStep("chat");

    try {
      await saveMessageToFirebase({
        sessionId: newConversation.id,
        name,
        phone,
        role: "bot",
        message: defaultBotMessage.text || "",
      });
    } catch (error) {
      console.error("Lỗi khi tạo conversation mới:", error);
    }
  };

  const ensureConversationReady = async () => {
    if (activeConversationId) return activeConversationId;

    const list = refreshConversationList();
    if (list.length > 0) {
      const selectedId = getCurrentConversationId() || list[0].id;
      setActiveConversationId(selectedId);
      setCurrentConversationId(selectedId);
      return selectedId;
    }

    await createNewConversation();
    return getCurrentConversationId();
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
      const savedCustomer = getCustomerInfo();

      if (savedCustomer.name || savedCustomer.phone) {
        setLeadForm((prev) => ({
          ...prev,
          fullName: savedCustomer.name,
          phone: savedCustomer.phone,
        }));
      }

      if (!savedCustomer.name || !savedCustomer.phone) return;

      const customerKey = normalizeCustomerKey(
        savedCustomer.name,
        savedCustomer.phone
      );

      const list = getConversationListForCustomer(customerKey).sort(
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
    setShowInlineTrialForm(false);

    const { name, phone } = getCustomerInfo();
    if (!name || !phone) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
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
      await saveMessageToFirebase({
        sessionId: conversationId,
        name,
        phone,
        role: "bot",
        message: answer,
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
          text: answer,
          images,
        },
      ]);
      setIsTyping(false);
      setStep("chat");
    }, 800);
  };

  const handleLeadStart = async () => {
    if (!canStartLead) return;

    const cleanName = leadForm.fullName.trim();
    const cleanPhone = leadForm.phone.replace(/\D/g, "");

    saveCustomerInfo(cleanName, cleanPhone);

    const customerKey = normalizeCustomerKey(cleanName, cleanPhone);
    const list = getConversationListForCustomer(customerKey).sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    setConversations(list);

    if (list.length > 0) {
      const selectedId = getCurrentConversationId() || list[0].id;
      await loadConversationById(selectedId);
      return;
    }

    await createNewConversation();
  };

  const closeInlineTrialForm = () => {
    setShowInlineTrialForm(false);
    setTrialForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      companySize: "",
      note: "",
      agreed: true,
    });
  };

  const handleLogout = () => {
    clearCurrentChatSession();
    clearCurrentConversationId();

    setLeadForm({
      fullName: "",
      phone: "",
      agreed: true,
    });

    setTrialForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      companySize: "",
      note: "",
      agreed: true,
    });

    setConversations([]);
    setActiveConversationId("");
    setMessages([defaultBotMessage]);
    setChatInput("");
    setShowInlineTrialForm(false);
    setPreviewImage(null);
    setIsTyping(false);
    setStep("lead");
  };

  const openTrialFormInline = async (questionText: string) => {
    const { name, phone } = getCustomerInfo();
    if (!name || !phone) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    const botText = "Vui lòng điền những thông tin dưới đây";

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
      role: "user",
      message: questionText,
    });

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
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

    setShowInlineTrialForm(true);
    setStep("chat");
  };

  const handleQuickQuestion = async (question: string) => {
    if (question === "Làm sao để đăng ký dùng thử 15 ngày?") {
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

    const { name, phone } = getCustomerInfo();

    if (!name || !phone) {
      alert("Vui lòng nhập tên và số điện thoại trước");
      return;
    }

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
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
        name,
        phone,
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
        setShowInlineTrialForm(true);
        setStep("chat");
        return;
      }

      setShowInlineTrialForm(false);
      setStep("chat");
    } catch (error) {
      console.error("Lỗi khi gọi API chat:", error);

      const errorText =
        "Đã có lỗi xảy ra khi xử lý câu hỏi. Bạn vui lòng thử lại sau.";

      await saveMessageToFirebase({
        sessionId: conversationId,
        name,
        phone,
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

      setShowInlineTrialForm(false);
      setStep("chat");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmitTrial = async () => {
    if (!canSubmitTrial) return;

    const { name, phone } = getCustomerInfo();
    if (!name || !phone) return;

    const conversationId = await ensureConversationReady();
    if (!conversationId) return;

    const userText = "Tôi muốn đăng ký dùng thử demo.";
    const botText = `Cảm ơn ${trialForm.fullName}. Chúng tôi đã ghi nhận thông tin của bạn và sẽ liên hệ lại với bạn thông qua số điện thoại ${trialForm.phone}.`;

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
      role: "user",
      message: userText,
    });

    await saveMessageToFirebase({
      sessionId: conversationId,
      name,
      phone,
      role: "bot",
      message: botText,
    });

    maybePromoteConversationTitle(conversationId, userText);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: userText,
      },
      {
        id: prev.length + 2,
        role: "bot",
        text: botText,
      },
    ]);

    setTrialForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
      service: "",
      companySize: "",
      note: "",
      agreed: true,
    });

    setShowInlineTrialForm(false);
    setStep("chat");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-[#1677ff] bg-white chat-glow transition hover:scale-110"
      >
        <img
          src="/trangchu/chatbox.jpg"
          alt="chat"
          className="h-full w-full rounded-full object-cover"
        />
      </button>
    );
  }

  const renderConversationList = () => (
    <ConversationList
      conversations={conversations}
      activeConversationId={activeConversationId}
      onSelect={loadConversationById}
    />
  );

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
          <div className="relative z-10 flex items-center justify-between px-4 pt-4 pb-3">
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
              {step === "chat" && (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex h-7 items-center justify-center rounded-md border border-[#d8dee8] bg-white px-2 text-[11px] text-[#4b5563] transition hover:scale-105 hover:border-[#ffd2d2] hover:bg-[#fff7f7]"
                  title="Đăng xuất"
                >
                  Đăng xuất
                </button>
              )}

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
                onClick={() => setOpen(false)}
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
            {step === "lead" && (
              <div className="chat-scrollbar flex h-full items-start justify-center overflow-y-auto px-5 pt-[74px] pb-8">
                <div className="chat-lead-glow w-full max-w-[300px]">
                  <div className="relative z-10 rounded-[18px] bg-white px-5 py-5 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
                    <h3 className="mb-5 text-center text-[16px] font-semibold leading-[24px] text-[#121826]">
                      Vui lòng cung cấp thông tin để
                      <br />
                      được tư vấn miễn phí
                    </h3>

                    <div className="space-y-3">
                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-[#2d2f33]">
                          Họ và tên <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={leadForm.fullName}
                          onChange={(e) =>
                            setLeadForm({
                              ...leadForm,
                              fullName: e.target.value,
                            })
                          }
                          placeholder="Vui lòng nhập họ tên"
                          className="h-[40px] w-full rounded-[10px] border border-[#ebedf0] bg-white px-3 text-[13px] text-[#111827] outline-none transition placeholder:text-[#d0d4db] focus:border-[#2992ff]"
                        />
                      </div>

                      <div>
                        <label className="mb-1.5 block text-[13px] font-medium text-[#2d2f33]">
                          Số điện thoại <span className="text-red-500">*</span>
                        </label>
                        <input
                          value={leadForm.phone}
                          onChange={(e) =>
                            setLeadForm({
                              ...leadForm,
                              phone: e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 12),
                            })
                          }
                          placeholder="Vui lòng nhập số điện thoại"
                          inputMode="numeric"
                          className="h-[40px] w-full rounded-[10px] border border-[#ebedf0] bg-white px-3 text-[13px] text-[#111827] outline-none transition placeholder:text-[#d0d4db] focus:border-[#2992ff]"
                        />

                        {leadForm.phone.length > 0 &&
                          (leadForm.phone.length < 9 ||
                            leadForm.phone.length > 12) && (
                            <p className="mt-1 text-[12px] text-red-500">
                              Số điện thoại phải từ 9 đến 12 chữ số.
                            </p>
                          )}
                      </div>

                      <button
                        type="button"
                        onClick={handleLeadStart}
                        className={`mt-1 h-[38px] cursor-pointer rounded-[9px] px-5 text-[14px] font-semibold text-white transition ${
                          canStartLead
                            ? "bg-[#2c8fff] hover:opacity-95"
                            : "cursor-not-allowed bg-[#9ec5ff]"
                        }`}
                      >
                        Bắt đầu
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === "chat" && (
              <div className="flex h-full">
                {isExpanded && (
                  <div className="hidden w-[250px] shrink-0 border-r border-[#edf1f5] bg-[#fbfcfe] md:flex md:flex-col">
                    <div className="border-b border-[#edf1f5] px-3 py-3">
                      <button
                        type="button"
                        onClick={createNewConversation}
                        className="flex w-full items-center justify-center gap-2 rounded-[12px] border border-[#d8dee8] bg-white px-3 py-2 text-[13px] font-medium text-[#2e3137] transition hover:border-[#bfdcff] hover:bg-[#f6fbff]"
                      >
                        <span className="text-[18px] leading-none">+</span>
                        <span>Cuộc trò chuyện mới</span>
                      </button>
                    </div>

                    <div className="chat-scrollbar flex-1 overflow-y-auto px-3 py-3">
                      {renderConversationList()}
                    </div>
                  </div>
                )}

                <div className="flex min-w-0 flex-1 flex-col">
                  {!isExpanded && null}

                  <div className="chat-scrollbar flex-1 overflow-y-auto px-5 pt-4 pb-3">
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

                      {showInlineTrialForm && (
                        <div className="flex justify-start">
                          <div className="relative w-full rounded-[14px] border border-[#eceff3] bg-white px-4 py-4 shadow-[0_10px_25px_rgba(15,23,42,0.04)]">
                            <button
                              type="button"
                              onClick={closeInlineTrialForm}
                              className="absolute right-3 top-3 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-[#d8dee8] bg-white text-[16px] text-[#6b7280] transition hover:scale-105 hover:border-[#bfdcff] hover:bg-[#f6fbff]"
                            >
                              ×
                            </button>

                            <h3 className="mb-4 text-center text-[16px] font-extrabold text-[#2388ff]">
                              ĐĂNG KÝ SỬ DỤNG DEMO
                            </h3>

                            <div className="space-y-3">
                              <Field label="Họ và tên" required>
                                <input
                                  value={trialForm.fullName}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      fullName: e.target.value,
                                    })
                                  }
                                  className="chat-form-input"
                                />
                              </Field>

                              <Field label="Email" required>
                                <input
                                  type="email"
                                  value={trialForm.email}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      email: e.target.value,
                                    })
                                  }
                                  className="chat-form-input"
                                />
                              </Field>

                              <Field label="Số điện thoại/Zalo" required>
                                <input
                                  value={trialForm.phone}
                                  onChange={(e) => {
                                    const value = e.target.value
                                      .replace(/\D/g, "")
                                      .slice(0, 12);

                                    setTrialForm({
                                      ...trialForm,
                                      phone: value,
                                    });
                                  }}
                                  placeholder="Nhập từ 9 đến 12 số"
                                  inputMode="numeric"
                                  className="chat-form-input"
                                />

                                {trialForm.phone.length > 0 &&
                                  (trialForm.phone.length < 9 ||
                                    trialForm.phone.length > 12) && (
                                    <p className="mt-1 text-[12px] text-red-500">
                                      Số điện thoại phải từ 9 đến 12 chữ số.
                                    </p>
                                  )}
                              </Field>

                              <Field label="Công ty" required>
                                <input
                                  value={trialForm.company}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      company: e.target.value,
                                    })
                                  }
                                  className="chat-form-input"
                                />
                              </Field>

                              <Field
                                label="Dịch vụ"
                                required
                                hint="Có thể chọn nhiều loại dịch vụ"
                              >
                                <select
                                  value={trialForm.service}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      service: e.target.value,
                                    })
                                  }
                                  className="chat-form-input"
                                >
                                  <option value=""></option>
                                  <option value="tour-noi-dia">
                                    Tour nội địa
                                  </option>
                                  <option value="inbound">Inbound</option>
                                  <option value="outbound">Outbound</option>
                                  <option value="khach-san">Khách sạn</option>
                                  <option value="nha-xe">Nhà xe</option>
                                  <option value="ve-tham-quan">
                                    Vé tham quan
                                  </option>
                                </select>
                              </Field>

                              <Field label="Quy mô công ty" required>
                                <select
                                  value={trialForm.companySize}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      companySize: e.target.value,
                                    })
                                  }
                                  className="chat-form-input"
                                >
                                  <option value=""></option>
                                  <option value="1-10">1 - 10 người</option>
                                  <option value="11-30">11 - 30 người</option>
                                  <option value="31-50">31 - 50 người</option>
                                  <option value="50+">Trên 50 người</option>
                                </select>
                              </Field>

                              <Field label="Lời nhắc">
                                <textarea
                                  value={trialForm.note}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      note: e.target.value,
                                    })
                                  }
                                  rows={3}
                                  className="chat-form-input min-h-[76px] resize-none py-3"
                                />
                              </Field>

                              <label className="flex items-start gap-2 text-[12px] text-[#4b5563]">
                                <input
                                  type="checkbox"
                                  checked={trialForm.agreed}
                                  onChange={(e) =>
                                    setTrialForm({
                                      ...trialForm,
                                      agreed: e.target.checked,
                                    })
                                  }
                                  className="mt-[2px] h-4 w-4 accent-[#2388ff]"
                                />
                                <span>
                                  Cam kết bảo mật thông tin.{" "}
                                  <span className="font-medium text-[#2388ff] underline">
                                    Chi tiết tại đây
                                  </span>
                                </span>
                              </label>

                              <button
                                type="button"
                                onClick={handleSubmitTrial}
                                className={`flex h-[42px] w-full items-center justify-center rounded-[10px] px-4 text-[16px] font-semibold text-white transition ${
                                  canSubmitTrial
                                    ? "cursor-pointer bg-[#2388ff] hover:opacity-95"
                                    : "cursor-not-allowed bg-[#9ec5ff]"
                                }`}
                              >
                                Đăng ký demo
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

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
                    <QuestionGrid
                      items={quickQuestions}
                      onClick={handleQuickQuestion}
                      className="mb-1"
                      isExpanded={isExpanded}
                    />
                  </div>

                  <div className="shrink-0">
                    <ChatInput
                      value={chatInput}
                      onChange={setChatInput}
                      onSend={handleSendCustomMessage}
                      onNewChat={createNewConversation}
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

function Field({
  label,
  required = false,
  hint,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-3">
        <label className="text-[13px] font-semibold text-[#2e3137]">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {hint ? (
          <span className="text-[11px] italic text-[#9ca3af]">{hint}</span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function ConversationList({
  conversations,
  activeConversationId,
  onSelect,
}: {
  conversations: ConversationItem[];
  activeConversationId: string;
  onSelect: (id: string) => void | Promise<void>;
}) {
  if (conversations.length === 0) {
    return (
      <div className="text-[12px] text-[#9ca3af]">
        Chưa có lịch sử trò chuyện.
      </div>
    );
  }

  return (
    <div className="flex gap-2 md:flex-col">
      {conversations.map((item) => {
        const active = item.id === activeConversationId;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`min-w-[160px] rounded-[12px] border px-3 py-2 text-left text-[12px] transition md:min-w-0 ${
              active
                ? "border-[#b8dcff] bg-[#f3f9ff] text-[#1457c7]"
                : "border-[#edf1f5] bg-white text-[#374151] hover:border-[#bfdcff] hover:bg-[#f6fbff]"
            }`}
          >
            <div className="line-clamp-2 font-medium">{item.title}</div>
            <div className="mt-1 text-[11px] text-[#9ca3af]">
              {new Date(item.updatedAt).toLocaleString("vi-VN")}
            </div>
          </button>
        );
      })}
    </div>
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
      <div
        className={`flex flex-wrap justify-start gap-x-2 gap-y-2`}
      >
        {items.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => onClick(item)}
            className="
              cursor-pointer whitespace-nowrap rounded-[14px] border border-[#a8dbff] bg-white
              px-3 py-[7px] text-[11px] font-medium leading-[16px] text-[#2e3137]
              transition hover:scale-[1.02] hover:border-[#bfdcff] hover:bg-[#f6fbff]
            "
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
}

function ChatInput({
  value,
  onChange,
  onSend,
  onNewChat,
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void | Promise<void>;
  onNewChat: () => void | Promise<void>;
}) {
  return (
    <div className="overflow-visible px-4 pb-5 pt-2">
      <div className="chat-input-glow">
        <div className="relative z-10 overflow-visible rounded-[18px] border border-[#edf1f5] bg-white px-3 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNewChat()}
              title="Tạo cuộc trò chuyện mới"
              className="flex h-7 w-7 cursor-pointer shrink-0 items-center justify-center rounded-full text-[18px] leading-none text-[#6b7280] transition hover:bg-[#f3f4f6]"
            >
              +
            </button>

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