import type {AgentMeta,AgentRun,CompanyProfile} from "@/types";
export const API_URL=process.env.NEXT_PUBLIC_API_URL??"http://localhost:4100";
async function unwrap<T>(r:Response):Promise<T>{const data=await r.json();if(!r.ok)throw new Error(data.error??"Request failed");return data as T;}
export async function getAgents(){return unwrap<{agents:AgentMeta[]}>(await fetch(`${API_URL}/api/agents`,{cache:"no-store"}));}
export async function getProfile(){return unwrap<{profile:CompanyProfile}>(await fetch(`${API_URL}/api/profile`,{cache:"no-store"}));}
export async function saveProfile(profile:CompanyProfile){return unwrap<{profile:CompanyProfile}>(await fetch(`${API_URL}/api/profile`,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(profile)}));}
export async function startRun<T=unknown>(agentId:string,input:unknown){return unwrap<{run:AgentRun<T>}>(await fetch(`${API_URL}/api/agents/${agentId}/runs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)}));}
export async function getRun<T=unknown>(id:string){return unwrap<{run:AgentRun<T>}>(await fetch(`${API_URL}/api/runs/${id}`,{cache:"no-store"}));}
