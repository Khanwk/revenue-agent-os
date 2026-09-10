import { randomUUID } from "node:crypto";
import type { AgentRun, AgentStatus } from "../types/agent.js";

class RunStore {
  private readonly runs = new Map<string, AgentRun>();

  create(agentId: string, input: unknown) {
    const now = new Date().toISOString();
    const run: AgentRun = {
      id: randomUUID(),
      agentId,
      status: "queued",
      input,
      events: [
        {
          id: randomUUID(),
          status: "queued",
          label: "Queued",
          message: "Agent run created.",
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };
    this.runs.set(run.id, run);
    return run;
  }

  get(id: string) {
    return this.runs.get(id);
  }

  addEvent(
    id: string,
    status: AgentStatus,
    label: string,
    message: string,
    detail?: string,
  ) {
    const run = this.require(id);
    const now = new Date().toISOString();
    run.status = status;
    run.events.push({
      id: randomUUID(),
      status,
      label,
      message,
      detail,
      createdAt: now,
    });
    run.updatedAt = now;
    return run;
  }

  complete(id: string, output: unknown) {
    const run = this.require(id);
    const now = new Date().toISOString();
    run.output = output;
    run.status = "completed";
    run.updatedAt = now;
    run.events.push({
      id: randomUUID(),
      status: "completed",
      label: "Complete",
      message: "Agent finished successfully.",
      createdAt: now,
    });
    return run;
  }

  fail(id: string, error: string) {
    const run = this.require(id);
    const now = new Date().toISOString();
    run.error = error;
    run.status = "failed";
    run.updatedAt = now;
    run.events.push({
      id: randomUUID(),
      status: "failed",
      label: "Failed",
      message: error,
      createdAt: now,
    });
    return run;
  }

  private require(id: string) {
    const run = this.runs.get(id);
    if (!run) throw new Error(`Run ${id} not found.`);
    return run;
  }
}

export const runStore = new RunStore();
