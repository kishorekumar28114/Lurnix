import OpenAI from "openai";

/**
 * Central server-only Groq configuration and client module.
 * Defaults to the active, supported model "openai/gpt-oss-20b".
 */
export const DEFAULT_GROQ_BASE_URL = "https://api.groq.com/openai/v1";
export const DEFAULT_GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
export const DEFAULT_GROQ_MODEL = "openai/gpt-oss-20b";

export class GroqConfigurationError extends Error {
  code = "GROQ_CONFIGURATION_ERROR";
  constructor(message: string) {
    super(message);
    this.name = "GroqConfigurationError";
  }
}

export class GroqModelUnavailableError extends Error {
  code = "model_not_found";
  status = 404;
  constructor(message: string = "The configured model is unavailable.") {
    super(message);
    this.name = "GroqModelUnavailableError";
  }
}

export interface GroqConfig {
  apiKey: string;
  baseUrl: string;
  apiUrl: string;
  model: string;
}

/**
 * Retrieves and validates the Groq API key from environment variables.
 * Throws GroqConfigurationError if missing.
 */
export function getGroqApiKey(): string {
  const apiKey = process.env.GROQ_API_KEY?.trim();
  if (!apiKey) {
    throw new GroqConfigurationError(
      "Groq API key is not configured. Please set GROQ_API_KEY in your environment variables."
    );
  }
  return apiKey;
}

/**
 * Retrieves the Groq base URL with fallback to default.
 */
export function getGroqBaseUrl(): string {
  return (
    process.env.GROQ_BASE_URL?.trim() || DEFAULT_GROQ_BASE_URL
  ).replace(/\/+$/, "");
}

/**
 * Retrieves the Groq completions API URL with fallback to default.
 */
export function getGroqApiUrl(): string {
  if (process.env.GROQ_API_URL?.trim()) {
    return process.env.GROQ_API_URL.trim().replace(/\/+$/, "");
  }
  return `${getGroqBaseUrl()}/chat/completions`;
}

/**
 * Retrieves the configured Groq model, falling back to openai/gpt-oss-20b.
 * Retired model IDs are never returned as defaults.
 */
export function getGroqModel(): string {
  const model = process.env.GROQ_MODEL?.trim();
  if (!model) {
    return DEFAULT_GROQ_MODEL;
  }
  return model;
}

/**
 * Validates all required Groq configuration.
 */
export function validateGroqConfig(): GroqConfig {
  const apiKey = getGroqApiKey();
  const baseUrl = getGroqBaseUrl();
  const apiUrl = getGroqApiUrl();
  const model = getGroqModel();
  return { apiKey, baseUrl, apiUrl, model };
}

let groqClientInstance: OpenAI | null = null;
let lastClientKey: string | null = null;
let lastClientBaseUrl: string | null = null;

/**
 * Returns a shared, singleton OpenAI client configured for Groq.
 */
export function getGroqClient(): OpenAI {
  const apiKey = getGroqApiKey();
  const baseURL = getGroqBaseUrl();

  if (
    !groqClientInstance ||
    lastClientKey !== apiKey ||
    lastClientBaseUrl !== baseURL
  ) {
    groqClientInstance = new OpenAI({
      apiKey,
      baseURL,
    });
    lastClientKey = apiKey;
    lastClientBaseUrl = baseURL;
  }

  return groqClientInstance;
}

/**
 * Returns authorization headers for Groq API requests (used for direct HTTP calls if needed).
 */
export function getGroqHeaders(): Record<string, string> {
  const apiKey = getGroqApiKey();
  return {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };
}

/**
 * Sanitizes any raw error message by redacting API keys and tokens.
 */
export function sanitizeAiErrorMessage(rawMessage: unknown): string {
  if (!rawMessage) return "Unknown AI service error";
  const messageStr =
    typeof rawMessage === "string"
      ? rawMessage
      : (rawMessage as any)?.message || JSON.stringify(rawMessage);

  return messageStr
    .replace(/gsk_[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
    .replace(/sk-[a-zA-Z0-9_-]{20,}/g, "[REDACTED_KEY]")
    .replace(/Bearer\s+[a-zA-Z0-9_.-]+/gi, "Bearer [REDACTED]");
}

/**
 * Checks whether an error represents a model_not_found error from Groq.
 */
export function isModelNotFoundError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as any;

  if (err instanceof GroqModelUnavailableError || err.code === "model_not_found") {
    return true;
  }

  const status = err.status || err.response?.status;
  const code = err.code || err.error?.code;
  const msg = String(err.message || err.error?.message || "");

  if (code === "model_not_found") return true;
  if (status === 404 && (msg.includes("model_not_found") || msg.includes("does not exist"))) {
    return true;
  }
  if (msg.includes("model_not_found")) return true;

  return false;
}

export interface FormattedGroqError {
  error: string;
  details?: string;
  status: number;
  code?: string;
}

/**
 * Formats any Groq or AI error into a clean JSON response object.
 * Rejects missing configuration with clear JSON errors.
 * Replaces model_not_found with a user-friendly error stating the model is unavailable.
 */
export function formatGroqError(error: unknown): FormattedGroqError {
  if (error instanceof GroqConfigurationError) {
    return {
      error: error.message,
      details: error.message,
      status: 500,
      code: "configuration_missing",
    };
  }

  if (isModelNotFoundError(error)) {
    return {
      error: "The configured model is unavailable.",
      details: "The configured model is unavailable.",
      status: 404,
      code: "model_not_found",
    };
  }

  const err = error as any;
  const status = err?.status || err?.response?.status || 500;
  const code = err?.code || err?.error?.code;
  const rawMessage =
    err?.error?.message ||
    err?.message ||
    err?.response?.data?.error?.message ||
    "Unknown AI service error";

  const msgString = String(rawMessage);

  if (
    msgString.includes("GROQ_API_KEY is not configured") ||
    msgString.includes("GROQ_API_KEY is required") ||
    msgString.includes("Groq API key is not configured")
  ) {
    return {
      error: "Groq API key is not configured. Please set GROQ_API_KEY in your environment variables.",
      details: "Groq API key is not configured. Please set GROQ_API_KEY in your environment variables.",
      status: 500,
      code: "configuration_missing",
    };
  }

  const sanitized = sanitizeAiErrorMessage(rawMessage);
  return {
    error: sanitized,
    details: sanitized,
    status: status >= 400 && status < 600 ? status : 500,
    code: code || "ai_error",
  };
}

/**
 * Executes a chat completion through the shared Groq OpenAI client.
 */
export async function createGroqChatCompletion(
  params: Omit<OpenAI.Chat.ChatCompletionCreateParamsNonStreaming, "model"> & {
    model?: string;
  }
): Promise<OpenAI.Chat.Completions.ChatCompletion> {
  const model = params.model || getGroqModel();
  const client = getGroqClient();

  try {
    return await client.chat.completions.create({
      ...params,
      model,
    });
  } catch (error: any) {
    if (isModelNotFoundError(error)) {
      throw new GroqModelUnavailableError("The configured model is unavailable.");
    }
    throw error;
  }
}

/**
 * Translates text to a specified target language using Groq.
 */
export async function translateText(
  text: string,
  targetLanguage: string
): Promise<string> {
  const model = getGroqModel();
  const maxChars = 12000;
  const safeText =
    text.length > maxChars
      ? text.slice(0, maxChars) + "\n\n[...TEXT TRUNCATED DUE TO AI TOKEN LIMITS...]"
      : text;

  try {
    const client = getGroqClient();
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.3,
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
    });

    return completion.choices[0]?.message?.content || "";
  } catch (error: any) {
    if (isModelNotFoundError(error)) {
      throw new GroqModelUnavailableError("The configured model is unavailable.");
    }
    const status = error.status || error.response?.status;
    const upstreamError = error.message || error.response?.data?.error?.message;
    const sanitized = sanitizeAiErrorMessage(upstreamError);
    console.error(
      `[Translation Upstream Error] Status: ${status}, Model: ${model}, Message: ${sanitized}`
    );
    throw new Error(`Groq API Error (${status || "unknown"}): ${sanitized}`);
  }
}
