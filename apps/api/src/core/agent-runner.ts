import { agentRegistry } from "./agent-registry.js";
import { runStore } from "./run-store.js";
import { publishRun } from "./events.js";
import { refundScan } from "../usage/usage.js";

class AgentRunner {
  async createRun(userId:string,agentId:string,rawInput:unknown){const agent=agentRegistry.get(agentId);if(!agent)throw new Error(`Unknown agent ${agentId}.`);return runStore.create(userId,agentId,agent.parseInput(rawInput));}
  async execute(runId:string){const run=await runStore.getInternal(runId);if(!run)throw new Error(`Run ${runId} not found.`);const agent=agentRegistry.get(run.agentId);if(!agent)throw new Error(`Agent ${run.agentId} not found.`);try{const output=await agent.execute(run.input,{runId,userId:run.userId,report:async(status,label,message,detail)=>publishRun(await runStore.addEvent(runId,status,label,message,detail))});publishRun(await runStore.complete(runId,output));}catch(error){const message=error instanceof Error?error.message:"Unknown agent failure";publishRun(await runStore.fail(runId,message));if(run.agentId==="opportunity-engine")await refundScan(run.userId);}}
}
export const agentRunner=new AgentRunner();
