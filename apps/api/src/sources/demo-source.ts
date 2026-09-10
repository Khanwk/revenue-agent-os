import type { OpportunitySource } from "./types.js ";

const demo = [
  {
    id: "demo-1",
    sourceId: "demo-1",
    platform: "demo" as const,
    platformLabel: "Demo Feed",
    title: "Build a Next SaaS admin platform with Node APIs",
    description:
      "Need an experienced full-stack team to finish a B2B SaaS dashboard, role-based admin flows, subscriptions, reporting and API integrations. Existing Next frontend needs cleanup and the backend needs Node/TypeScript endpoints.",
    budget: "USD 2,000–4,000",
    budgetMinUsd: 2000,
    budgetMaxUsd: 4000,
    skills: ["Next", "TypeScript", "Node", "PostgreSQL", "SaaS"],
    clientInfo: "Payment verified · clear product scope",
    postedAt: "2026-09-10T03:00:00Z",
    location: "United Kingdom",
    proposals: "10–15 proposals",
    proposalCount: 12,
    projectType: "fixed" as const,
    isDemo: true,
  },
  {
    id: "demo-2",
    sourceId: "demo-2",
    platform: "demo" as const,
    platformLabel: "Demo Feed",
    title: "E-commerce quotation and order workflow automation",
    description:
      "Looking for a developer to build custom quote requests, admin pricing, customer acceptance, checkout conversion, order tracking and artwork uploads for a B2B ecommerce store.",
    budget: "USD 1,500–3,000",
    budgetMinUsd: 1500,
    budgetMaxUsd: 3000,
    skills: ["React", "Node", "MongoDB", "E-commerce", "API"],
    clientInfo: "Established ecommerce business",
    postedAt: "2026-09-10T01:30:00Z",
    location: "Australia",
    proposals: "5–10 proposals",
    proposalCount: 8,
    projectType: "fixed" as const,
    isDemo: true,
  },
  {
    id: "demo-3",
    sourceId: "demo-3",
    platform: "demo" as const,
    platformLabel: "Demo Feed",
    title: "AI document automation and PDF reporting system",
    description:
      "Build a secure workflow that receives structured data, generates branded reports, creates PDFs, stores status and exposes an admin dashboard. AWS experience preferred.",
    budget: "USD 25–45/hr",
    hourlyMinUsd: 25,
    hourlyMaxUsd: 45,
    skills: ["Node", "AWS", "PDF", "Automation", "TypeScript"],
    clientInfo: "Technical founder · long-term possibility",
    postedAt: "2026-09-09T22:00:00Z",
    location: "United States",
    proposals: "Under 5 proposals",
    proposalCount: 4,
    projectType: "hourly" as const,
    isDemo: true,
  },
];

export const demoOpportunitySource: OpportunitySource = {
  status: () => ({
    id: "demo",
    label: "Demo Feed",
    platform: "demo",
    configured: true,
    note: "Local sample jobs. Disable mentally when live sources are available.",
  }),
  async search(input) {
    const words = input.query.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = words.length
      ? demo.filter((job) =>
          words.some((word) =>
            `${job.title} ${job.description} ${job.skills.join(" ")}`
              .toLowerCase()
              .includes(word),
          ),
        )
      : demo;
    return filtered.slice(0, input.limit);
  },
};
