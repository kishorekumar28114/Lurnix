import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/quiz/aiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { chunks } = body;

        if (!chunks || !Array.isArray(chunks) || chunks.length === 0) {
            return NextResponse.json({ error: "No text chunks provided for generation." }, { status: 400 });
        }

        const questions = await generateQuizQuestions(chunks);

        // Safety check just in case the model didn't return an array
        if (!Array.isArray(questions)) {
            throw new Error("Invalid output format from model.");
        }

        return NextResponse.json({ questions });
    } catch (error: any) {
        console.error("Quiz Generation Error in API Route:", error);
        return NextResponse.json(
            { error: error.message || "Failed to generate quiz." },
            { status: 500 }
        );
    }
}
