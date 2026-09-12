import { agentRegistry } from "../core/agent-registry.js";
import { opportunityEngineAgent } from "./opportunity-engine/index.js";
import { proposalAgent } from "./proposal/index.js";
import { projectPlannerAgent } from "./project-planner/index.js";
import { genericAgents } from "./generic/index.js";
let registered=false;
export function registerAgents(){if(registered)return;[opportunityEngineAgent,proposalAgent,projectPlannerAgent,...genericAgents].forEach(agent=>agentRegistry.register(agent));registered=true;}
