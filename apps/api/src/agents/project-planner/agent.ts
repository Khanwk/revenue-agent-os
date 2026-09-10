import type { AgentDefinition } from "../../types/agent.js";
import { getCompanyProfile } from "../../profile/profile-store.js";
import { getAiProvider } from "../../providers/index.js";
import { buildPlannerPrompt, PLANNER_SYSTEM_PROMPT } from "./prompt.js";
import {
  plannerInputSchema,
  plannerJsonSchema,
  plannerOutputSchema,
  type PlannerInput,
  type PlannerOutput,
} from "./schema.js";

export const projectPlannerAgent: AgentDefinition<PlannerInput, PlannerOutput> =
  {
    meta: {
      id: "project-planner",
      name: "Project Planner",
      shortName: "Architect",
      icon: "blocks",
      version: "1.0.0",
      description:
        "Turns a selected opportunity into delivery phases, architecture, roles, risks and discovery questions.",
      purpose: "Prevent vague projects from becoming founder bottlenecks.",
    },
    parseInput: (input) => plannerInputSchema.parse(input),
    async execute(input, context) {
      const profile = await getCompanyProfile();
      const job = input.rankedOpportunity.opportunity;
      context.report(
        "thinking",
        "Scope map",
        "Separating known requirements from assumptions and unknowns.",
      );
      context.report(
        "thinking",
        "Delivery design",
        "Mapping phases and responsibilities to the current team capacity.",
      );
      const mockResponse = {
        objective: `Deliver the core business outcome described in ${job.title} through a reviewable MVP and controlled follow-up milestones.`,
        assumptions: [
          "The listing does not contain every acceptance criterion.",
          "Required third-party credentials and existing code access will be supplied by the client.",
          "Major scope changes are handled as new milestones.",
        ],
        architecture: [
          "Next web application for UI and server-rendered product surfaces where appropriate",
          "Node/Express API for business logic and agent/integration work",
          "MongoDB or PostgreSQL selected after confirming relational requirements",
          "Central validation, logging and error handling",
          "Simple deployment pipeline with separate environment configuration",
        ],
        estimatedTimeline:
          "Roughly 2–5 weeks after discovery; confirm after repository and integration review.",
        phases: [
          {
            name: "Discovery",
            duration: "2–3 days",
            outcomes: [
              "User flows",
              "Scope boundary",
              "Acceptance criteria",
              "Technical plan",
            ],
          },
          {
            name: "Design & foundation",
            duration: "3–5 days",
            outcomes: [
              "UI direction",
              "Data/API contracts",
              "Project foundation",
            ],
          },
          {
            name: "Core build",
            duration: "1–3 weeks",
            outcomes: [
              "Primary workflow",
              "API integration",
              "Admin/customer states",
            ],
          },
          {
            name: "QA & release",
            duration: "2–4 days",
            outcomes: ["Testing", "Bug fixes", "Deployment", "Handover"],
          },
        ],
        teamAssignments: [
          {
            role: "Founder / Backend",
            responsibilities: [
              "Architecture",
              "APIs",
              "data model",
              "integration review",
              "final code review",
            ],
          },
          {
            role: "UI/UX",
            responsibilities: [
              "User flow",
              "wireframes",
              "responsive design",
              "edge states",
            ],
          },
          {
            role: "Frontend",
            responsibilities: [
              "Next implementation",
              "API integration",
              "frontend QA",
            ],
          },
          {
            role: "Marketing / Research",
            responsibilities: [
              "Client/domain research",
              "competitor references when useful",
              "case-study notes after delivery",
            ],
          },
        ],
        risks: [
          "Hidden integrations or legacy-code constraints",
          "Unclear acceptance criteria",
          "Scope growth after fixed-price commitment",
        ],
        discoveryQuestions: [
          "Who are the primary users and what action must each complete?",
          "What is already built and what must remain unchanged?",
          "Which third-party integrations are mandatory?",
          "What does the client consider a successful first milestone?",
        ],
        definitionOfDone: [
          "Agreed primary workflows work end-to-end",
          "Acceptance criteria are tested",
          "Errors and edge states are handled",
          "Deployment is reproducible",
          "Client has handover notes",
        ],
      };
      const output = await getAiProvider().generateStructured<PlannerOutput>({
        system: PLANNER_SYSTEM_PROMPT,
        prompt: buildPlannerPrompt(profile, input),
        schema: plannerJsonSchema,
        mockResponse,
      });
      context.report(
        "validating",
        "Reality check",
        "Checking timeline, role allocation and assumptions against the actual listing.",
      );
      return plannerOutputSchema.parse(output);
    },
  };
