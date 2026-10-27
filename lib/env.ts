/**
 * Central server-only environment validation module.
 * Validates required environment variables and ensures safe defaults.
 */
import {
  getGroqApiKey,
  getGroqBaseUrl,
  getGroqApiUrl,
  getGroqModel,
  DEFAULT_GROQ_MODEL,
} from "@/lib/groq";

export interface ServerEnv {
  MONGODB_URI: string;
  MONGODB_DB: string;
  JWT_SECRET: string;
  GROQ_API_KEY: string;
  GROQ_BASE_URL: string;
  GROQ_API_URL: string;
  GROQ_MODEL: string;
}

let cachedEnv: ServerEnv | null = null;

export function validateServerEnv(): ServerEnv {
  const errors: string[] = [];

  const MONGODB_URI = process.env.MONGODB_URI?.trim();
  if (!MONGODB_URI) {
    errors.push("MONGODB_URI is required.");
  }

  const MONGODB_DB = process.env.MONGODB_DB?.trim() || "lurnix";

  const JWT_SECRET = process.env.JWT_SECRET?.trim();
  if (!JWT_SECRET) {
    errors.push("JWT_SECRET is required.");
  } else if (JWT_SECRET.length < 32) {
    errors.push("JWT_SECRET must be at least 32 characters long for security.");
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY?.trim();
  if (!GROQ_API_KEY) {
    errors.push("GROQ_API_KEY is required.");
  }

  const GROQ_BASE_URL = getGroqBaseUrl();
  const GROQ_API_URL = getGroqApiUrl();
  const GROQ_MODEL = getGroqModel();

  if (errors.length > 0) {
    const errorSummary = `[Environment Validation Failed]:\n - ${errors.join("\n - ")}`;
    console.error(errorSummary);
    throw new Error(errorSummary);
  }

  cachedEnv = {
    MONGODB_URI: MONGODB_URI!,
    MONGODB_DB,
    JWT_SECRET: JWT_SECRET!,
    GROQ_BASE_URL,
    GROQ_API_URL,
    GROQ_API_KEY: GROQ_API_KEY!,
    GROQ_MODEL,
  };

  return cachedEnv;
}

export function getServerEnv(): ServerEnv {
  if (cachedEnv) return cachedEnv;
  return validateServerEnv();
}

export function getMongoUri(): string {
  const uri = process.env.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("MONGODB_URI is required.");
  }
  return uri;
}

export function getMongoDbName(): string {
  return process.env.MONGODB_DB?.trim() || "lurnix";
}

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error("JWT_SECRET is required.");
  }
  if (secret.length < 32) {
    throw new Error("JWT_SECRET must be at least 32 characters long.");
  }
  return secret;
}

export { getGroqApiKey, getGroqBaseUrl, getGroqApiUrl, getGroqModel, DEFAULT_GROQ_MODEL };
