import { NextResponse } from "next/server";
import { translateText, formatGroqError } from "@/lib/groq";
import { TranslationRequest } from "@/types/translation";

export async function POST(request: Request) {
  try {
    let body: TranslationRequest;
    try {
      body = (await request.json()) as TranslationRequest;
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { text, targetLanguage } = body || {};

    if (!text || !targetLanguage || typeof text !== "string" || typeof targetLanguage !== "string") {
      return NextResponse.json(
        { error: "Text and target language are required" },
        { status: 400 }
      );
    }

    const translatedText = await translateText(text, targetLanguage);

    return NextResponse.json({ translatedText });
  } catch (error) {
    const formatted = formatGroqError(error);
    console.error(`[Translation API Error] Status: ${formatted.status}, Message: ${formatted.error}`);
    return NextResponse.json(
      { error: formatted.error },
      { status: formatted.status }
    );
  }
}
