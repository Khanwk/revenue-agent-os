import { demoOpportunitySource } from "./demo-source";
import { freelancerOpportunitySource } from "./freelancer-source";
import { upworkOpportunitySource } from "./upwork-source";
import type {
  DiscoveredOpportunity,
  OpportunitySearchInput,
  OpportunitySourceStatus,
} from "./types";

const sources = [
  freelancerOpportunitySource,
  upworkOpportunitySource,
  demoOpportunitySource,
];

export function getSourceStatuses(): OpportunitySourceStatus[] {
  return sources.map((source) => source.status());
}

export async function searchAllSources(
  queries: string[],
  limitPerQuery: number,
) {
  const calls = sources.flatMap((source) => {
    if (!source.status().configured) return [];
    return queries.map(async (query) => {
      try {
        return {
          jobs: await source.search({ query, limit: limitPerQuery }),
          error: undefined as string | undefined,
        };
      } catch (error) {
        return {
          jobs: [] as DiscoveredOpportunity[],
          error: `${source.status().label}: ${error instanceof Error ? error.message : "source failed"}`,
        };
      }
    });
  });
  const settled = await Promise.all(calls);
  const map = new Map<string, DiscoveredOpportunity>();
  for (const item of settled) for (const job of item.jobs) map.set(job.id, job);
  return {
    opportunities: [...map.values()],
    errors: settled.map((x) => x.error).filter((x): x is string => Boolean(x)),
    sources: getSourceStatuses(),
  };
}

export type {
  DiscoveredOpportunity,
  OpportunityPlatform,
  OpportunitySourceStatus,
} from "./types";
