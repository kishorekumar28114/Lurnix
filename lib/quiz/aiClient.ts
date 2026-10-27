import { Question, AnalysisReport } from "./types";
import {
  createGroqChatCompletion,
  sanitizeAiErrorMessage,
  GroqModelUnavailableError,
  GroqConfigurationError,
} from "@/lib/groq";

/**
 * Generates quiz questions from given context chunks.
 * We want EXACTLY 10 questions spread out over whatever chunks are provided.
 */
export async function generateQuizQuestions(chunks: string[]): Promise<Question[]> {
  const totalChunks = chunks.length;
  if (totalChunks === 0) return [];

  // Distribute the 10 questions somewhat evenly across chunks
  const questionsPerChunk = chunks.map(() => Math.floor(10 / totalChunks));

  // Distribute the remainder (e.g., if 10 / 3 chunks, remaining is 1. We stick it in the first chunk)
  const remainder = 10 % totalChunks;
  for (let i = 0; i < remainder; i++) {
    questionsPerChunk[i]++;
  }

  let allQuestions: Question[] = [];

  for (let i = 0; i < totalChunks; i++) {
    const chunkCount = questionsPerChunk[i];
    if (chunkCount === 0) continue;

    const chunk = chunks[i];

    const systemPrompt = `You are an expert assessment generator. Return ONLY a valid JSON array containing exactly ${chunkCount} multiple-choice question objects. Do not include conversational text or verbose reasoning.`;

    const userPrompt = `Context:
${chunk}

Generate ${chunkCount} multiple-choice questions based ONLY on the context.
Format required:
[
  {
    "question": "Question text",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "correctAnswer": "Correct Option",
    "hint": "Helpful hint",
    "explanation": "Clear explanation",
    "topic": "Topic name"
  }
]`;

    try {
      const completion = await createGroqChatCompletion({
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.3,
        max_tokens: 4096,
      });

      let responseText = completion.choices[0]?.message?.content || "";

      // Strip markdown code fences if present
      responseText = responseText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1").trim();

      // Better JSON extraction
      const jsonMatch = responseText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        responseText = jsonMatch[0];
      }

      const parsedData = JSON.parse(responseText) as Question[];
      allQuestions = [...allQuestions, ...parsedData];
    } catch (e: any) {
      console.error("AI Generation Error: ", e);
      if (
        e instanceof GroqModelUnavailableError ||
        e instanceof GroqConfigurationError ||
        e?.code === "model_not_found" ||
        e?.status === 404
      ) {
        throw e;
      }
      const sanitized = sanitizeAiErrorMessage(e.message || "Unknown error");
      throw new Error(`Failed to generate questions: ${sanitized}`);
    }
  }

  // Fallback cleanup to ensure we get exactly 10 if there were off-by-one errors from the model parsing
  return allQuestions.slice(0, 10);
}

/**
 * Analyses user performance and returns actionable feedback.
 */
export async function generatePerformanceAnalysis(
  questions: Question[],
  userAnswers: any[]
): Promise<AnalysisReport> {
  // Construct context regarding the user's performance
  const performanceData = questions.map((q, idx) => {
    const ans = userAnswers.find((u) => u.questionIndex === idx);
    return {
      question: q.question,
      topic: q.topic,
      correctAnswer: q.correctAnswer,
      userAnswer: ans?.selectedOption || "Skipped",
      wasCorrect: ans?.isCorrect || false,
    };
  });

  const systemPrompt = `You are an AI learning coach. Analyze student quiz performance and output ONLY a valid JSON object matching the requested schema. Do not include conversational text or verbose reasoning.`;

  const userPrompt = `Input Performance Data:
${JSON.stringify(performanceData, null, 2)}

Provide feedback in this exact JSON structure:
{
  "strengths": ["...", "..."],
  "weakAreas": ["...", "..."],
  "topicsToFocusOn": ["...", "..."],
  "suggestedStudyStrategy": "..."
}`;

  try {
    const completion = await createGroqChatCompletion({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    let responseText = completion.choices[0]?.message?.content || "";

    // Strip markdown code fences if present
    responseText = responseText.replace(/```(?:json)?\s*([\s\S]*?)\s*```/g, "$1").trim();

    // Better JSON extraction
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      responseText = jsonMatch[0];
    }

    return JSON.parse(responseText) as AnalysisReport;
  } catch (e: any) {
    console.error("Analysis AI Generation Error: ", e);
    if (
      e instanceof GroqModelUnavailableError ||
      e instanceof GroqConfigurationError ||
      e?.code === "model_not_found" ||
      e?.status === 404
    ) {
      throw e;
    }
    const sanitized = sanitizeAiErrorMessage(e.message || "Unknown error");
    throw new Error(`Failed to generate analysis: ${sanitized}`);
  }
}
