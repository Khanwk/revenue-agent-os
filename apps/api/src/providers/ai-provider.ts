export interface StructuredGenerationInput {
  system: string;
  prompt: string;
  schema: Record<string, unknown>;
  mockResponse?: unknown;
}

export interface AiProvider {
  generateStructured<T>(input: StructuredGenerationInput): Promise<T>;
}
