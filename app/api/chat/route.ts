import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { faqData } from "@/data/faq";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("Thiếu GEMINI_API_KEY trong file .env.local");
}

const ai = new GoogleGenAI({ apiKey });

function normalizeText(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

function findBestFaq(message: string) {
  const input = normalizeText(message);

  let bestMatch: null | {
    question: string;
    answer: string;
    keywords: string[];
  } = null;

  let bestScore = 0;

  for (const item of faqData) {
    let score = 0;

    for (const keyword of item.keywords) {
      const k = normalizeText(keyword);
      if (input.includes(k)) score += 2;
      if (input === k) score += 3;
    }

    const q = normalizeText(item.question);
    if (input.includes(q) || q.includes(input)) score += 4;

    if (score > bestScore) {
      bestScore = score;
      bestMatch = item;
    }
  }

  return { bestMatch, bestScore };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body.message || "").trim();

    if (!message) {
      return NextResponse.json(
        {
          answer: "Vui lòng nhập câu hỏi.",
          source: "system",
          action: "reply_only",
        },
        { status: 400 }
      );
    }

    const normalized = normalizeText(message);

    const trialKeywords = [
  "dang ky",
  "đăng ký",
  "demo",
  "dang ky demo",
  "dang ky dung thu",
  "dung thu",
  "15 ngay",
  "tu van",
  "de lai thong tin",
  "de lai thong tin nhu nao",
  "de lai thong tin sao",
  "de lai lien he",
  "lien he toi",
  "goi lai",
  "ho tro lien he",
  "muon duoc tu van",
  "muon dang ky",
  "cach dang ky",
  "lam sao dang ky",
  "xin tu van",
  "toi muon duoc lien he",
  "cho toi dang ky",
  "co the tu van cho toi khong",
];

    const shouldOpenTrialForm = trialKeywords.some((keyword) =>
      normalized.includes(keyword)
    );

    if (shouldOpenTrialForm) {
      return NextResponse.json({
        answer: "Vui lòng điền những thông tin dưới đây để đội ngũ hỗ trợ liên hệ và kích hoạt dùng thử.",
        source: "rule",
        action: "open_trial_form",
      });
    }

    const { bestMatch, bestScore } = findBestFaq(message);

    if (bestMatch && bestScore >= 4) {
      return NextResponse.json({
        answer: bestMatch.answer,
        source: "faq",
        action: "reply_only",
      });
    }

    const faqContext = faqData
      .map(
        (item, index) =>
          `${index + 1}. Câu hỏi: ${item.question}\nTrả lời chuẩn: ${item.answer}`
      )
      .join("\n\n");

const prompt = `
Bạn là trợ lý tư vấn cho website Nhanh Travel.

Yêu cầu bắt buộc:
- Trả lời bằng tiếng Việt.
- Trả lời rõ ràng, lịch sự và đầy đủ.
- Chỉ trả lời trong phạm vi thông tin liên quan đến Nhanh Travel.
- Không tự bịa giá, số điện thoại, email, chính sách.
- Nếu người dùng có ý định đăng ký demo, dùng thử, để lại thông tin, muốn được tư vấn hoặc muốn đội ngũ liên hệ lại, thì action phải là "open_trial_form".
- Nếu chỉ là hỏi thông tin thông thường thì action phải là "reply_only".

DỮ LIỆU CHUẨN:
${faqContext}

⚠️ QUAN TRỌNG:
- Chỉ trả về DUY NHẤT một object JSON
- Không thêm markdown
- Không thêm \`\`\`json
- Không giải thích thêm

Format bắt buộc:
{"answer":"nội dung trả lời","action":"open_trial_form hoặc reply_only"}

CÂU HỎI NGƯỜI DÙNG:
${message}
`;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });

      const rawText =
        response.text ||
        '{"answer":"Hiện tại tôi chưa có câu trả lời phù hợp.","action":"reply_only"}';

      let parsed: { answer?: string; action?: string } = {};

const cleanedText = rawText
  .replace(/```json/gi, "")
  .replace(/```/g, "")
  .trim();

try {
  parsed = JSON.parse(cleanedText);
} catch (err) {
  console.error("Lỗi parse JSON:", err);
  parsed = {
    answer: cleanedText,
    action: "reply_only",
  };
}

      return NextResponse.json({
        answer:
          parsed.answer ||
          "Hiện tại tôi chưa có câu trả lời phù hợp. Bạn vui lòng để lại thông tin để được tư vấn thêm.",
        source: "ai",
        action:
          parsed.action === "open_trial_form"
            ? "open_trial_form"
            : "reply_only",
      });
    } catch (error) {
      console.error("Lỗi Gemini:", error);

      if (bestMatch) {
        return NextResponse.json({
          answer: bestMatch.answer,
          source: "faq-fallback",
          action: "reply_only",
        });
      }

      return NextResponse.json({
        answer:
          "Hệ thống AI đang bận tạm thời. Bạn vui lòng thử lại sau ít phút hoặc chọn các câu hỏi có sẵn để được hỗ trợ nhanh.",
        source: "system",
        action: "reply_only",
      });
    }
  } catch (error) {
    console.error("Lỗi API /api/chat:", error);

    return NextResponse.json(
      {
        answer: "Đã có lỗi xảy ra khi xử lý câu hỏi. Bạn vui lòng thử lại sau.",
        source: "system",
        action: "reply_only",
      },
      { status: 500 }
    );
  }
}