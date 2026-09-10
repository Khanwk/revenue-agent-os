import type { AgentMeta, AgentRun, CompanyProfile } from "@/types";

const rawApiUrl =
  process.env.NEXT_PUBLIC_API_URL ??
  "https://revenue-agentapi-production-295a.up.railway.app/";

if (!rawApiUrl) {
  throw new Error("NEXT_PUBLIC_API_URL is not configured.");
}

export const API_URL = rawApiUrl.replace(/\/$/, "");

async function unwrap<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => null);

    throw new Error(
      body?.error || `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function getAgents() {
  return unwrap<{ agents: AgentMeta[] }>(
    await fetch(`${API_URL}/api/agents`, {
      cache: "no-store",
    }),
  );
}

export async function getProfile() {
  return unwrap<{ profile: CompanyProfile }>(
    await fetch(`${API_URL}/api/profile`, {
      cache: "no-store",
    }),
  );
}

export async function saveProfile(profile: CompanyProfile) {
  return unwrap<{ profile: CompanyProfile }>(
    await fetch(`${API_URL}/api/profile`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profile),
    }),
  );
}

export async function startRun<T = unknown>(agentId: string, input: unknown) {
  return unwrap<{ run: AgentRun<T> }>(
    await fetch(`${API_URL}/api/agents/${agentId}/runs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    }),
  );
}

export async function getRun<T = unknown>(id: string) {
  return unwrap<{ run: AgentRun<T> }>(
    await fetch(`${API_URL}/api/runs/${id}`, {
      cache: "no-store",
    }),
  );
}
