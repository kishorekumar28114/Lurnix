import OpenAI from "openai";
import { getGroqClient } from "@/lib/groq";

export function getSummarizationClient(): OpenAI {
  return getGroqClient();
}

// Lazy proxy so that importing this module does not invoke getGroqClient at module evaluation time
const openai = new Proxy({} as OpenAI, {
  get(_target, prop) {
    const client = getSummarizationClient() as any;
    const value = client[prop];
    if (typeof value === "function") {
      return value.bind(client);
    }
    return value;
  },
});

export default openai;
