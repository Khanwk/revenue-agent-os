import { supabaseAdmin } from "../db/supabase.js";
import { env } from "../config/env.js";

export interface UsageSummary { scansUsed: number; scanLimit: number; scansRemaining: number; }

export async function getUsage(userId: string): Promise<UsageSummary> {
  const { data, error } = await supabaseAdmin.from("user_usage").select("scans_used,scan_limit").eq("user_id", userId).single();
  if (error) throw error;
  const scanLimit = data.scan_limit ?? env.DEMO_SCAN_LIMIT;
  const scansUsed = data.scans_used ?? 0;
  return { scansUsed, scanLimit, scansRemaining: Math.max(0, scanLimit - scansUsed) };
}

export async function consumeScan(userId: string) {
  const { data, error } = await supabaseAdmin.rpc("consume_demo_scan", { p_user_id: userId });
  if (error) throw error;
  if (!data?.allowed) {
    const err = new Error("Your 5 demo scans have been used.") as Error & { code?: string; status?: number };
    err.code = "SCAN_LIMIT_REACHED"; err.status = 429; throw err;
  }
  return data as { allowed: boolean; scans_used: number; scan_limit: number; scans_remaining: number };
}

export async function refundScan(userId: string) {
  const { error } = await supabaseAdmin.rpc("refund_demo_scan", { p_user_id: userId });
  if (error) console.error("[Usage] refund failed", error);
}

export async function consumeAgentRun(userId: string) {
  const { data, error } = await supabaseAdmin.rpc("consume_agent_run", { p_user_id: userId, p_limit: env.AGENT_RUNS_PER_HOUR });
  if (error) throw error;
  if (!data?.allowed) {
    const err = new Error("Hourly agent-run limit reached. Try again later.") as Error & { code?: string; status?: number };
    err.code = "AGENT_RATE_LIMIT"; err.status = 429; throw err;
  }
}
