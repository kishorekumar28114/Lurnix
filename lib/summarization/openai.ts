import OpenAI from "openai";

export function getSummarizationClient(): OpenAI {
    const apiKey = process.env.GROQ_API_KEY;
    const baseURL = process.env.GROQ_BASE_URL;

    if (!apiKey) {
        console.warn("WARNING: GROQ_API_KEY is not defined in the environment.");
    }
    if (!baseURL) {
        console.warn("WARNING: GROQ_BASE_URL is not defined in the environment.");
    }

    return new OpenAI({
        baseURL: baseURL || undefined,
        apiKey: apiKey || "missing_key",
    });
}

const openai = getSummarizationClient();
export default openai;
