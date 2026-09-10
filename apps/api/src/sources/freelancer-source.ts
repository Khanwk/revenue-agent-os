import type { DiscoveredOpportunity, OpportunitySource } from "./types.js";

type AnyRecord = Record<string, any>;

function money(project: AnyRecord) {
  const currency = project.currency?.code || project.currency?.sign || "USD";
  const min = Number(project.budget?.minimum);
  const max = Number(project.budget?.maximum);
  if (Number.isFinite(min) && Number.isFinite(max)) return `${currency} ${min.toLocaleString()}–${max.toLocaleString()}`;
  return "See Freelancer listing";
}

function projectUrl(project: AnyRecord) {
  const seo = String(project.seo_url || "").replace(/^\/+/, "").replace(/^projects\//, "");
  return seo ? `https://www.freelancer.com/projects/${seo}` : `https://www.freelancer.com/projects/${project.id}`;
}

function locationOf(user: AnyRecord | undefined) {
  return user?.location?.country?.name || user?.location?.city || undefined;
}

export const freelancerOpportunitySource: OpportunitySource = {
  status: () => ({ id: "freelancer", label: "Freelancer.com", platform: "freelancer", configured: true, note: "Uses Freelancer.com's public active-project API." }),
  async search(input) {
    const params = new URLSearchParams({ limit: String(input.limit), full_description: "true", job_details: "true", user_details: "true" });
    if (input.query.trim()) params.set("or_search_query", input.query.trim());
    const response = await fetch(`https://www.freelancer.com/api/projects/0.1/projects/active/?${params}`,
      { headers: { Accept: "application/json", "User-Agent": "RevenueAgentOS/1.0" }, signal: AbortSignal.timeout(15000) });
    if (!response.ok) throw new Error(`Freelancer source returned HTTP ${response.status}`);
    const json = await response.json() as AnyRecord;
    const projects: AnyRecord[] = json?.result?.projects ?? [];
    const users: AnyRecord = json?.result?.users ?? {};
    return projects.map((project): DiscoveredOpportunity => {
      const owner = users[String(project.owner_id)] || users[project.owner_id];
      const min = Number(project.budget?.minimum);
      const max = Number(project.budget?.maximum);
      const bidCount = Number(project.bid_stats?.bid_count);
      const isHourly = String(project.type || "").toLowerCase().includes("hourly");
      return {
        id: `freelancer:${project.id}`,
        sourceId: String(project.id),
        platform: "freelancer",
        platformLabel: "Freelancer.com",
        title: String(project.title || "Untitled project"),
        description: String(project.description || project.preview_description || ""),
        budget: money(project),
        budgetMinUsd: !isHourly && Number.isFinite(min) ? min : undefined,
        budgetMaxUsd: !isHourly && Number.isFinite(max) ? max : undefined,
        hourlyMinUsd: isHourly && Number.isFinite(min) ? min : undefined,
        hourlyMaxUsd: isHourly && Number.isFinite(max) ? max : undefined,
        skills: Array.isArray(project.jobs) ? project.jobs.map((job: AnyRecord) => String(job.name || "")).filter(Boolean) : [],
        clientInfo: [owner?.status?.payment_verified ? "Payment verified" : undefined, owner?.display_name || owner?.username].filter(Boolean).join(" · ") || "Public Freelancer client",
        url: projectUrl(project),
        postedAt: Number.isFinite(Number(project.submitdate)) ? new Date(Number(project.submitdate) * 1000).toISOString() : undefined,
        location: locationOf(owner),
        proposals: Number.isFinite(bidCount) ? `${bidCount} bids` : undefined,
        proposalCount: Number.isFinite(bidCount) ? bidCount : undefined,
        projectType: isHourly ? "hourly" : "fixed"
      };
    });
  }
};
