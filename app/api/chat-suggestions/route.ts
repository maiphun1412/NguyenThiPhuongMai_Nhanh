import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

if (!apiKey) {
  throw new Error("Thiếu OPENAI_API_KEY trong file .env.local");
}

const client = new OpenAI({ apiKey });

function extractJsonArray(text: string) {
  const cleaned = text.replace(/```json/gi, "").replace(/```/g, "").trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("[");
    const end = cleaned.lastIndexOf("]");

    if (start !== -1 && end !== -1 && end > start) {
      try {
        return JSON.parse(cleaned.slice(start, end + 1));
      } catch {
        return [];
      }
    }

    return [];
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = String(body?.message || "").trim();
    const answer = String(body?.answer || "").trim();

    if (!message || !answer) {
      return NextResponse.json({ suggestions: [] });
    }

    const prompt = `
Bạn đang hỗ trợ tạo câu hỏi gợi ý tiếp theo cho chatbot Nhanh Travel.

Câu người dùng vừa hỏi:
${message}

Câu chatbot vừa trả lời:
${answer}

Yêu cầu:
- Gợi ý 3 câu hỏi tiếp theo
- Viết ngắn gọn, tự nhiên, dễ bấm
- Chỉ liên quan đến sản phẩm, tính năng, demo, chi phí, hướng dẫn, triển khai
- Không lặp lại y nguyên câu người dùng vừa hỏi
- Không thêm giải thích

Chỉ trả về JSON array thuần như ví dụ:
["Câu 1", "Câu 2", "Câu 3"]
    `.trim();

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content:
            'Bạn chỉ trả về đúng 1 JSON array hợp lệ, ví dụ ["Câu 1", "Câu 2", "Câu 3"].',
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const rawText = response.choices[0]?.message?.content || "[]";
    const parsed = extractJsonArray(rawText);

    const suggestions = Array.isArray(parsed)
      ? parsed.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
      : [];

    return NextResponse.json({
      suggestions: suggestions.slice(0, 3),
    });
  } catch (error) {
    console.error("Lỗi API /api/chat-suggestions:", error);
    return NextResponse.json({ suggestions: [] });
  }
}