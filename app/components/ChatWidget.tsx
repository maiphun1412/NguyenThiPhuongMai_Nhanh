"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type Step = "lead" | "menu" | "chat";

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
    text: "Doanh nghiệp có thể hiển thị đầy đủ thông tin liên hệ như địa chỉ văn phòng, hotline, email tư vấn, hoặc tích hợp nút gọi nhanh, chat trực tiếp giúp khách hàng liên hệ dễ dàng và nhanh chóng.",
  },

  "Quản lý tour ghép/đoàn thế nào?": {
    text: "Hệ thống hỗ trợ quản lý cả tour riêng và tour ghép. Doanh nghiệp có thể quản lý lịch khởi hành, số lượng khách, xe, tài xế, hướng dẫn viên, dịch vụ đi kèm và điều phối toàn bộ quá trình vận hành tour một cách tập trung và chính xác.",
  },

  "Có App cho khách hàng không?": {
    text: "Có. Hệ thống có thể triển khai App khách hàng mang thương hiệu riêng của doanh nghiệp, cho phép khách đặt tour, xem lịch trình, nhận thông báo, tích điểm, thanh toán và theo dõi dịch vụ ngay trên điện thoại.",
  },

  "Bảng giá chi tiết.": {
    text: "Hệ thống hỗ trợ xây dựng bảng giá cho nhiều loại dịch vụ như tour, khách sạn, xe, vé tham quan... Doanh nghiệp có thể tạo báo giá nhanh chóng, tùy chỉnh theo khách hàng và chuyển đổi trực tiếp thành đơn hàng.",
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

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("lead");
  const [isTyping, setIsTyping] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [showInlineTrialForm, setShowInlineTrialForm] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

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

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "bot",
      text: "Em chào anh chị! Anh chị quan tâm các dịch vụ nào của Nhanhtravel ạ ?",
    },
  ]);

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

  const fakeBotReply = (
    question: string,
    answer: string,
    images: string[] = []
  ) => {
    setShowInlineTrialForm(false);

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: question,
      },
    ]);

    setIsTyping(true);

    setTimeout(() => {
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

  const handleLeadStart = () => {
    if (!canStartLead) return;
    setStep("menu");
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

  const openTrialFormInline = (questionText: string) => {
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
        text: "Vui lòng điền những thông tin dưới đây",
      },
    ]);

    setShowInlineTrialForm(true);
    setStep("chat");
  };

  const handleQuickQuestion = (question: string) => {
    if (question === "Làm sao để đăng ký dùng thử 15 ngày?") {
      openTrialFormInline(question);
      return;
    }

    const answer = answerMap[question] ?? {
      text: "Xin chào, bạn vui lòng chọn các câu hỏi có sẵn bên dưới để được hỗ trợ.",
    };

    fakeBotReply(question, answer.text, answer.images || []);
  };

  const handleSendCustomMessage = async () => {
    const value = chatInput.trim();
    if (!value) return;

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

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "bot",
          text: data.answer || "Xin lỗi, tôi chưa có câu trả lời phù hợp.",
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

      setMessages((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          role: "bot",
          text: "Đã có lỗi xảy ra khi xử lý câu hỏi. Bạn vui lòng thử lại sau.",
        },
      ]);

      setShowInlineTrialForm(false);
      setStep("chat");
    } finally {
      setIsTyping(false);
    }
  };

  const handleSubmitTrial = () => {
    if (!canSubmitTrial) return;

    setMessages((prev) => [
      ...prev,
      {
        id: prev.length + 1,
        role: "user",
        text: "Tôi muốn đăng ký dùng thử demo.",
      },
      {
        id: prev.length + 2,
        role: "bot",
        text: `Cảm ơn ${trialForm.fullName}. Chúng tôi đã ghi nhận thông tin của bạn và sẽ liên hệ lại với bạn thông qua số điện thoại ${trialForm.phone}.`,
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
        onClick={() => setOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-white border border-[#1677ff] chat-glow transition hover:scale-110"
      >
        <img
          src="/trangchu/chatbox.jpg"
          alt="chat"
          className="h-full w-full rounded-full object-cover"
        />
      </button>
    );
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50 w-[390px] max-w-[calc(100vw-16px)] sm:bottom-5 sm:right-5 sm:w-[400px]">
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

            <button
              onClick={() => setOpen(false)}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-[#ebedf2] bg-white text-[14px] text-[#b5bcc7] transition hover:bg-[#f8fafc] hover:text-[#6b7280]"
            >
              ×
            </button>
          </div>

          <div className="relative z-10 h-[610px] overflow-hidden">
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
        phone: e.target.value.replace(/\D/g, "").slice(0, 12),
      })
    }
    placeholder="Vui lòng nhập số điện thoại"
    inputMode="numeric"
    className="h-[40px] w-full rounded-[10px] border border-[#ebedf0] bg-white px-3 text-[13px] text-[#111827] outline-none transition placeholder:text-[#d0d4db] focus:border-[#2992ff]"
  />

  {leadForm.phone.length > 0 &&
    (leadForm.phone.length < 9 || leadForm.phone.length > 12) && (
      <p className="mt-1 text-[12px] text-red-500">
        Số điện thoại phải từ 9 đến 12 chữ số.
      </p>
    )}
</div>

                      <button
                        onClick={handleLeadStart}
                        className={`mt-1 h-[38px] rounded-[9px] px-5 text-[14px] font-semibold text-white transition ${
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

            {step === "menu" && (
              <div className="flex h-full flex-col">
                <div className="chat-scrollbar flex-1 overflow-y-auto px-5 pt-16 pb-4">
                  <div className="mx-auto mb-6 max-w-[330px] text-center text-[15px] font-semibold leading-[28px] text-[#20242c]">
                    Em chào anh chị! Anh chị quan tâm các dịch vụ nào của
                    Nhanhtravel ạ ?
                  </div>

                  <QuestionGrid
                    items={quickQuestions}
                    onClick={handleQuickQuestion}
                  />
                </div>

                <div className="shrink-0">
                  <ChatInput
                    value={chatInput}
                    onChange={setChatInput}
                    onSend={handleSendCustomMessage}
                  />
                </div>
              </div>
            )}

            {step === "chat" && (
              <div className="flex h-full flex-col">
                <div className="chat-scrollbar flex-1 overflow-y-auto px-5 pt-4 pb-3">
                  <div className="space-y-3">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
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
                                    className="overflow-hidden rounded-[12px] border border-[#e5e7eb] bg-white"
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
                            className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[16px] text-[#6b7280] transition hover:bg-[#f8fafc]"
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
      const value = e.target.value.replace(/\D/g, "").slice(0, 12);

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
    (trialForm.phone.length < 9 || trialForm.phone.length > 12) && (
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
                              onClick={handleSubmitTrial}
                              className={`flex h-[42px] w-full items-center justify-center rounded-[10px] text-[16px] font-semibold text-white transition ${
                                canSubmitTrial
                                  ? "bg-[#2388ff] hover:opacity-95"
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
                  />
                </div>

                <div className="shrink-0">
                  <ChatInput
                    value={chatInput}
                    onChange={setChatInput}
                    onSend={handleSendCustomMessage}
                  />
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
              className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[20px] text-[#111827] shadow"
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

function QuestionGrid({
  items,
  onClick,
  className = "",
}: {
  items: string[];
  onClick: (item: string) => void;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[366px] ${className}`}>
      <div className="flex flex-wrap justify-center gap-x-2 gap-y-2">
        {items.map((item) => (
          <button
            key={item}
            onClick={() => onClick(item)}
            className="
              rounded-[14px] border border-[#a8dbff] bg-white
              px-3 py-[7px] text-[11px] font-medium leading-[16px] text-[#2e3137]
              transition hover:bg-[#f7fbff]
              whitespace-nowrap
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
}: {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="overflow-visible px-4 pb-5 pt-2">
      <div className="chat-input-glow">
        <div className="relative z-10 overflow-visible rounded-[18px] border border-[#edf1f5] bg-white px-3 py-3 shadow-[0_8px_18px_rgba(15,23,42,0.06)]">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[18px] leading-none text-[#6b7280] transition hover:bg-[#f3f4f6]"
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
              onClick={onSend}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[#6b7280] transition hover:bg-[#f3f4f6]"
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