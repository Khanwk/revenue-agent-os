import type { CompanyProfile } from "../../types/company.js";
import type { ProposalInput } from "./schema.js";

export const PROPOSAL_SYSTEM_PROMPT = `You are a senior proposal writer for a small software company. Write concise, human, technically credible freelance proposals. Never invent experience, client names, metrics, certifications or completed projects. Use only the supplied company profile and opportunity. Avoid generic greetings and long self-introductions. Focus on the client's problem, relevant evidence, approach, questions and next step. Follow the JSON schema exactly.`;
export function buildProposalPrompt(
  profile: CompanyProfile,
  input: ProposalInput,
) {
  return `COMPANY PROFILE
${JSON.stringify(profile, null, 2)}

OPPORTUNITY + SCOUT ANALYSIS
${JSON.stringify(input.rankedOpportunity, null, 2)}

EXTRA NOTES
${input.extraNotes || "None"}

Create a proposal the founder can review before submitting. Pricing must acknowledge uncertainty when scope is unclear.`;
}
