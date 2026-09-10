import express from "express";
import cors from "cors";
import { env } from "./config/env.js";
import { agentsRouter } from "./routes/agents.js";
import { runsRouter } from "./routes/runs.js";
import { profileRouter } from "./routes/profile.js";
import { sourcesRouter } from "./routes/sources.js";
import { healthRouter } from "./routes/health.js";
import { upworkIntegrationRouter } from "./routes/upwork-integration.js";

export function createApp(){
  const app=express();
  app.use(cors({origin:env.WEB_ORIGIN}));
  app.use(express.json({limit:"2mb"}));
  app.use("/api/health",healthRouter);
  app.use("/api/integrations/upwork",upworkIntegrationRouter);
  app.use("/api/profile",profileRouter);
  app.use("/api/sources",sourcesRouter);
  app.use("/api/agents",agentsRouter);
  app.use("/api/runs",runsRouter);
  app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
    console.error(error);res.status(500).json({error:error instanceof Error?error.message:"Internal server error"});
  });
  return app;
}
