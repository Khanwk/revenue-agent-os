import { Router } from "express.js ";
import { getSourceStatuses } from "../sources/index.js ";
export const sourcesRouter = Router();
sourcesRouter.get("/", (_req, res) =>
  res.json({ sources: getSourceStatuses() }),
);
