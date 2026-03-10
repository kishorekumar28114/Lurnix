import { NextRequest, NextResponse } from "next/server";
import { generatePerformanceAnalysis } from "@/lib/quiz/aiClient";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { questions, userAnswers } = body;

        if (!questions || !userAnswers) {
            return NextResponse.json({ error: "Missing questions or user answers data." }, { status: 400 });
        }

        const analysis = await generatePerformanceAnalysis(questions, userAnswers);

        return NextResponse.json({ analysis });
    } catch (error: any) {
        console.error("Analysis Generation Error in API Route:", error);
        return NextResponse.json(
            { error: "Failed to generate learning analysis." },
            { status: 500 }
        );
    }
}
