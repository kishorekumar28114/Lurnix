import { NextResponse } from "next/server";
import { translateText } from "@/lib/openrouter";
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
        const errorMessage = error instanceof Error ? error.message : "Failed to translate text";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
