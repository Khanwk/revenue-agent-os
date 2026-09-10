import { z } from "zod.js ";
import { rankedOpportunitySchema } from "../opportunity-engine/schema.js ";

export const plannerInputSchema = z.object({
  rankedOpportunity: rankedOpportunitySchema,
  clientNotes: z.string().optional().default(""),
});
export type PlannerInput = z.infer<typeof plannerInputSchema>;
export const plannerOutputSchema = z.object({
  objective: z.string(),
  assumptions: z.array(z.string()),
  architecture: z.array(z.string()),
  estimatedTimeline: z.string(),
  phases: z.array(
    z.object({
      name: z.string(),
      duration: z.string(),
      outcomes: z.array(z.string()),
    }),
  ),
  teamAssignments: z.array(
    z.object({ role: z.string(), responsibilities: z.array(z.string()) }),
  ),
  risks: z.array(z.string()),
  discoveryQuestions: z.array(z.string()),
  definitionOfDone: z.array(z.string()),
});
export type PlannerOutput = z.infer<typeof plannerOutputSchema>;
export const plannerJsonSchema: Record<string, unknown> = {
  type: "object",
  properties: {
    objective: { type: "string" },
    assumptions: { type: "array", items: { type: "string" } },
    architecture: { type: "array", items: { type: "string" } },
    estimatedTimeline: { type: "string" },
    phases: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          duration: { type: "string" },
          outcomes: { type: "array", items: { type: "string" } },
        },
        required: ["name", "duration", "outcomes"],
      },
    },
    teamAssignments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          role: { type: "string" },
          responsibilities: { type: "array", items: { type: "string" } },
        },
        required: ["role", "responsibilities"],
      },
    },
    risks: { type: "array", items: { type: "string" } },
    discoveryQuestions: { type: "array", items: { type: "string" } },
    definitionOfDone: { type: "array", items: { type: "string" } },
  },
  required: [
    "objective",
    "assumptions",
    "architecture",
    "estimatedTimeline",
    "phases",
    "teamAssignments",
    "risks",
    "discoveryQuestions",
    "definitionOfDone",
  ],
};
