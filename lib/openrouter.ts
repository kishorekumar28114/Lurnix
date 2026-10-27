/**
 * Re-exports from centralized Groq AI module for backward compatibility.
 */
import {
  getGroqApiKey,
  getGroqBaseUrl,
  getGroqModel,
  getGroqApiUrl,
  getGroqHeaders,
  sanitizeAiErrorMessage,
  translateText,
  getGroqClient,
  createGroqChatCompletion,
} from "@/lib/groq";

export {
  getGroqApiKey,
  getGroqBaseUrl,
  getGroqModel,
  getGroqApiUrl,
  getGroqHeaders,
  sanitizeAiErrorMessage,
  translateText,
  getGroqClient,
  createGroqChatCompletion,
};

// Backward-compatibility aliases
export const getAiModel = getGroqModel;
export const getOpenRouterApiKey = getGroqApiKey;
