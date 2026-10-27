import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createGroqChatCompletion, formatGroqError } from "@/lib/groq";

export async function POST(request) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const { message, historyContext = [] } = body || {};

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    let conversationHistory = Array.isArray(historyContext) ? [...historyContext] : [];
    conversationHistory.push({ role: "user", content: message });
    if (conversationHistory.length > 10) {
      conversationHistory = conversationHistory.slice(-10);
    }

    const completion = await createGroqChatCompletion({
      messages: conversationHistory,
      temperature: 0.7,
    });

    const reply = completion.choices[0]?.message?.content || "";
    return NextResponse.json({ reply });
  } catch (error) {
    const formatted = formatGroqError(error);
    console.error(`[Chat API Error] Status: ${formatted.status}, Message: ${formatted.error}`);
    return NextResponse.json(
      { error: formatted.error, details: formatted.details || formatted.error },
      { status: formatted.status }
    );
  }
}
