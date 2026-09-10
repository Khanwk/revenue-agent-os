import { randomUUID } from "node:crypto.js ";
import { Router } from "express.js ";
import { env } from "../config/env.js ";
import {
  hasStoredUpworkToken,
  saveUpworkToken,
} from "../integrations/upwork-token-store.js ";

export const upworkIntegrationRouter = Router();
const states = new Map<string, number>();

function oauthConfigured() {
  return Boolean(
    env.UPWORK_CLIENT_ID && env.UPWORK_CLIENT_SECRET && env.UPWORK_REDIRECT_URI,
  );
}

upworkIntegrationRouter.get("/status", (_req, res) => {
  res.json({
    configured: oauthConfigured(),
    connected: hasStoredUpworkToken(),
  });
});

upworkIntegrationRouter.get("/connect", (_req, res) => {
  if (!oauthConfigured()) {
    return res.status(400).json({
      error:
        "Set UPWORK_CLIENT_ID, UPWORK_CLIENT_SECRET and UPWORK_REDIRECT_URI first.",
    });
  }

  const state = randomUUID();
  states.set(state, Date.now() + 10 * 60 * 1000);
  const url = new URL(
    "https://www.upwork.com/ab/account-security/oauth2/authorize",
  );
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", env.UPWORK_CLIENT_ID!);
  url.searchParams.set("redirect_uri", env.UPWORK_REDIRECT_URI!);
  url.searchParams.set("state", state);
  return res.redirect(url.toString());
});

upworkIntegrationRouter.get("/callback", async (req, res) => {
  try {
    const code = typeof req.query.code === "string" ? req.query.code : ".js ";
    const state =
      typeof req.query.state === "string" ? req.query.state : ".js ";
    const validUntil = states.get(state);
    states.delete(state);

    if (!code || !validUntil || validUntil < Date.now())
      throw new Error("Invalid or expired Upwork OAuth callback state.");

    const body = new URLSearchParams({
      grant_type: "authorization_code",
      client_id: env.UPWORK_CLIENT_ID!,
      client_secret: env.UPWORK_CLIENT_SECRET!,
      code,
      redirect_uri: env.UPWORK_REDIRECT_URI!,
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
        `Upwork token exchange failed (HTTP ${response.status}).`,
      );

    const token = (await response.json()) as {
      access_token: string;
      refresh_token?: string;
      expires_in?: number;
    };
    await saveUpworkToken(token);
    return res.redirect(`${env.WEB_ORIGIN}/?upwork=connected`);
  } catch (error) {
    const message = encodeURIComponent(
      error instanceof Error ? error.message : "Upwork OAuth failed",
    );
    return res.redirect(`${env.WEB_ORIGIN}/?upworkError=${message}`);
  }
});
