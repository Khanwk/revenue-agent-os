import { Router } from "express";
import { agentRegistry } from "../core/agent-registry.js";
import { agentRunner } from "../core/agent-runner.js";
import { consumeAgentRun, consumeScan, refundScan } from "../usage/usage.js";
export const agentsRouter=Router();
agentsRouter.get("/",(_req,res)=>res.json({agents:agentRegistry.list()}));
agentsRouter.post("/:agentId/runs",async(req,res)=>{let scanCharged=false;try{const userId=req.user!.id;const isScout=req.params.agentId==="opportunity-engine";if(isScout){await consumeScan(userId);scanCharged=true;}try{await consumeAgentRun(userId);}catch(error){if(scanCharged)await refundScan(userId);throw error;}const run=await agentRunner.createRun(userId,req.params.agentId,req.body);res.status(202).json({run});void agentRunner.execute(run.id);}catch(error){if(scanCharged && !(error instanceof Error && error.message.includes("Hourly"))) { /* execution failures refund in runner; create failures refund below */ }
    const e=error as Error&{status?:number;code?:string};
    if(scanCharged && e.code!=="AGENT_RATE_LIMIT" && e.code!=="SCAN_LIMIT_REACHED") await refundScan(req.user!.id).catch(()=>undefined);
    res.status(e.status??400).json({error:e.message||"Unable to start agent",code:e.code});
  }});
