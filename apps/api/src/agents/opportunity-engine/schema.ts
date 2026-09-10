import { z } from "zod";

export const engineInputSchema = z.object({
  query: z.string().optional().default(""),
  topN: z.number().int().min(1).max(20).optional(),
});
export type EngineInput = z.infer<typeof engineInputSchema>;

export const opportunitySchema = z.object({
  id: z.string(),
  sourceId: z.string(),
  platform: z.enum(["upwork", "freelancer", "demo", "other"]),
  platformLabel: z.string(),
  title: z.string(),
  description: z.string(),
  budget: z.string(),
  budgetMinUsd: z.number().optional(),
  budgetMaxUsd: z.number().optional(),
  hourlyMinUsd: z.number().optional(),
  hourlyMaxUsd: z.number().optional(),
  skills: z.array(z.string()),
  clientInfo: z.string(),
  url: z.string().optional(),
  postedAt: z.string().optional(),
  location: z.string().optional(),
  proposals: z.string().optional(),
  proposalCount: z.number().optional(),
  projectType: z.enum(["fixed", "hourly", "unknown"]).optional(),
  isDemo: z.boolean().optional(),
});

export const rankedOpportunitySchema = z.object({
  opportunity: opportunitySchema,
  quickScore: z.number().min(0).max(100),
  aiScore: z.number().min(0).max(100),
  finalScore: z.number().min(0).max(100),
  recommendation: z.enum(["bid", "consider", "skip"]),
  confidence: z.number().min(0).max(100),
  summary: z.string(),
  clientNeed: z.string(),
  matchedSkills: z.array(z.string()),
  reasons: z.array(z.string()),
  risks: z.array(z.string()),
  suggestedBid: z.string(),
  proposalAngle: z.string(),
});

export const engineOutputSchema = z.object({
  searchedQueries: z.array(z.string()),
  scannedCount: z.number().int().min(0),
  sourceErrors: z.array(z.string()),
  sources: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      platform: z.string(),
      configured: z.boolean(),
      note: z.string().optional(),
    }),
  ),
  ranked: z.array(rankedOpportunitySchema),
});
export type EngineOutput = z.infer<typeof engineOutputSchema>;

export const evaluationJsonSchema: Record<string, unknown> = {
  type: "object",
  properties: {
    evaluations: {
      type: "array",
      items: {
        type: "object",
        properties: {
          projectId: { type: "string" },
          fitScore: { type: "integer", minimum: 0, maximum: 100 },
          confidence: { type: "integer", minimum: 0, maximum: 100 },
          recommendation: { type: "string", enum: ["bid", "consider", "skip"] },
          summary: { type: "string" },
          clientNeed: { type: "string" },
          reasons: { type: "array", items: { type: "string" } },
          risks: { type: "array", items: { type: "string" } },
          suggestedBid: { type: "string" },
          proposalAngle: { type: "string" },
        },
        required: [
          "projectId",
          "fitScore",
          "confidence",
          "recommendation",
          "summary",
          "clientNeed",
          "reasons",
          "risks",
          "suggestedBid",
          "proposalAngle",
        ],
      },
    },
  },
  required: ["evaluations"],
};
