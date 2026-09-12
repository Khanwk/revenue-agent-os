import { randomUUID } from "node:crypto";
import type { AgentRun, AgentStatus } from "../types/agent.js";
import { supabaseAdmin } from "../db/supabase.js";

function rowToRun(row: any): AgentRun {
  return { id:row.id,userId:row.user_id,agentId:row.agent_id,status:row.status,input:row.input,output:row.output ?? undefined,error:row.error ?? undefined,events:row.events ?? [],createdAt:row.created_at,updatedAt:row.updated_at };
}

class RunStore {
  async create(userId:string,agentId:string,input:unknown) {
    const now=new Date().toISOString();
    const run:AgentRun={id:randomUUID(),userId,agentId,status:"queued",input,events:[{id:randomUUID(),status:"queued",label:"Queued",message:"Agent run created.",createdAt:now}],createdAt:now,updatedAt:now};
    const { error }=await supabaseAdmin.from("agent_runs").insert({id:run.id,user_id:userId,agent_id:agentId,status:run.status,input:run.input,events:run.events,created_at:now,updated_at:now});
    if(error) throw error; return run;
  }
  async get(userId:string,id:string){ const {data,error}=await supabaseAdmin.from("agent_runs").select("*").eq("id",id).eq("user_id",userId).maybeSingle(); if(error) throw error; return data?rowToRun(data):undefined; }
  async getInternal(id:string){ const {data,error}=await supabaseAdmin.from("agent_runs").select("*").eq("id",id).maybeSingle(); if(error) throw error; return data?rowToRun(data):undefined; }
  async list(userId:string,limit=30){ const {data,error}=await supabaseAdmin.from("agent_runs").select("*").eq("user_id",userId).order("updated_at",{ascending:false}).limit(Math.min(100,Math.max(1,limit))); if(error) throw error; return (data??[]).map(rowToRun); }
  async addEvent(id:string,status:AgentStatus,label:string,message:string,detail?:string){ const run=await this.requireInternal(id); const now=new Date().toISOString(); run.status=status;run.updatedAt=now;run.events.push({id:randomUUID(),status,label,message,detail,createdAt:now}); const {error}=await supabaseAdmin.from("agent_runs").update({status,events:run.events,updated_at:now}).eq("id",id);if(error)throw error;return run; }
  async complete(id:string,output:unknown){ const run=await this.requireInternal(id);const now=new Date().toISOString();run.output=output;run.status="completed";run.updatedAt=now;run.events.push({id:randomUUID(),status:"completed",label:"Complete",message:"Agent finished successfully.",createdAt:now});const{error}=await supabaseAdmin.from("agent_runs").update({status:"completed",output,events:run.events,updated_at:now}).eq("id",id);if(error)throw error;return run; }
  async fail(id:string,errorMessage:string){const run=await this.requireInternal(id);const now=new Date().toISOString();run.error=errorMessage;run.status="failed";run.updatedAt=now;run.events.push({id:randomUUID(),status:"failed",label:"Failed",message:errorMessage,createdAt:now});const{error}=await supabaseAdmin.from("agent_runs").update({status:"failed",error:errorMessage,events:run.events,updated_at:now}).eq("id",id);if(error)throw error;return run;}
  private async requireInternal(id:string){const run=await this.getInternal(id);if(!run)throw new Error(`Run ${id} not found.`);return run;}
}
export const runStore=new RunStore();
