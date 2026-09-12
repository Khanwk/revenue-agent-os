export type OpportunityPlatform = "upwork" | "freelancer" | "demo" | "other";
export interface DiscoveredOpportunity { id:string;sourceId:string;platform:OpportunityPlatform;platformLabel:string;title:string;description:string;budget:string;budgetMinUsd?:number;budgetMaxUsd?:number;hourlyMinUsd?:number;hourlyMaxUsd?:number;skills:string[];clientInfo:string;url?:string;postedAt?:string;location?:string;proposals?:string;proposalCount?:number;projectType?:"fixed"|"hourly"|"unknown";isDemo?:boolean; }
export interface OpportunitySearchInput { query:string;limit:number;userId:string; }
export interface OpportunitySourceStatus { id:string;label:string;platform:OpportunityPlatform;configured:boolean;note?:string; }
export interface OpportunitySource { status(userId?:string):Promise<OpportunitySourceStatus>|OpportunitySourceStatus; search(input:OpportunitySearchInput):Promise<DiscoveredOpportunity[]>; }
