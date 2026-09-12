import type { AgentMeta,AgentRun,CompanyProfile,UsageSummary } from "@/types";
import { supabase } from "@/lib/supabase";
const configuredApiUrl=process.env.NEXT_PUBLIC_API_URL?.trim();
export const API_URL=(configuredApiUrl||(process.env.NODE_ENV==="development"?"http://localhost:4100":"")).replace(/\/$/,"");
function assertApiUrl(){if(!API_URL)throw new Error("NEXT_PUBLIC_API_URL is not configured for this deployment.");}
async function authHeaders(extra?:HeadersInit){const next=new Headers(extra);const{data}=await supabase.auth.getSession();if(data.session?.access_token)next.set("Authorization",`Bearer ${data.session.access_token}`);return next;}
async function unwrap<T>(response:Response):Promise<T>{const data=await response.json().catch(()=>({}));if(!response.ok){const error=new Error((data as any).error||`Request failed with status ${response.status}`) as Error&{status?:number;code?:string};error.status=response.status;error.code=(data as any).code;throw error;}return data as T;}
async function request<T>(path:string,init?:RequestInit){assertApiUrl();return unwrap<T>(await fetch(`${API_URL}${path}`,{...init,headers:await authHeaders(init?.headers),cache:init?.cache??"no-store"}));}
export async function getAgents(){return request<{agents:AgentMeta[]}>("/api/agents");}
export async function getProfile(){return request<{profile:CompanyProfile}>("/api/profile");}
export async function saveProfile(profile:CompanyProfile){return request<{profile:CompanyProfile}>("/api/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify(profile)});}
export async function getMe(){return request<{user:{id:string;email?:string};usage:UsageSummary}>("/api/me");}
export async function startRun<T=unknown>(agentId:string,input:unknown){return request<{run:AgentRun<T>}>(`/api/agents/${agentId}/runs`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(input)});}
export async function getRun<T=unknown>(id:string){return request<{run:AgentRun<T>}>(`/api/runs/${id}`);}
export async function getUpworkConnectUrl(){return request<{authorizationUrl:string}>("/api/integrations/upwork/connect-url");}
