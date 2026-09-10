import express from "express";
import cors from "cors";
import { env } from "./config/env";
import { agentsRouter } from "./routes/agents";
import { runsRouter } from "./routes/runs";
import { profileRouter } from "./routes/profile";
import { sourcesRouter } from "./routes/sources";
import { healthRouter } from "./routes/health";
import { upworkIntegrationRouter } from "./routes/upwork-integration";

export function createApp() {
  const app = express();

  app.use(
    cors({
      origin: env.WEB_ORIGIN,
      credentials: true,
    }),
  );

  app.use(express.json({ limit: "2mb" }));
  app.use(express.urlencoded({ extended: true }));

  app.get("/", (_req, res) => {
    res.status(200).json({
      success: true,
      service: "Revenue Agent OS API",
      status: "running",
      endpoints: {
        health: "/api/health",
        agents: "/api/agents",
        runs: "/api/runs",
        profile: "/api/profile",
        sources: "/api/sources",
        upwork: "/api/integrations/upwork",
      },
    });
  });

  app.use("/api/health", healthRouter);
  app.use("/api/integrations/upwork", upworkIntegrationRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/sources", sourcesRouter);
  app.use("/api/agents", agentsRouter);
  app.use("/api/runs", runsRouter);

  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Route not found",
    });
  });

  app.use(
    (
      error: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      console.error("[API ERROR]", error);

      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      });
    },
  );

  return app;
}
