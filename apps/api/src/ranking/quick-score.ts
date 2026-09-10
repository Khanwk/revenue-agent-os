import type { CompanyProfile } from "../types/company.js";
import type { DiscoveredOpportunity } from "../sources/types.js";

export interface QuickScoreResult { score: number; matchedSkills: string[]; reasons: string[]; penalties: string[]; }

function includes(text: string, term: string) { return text.toLowerCase().includes(term.toLowerCase()); }

export function quickScore(profile: CompanyProfile, job: DiscoveredOpportunity): QuickScoreResult {
  const text = `${job.title} ${job.description} ${job.skills.join(" ")}`;
  const weightedTotal = profile.skills.reduce((sum, skill) => sum + skill.strength, 0) || 1;
  const matched = profile.skills.filter((skill) => includes(text, skill.name));
  const matchedWeight = matched.reduce((sum, skill) => sum + skill.strength, 0);
  const matchedSkills = matched.map((skill) => skill.name);
  const skillScore = Math.min(45, Math.round((matchedWeight / Math.max(12, weightedTotal * 0.45)) * 45));

  let budgetScore = 8;
  if (job.projectType === "fixed" && job.budgetMaxUsd !== undefined) {
    if (job.budgetMaxUsd >= profile.minimumFixedBudgetUsd * 4) budgetScore = 20;
    else if (job.budgetMaxUsd >= profile.minimumFixedBudgetUsd * 2) budgetScore = 16;
    else if (job.budgetMaxUsd >= profile.minimumFixedBudgetUsd) budgetScore = 12;
    else budgetScore = 2;
  } else if (job.projectType === "hourly" && job.hourlyMaxUsd !== undefined) {
    if (job.hourlyMaxUsd >= profile.minimumHourlyRateUsd * 2) budgetScore = 20;
    else if (job.hourlyMaxUsd >= profile.minimumHourlyRateUsd) budgetScore = 14;
    else budgetScore = 2;
  }

  const preferredMatches = profile.preferredKeywords.filter((term) => includes(text, term));
  const preferredScore = Math.min(12, preferredMatches.length * 3);

  let competitionScore = 6;
  if (job.proposalCount !== undefined) {
    if (job.proposalCount < 5) competitionScore = 10;
    else if (job.proposalCount <= 10) competitionScore = 8;
    else if (job.proposalCount <= 20) competitionScore = 5;
    else competitionScore = 2;
  }

  let recencyScore = 5;
  if (job.postedAt) {
    const hours = (Date.now() - Date.parse(job.postedAt)) / 3_600_000;
    if (hours <= 2) recencyScore = 8;
    else if (hours <= 8) recencyScore = 6;
    else if (hours <= 24) recencyScore = 4;
    else recencyScore = 2;
  }

  const penalties = profile.avoidKeywords.filter((term) => includes(text, term));
  const penalty = Math.min(20, penalties.length * 10);
  const score = Math.max(0, Math.min(100, skillScore + budgetScore + preferredScore + competitionScore + recencyScore - penalty + 5));
  const reasons = [
    matchedSkills.length ? `Matched skills: ${matchedSkills.slice(0, 5).join(", ")}` : "Few explicit skill matches",
    preferredMatches.length ? `Preferred work signals: ${preferredMatches.slice(0, 4).join(", ")}` : "No preferred-keyword bonus",
    job.proposalCount !== undefined ? `${job.proposalCount} competing bids/proposals reported` : "Competition data unavailable"
  ];
  return { score, matchedSkills, reasons, penalties };
}
