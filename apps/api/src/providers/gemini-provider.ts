import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";
import type { AiProvider, StructuredGenerationInput } from "./ai-provider.js";

export class GeminiProvider implements AiProvider {
  private readonly client: GoogleGenAI;

  constructor() {
    if (!env.GEMINI_API_KEY)
      throw new Error("GEMINI_API_KEY is required when AI_PROVIDER=gemini.");
    this.client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }

  async generateStructured<T>(input: StructuredGenerationInput): Promise<T> {
    const response = await this.client.models.generateContent({
      model: env.GEMINI_MODEL,
      contents: input.prompt,
      config: {
        systemInstruction: input.system,
        responseMimeType: "application/json",
        responseJsonSchema: input.schema,
      } as any,
    });
    if (!response.text) throw new Error("Gemini returned an empty response.");
    return JSON.parse(response.text) as T;
  }
}
