"use client";

import { useState } from "react";

type ChatMessage = {
  role: "user" | "bot";
  text: string;
};

type TrialFormData = {
  fullName: string;
  email: string;
  phone: string;
  company: string;
};

const quickQuestions = [
  "Làm sao để đăng ký dùng thử 15 ngày?",
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

export default function FloatingChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "bot",
      text: "Xin chào, tôi là trợ lý Nhanh Travel. Bạn cần hỗ trợ nội dung nào?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [showTrialForm, setShowTrialForm] = useState(false);

  const [trialForm, setTrialForm] = useState<TrialFormData>({
    fullName: "",
    email: "",
    phone: "",
    company: "",
  });

  async function sendMessage(text: string) {
    const finalText = text.trim();
    if (!finalText || loading) return;

    setMessages((prev) => [...prev, { role: "user", text: finalText }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message: finalText }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.answer || "Xin lỗi, tôi chưa trả lời được câu hỏi này.",
        },
      ]);

      if (data.action === "open_trial_form") {
        setShowTrialForm(true);
      } else {
        setShowTrialForm(false);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Đã có lỗi xảy ra. Bạn vui lòng thử lại sau.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function handleSubmitTrialForm(e: React.FormEvent) {
    e.preventDefault();

    if (
      !trialForm.fullName.trim() ||
      !trialForm.email.trim() ||
      !trialForm.phone.trim() ||
      !trialForm.company.trim()
    ) {
      alert("Vui lòng nhập đầy đủ thông tin.");
      return;
    }

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: "Tôi muốn đăng ký dùng thử demo.",
      },
      {
        role: "bot",
        text: `Cảm ơn ${trialForm.fullName}. Đội ngũ Nhanh Travel sẽ sớm liên hệ qua số ${trialForm.phone} hoặc email ${trialForm.email}.`,
      },
    ]);

    setTrialForm({
      fullName: "",
      email: "",
      phone: "",
      company: "",
    });

    setShowTrialForm(false);
  }

  return (
    <div>
      <div>
        {messages.map((msg, index) => (
          <div key={index}>
            <div>{msg.text}</div>
          </div>
        ))}
      </div>

      {showTrialForm && (
        <form onSubmit={handleSubmitTrialForm} style={{ marginTop: 16 }}>
          <h3>Đăng ký sử dụng demo</h3>

          <div>
            <input
              type="text"
              placeholder="Họ và tên"
              value={trialForm.fullName}
              onChange={(e) =>
                setTrialForm((prev) => ({ ...prev, fullName: e.target.value }))
              }
            />
          </div>

          <div>
            <input
              type="email"
              placeholder="Email"
              value={trialForm.email}
              onChange={(e) =>
                setTrialForm((prev) => ({ ...prev, email: e.target.value }))
              }
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Số điện thoại/Zalo"
              value={trialForm.phone}
              onChange={(e) =>
                setTrialForm((prev) => ({ ...prev, phone: e.target.value }))
              }
            />
          </div>

          <div>
            <input
              type="text"
              placeholder="Công ty"
              value={trialForm.company}
              onChange={(e) =>
                setTrialForm((prev) => ({ ...prev, company: e.target.value }))
              }
            />
          </div>

          <button type="submit">Đăng ký demo</button>
        </form>
      )}

      <div>
        {quickQuestions.map((question) => (
          <button
            key={question}
            type="button"
            onClick={() => sendMessage(question)}
            disabled={loading}
          >
            {question}
          </button>
        ))}
      </div>

      <div>
        <input
          type="text"
          placeholder="Nhập tin nhắn của bạn"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage(input);
          }}
          disabled={loading}
        />
        <button type="button" onClick={() => sendMessage(input)} disabled={loading}>
          {loading ? "Đang gửi..." : "Gửi"}
        </button>
      </div>
    </div>
  );
}