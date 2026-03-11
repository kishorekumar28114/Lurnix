import OpenAI from "openai";

const Lurnix_Summarize = process.env.Lurnix_Summarize;

if (!Lurnix_Summarize) {
    console.warn("WARNING: OPENROUTER_API_KEY is not defined in the environment.");
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: Lurnix_Summarize || 'missing_key',
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Lurnix AI",
    }
});

export default openai;
