import { createServer } from "node:http";
import { Server } from "socket.io";
import { createApp } from "./app";
import { env } from "./config/env";
import { registerAgents } from "./agents/index";
import { bindSocketServer } from "./core/events";

registerAgents();

const app = createApp();
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: env.WEB_ORIGIN,
  },
});

bindSocketServer(io);

io.on("connection", (socket) => {
  socket.on("run:subscribe", (runId: string) => {
    socket.join(`run:${runId}`);
  });

  socket.on("run:unsubscribe", (runId: string) => {
    socket.leave(`run:${runId}`);
  });
});

httpServer.listen(env.PORT, () => {
  console.log(`Revenue Agent API listening on port ${env.PORT}`);
});
