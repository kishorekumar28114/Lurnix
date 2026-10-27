import { NextResponse } from "next/server";
import { createGroqChatCompletion, formatGroqError } from "@/lib/groq";

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { text, history = [] } = body || {};

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    let messages = Array.isArray(history) ? [...history] : [];
    messages.push({ role: "user", content: text });
    if (messages.length > 10) {
      messages = messages.slice(-10);
    }

    const completion = await createGroqChatCompletion({
      messages,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (error) {
    const formatted = formatGroqError(error);
    console.error(`[Voice API Error] Status: ${formatted.status}, Message: ${formatted.error}`);
    return NextResponse.json(
      { error: formatted.error, details: formatted.details || formatted.error },
      { status: formatted.status }
    );
  }
}
