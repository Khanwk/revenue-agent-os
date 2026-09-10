import { Router } from "express";
import { agentRegistry } from "../core/agent-registry";
import { agentRunner } from "../core/agent-runner";

export const agentsRouter = Router();
agentsRouter.get("/", (_req, res) =>
  res.json({ agents: agentRegistry.list() }),
);
agentsRouter.post("/:agentId/runs", (req, res) => {
  try {
    const run = agentRunner.createRun(req.params.agentId, req.body);
    res.status(202).json({ run });
    void agentRunner.execute(run.id);
  } catch (error) {
    res
      .status(400)
      .json({
        error: error instanceof Error ? error.message : "Unable to start agent",
      });
  }
});
