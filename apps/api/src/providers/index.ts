import { env } from "../config/env";
import { GeminiProvider } from "./gemini-provider";
import { MockProvider } from "./mock-provider";
import type { AiProvider } from "./ai-provider";

let provider: AiProvider | undefined;
export function getAiProvider(): AiProvider {
  if (!provider)
    provider =
      env.AI_PROVIDER === "gemini" ? new GeminiProvider() : new MockProvider();
  return provider;
}
