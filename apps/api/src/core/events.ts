import type { Server } from "socket.io";
import type { AgentRun } from "../types/agent.js";

let io: Server | undefined;
export function bindSocketServer(server: Server) {
  io = server;
}
export function publishRun(run: AgentRun) {
  io?.to(`run:${run.id}`).emit("run:update", run);
}
