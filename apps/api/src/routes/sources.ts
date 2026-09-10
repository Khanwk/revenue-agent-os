import { Router } from "express";
import { getSourceStatuses } from "../sources/index";
export const sourcesRouter = Router();
sourcesRouter.get("/", (_req, res) =>
  res.json({ sources: getSourceStatuses() }),
);
