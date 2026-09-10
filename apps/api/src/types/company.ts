export interface CompanySkill {
  name: string;
  strength: number;
}

export interface CompanyProfile {
  companyName: string;
  positioning: string;
  teamSummary: string;
  skills: CompanySkill[];
  services: string[];
  preferredKeywords: string[];
  avoidKeywords: string[];
  minimumFixedBudgetUsd: number;
  minimumHourlyRateUsd: number;
  maxProjectWeeks: number;
  weeklyCapacityHours: number;
  preferredRegions: string[];
  portfolioHighlights: string[];
  proposalTone: string;
}
