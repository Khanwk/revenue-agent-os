import { promises as fs } from "node:fs";
import path from "node:path";
import { z } from "zod";
import type { CompanyProfile } from "../types/company.js";
import { supabaseAdmin } from "../db/supabase.js";

export const companyProfileSchema=z.object({companyName:z.string().min(1),positioning:z.string().min(1),teamSummary:z.string().min(1),skills:z.array(z.object({name:z.string().min(1),strength:z.number().int().min(1).max(5)})).min(1),services:z.array(z.string()).min(1),preferredKeywords:z.array(z.string()),avoidKeywords:z.array(z.string()),minimumFixedBudgetUsd:z.number().min(0),minimumHourlyRateUsd:z.number().min(0),maxProjectWeeks:z.number().int().min(1),weeklyCapacityHours:z.number().int().min(1),preferredRegions:z.array(z.string()),portfolioHighlights:z.array(z.string()),proposalTone:z.string().min(1)});
let defaultCache:CompanyProfile|undefined;
async function getDefault(){if(defaultCache)return defaultCache;const raw=await fs.readFile(path.resolve(process.cwd(),"data/company-profile.json"),"utf8");defaultCache=companyProfileSchema.parse(JSON.parse(raw));return defaultCache!;}
export async function getCompanyProfile(userId:string):Promise<CompanyProfile>{const{data,error}=await supabaseAdmin.from("company_profiles").select("profile").eq("user_id",userId).maybeSingle();if(error)throw error;if(data?.profile)return companyProfileSchema.parse(data.profile);const profile=await getDefault();const{error:upsertError}=await supabaseAdmin.from("company_profiles").upsert({user_id:userId,profile},{onConflict:"user_id"});if(upsertError)throw upsertError;return profile;}
export async function saveCompanyProfile(userId:string,input:unknown):Promise<CompanyProfile>{const profile=companyProfileSchema.parse(input);const{error}=await supabaseAdmin.from("company_profiles").upsert({user_id:userId,profile,updated_at:new Date().toISOString()},{onConflict:"user_id"});if(error)throw error;return profile;}
