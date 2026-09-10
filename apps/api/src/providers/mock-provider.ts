import type { AiProvider, StructuredGenerationInput } from "./ai-provider.js ";

export class MockProvider implements AiProvider {
  async generateStructured<T>(input: StructuredGenerationInput): Promise<T> {
    await new Promise((resolve) => setTimeout(resolve, 500));
    if (input.mockResponse === undefined)
      throw new Error("Mock provider needs mockResponse.");
    return input.mockResponse as T;
  }
}
