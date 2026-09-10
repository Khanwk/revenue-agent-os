import { agentRegistry } from "./agent-registry.js";
import { runStore } from "./run-store.js";
import { publishRun } from "./events.js";

class AgentRunner {
  createRun(agentId: string, rawInput: unknown) {
    const agent = agentRegistry.get(agentId);
    if (!agent) throw new Error(`Unknown agent ${agentId}.`);
    return runStore.create(agentId, agent.parseInput(rawInput));
  }

  async execute(runId: string) {
    const run = runStore.get(runId);
    if (!run) throw new Error(`Run ${runId} not found.`);
    const agent = agentRegistry.get(run.agentId);
    if (!agent) throw new Error(`Agent ${run.agentId} not found.`);
    try {
      const output = await agent.execute(run.input, {
        runId,
        report: (status, label, message, detail) => publishRun(runStore.addEvent(runId, status, label, message, detail))
      });
      publishRun(runStore.complete(runId, output));
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown agent failure";
      publishRun(runStore.fail(runId, message));
    }
  }
}

export const agentRunner = new AgentRunner();
