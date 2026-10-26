import OpenAI from "openai";

export function getSummarizationApiKey(): string {
    return process.env.Lurnix_Summarize || process.env.OPENROUTER_API_KEY || "";
}

export function getOpenAIClient(): OpenAI {
    const key = getSummarizationApiKey();
    if (!key) {
        console.warn("WARNING: Lurnix_Summarize / OPENROUTER_API_KEY is not defined in the environment.");
    }
    return new OpenAI({
        baseURL: "https://openrouter.ai/api/v1",
        apiKey: key || "missing_key",
        defaultHeaders: {
            "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Lurnix AI",
        },
    });
}

const openai = getOpenAIClient();
export default openai;
