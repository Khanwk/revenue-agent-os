import { demoOpportunitySource } from "./demo-source.js";
import { freelancerOpportunitySource } from "./freelancer-source.js";
import { upworkOpportunitySource } from "./upwork-source.js";
import type { DiscoveredOpportunity, OpportunitySourceStatus } from "./types.js";
const sources=[freelancerOpportunitySource,upworkOpportunitySource,demoOpportunitySource];
export async function getSourceStatuses(userId?:string):Promise<OpportunitySourceStatus[]>{return Promise.all(sources.map(s=>s.status(userId)));}
export async function searchAllSources(userId:string,queries:string[],limitPerQuery:number){const statuses=await getSourceStatuses(userId);const calls=sources.flatMap((source,index)=>statuses[index].configured?queries.map(async query=>{try{return{jobs:await source.search({query,limit:limitPerQuery,userId}),error:undefined as string|undefined};}catch(error){return{jobs:[] as DiscoveredOpportunity[],error:`${statuses[index].label}: ${error instanceof Error?error.message:"source failed"}`};}}):[]);const settled=await Promise.all(calls);const map=new Map<string,DiscoveredOpportunity>();for(const item of settled)for(const job of item.jobs)map.set(job.id,job);return{opportunities:[...map.values()],errors:settled.map(x=>x.error).filter((x):x is string=>Boolean(x)),sources:statuses};}
export type { DiscoveredOpportunity,OpportunityPlatform,OpportunitySourceStatus } from "./types.js";
