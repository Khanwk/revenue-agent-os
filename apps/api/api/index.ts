import { createServer } from "node:http";
import { createApp } from "../src/app.js";
import { registerAgents } from "../src/agents/index.js";

registerAgents();

const app = createApp();
const server = createServer(app);

export default server;
