import { NextRequest, NextResponse } from "next/server";
import { generateQuizQuestions } from "@/lib/quiz/aiClient";
import { formatGroqError } from "@/lib/groq";

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON in request body" }, { status: 400 });
    }

    const { chunks } = body || {};

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
    const { error: errorMsg, status } = formatGroqError(error);
    console.error(`[Quiz Generation API Error] Status: ${status}, Message: ${errorMsg}`);
    return NextResponse.json(
      { error: errorMsg },
      { status }
    );
  }
}
