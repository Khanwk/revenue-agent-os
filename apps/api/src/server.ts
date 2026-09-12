import { createServer } from "node:http";
import { Server } from "socket.io";
import { createAdapter } from "@socket.io/redis-adapter";
import { createClient } from "redis";
import { createApp } from "./app.js";
import { allowedOrigins, env } from "./config/env.js";
import { registerAgents } from "./agents/index.js";
import { bindSocketServer } from "./core/events.js";
import { runStore } from "./core/run-store.js";
import { userFromToken } from "./auth/auth.js";

registerAgents();
const app=createApp();const httpServer=createServer(app);const io=new Server(httpServer,{cors:{origin:allowedOrigins,credentials:true,methods:["GET","POST"]},transports:["polling","websocket"],connectionStateRecovery:{maxDisconnectionDuration:120_000,skipMiddlewares:false}});
io.use(async(socket,next)=>{const user=await userFromToken(socket.handshake.auth?.token);if(!user)return next(new Error("Authentication required"));socket.data.userId=user.id;next();});
bindSocketServer(io);
io.on("connection",socket=>{const userId=String(socket.data.userId);socket.emit("socket:ready",{socketId:socket.id,recovered:socket.recovered,transport:socket.conn.transport.name});socket.on("run:subscribe",async(runId:string,ack?:(v:unknown)=>void)=>{if(typeof runId!=="string")return;const run=await runStore.get(userId,runId);if(!run){ack?.({ok:false});return;}socket.join(`run:${runId}`);socket.emit("run:update",run);ack?.({ok:true,run});});socket.on("run:unsubscribe",(runId:string)=>{if(typeof runId==="string")socket.leave(`run:${runId}`);});});
async function configureRedis(){if(!env.REDIS_URL)return;try{const pub=createClient({url:env.REDIS_URL});const sub=pub.duplicate();pub.on("error",e=>console.error("[Redis pub]",e));sub.on("error",e=>console.error("[Redis sub]",e));await Promise.all([pub.connect(),sub.connect()]);io.adapter(createAdapter(pub,sub));console.log("[Socket.IO] Redis adapter connected.");}catch(e){console.error("[Socket.IO] Redis adapter unavailable; single-replica mode.",e);}}
await configureRedis();httpServer.listen(env.PORT,"0.0.0.0",()=>{console.log(`Revenue Agent API listening on 0.0.0.0:${env.PORT}`);});
function shutdown(signal:string){console.log(`[${signal}] Shutting down...`);io.close(()=>httpServer.close(()=>process.exit(0)));setTimeout(()=>process.exit(1),10_000).unref();}process.on("SIGTERM",()=>shutdown("SIGTERM"));process.on("SIGINT",()=>shutdown("SIGINT"));
