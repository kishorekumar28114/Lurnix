import { NextRequest, NextResponse } from "next/server";
import { generatePerformanceAnalysis } from "@/lib/quiz/aiClient";
import { formatGroqError } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { questions, userAnswers } = body || {};

    if (!questions || !userAnswers || !Array.isArray(questions) || !Array.isArray(userAnswers)) {
      return NextResponse.json(
        { error: "Missing or invalid questions or user answers data." },
        { status: 400 }
      );
    }

    const analysis = await generatePerformanceAnalysis(questions, userAnswers);

    return NextResponse.json({ analysis });
  } catch (error: any) {
    const { error: errorMsg, status } = formatGroqError(error);
    console.error(`[Analysis Generation API Error] Status: ${status}, Message: ${errorMsg}`);
    return NextResponse.json(
      { error: errorMsg },
      { status }
    );
  }
}
