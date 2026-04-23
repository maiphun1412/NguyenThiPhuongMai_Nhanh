import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { faqData, type FaqItem } from "@/src/lib/faq-data";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Thiếu OPENAI_API_KEY trong file .env.local");
}

const client = new OpenAI({
  apiKey,
});

const DEMO_LINK =
  "https://demo.nhanhtravel.com/RegisterDemo/register_demo_form";
const GUIDE_LINK = "http://localhost:3000/huong-dan-su-dung";

type ChatAction = "reply_only" | "open_trial_form";
type ChatSource =
  | "system"
  | "rule"
  | "faq"
  | "ai"
  | "ai-fallback"
  | "faq-fallback";

function normalizeText(text?: string) {
  return (text || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
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

function uniqueStrings(items: string[]) {
  return Array.from(new Set(items.filter((item) => item && item.trim() !== "")));
}

function getTopFaqMatches(message: string, limit = 5) {
  return faqData
    .map((item) => ({
      item,
      score: scoreQuestionMatch(message, item.question),
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function findBestFaq(message: string) {
  const matches = getTopFaqMatches(message, 1);
  const best = matches[0];

  return {
    bestMatch: best?.item || null,
    bestScore: best?.score || 0,
  };
}

function buildSuggestionsFromFaq(
  message: string,
  primaryItem?: FaqItem | null
): string[] {
  const topMatches = getTopFaqMatches(message, 12);
  const bestItem = primaryItem || topMatches[0]?.item || null;

  const suggestions: string[] = [];
  const normalizedMessage = normalizeText(message);

  if (bestItem) {
    const parentQuestion =
      bestItem.parentQuestion && bestItem.parentQuestion.trim() !== ""
        ? bestItem.parentQuestion
        : bestItem.question;

    const sameGroupItems = faqData.filter(
      (item) =>
        normalizeText(item.parentQuestion) === normalizeText(parentQuestion)
    );

    const sortedSameGroup = sameGroupItems
      .filter((item) => normalizeText(item.question) !== normalizedMessage)
      .sort((a, b) => {
        const aScore = scoreQuestionMatch(message, a.question);
        const bScore = scoreQuestionMatch(message, b.question);
        return bScore - aScore;
      });

    for (const item of sortedSameGroup) {
      suggestions.push(item.question);
    }

    if (
      normalizeText(parentQuestion) !== normalizedMessage &&
      !suggestions.some(
        (question) => normalizeText(question) === normalizeText(parentQuestion)
      )
    ) {
      suggestions.unshift(parentQuestion);
    }
  }

  for (const match of topMatches) {
    if (normalizeText(match.item.question) !== normalizedMessage) {
      suggestions.push(match.item.question);
    }
  }

  return uniqueStrings(suggestions).slice(0, 8);
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

function jsonResponse(
  text: string,
  source: ChatSource,
  action: ChatAction,
  status = 200,
  suggestions: string[] = []
) {
  return NextResponse.json(
    {
      answer: text,
      reply: text,
      source,
      action,
      suggestions,
    },
    { status }
  );
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();

    if (!message) {
      return jsonResponse(
        "Vui lòng nhập câu hỏi.",
        "system",
        "reply_only",
        400,
        []
      );
    }

    const normalized = normalizeText(message);

    const showGuideLinkKeywords = [
  "bảng giá chi tiết",
  "bang gia chi tiet",
  "xem giao diện thực tế",
  "xem giao dien thuc te",
  "hướng dẫn sử dụng",
  "huong dan su dung",
  "hướng dẫn",
  "huong dan",
  "cách sử dụng",
  "cach su dung",
  "cách dùng",
  "cach dung",
  "xem hướng dẫn",
  "xem huong dan",
];

    const showDemoLinkKeywords = [
      "đăng ký demo",
      "dang ky demo",
      "đăng ký dùng thử",
      "dang ky dung thu",
      "dùng thử",
      "dung thu",
      "demo",
      "đăng ký",
      "dang ky",
      "muốn đăng ký",
      "muon dang ky",
      "cách đăng ký",
      "cach dang ky",
      "làm sao đăng ký",
      "lam sao dang ky",
      "để lại thông tin",
      "de lai thong tin",
      "liên hệ tư vấn",
      "lien he tu van",
      "tư vấn",
      "tu van",
    ];

    const shouldShowGuideLink = showGuideLinkKeywords.some((keyword) =>
  normalized.includes(normalizeText(keyword))
);

if (shouldShowGuideLink) {
  return jsonResponse(
    `Dạ, bên em đã chuẩn bị đầy đủ tài liệu hướng dẫn chi tiết cũng như giao diện thực tế để anh/chị dễ dàng tham khảo và sử dụng.
Anh/chị có thể xem trực tiếp tại liên kết dưới đây để nắm rõ hơn cách hệ thống vận hành cũng như các tính năng cụ thể ạ:
${GUIDE_LINK}`,
    "rule",
    "reply_only",
    200,
    buildSuggestionsFromFaq(message)
  );
}

    const shouldShowDemoLink = showDemoLinkKeywords.some((keyword) =>
      normalized.includes(normalizeText(keyword))
    );

    if (shouldShowDemoLink) {
      return jsonResponse(
        `Nếu anh/chị muốn đăng ký dùng thử hoặc cần tìm hiểu thêm trước khi triển khai, anh/chị có thể nhấn vào liên kết này để đăng ký trực tiếp. Sau khi nhận thông tin, đội ngũ Nhanh Travel sẽ hỗ trợ mình nhanh hơn và tư vấn phù hợp với mô hình của doanh nghiệp ạ:\n${DEMO_LINK}`,
        "rule",
        "reply_only",
        200,
        buildSuggestionsFromFaq(message)
      );
    }

    const { bestMatch, bestScore } = findBestFaq(message);

    if (bestMatch && bestScore >= 8) {
      return jsonResponse(
        bestMatch.answer,
        "faq",
        "reply_only",
        200,
        buildSuggestionsFromFaq(message, bestMatch)
      );
    }

    const topFaqMatches = getTopFaqMatches(message, 5);
    const faqContext = topFaqMatches
      .map(
        ({ item }, index) =>
          `${index + 1}. Câu hỏi FAQ: ${item.question}\nTrả lời chuẩn: ${item.answer}`
      )
      .join("\n\n");

    const prompt = `
Bạn là trợ lý tư vấn cho website Nhanh Travel.

Yêu cầu bắt buộc:
- Trả lời bằng tiếng Việt.
- Chỉ trả lời các câu hỏi liên quan đến sản phẩm, dịch vụ, chính sách, quy trình của Nhanh Travel.
- Không trả lời ngoài phạm vi.
- Giọng văn thân thiện, tự nhiên, lễ phép.
- Không trả lời cộc lốc, không quá ngắn.
- Ưu tiên bám sát dữ liệu FAQ chuẩn bên dưới.
- Không tự bịa giá, số điện thoại, email, chính sách.
- Nếu câu hỏi có thể trả lời từ FAQ thì phải bám đúng ý FAQ.
- Không tự động yêu cầu người dùng điền form.
- Không trả action là "open_trial_form" cho các trường hợp người dùng tự nhập câu hỏi.
- Với các câu hỏi về demo, dùng thử, tư vấn, liên hệ, chỉ nên trả lời bằng nội dung hướng dẫn và link để người dùng tự bấm.
- Với các câu hỏi như "Bảng giá chi tiết", "Xem giao diện thực tế" hoặc "Hướng dẫn sử dụng", chỉ nên trả lời bằng link hướng dẫn để người dùng tự bấm.
- Action luôn là "reply_only".

DỮ LIỆU FAQ LIÊN QUAN NHẤT:
${faqContext}

⚠️ QUAN TRỌNG:
- Chỉ trả về DUY NHẤT một object JSON
- Không thêm markdown
- Không thêm \`\`\`
- Không giải thích ngoài JSON

Format bắt buộc:
{"answer":"nội dung trả lời","action":"reply_only"}

CÂU HỎI NGƯỜI DÙNG:
${message}
`.trim();

    try {
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        temperature: 0.3,
        messages: [
          {
            role: "system",
            content:
              'Bạn là trợ lý tư vấn của Nhanh Travel. Luôn trả về đúng 1 object JSON hợp lệ theo format {"answer":"...","action":"reply_only"}.',
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
        return jsonResponse(
          "Hiện tại tôi chưa có câu trả lời phù hợp. Anh/chị có thể đặt lại câu hỏi cụ thể hơn để em hỗ trợ chính xác hơn, hoặc tham khảo thêm thông tin tại trang hướng dẫn sử dụng của hệ thống ạ.",
          "ai-fallback",
          "reply_only",
          200,
          buildSuggestionsFromFaq(message, bestMatch)
        );
      }

      const finalAnswer =
        typeof parsed.answer === "string" && parsed.answer.trim()
          ? parsed.answer.trim()
          : "Hiện tại tôi chưa có câu trả lời phù hợp. Anh/chị có thể đặt lại câu hỏi cụ thể hơn để em hỗ trợ chính xác hơn ạ.";

      const finalAction: ChatAction = "reply_only";

      return jsonResponse(
        finalAnswer,
        "ai",
        finalAction,
        200,
        buildSuggestionsFromFaq(message, bestMatch)
      );
    } catch (error) {
      console.error("Lỗi OpenAI:", error);

      if (bestMatch) {
        return jsonResponse(
          bestMatch.answer,
          "faq-fallback",
          "reply_only",
          200,
          buildSuggestionsFromFaq(message, bestMatch)
        );
      }

      return jsonResponse(
        `Hiện tại hệ thống AI đang bận một chút. Anh/chị vui lòng thử lại sau, hoặc nếu muốn xem thêm thông tin tổng quan thì có thể tham khảo tại liên kết này ạ:\n${GUIDE_LINK}`,
        "system",
        "reply_only",
        200,
        buildSuggestionsFromFaq(message)
      );
    }
  } catch (error) {
    console.error("Lỗi API /api/chat:", error);

    return jsonResponse(
      "Đã có lỗi xảy ra khi xử lý câu hỏi. Bạn vui lòng thử lại sau.",
      "system",
      "reply_only",
      500,
      []
    );
  }
}