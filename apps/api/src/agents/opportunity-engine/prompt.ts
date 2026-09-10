import type { CompanyProfile } from "../../types/company.js";
import type { DiscoveredOpportunity } from "../../sources/types.js";

export const ENGINE_SYSTEM_PROMPT = `You are Scout, a commercial opportunity analyst for a small software company. Rank freelance software projects by real win probability and business value, not by excitement. Never invent client facts, budgets, project history, skills or links. Prefer work the team can actually deliver. Penalize vague scope, low budget, poor skill fit, unrealistic deadlines and suspicious requests. Your output must follow the JSON schema exactly.`;

export function buildEnginePrompt(
  profile: CompanyProfile,
  jobs: Array<{
    job: DiscoveredOpportunity;
    quickScore: number;
    matchedSkills: string[];
  }>,
) {
  const compactJobs = jobs.map(({ job, quickScore, matchedSkills }) => ({
    projectId: job.id,
    platform: job.platformLabel,
    title: job.title,
    description: job.description.slice(0, 1800),
    budget: job.budget,
    skills: job.skills,
    location: job.location,
    proposals: job.proposals,
    quickScore,
    matchedSkills,
  }));
  return `COMPANY PROFILE
${JSON.stringify(profile, null, 2)}

CANDIDATE PROJECTS
${JSON.stringify(compactJobs, null, 2)}

Evaluate every candidate. A 90+ score should be rare and mean unusually strong fit. BID means worth human review and likely proposal; CONSIDER means inspect carefully; SKIP means do not spend time/Connects. Suggested bid must be a strategy, not a fake exact price when scope is unclear.`;
}
