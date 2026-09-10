import { promises as fs } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import type { CompanyProfile } from "../types/company";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const filePath = path.resolve(__dirname, "../../data/company-profile.json");

export const companyProfileSchema = z.object({
  companyName: z.string().min(1),
  positioning: z.string().min(1),
  teamSummary: z.string().min(1),
  skills: z
    .array(
      z.object({
        name: z.string().min(1),
        strength: z.number().int().min(1).max(5),
      }),
    )
    .min(1),
  services: z.array(z.string()).min(1),
  preferredKeywords: z.array(z.string()),
  avoidKeywords: z.array(z.string()),
  minimumFixedBudgetUsd: z.number().min(0),
  minimumHourlyRateUsd: z.number().min(0),
  maxProjectWeeks: z.number().int().min(1),
  weeklyCapacityHours: z.number().int().min(1),
  preferredRegions: z.array(z.string()),
  portfolioHighlights: z.array(z.string()),
  proposalTone: z.string().min(1),
});

export async function getCompanyProfile(): Promise<CompanyProfile> {
  const raw = await fs.readFile(filePath, "utf8");
  return companyProfileSchema.parse(JSON.parse(raw));
}

export async function saveCompanyProfile(
  input: unknown,
): Promise<CompanyProfile> {
  const profile = companyProfileSchema.parse(input);
  await fs.writeFile(filePath, JSON.stringify(profile, null, 2) + "\n", "utf8");
  return profile;
}
