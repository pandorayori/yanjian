import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { text } = await req.json();

  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "缺少文本" }, { status: 400 });
  }

  const resp = await fetch(
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
      },
      body: JSON.stringify({
        model: "qwen-plus", // 可换 qwen-turbo 以更快更省
        messages: [
          {
            role: "system",
            content:
              "你是一位受过心理学训练的中文AI沟通教练。严格只输出JSON，无任何多余文字。",
          },
          {
            role: "user",
            content: `
请把这句话改写成三种语气（保持事实与立场不变，不加新承诺、不改变人称）：
「${text}」

输出严格为JSON（不要markdown、不要解释）：
{
  "gentle": "温柔表达",
  "direct": "直接表达",
  "humor": "幽默表达"
}`,
          },
        ],
        // 让输出更稳更短
        temperature: 0.7,
        top_p: 0.9,
        max_tokens: 300,
      }),
    }
  );

  const data = await resp.json();

  let gentle = "", direct = "", humor = "";

  // 兼容各种返回形态
  const content = data?.choices?.[0]?.message?.content ?? "";
  try {
    const j = JSON.parse(content);
    gentle = j.gentle || "";
    direct = j.direct || "";
    humor = j.humor || "";
  } catch {
    // 如果模型没按JSON返回，就兜底塞到一个块里
    gentle = content || "（AI 暂无可用结果）";
  }

  return NextResponse.json({ gentle, direct, humor });
}