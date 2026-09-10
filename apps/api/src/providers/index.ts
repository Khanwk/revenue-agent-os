import { env } from "../config/env.js";
import { GeminiProvider } from "./gemini-provider.js";
import { MockProvider } from "./mock-provider.js";
import type { AiProvider } from "./ai-provider.js";

let provider: AiProvider | undefined;
export function getAiProvider(): AiProvider {
  if (!provider) provider = env.AI_PROVIDER === "gemini" ? new GeminiProvider() : new MockProvider();
  return provider;
}
