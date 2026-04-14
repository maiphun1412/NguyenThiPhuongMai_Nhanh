import { NextResponse } from "next/server";
import { getGuideAiTranscriptById } from "@/app/lib/guide-ai-data";

type AiGuideSummary = {
  summary: string;
  steps: string[];
  notes: string[];
};

function normalizeOutput(data: Partial<AiGuideSummary>): AiGuideSummary {
  return {
    summary:
      typeof data.summary === "string" && data.summary.trim()
        ? data.summary.trim()
        : "Chưa có tóm tắt cho video này.",
    steps: Array.isArray(data.steps)
      ? data.steps
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
    notes: Array.isArray(data.notes)
      ? data.notes
          .filter((item): item is string => typeof item === "string")
          .map((item) => item.trim())
          .filter(Boolean)
      : [],
  };
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const guideId = String(body?.guideId || "").trim();

    if (!guideId) {
      return NextResponse.json({ error: "Thiếu guideId" }, { status: 400 });
    }

    const guide = getGuideAiTranscriptById(guideId);

    if (!guide) {
      return NextResponse.json(
        { error: `Không tìm thấy transcript cho guideId: ${guideId}` },
        { status: 404 }
      );
    }

    if (!guide.transcript || !guide.transcript.trim()) {
      return NextResponse.json(
        { error: "Transcript đang rỗng hoặc không hợp lệ" },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Thiếu OPENAI_API_KEY trong environment" },
        { status: 500 }
      );
    }

    const input = `
Bạn là trợ lý hỗ trợ sử dụng phần mềm du lịch.

Hãy đọc transcript video bên dưới và trả về dữ liệu JSON theo đúng schema.

Yêu cầu:
- Viết tiếng Việt ngắn gọn, rõ ý
- Không viết lan man
- "steps" là các bước thao tác thao tác quan trọng nhất
- "notes" chỉ giữ các lưu ý thật sự quan trọng
- Không bịa thêm nội dung ngoài transcript

Tiêu đề video:
${guide.title}

Transcript:
${guide.transcript}
    `.trim();

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        input,
        text: {
          format: {
            type: "json_schema",
            name: "guide_summary",
            schema: {
              type: "object",
              additionalProperties: false,
              properties: {
                summary: { type: "string" },
                steps: {
                  type: "array",
                  items: { type: "string" },
                },
                notes: {
                  type: "array",
                  items: { type: "string" },
                },
              },
              required: ["summary", "steps", "notes"],
            },
          },
        },
      }),
    });

    const rawText = await response.text();
    console.log("OpenAI raw response:", rawText);

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Gọi OpenAI thất bại",
          detail: rawText,
        },
        { status: 500 }
      );
    }

    const data = JSON.parse(rawText);

    const outputText = data?.output?.[0]?.content?.[0]?.text;

    if (!outputText || typeof outputText !== "string") {
      return NextResponse.json(
        {
          error: "AI không trả về nội dung hợp lệ",
          raw: data,
        },
        { status: 500 }
      );
    }

    let parsed: AiGuideSummary;
    try {
      parsed = JSON.parse(outputText);
    } catch {
      return NextResponse.json(
        {
          error: "AI trả về không đúng JSON",
          raw: outputText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(normalizeOutput(parsed));
  } catch (error) {
    return NextResponse.json(
      {
        error: "Có lỗi khi xử lý guide-summary",
        detail: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}