import axios from "axios";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export async function translateText(text: string, targetLanguage: string): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is not configured.");
    }

    // 470KB of text is ~100k+ tokens. gpt-3.5-turbo max is 4,096~16k depending on routing.
    // Truncate safely to roughly ~10,000 characters to prevent 400 errors from OpenRouter.
    const maxChars = 12000;
    const safeText = text.length > maxChars ? text.slice(0, maxChars) + "\n\n[...TEXT TRUNCATED DUE TO AI TOKEN LIMITS...]" : text;

    try {
        const response = await axios.post(
            API_URL,
            {
                model: "openai/gpt-3.5-turbo",
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
                headers: {
                    Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("OpenRouter API Error:", error.response?.data || error.message);
            throw new Error(`OpenRouter Error: ${error.response?.data?.error?.message || "Failed to translate text"}`);
        }
        throw error;
    }
}

export async function simplifyExplanation(text: string, language: string): Promise<string> {
    if (!OPENROUTER_API_KEY) {
        throw new Error("OpenRouter API key is not configured.");
    }

    const response = await axios.post(
        API_URL,
        {
            model: "openai/gpt-3.5-turbo",
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
            headers: {
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
        }
    );

    return response.data.choices[0].message.content;
}
