import { env } from "../../config/env.js";
import { getAiProvider } from "../../providers/index.js";
import { getCompanyProfile } from "../../profile/profile-store.js";
import { quickScore } from "../../ranking/quick-score.js";
import { searchAllSources } from "../../sources/index.js";
import type { AgentDefinition } from "../../types/agent.js";
import { buildEnginePrompt, ENGINE_SYSTEM_PROMPT } from "./prompt.js";
import { engineInputSchema, engineOutputSchema, evaluationJsonSchema, type EngineInput, type EngineOutput } from "./schema.js";

function buildQueries(input: EngineInput, skills: Array<{name:string; strength:number}>, preferred: string[]) {
  if (input.query.trim()) return [input.query.trim()];
  const top = [...skills].sort((a,b) => b.strength-a.strength).slice(0, 9).map((x) => x.name);
  const groups = [top.slice(0,3), top.slice(3,6), top.slice(6,9)].filter((x) => x.length);
  const queries = groups.map((g) => g.join(" "));
  if (preferred.length) queries.push(preferred.slice(0,4).join(" "));
  return [...new Set(queries)].slice(0,4);
}

export const opportunityEngineAgent: AgentDefinition<EngineInput, EngineOutput> = {
  meta: {
    id: "opportunity-engine", name: "Opportunity Engine", shortName: "Scout", icon: "radar", version: "1.1.0",
    description: "Searches configured freelance sources and automatically ranks the best projects for your company.",
    purpose: "Turn your skills and delivery strengths into a focused, ranked pipeline of projects worth bidding on."
  },
  parseInput: (input) => engineInputSchema.parse(input),
  async execute(input, context) {
    await context.report("tool", "Company profile", "Loading skills, services, budget thresholds and preferred work.");
    const profile = await getCompanyProfile(context.userId);
    const queries = buildQueries(input, profile.skills, profile.preferredKeywords);

    await context.report("tool", "Scanning sources", "Searching every configured project source.", queries.join(" · "));
    const searched = await searchAllSources(context.userId, queries, Math.max(5, Math.ceil(env.SOURCE_FETCH_LIMIT / queries.length)));

    await context.report("thinking", "Fast ranking", `Pre-scoring ${searched.opportunities.length} projects before spending AI tokens.`);
    const scored = searched.opportunities
      .map((job) => ({ job, quick: quickScore(profile, job) }))
      .sort((a,b) => b.quick.score-a.quick.score);

    const topN = input.topN ?? env.OPPORTUNITY_TOP_N;
    const candidates = scored.slice(0, Math.max(topN, Math.min(20, topN * 2)));
    const aiCandidates = candidates.slice(0, topN);

    await context.report("thinking", "Deep fit analysis", `Analyzing the top ${aiCandidates.length} matches against delivery ability and commercial value.`);
    const mockResponse = {
      evaluations: aiCandidates.map(({ job, quick }, index) => {
        const aiScore = Math.max(20, Math.min(96, quick.score + (index < 3 ? 5-index*2 : -2)));
        const recommendation = aiScore >= 74 ? "bid" : aiScore >= 58 ? "consider" : "skip";
        return {
          projectId: job.id, fitScore: aiScore, confidence: Math.min(94, 78 + quick.matchedSkills.length * 3), recommendation,
          summary: `${job.title} is ${recommendation === "bid" ? "a strong" : recommendation === "consider" ? "a possible" : "a weak"} match based on the current company profile.`,
          clientNeed: job.description.slice(0, 220) || "The client needs software delivery matching the listing.",
          reasons: quick.reasons,
          risks: quick.penalties.length ? quick.penalties.map((x) => `Avoided-work signal: ${x}`) : ["Confirm exact scope, acceptance criteria and dependencies before committing."],
          suggestedBid: recommendation === "bid" ? "Use a milestone-based proposal focused on understanding the workflow and reducing delivery risk." : "Do not rush to bid; clarify value, scope and budget first.",
          proposalAngle: quick.matchedSkills.length ? `Lead with relevant experience around ${quick.matchedSkills.slice(0,3).join(", ")}.` : "Lead with problem understanding rather than claiming stack-specific experience."
        };
      })
    };

    const generated = await getAiProvider().generateStructured<any>({
      system: ENGINE_SYSTEM_PROMPT,
      prompt: buildEnginePrompt(profile, aiCandidates.map(({job,quick}) => ({ job, quickScore: quick.score, matchedSkills: quick.matchedSkills }))),
      schema: evaluationJsonSchema,
      mockResponse
    });
    const evalMap = new Map((generated.evaluations ?? []).map((x: any) => [x.projectId, x]));

    await context.report("validating", "Ranking", "Combining deterministic pre-score with AI judgement and checking links/results.");
    const ranked = aiCandidates.map(({ job, quick }) => {
      const evaluation: any = evalMap.get(job.id) ?? {};
      const aiScore = Number(evaluation.fitScore ?? quick.score);
      const finalScore = Math.max(0, Math.min(100, Math.round(quick.score * 0.45 + aiScore * 0.55)));
      return {
        opportunity: job, quickScore: quick.score, aiScore, finalScore,
        recommendation: evaluation.recommendation ?? (finalScore >= 74 ? "bid" : finalScore >= 58 ? "consider" : "skip"),
        confidence: Number(evaluation.confidence ?? 75), summary: String(evaluation.summary ?? "Fit analysis completed."),
        clientNeed: String(evaluation.clientNeed ?? job.description.slice(0, 300)), matchedSkills: quick.matchedSkills,
        reasons: Array.isArray(evaluation.reasons) ? evaluation.reasons : quick.reasons,
        risks: Array.isArray(evaluation.risks) ? evaluation.risks : [], suggestedBid: String(evaluation.suggestedBid ?? "Review before bidding."),
        proposalAngle: String(evaluation.proposalAngle ?? "Lead with relevant delivery experience.")
      };
    }).sort((a,b) => b.finalScore-a.finalScore);

    return engineOutputSchema.parse({ searchedQueries: queries, scannedCount: searched.opportunities.length, sourceErrors: searched.errors, sources: searched.sources, ranked });
  }
};
