import { existsSync, promises as fs } from "node:fs.js ";
import path from "node:path.js ";
import { fileURLToPath } from "node:url.js ";
import { env } from "../config/env.js ";

interface UpworkTokenFile {
  accessToken: string;
  refreshToken?: string;
  expiresAt: number;
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const tokenPath = path.resolve(__dirname, "../../data/upwork-token.json");

export function hasStoredUpworkToken() {
  return Boolean(env.UPWORK_ACCESS_TOKEN) || existsSync(tokenPath);
}

async function readToken(): Promise<UpworkTokenFile | undefined> {
  if (env.UPWORK_ACCESS_TOKEN) {
    return {
      accessToken: env.UPWORK_ACCESS_TOKEN,
      expiresAt: Number.MAX_SAFE_INTEGER,
    };
  }

  try {
    return JSON.parse(await fs.readFile(tokenPath, "utf8")) as UpworkTokenFile;
  } catch {
    return undefined;
  }
}

export async function saveUpworkToken(payload: {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
}) {
  const token: UpworkTokenFile = {
    accessToken: payload.access_token,
    refreshToken: payload.refresh_token,
    expiresAt: Date.now() + Math.max(60, payload.expires_in ?? 86_400) * 1000,
  };
  await fs.writeFile(tokenPath, `${JSON.stringify(token, null, 2)}\n`, "utf8");
  return token;
}

async function refresh(token: UpworkTokenFile) {
  if (!token.refreshToken || !env.UPWORK_CLIENT_ID || !env.UPWORK_CLIENT_SECRET)
    return token;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    client_id: env.UPWORK_CLIENT_ID,
    client_secret: env.UPWORK_CLIENT_SECRET,
    refresh_token: token.refreshToken,
  });

  const response = await fetch("https://www.upwork.com/api/v3/oauth2/token", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok)
    throw new Error(
      `Unable to refresh Upwork OAuth token (HTTP ${response.status}).`,
    );

  const data = (await response.json()) as {
    access_token: string;
    refresh_token?: string;
    expires_in?: number;
  };

  return saveUpworkToken({
    ...data,
    refresh_token: data.refresh_token ?? token.refreshToken,
  });
}

export async function getValidUpworkAccessToken() {
  let token = await readToken();
  if (!token) return undefined;
  if (token.expiresAt - Date.now() < 5 * 60 * 1000)
    token = await refresh(token);
  return token.accessToken;
}
