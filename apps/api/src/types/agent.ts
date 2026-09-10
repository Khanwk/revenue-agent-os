export type AgentStatus =
  | "queued"
  | "thinking"
  | "tool"
  | "validating"
  | "completed"
  | "failed";

export interface AgentMeta {
  id: string;
  name: string;
  shortName: string;
  description: string;
  purpose: string;
  icon: string;
  version: string;
}

export interface AgentRunEvent {
  id: string;
  status: AgentStatus;
  label: string;
  message: string;
  detail?: string;
  createdAt: string;
}

export interface AgentRun<TInput = unknown, TOutput = unknown> {
  id: string;
  agentId: string;
  status: AgentStatus;
  input: TInput;
  output?: TOutput;
  error?: string;
  events: AgentRunEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface AgentContext {
  runId: string;
  report: (
    status: "thinking" | "tool" | "validating",
    label: string,
    message: string,
    detail?: string,
  ) => void;
}

export interface AgentDefinition<TInput = unknown, TOutput = unknown> {
  meta: AgentMeta;
  parseInput(input: unknown): TInput;
  execute(input: TInput, context: AgentContext): Promise<TOutput>;
}
