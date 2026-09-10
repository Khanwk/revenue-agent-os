import { agentRegistry } from "../core/agent-registry.js";
import { opportunityEngineAgent } from "./opportunity-engine/index.js";
import { proposalAgent } from "./proposal/index.js";
import { projectPlannerAgent } from "./project-planner/index.js";

export function registerAgents() {
  [opportunityEngineAgent, proposalAgent, projectPlannerAgent].forEach(
    (agent) => agentRegistry.register(agent),
  );
}
