import { z } from "zod";
import { rankedOpportunitySchema } from "../opportunity-engine/schema.js";

export const proposalInputSchema = z.object({
  rankedOpportunity: rankedOpportunitySchema,
  extraNotes: z.string().optional().default(""),
});
export type ProposalInput = z.infer<typeof proposalInputSchema>;
export const proposalOutputSchema = z.object({
  recommendedPrice: z.string(),
  pricingReason: z.string(),
  openingHook: z.string(),
  fullProposal: z.string(),
  questions: z.array(z.string()),
  milestones: z.array(
    z.object({
      title: z.string(),
      duration: z.string(),
      deliverable: z.string(),
    }),
  ),
  avoidSaying: z.array(z.string()),
});
export type ProposalOutput = z.infer<typeof proposalOutputSchema>;
export const proposalJsonSchema: Record<string, unknown> = {
  type: "object",
  properties: {
    recommendedPrice: { type: "string" },
    pricingReason: { type: "string" },
    openingHook: { type: "string" },
    fullProposal: { type: "string" },
    questions: { type: "array", items: { type: "string" } },
    milestones: {
      type: "array",
      items: {
        type: "object",
        properties: {
          title: { type: "string" },
          duration: { type: "string" },
          deliverable: { type: "string" },
        },
        required: ["title", "duration", "deliverable"],
      },
    },
    avoidSaying: { type: "array", items: { type: "string" } },
  },
  required: [
    "recommendedPrice",
    "pricingReason",
    "openingHook",
    "fullProposal",
    "questions",
    "milestones",
    "avoidSaying",
  ],
};
