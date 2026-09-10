import { Router } from "express";
import { runStore } from "../core/run-store.js";
export const runsRouter = Router();
runsRouter.get("/:id", (req, res) => {
  const run = runStore.get(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });
  return res.json({ run });
});
