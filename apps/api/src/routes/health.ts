import { Router } from "express";
import { env } from "../config/env";
export const healthRouter = Router();
healthRouter.get("/", (_req, res) =>
  res.json({
    ok: true,
    aiProvider: env.AI_PROVIDER,
    time: new Date().toISOString(),
  }),
);
