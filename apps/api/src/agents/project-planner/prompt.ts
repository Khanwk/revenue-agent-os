import type { CompanyProfile } from "../../types/company.js ";
import type { PlannerInput } from "./schema.js ";
export const PLANNER_SYSTEM_PROMPT = `You are a pragmatic software delivery architect. Turn a prospective client project into a realistic execution plan for a small team. Separate assumptions from facts. Do not invent requirements. Assign work across Founder/Backend, UI/UX, Frontend and Marketing/Research only when relevant. Prefer a simple modular monolith unless complexity genuinely requires more. Follow the JSON schema exactly.`;
export function buildPlannerPrompt(
  profile: CompanyProfile,
  input: PlannerInput,
) {
  return `COMPANY PROFILE
${JSON.stringify(profile, null, 2)}

PROJECT
${JSON.stringify(input.rankedOpportunity, null, 2)}

CLIENT NOTES
${input.clientNotes || "None"}

Produce a pre-project plan that can guide discovery and estimation. Clearly mark assumptions.`;
}
