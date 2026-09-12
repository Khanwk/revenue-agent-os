import type { NextFunction, Request, Response } from "express";
import { supabaseAdmin } from "../db/supabase.js";

function bearer(req: Request) {
  const value = req.headers.authorization;
  if (!value?.startsWith("Bearer ")) return undefined;
  return value.slice(7).trim();
}

export async function userFromToken(token?: string) {
  if (!token) return undefined;
  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) return undefined;
  return data.user;
}

export async function requireUser(req: Request, res: Response, next: NextFunction) {
  const user = await userFromToken(bearer(req));
  if (!user) {
    res.status(401).json({ error: "Authentication required", code: "AUTH_REQUIRED" });
    return;
  }
  req.user = user;
  next();
}
