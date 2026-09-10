import type { AgentDefinition } from "../../types/agent.js";
import { getCompanyProfile } from "../../profile/profile-store.js";
import { getAiProvider } from "../../providers/index.js";
import { buildProposalPrompt, PROPOSAL_SYSTEM_PROMPT } from "./prompt.js";
import {
  proposalInputSchema,
  proposalJsonSchema,
  proposalOutputSchema,
  type ProposalInput,
  type ProposalOutput,
} from "./schema.js";

export const proposalAgent: AgentDefinition<ProposalInput, ProposalOutput> = {
  meta: {
    id: "proposal",
    name: "Proposal Agent",
    shortName: "Pitch",
    icon: "pen",
    version: "1.0.0",
    description:
      "Turns a ranked opportunity into a tailored, truthful proposal.",
    purpose: "Increase proposal quality without generic AI spam.",
  },
  parseInput: (input) => proposalInputSchema.parse(input),
  async execute(input, context) {
    const profile = await getCompanyProfile();
    const job = input.rankedOpportunity.opportunity;
    context.report(
      "thinking",
      "Positioning",
      "Choosing the strongest truthful angle for this client.",
      input.rankedOpportunity.proposalAngle,
    );
    context.report(
      "thinking",
      "Pricing",
      "Preparing a bid direction without pretending unclear scope is known.",
    );
    const mockResponse = {
      recommendedPrice:
        job.projectType === "hourly"
          ? job.budget
          : "Confirm scope, then propose milestone pricing within the client's budget range.",
      pricingReason:
        "The listing is suitable for milestone delivery, but final price should follow clarification of integrations and acceptance criteria.",
      openingHook: `The important part of ${job.title} is getting the workflow and acceptance criteria right before adding more code.`,
      fullProposal: `I looked through the requirements for ${job.title}. The strongest overlap with our team is ${input.rankedOpportunity.matchedSkills.slice(0, 4).join(", ") || "custom web application delivery"}.

Rather than jump straight into implementation, I would first confirm the core workflow, integrations and definition of done, then deliver in small reviewable milestones. That keeps scope visible and reduces rework.

Based on the current description, we can handle the frontend/backend integration and the business workflow as one delivery stream. I would be happy to review the existing setup and propose the first milestone after a short requirements discussion.`,
      questions: [
        "What is the must-have outcome for the first usable milestone?",
        "Which integrations or existing systems must we preserve?",
        "Who will approve the final workflow and acceptance criteria?",
      ],
      milestones: [
        {
          title: "Discovery & technical plan",
          duration: "2–3 days",
          deliverable: "Confirmed scope, flows and implementation plan",
        },
        {
          title: "Core implementation",
          duration: "1–3 weeks",
          deliverable: "Working primary workflow with integrations",
        },
        {
          title: "QA & handover",
          duration: "2–4 days",
          deliverable: "Tested release, fixes and handover notes",
        },
      ],
      avoidSaying: [
        "Do not claim experience not listed in the company profile.",
        "Do not promise an exact deadline before clarifying dependencies.",
        "Do not lead with being the cheapest option.",
      ],
    };
    const output = await getAiProvider().generateStructured<ProposalOutput>({
      system: PROPOSAL_SYSTEM_PROMPT,
      prompt: buildProposalPrompt(profile, input),
      schema: proposalJsonSchema,
      mockResponse,
    });
    context.report(
      "validating",
      "Truth check",
      "Removing unsupported claims and checking that the proposal addresses this specific project.",
    );
    return proposalOutputSchema.parse(output);
  },
};
