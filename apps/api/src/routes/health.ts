import { Router } from "express";
import { env } from "../config/env.js";
export const healthRouter=Router();
healthRouter.get("/",(_req,res)=>res.json({ok:true,service:"revenue-agent-api",version:"2.0.0",aiProvider:env.AI_PROVIDER,auth:"supabase",realtime:"socket.io",uptimeSeconds:Math.round(process.uptime()),time:new Date().toISOString()}));
