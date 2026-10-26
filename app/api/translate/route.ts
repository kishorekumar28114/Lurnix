import { NextResponse } from "next/server";
import { translateText, sanitizeAiErrorMessage } from "@/lib/openrouter";
import { TranslationRequest } from "@/types/translation";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as TranslationRequest;
        const { text, targetLanguage } = body;

        if (!text || !targetLanguage) {
            return NextResponse.json(
                { error: "Text and target language are required" },
                { status: 400 }
            );
        }

        const translatedText = await translateText(text, targetLanguage);

        return NextResponse.json({ translatedText });
    } catch (error) {
        console.error("Translation error:", error);
        const rawMessage = error instanceof Error ? error.message : "Failed to translate text";
        const sanitized = sanitizeAiErrorMessage(rawMessage);
        return NextResponse.json(
            { error: sanitized },
            { status: 500 }
        );
    }
}
