import express from "express";
import cors from "cors";
import helmet from "helmet";
import { rateLimit } from "express-rate-limit";
import { allowedOrigins } from "./config/env.js";
import { requireUser } from "./auth/auth.js";
import { agentsRouter } from "./routes/agents.js";
import { runsRouter } from "./routes/runs.js";
import { profileRouter } from "./routes/profile.js";
import { sourcesRouter } from "./routes/sources.js";
import { healthRouter } from "./routes/health.js";
import { upworkIntegrationRouter } from "./routes/upwork-integration.js";
import { meRouter } from "./routes/me.js";

function corsOrigin(origin:string|undefined,cb:(err:Error|null,allow?:boolean)=>void){if(!origin||allowedOrigins.includes(origin.replace(/\/$/,"")))return cb(null,true);cb(new Error(`Origin ${origin} is not allowed by CORS.`));}
export function createApp(){const app=express();app.set("trust proxy",1);app.disable("x-powered-by");app.use(helmet({crossOriginResourcePolicy:false}));app.use(cors({origin:corsOrigin,credentials:true,methods:["GET","POST","PUT","PATCH","DELETE","OPTIONS"],allowedHeaders:["Content-Type","Authorization"]}));app.use(express.json({limit:"2mb"}));app.use(express.urlencoded({extended:true}));app.use(rateLimit({windowMs:60_000,limit:120,standardHeaders:"draft-8",legacyHeaders:false}));app.get("/",(_req,res)=>res.json({success:true,service:"Revenue Agent OS API",version:"2.0.0",status:"running",auth:"supabase",realtime:"socket.io + REST fallback"}));app.use("/api/health",healthRouter);app.use("/api/integrations/upwork",upworkIntegrationRouter);app.use("/api",requireUser);app.use("/api/me",meRouter);app.use("/api/profile",profileRouter);app.use("/api/sources",sourcesRouter);app.use("/api/agents",agentsRouter);app.use("/api/runs",runsRouter);app.use((_req,res)=>res.status(404).json({success:false,error:"Route not found"}));app.use((error:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{console.error("[API ERROR]",error);res.status(500).json({success:false,error:error instanceof Error?error.message:"Internal server error"});});return app;}
