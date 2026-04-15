import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { faqData } from "@/data/faq";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Thiếu OPENAI_API_KEY trong file .env.local");
}

const client = new OpenAI({
  apiKey,
});

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

function extractJsonObject(text: string) {
  const cleaned = text
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");

    if (start !== -1 && end !== -1 && end > start) {
      const sliced = cleaned.slice(start, end + 1);
      try {
        return JSON.parse(sliced);
      } catch {
        return null;
      }
    }

    return null;
  }
}

// Định nghĩa kiểu dữ liệu cho câu trả lời của AI
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();

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
      "đăng kí",
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
      "thông tin",
    ];

    const shouldOpenTrialForm = trialKeywords.some((keyword) =>
      normalized.includes(keyword)
    );

    if (shouldOpenTrialForm) {
      return NextResponse.json({
        answer:
          "Vui lòng điền những thông tin dưới đây để đội ngũ hỗ trợ liên hệ và kích hoạt dùng thử.",
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
- Sử dụng thêm các thông tin đã được cung cấp trong hệ thống hoặc dữ liệu nội bộ
- Trả lời bằng tiếng Việt.
- Chỉ trả lười các câu trả lời liên quan đến sản phẩm, dịch vụ, chính sách, quy trình của Nhanh Travel. Không trả lời ngoài phạm vi này.
- Giọng văn thân thiện, tự nhiên, lễ phép.
- Không trả lời cộc lốc, không trả lời quá ngắn.
- Mỗi câu trả lời nên từ 3 đến 6 câu nếu là câu hỏi thông tin.
- Ưu tiên giải thích rõ khách hàng sẽ nhận được gì, phù hợp với ai, lợi ích là gì.
- Nếu câu hỏi liên quan đến chức năng, hãy nêu ngắn gọn:
  1. chức năng đó là gì
  2. giúp doanh nghiệp giải quyết vấn đề gì
  3. lợi ích khi sử dụng
- Không tự bịa giá, số điện thoại, email, chính sách.
- Nếu người dùng có ý định đăng ký demo, dùng thử, để lại thông tin, muốn được tư vấn hoặc muốn đội ngũ liên hệ lại, thì action phải là "open_trial_form".
- Nếu chỉ là hỏi thông tin thông thường thì action phải là "reply_only".
- Khi trả lời, ưu tiên văn phong tư vấn bán hàng nhẹ nhàng, rõ ràng, dễ hiểu.

DỮ LIỆU CHUẨN:
${faqContext}

⚠️ QUAN TRỌNG:
- Chỉ trả về DUY NHẤT một object JSON
- Không thêm markdown
- Không thêm \`\`\`
- Không giải thích ngoài JSON

Format bắt buộc:
{"answer":"nội dung trả lời","action":"open_trial_form hoặc reply_only"}

CÂU HỎI NGƯỜI DÙNG:
${message}
`.trim();

    try {
      // Gọi OpenAI API để lấy câu trả lời dựa trên prompt đã tạo
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              "Bạn là trợ lý tư vấn của Nhanh Travel. Luôn trả về đúng 1 object JSON hợp lệ theo format đã yêu cầu.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const rawText =
        response.choices[0]?.message?.content ||
        '{"answer":"Hiện tại tôi chưa có câu trả lời phù hợp.","action":"reply_only"}';

      const parsed = extractJsonObject(rawText);

      if (!parsed || typeof parsed !== "object") {
        return NextResponse.json({
          answer:
            "Hiện tại tôi chưa có câu trả lời phù hợp. Bạn vui lòng để lại thông tin để được tư vấn thêm.",
          source: "ai-fallback",
          action: "reply_only",
        });
      }

      return NextResponse.json({
        answer:
          typeof parsed.answer === "string" && parsed.answer.trim()
            ? parsed.answer.trim()
            : "Hiện tại tôi chưa có câu trả lời phù hợp. Bạn vui lòng để lại thông tin để được tư vấn thêm.",
        source: "ai",
        action:
          parsed.action === "open_trial_form"
            ? "open_trial_form"
            : "reply_only",
      });
    } catch (error) {
      console.error("Lỗi OpenAI:", error);

      if (bestMatch) {
        return NextResponse.json({
          answer: bestMatch.answer,
          source: "faq-fallback",
          action: "reply_only",
        });
      }

      return NextResponse.json({
        answer:
          "Hiện tại hệ thống AI đang bận. Anh/chị vui lòng để lại thông tin bên dưới, đội ngũ Nhanh Travel sẽ liên hệ hỗ trợ sớm ạ.",
        source: "system",
        action: "open_trial_form",
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