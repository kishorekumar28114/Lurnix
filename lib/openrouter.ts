import axios from "axios";

export function getGroqApiKey(): string {
    return process.env.GROQ_API_KEY || "";
}

export function getGroqApiUrl(): string {
    return process.env.GROQ_API_URL || "";
}

export function getGroqModel(): string {
    return process.env.GROQ_MODEL || "";
}

export function getGroqHeaders(): Record<string, string> {
    const apiKey = getGroqApiKey();
    return {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
    };
}

export function sanitizeAiErrorMessage(rawMessage: string): string {
    if (!rawMessage) return "Unknown AI service error";
    return rawMessage
        .replace(/gsk_[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
        .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
        .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, "Bearer [REDACTED]");
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    const apiKey = getGroqApiKey();
    if (!apiKey) {
        throw new Error("GROQ_API_KEY is not configured.");
    }
    const apiUrl = getGroqApiUrl();
    if (!apiUrl) {
        throw new Error("GROQ_API_URL is not configured.");
    }
    const model = getGroqModel();
    if (!model) {
        throw new Error("GROQ_MODEL is not configured.");
    }

    const maxChars = 12000;
    const safeText = text.length > maxChars ? text.slice(0, maxChars) + "\n\n[...TEXT TRUNCATED DUE TO AI TOKEN LIMITS...]" : text;

    try {
        const response = await axios.post(
            apiUrl,
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
                headers: getGroqHeaders(),
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const status = error.response?.status;
            const upstreamError = error.response?.data?.error?.message || error.message;
            const sanitized = sanitizeAiErrorMessage(upstreamError);
            console.error(`[Translation Upstream Error] Status: ${status}, Model: ${model}, Message: ${sanitized}`);
            throw new Error(`Groq API Error (${status || 'unknown'}): ${sanitized}`);
        }
        throw error;
    }
}
