import type { AgentDefinition } from "../types/agent.js";

class AgentRegistry {
  private readonly agents = new Map<string, AgentDefinition<any, any>>();

  register(agent: AgentDefinition<any, any>) {
    if (this.agents.has(agent.meta.id)) throw new Error(`Agent ${agent.meta.id} already registered.`);
    this.agents.set(agent.meta.id, agent);
  }

  get(id: string) { return this.agents.get(id); }
  list() { return [...this.agents.values()].map((agent) => agent.meta); }
}

export const agentRegistry = new AgentRegistry();
