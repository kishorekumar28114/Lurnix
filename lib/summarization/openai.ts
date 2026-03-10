import OpenAI from "openai";

const openrouterKey = process.env.OPENROUTER_API_KEY;

if (!openrouterKey) {
    console.warn("WARNING: OPENROUTER_API_KEY is not defined in the environment.");
}

const openai = new OpenAI({
    baseURL: "https://openrouter.ai/api/v1",
    apiKey: openrouterKey || 'missing_key',
    defaultHeaders: {
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || "Lurnix AI",
    }
});

export default openai;
