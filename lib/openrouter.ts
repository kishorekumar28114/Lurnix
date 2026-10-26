import axios from "axios";

export const DEFAULT_AI_MODEL = "meta-llama/llama-3.1-8b-instruct";
export const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";

export function getAiModel(): string {
    return process.env.AI_MODEL || DEFAULT_AI_MODEL;
}

export function getOpenRouterApiKey(): string {
    return process.env.OPENROUTER_API_KEY || "";
}

export function getOpenRouterHeaders(title = "Lurnix AI"): Record<string, string> {
    const apiKey = getOpenRouterApiKey();
    return {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        "X-Title": process.env.NEXT_PUBLIC_SITE_NAME || title,
    };
}

export function sanitizeAiErrorMessage(rawMessage: string): string {
    if (!rawMessage) return "Unknown AI service error";
    return rawMessage
        .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
        .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, "Bearer [REDACTED]");
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
        throw new Error("OpenRouter API key is not configured.");
    }

    const maxChars = 12000;
    const safeText = text.length > maxChars ? text.slice(0, maxChars) + "\n\n[...TEXT TRUNCATED DUE TO AI TOKEN LIMITS...]" : text;
    const model = getAiModel();

    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model,
                messages: [
                    {
                        role: "system",
                        content: `You are a professional translator specialized in educational content.

Translate the following text into ${targetLanguage}.

Requirements:
- Preserve the original meaning and educational accuracy.
- Maintain formatting such as headings, bullet points, numbering, and paragraphs.
- Do NOT translate technical terms, code snippets, URLs, formulas, or programming keywords.
- Keep the translation natural and easy for students to understand.
- Do NOT add explanations, greetings, or commentary.

Output ONLY the translated text.`,
                    },
                    {
                        role: "user",
                        content: safeText,
                    },
                ],
            },
            {
                headers: getOpenRouterHeaders("Lurnix Translator"),
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const upstreamError = error.response?.data?.error?.message || error.message;
            const sanitized = sanitizeAiErrorMessage(upstreamError);
            console.error(`[Translation Upstream Error] Status: ${status}, Model: ${model}, Message: ${sanitized}`);
            throw new Error(`OpenRouter Error (${status || 'unknown'}): ${sanitized}`);
        }
        throw error;
    }
}

export async function simplifyExplanation(text: string, language: string): Promise<string> {
    const apiKey = getOpenRouterApiKey();
    if (!apiKey) {
        throw new Error("OpenRouter API key is not configured.");
    }

    const model = getAiModel();

    try {
        const response = await axios.post(
            OPENROUTER_API_URL,
            {
                model,
                messages: [
                    {
                        role: "system",
                        content: `You are a helpful teacher. The user will provide a text in ${language}. Rewrite the text in simpler words in the same language (${language}) so that students can understand difficult concepts easily. Keep it concise.`,
                    },
                    {
                        role: "user",
                        content: text,
                    },
                ],
            },
            {
                headers: getOpenRouterHeaders("Lurnix Simplifier"),
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const upstreamError = error.response?.data?.error?.message || error.message;
            const sanitized = sanitizeAiErrorMessage(upstreamError);
            console.error(`[Simplifier Upstream Error] Status: ${status}, Model: ${model}, Message: ${sanitized}`);
            throw new Error(`OpenRouter Error (${status || 'unknown'}): ${sanitized}`);
        }
        throw error;
    }
}
