import { Question, AnalysisReport } from "./types";
import {
    getAiModel,
    getOpenRouterApiKey,
    getOpenRouterHeaders,
    sanitizeAiErrorMessage,
    OPENROUTER_API_URL,
} from "@/lib/openrouter";

/**
 * Generates quiz questions from given context chunks.
 * We want EXACTLY 10 questions spread out over whatever chunks are provided.
 */
export async function generateQuizQuestions(chunks: string[]): Promise<Question[]> {
    const apiKey = process.env.Lurnix_Quiz || getOpenRouterApiKey();
    if (!apiKey) {
        throw new Error("OpenRouter API key is not configured.");
    }
    const model = getAiModel();

    const totalChunks = chunks.length;
    // Distribute the 10 questions somewhat evenly across chunks
    let questionsPerChunk = chunks.map(() => Math.floor(10 / totalChunks));

    // Distribute the remainder (e.g., if 10 / 3 chunks, remaining is 1. We stick it in the first chunk)
    let remainder = 10 % totalChunks;
    for (let i = 0; i < remainder; i++) {
        questionsPerChunk[i]++;
    }

    let allQuestions: Question[] = [];

    for (let i = 0; i < totalChunks; i++) {
        const chunkCount = questionsPerChunk[i];
        if (chunkCount === 0) continue;

        const chunk = chunks[i];

        const prompt = `
You are an expert educational assessment generator.

Your task is to create high-quality multiple-choice questions from provided learning content.

Use ONLY the provided context.

Context: 
${chunk}

Requirements:
Generate EXACTLY ${chunkCount} conceptual questions that test understanding, not just memorization.

Each question must include:
question
options (4 options only)
correctAnswer
hint
explanation
topic

Return JSON only in the EXACT following format:
[
{
"question": "",
"options": ["","","",""],
"correctAnswer": "",
"hint": "",
"explanation": "",
"topic": ""
}
]

Rules:
1. Each question must test understanding of the concept.
2. Avoid trivial or definition-only questions.
3. Avoid repeating the same concept multiple times.
4. Ensure options are plausible and challenging.
5. The correct answer must be clearly supported by the context.
6. The hint should guide the learner without revealing the answer.
7. The explanation should teach the concept clearly.

Important:
Do NOT invent information that does not appear in the context.
Use only the knowledge contained in the input material.
Return EXACTLY the requested JSON structure list with exactly ${chunkCount} objects. Make sure it is valid JSON.
`;
        try {
            const response = await fetch(OPENROUTER_API_URL, {
                method: "POST",
                headers: getOpenRouterHeaders("Lurnix Quiz Generator", apiKey),
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: "user", content: prompt }]
                })
            });

            if (!response.ok) {
                const errData = await response.text();
                let errMsg = errData;
                try {
                    const parsed = JSON.parse(errData);
                    errMsg = parsed.error?.message || errData;
                } catch (_) { }
                const sanitized = sanitizeAiErrorMessage(errMsg);
                console.error(`[Quiz Upstream Error] Status: ${response.status}, Model: ${model}, Message: ${sanitized}`);
                throw new Error(`OpenRouter API Error: ${response.status} - ${sanitized}`);
            }

            const responseData = await response.json();

            let responseText = "";
            if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
                responseText = responseData.choices[0].message.content || "";
            }

            // Better JSON extraction
            const jsonMatch = responseText.match(/\[[\s\S]*\]/);
            if (jsonMatch) {
                responseText = jsonMatch[0];
            } else {
                responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
            }

            const parsedData = JSON.parse(responseText) as Question[];
            allQuestions = [...allQuestions, ...parsedData];
        } catch (e: any) {
            console.error("AI Generation Error: ", e);
            if (e.message && e.message.includes("OpenRouter API Error")) {
                throw e; // Pass through API quota/auth errors
            }
            throw new Error("Failed to generate questions. Model response was invalid format: " + (e.message || "Unknown Error"));
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
    const apiKey = process.env.Lurnix_Quiz || getOpenRouterApiKey();
    if (!apiKey) {
        throw new Error("OpenRouter API key is not configured.");
    }
    const model = getAiModel();

    // Construct context regarding the user's performance
    const performanceData = questions.map((q, idx) => {
        const ans = userAnswers.find(u => u.questionIndex === idx);
        return {
            question: q.question,
            topic: q.topic,
            correctAnswer: q.correctAnswer,
            userAnswer: ans?.selectedOption || "Skipped",
            wasCorrect: ans?.isCorrect || false
        };
    });

    const prompt = `
You are an AI learning coach.

Your task is to analyze a student's quiz performance and provide constructive feedback.

Analyze the results and generate a structured JSON report. 

Input Performance Data:
${JSON.stringify(performanceData, null, 2)}

Rules:
Focus on conceptual understanding rather than just scores.
Identify patterns in mistakes based on the topics.
Provide actionable suggestions that help the student improve.
Avoid generic feedback.

Output MUST BE EXACTLY valid JSON in this structure:
{
  "strengths": ["...", "..."],
  "weakAreas": ["...", "..."],
  "topicsToFocusOn": ["...", "..."],
  "suggestedStudyStrategy": "..."
}
`;

    try {
        const response = await fetch(OPENROUTER_API_URL, {
            method: "POST",
            headers: getOpenRouterHeaders("Lurnix Quiz Analyzer", apiKey),
            body: JSON.stringify({
                model: model,
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!response.ok) {
            const errData = await response.text();
            let errMsg = errData;
            try {
                const parsed = JSON.parse(errData);
                errMsg = parsed.error?.message || errData;
            } catch (_) { }
            const sanitized = sanitizeAiErrorMessage(errMsg);
            console.error(`[Analysis Upstream Error] Status: ${response.status}, Model: ${model}, Message: ${sanitized}`);
            throw new Error(`OpenRouter API Error: ${response.status} - ${sanitized}`);
        }

        const responseData = await response.json();
        let responseText = "";

        if (responseData.choices && responseData.choices.length > 0 && responseData.choices[0].message) {
            responseText = responseData.choices[0].message.content || "";
        }

        // Better JSON extraction
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
            responseText = jsonMatch[0];
        } else {
            responseText = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
        }

        return JSON.parse(responseText) as AnalysisReport;
    } catch (e: any) {
        console.error("Analysis AI Generation Error: ", e);
        if (e.message && e.message.includes("OpenRouter API Error")) {
            throw e; // Pass through API quota/auth errors
        }
        throw new Error("Failed to generate analysis: " + (e.message || "Unknown error"));
    }
}
