import { agentRegistry } from "../core/agent-registry";
import { opportunityEngineAgent } from "./opportunity-engine/index";
import { proposalAgent } from "./proposal/index";
import { projectPlannerAgent } from "./project-planner/index";

export function registerAgents() {
  [opportunityEngineAgent, proposalAgent, projectPlannerAgent].forEach(
    (agent) => agentRegistry.register(agent),
  );
}
