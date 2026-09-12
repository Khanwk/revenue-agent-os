import { z } from "zod";
import type { AgentDefinition, AgentMeta } from "../../types/agent.js";
import { getCompanyProfile } from "../../profile/profile-store.js";
import { getAiProvider } from "../../providers/index.js";

const inputSchema=z.object({context:z.string().min(3).max(20000),notes:z.string().max(5000).optional().default("")});
type GenericInput = z.infer<typeof inputSchema>;
const outputSchema=z.object({summary:z.string(),priorities:z.array(z.string()),actions:z.array(z.object({title:z.string(),why:z.string(),owner:z.string(),priority:z.enum(["high","medium","low"])})),risks:z.array(z.string()),questions:z.array(z.string()),draft:z.string().optional(),metrics:z.array(z.object({name:z.string(),target:z.string()})).optional().default([])});
const jsonSchema={type:"object",properties:{summary:{type:"string"},priorities:{type:"array",items:{type:"string"}},actions:{type:"array",items:{type:"object",properties:{title:{type:"string"},why:{type:"string"},owner:{type:"string"},priority:{type:"string",enum:["high","medium","low"]}},required:["title","why","owner","priority"]}},risks:{type:"array",items:{type:"string"}},questions:{type:"array",items:{type:"string"}},draft:{type:"string"},metrics:{type:"array",items:{type:"object",properties:{name:{type:"string"},target:{type:"string"}},required:["name","target"]}}},required:["summary","priorities","actions","risks","questions"]};

export interface GenericAgentConfig { meta:AgentMeta; role:string; objective:string; workflow:string[]; draftKind?:string; }
export function createGenericAgent(config:GenericAgentConfig):AgentDefinition<GenericInput, z.infer<typeof outputSchema>> {
  return {meta:config.meta,parseInput:(input)=>inputSchema.parse(input),async execute(input,context){
    const profile=await getCompanyProfile(context.userId);
    await context.report("thinking","Understand context",`${config.meta.shortName} is identifying the business outcome and constraints.`);
    await context.report("thinking","Apply company context","Matching the request to your team, services and positioning.");
    const mockResponse={summary:`${config.meta.shortName} reviewed the request and produced a focused execution plan.`,priorities:config.workflow.slice(0,3),actions:config.workflow.map((step,i)=>({title:step,why:`This supports ${config.objective.toLowerCase()}.`,owner:i%3===0?"Founder / lead":i%3===1?"Marketing / research":"Delivery team",priority:i<2?"high":i<4?"medium":"low"})),risks:["Validate assumptions before committing externally.","Do not claim evidence or results that are not in the company profile."],questions:["What outcome matters most?","What constraints or deadline should change this plan?"],draft:config.draftKind?`Draft ${config.draftKind}:\n\nUse the generated plan as a starting point and review it before sending externally.`:undefined,metrics:[{name:"Next action",target:"Complete the highest-priority action"}]};
    const system=`You are ${config.role} inside a small software company. Objective: ${config.objective}. Be commercially useful, concise, truthful, and execution-focused. Never invent portfolio proof, client facts, metrics, or commitments. Return JSON only.`;
    const prompt=`COMPANY PROFILE\n${JSON.stringify(profile,null,2)}\n\nREQUEST\n${input.context}\n\nNOTES\n${input.notes}\n\nWORKFLOW\n${config.workflow.join(" -> ")}\n\nReturn a practical result the company can act on immediately.`;
    const output=await getAiProvider().generateStructured<any>({system,prompt,schema:jsonSchema,mockResponse});
    await context.report("validating","Quality gate","Checking truthfulness, ownership, risks and next actions.");
    return outputSchema.parse(output);
  }};
}
