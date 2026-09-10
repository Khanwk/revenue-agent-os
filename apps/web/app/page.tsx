"use client";

import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import { AgentCore } from "@/components/AgentCore";
import { RunTimeline } from "@/components/RunTimeline";
import { ProfilePanel } from "@/components/ProfilePanel";
import { OpportunityWorkspace } from "@/components/OpportunityWorkspace";
import { ProposalWorkspace } from "@/components/ProposalWorkspace";
import { PlannerWorkspace } from "@/components/PlannerWorkspace";
import { API_URL, getAgents, getProfile, getRun, saveProfile, startRun } from "@/lib/api";
import type {
  AgentMeta,
  AgentRun,
  AgentStatus,
  CompanyProfile,
  EngineOutput,
  PlannerOutput,
  ProposalOutput,
  RankedOpportunity,
} from "@/types";

type AgentId = "opportunity-engine" | "proposal" | "project-planner";
type RunMap = Partial<Record<AgentId, AgentRun>>;

export default function Home() {
  const [agents, setAgents] = useState<AgentMeta[]>([]);
  const [profile, setProfile] = useState<CompanyProfile>();
  const [showProfile, setShowProfile] = useState(false);
  const [activeAgent, setActiveAgent] = useState<AgentId>("opportunity-engine");
  const [runs, setRuns] = useState<RunMap>({});
  const [error, setError] = useState("");
  const [engineResult, setEngineResult] = useState<EngineOutput>();
  const [selected, setSelected] = useState<RankedOpportunity>();
  const [proposal, setProposal] = useState<ProposalOutput>();
  const [plan, setPlan] = useState<PlannerOutput>();
  const socket = useMemo(() => io(API_URL, { autoConnect: false }), []);

  useEffect(() => {
    Promise.all([getAgents(), getProfile()])
      .then(([agentData, profileData]) => {
        setAgents(agentData.agents);
        setProfile(profileData.profile);
      })
      .catch((loadError) => setError(loadError instanceof Error ? loadError.message : "Unable to load workspace"));

    socket.connect();
    socket.on("run:update", (next: AgentRun) => {
      setRuns((current) => ({ ...current, [next.agentId as AgentId]: next }));
    });

    return () => {
      socket.off("run:update");
      socket.disconnect();
    };
  }, [socket]);

  const activeRun = runs[activeAgent];
  const status: AgentStatus = activeRun?.status ?? "idle";
  const busy = ["queued", "thinking", "tool", "validating"].includes(status);
  const stage = activeRun?.events.at(-1)?.label;
  const activeMeta = agents.find((agent) => agent.id === activeAgent);

  async function execute<T>(agentId: AgentId, input: unknown) {
    setError("");
    const { run: created } = await startRun<T>(agentId, input);
    setRuns((current) => ({ ...current, [agentId]: created }));
    socket.emit("run:subscribe", created.id);

    for (let attempt = 0; attempt < 180; attempt += 1) {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const latest = (await getRun<T>(created.id)).run;
      setRuns((current) => ({ ...current, [agentId]: latest }));

      if (latest.status === "completed") {
        socket.emit("run:unsubscribe", created.id);
        return latest.output as T;
      }

      if (latest.status === "failed") {
        socket.emit("run:unsubscribe", created.id);
        throw new Error(latest.error || "Agent failed");
      }
    }

    throw new Error("Agent run timed out locally.");
  }

  async function scan(query: string) {
    try {
      setActiveAgent("opportunity-engine");
      const output = await execute<EngineOutput>("opportunity-engine", { query, topN: 10 });
      setEngineResult(output);
    } catch (scanError) {
      setError(scanError instanceof Error ? scanError.message : "Scan failed");
    }
  }

  async function chooseProposal(item: RankedOpportunity) {
    setSelected(item);
    setProposal(undefined);
    setActiveAgent("proposal");
    try {
      const output = await execute<ProposalOutput>("proposal", { rankedOpportunity: item, extraNotes: "" });
      setProposal(output);
    } catch (proposalError) {
      setError(proposalError instanceof Error ? proposalError.message : "Proposal failed");
    }
  }

  async function choosePlan(item: RankedOpportunity) {
    setSelected(item);
    setPlan(undefined);
    setActiveAgent("project-planner");
    try {
      const output = await execute<PlannerOutput>("project-planner", { rankedOpportunity: item, clientNotes: "" });
      setPlan(output);
    } catch (planError) {
      setError(planError instanceof Error ? planError.message : "Planning failed");
    }
  }

  async function generateProposal() {
    if (!selected) return;
    try {
      setProposal(await execute<ProposalOutput>("proposal", { rankedOpportunity: selected, extraNotes: "" }));
    } catch (proposalError) {
      setError(proposalError instanceof Error ? proposalError.message : "Proposal failed");
    }
  }

  async function generatePlan() {
    if (!selected) return;
    try {
      setPlan(await execute<PlannerOutput>("project-planner", { rankedOpportunity: selected, clientNotes: "" }));
    } catch (planError) {
      setError(planError instanceof Error ? planError.message : "Planning failed");
    }
  }

  async function updateProfile(next: CompanyProfile) {
    const saved = await saveProfile(next);
    setProfile(saved.profile);
  }

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-symbol">RA</div>
          <div>
            <strong>Revenue Agent OS</strong>
            <span>Company control room</span>
          </div>
        </div>

        <div className="nav-label">REVENUE AGENTS</div>
        <nav>
          {agents.map((agent) => (
            <button
              type="button"
              key={agent.id}
              className={`nav-agent ${activeAgent === agent.id ? "active" : ""}`}
              onClick={() => setActiveAgent(agent.id as AgentId)}
            >
              <span className="nav-icon">{agent.icon === "radar" ? "◉" : agent.icon === "pen" ? "✦" : "◇"}</span>
              <span>
                <strong>{agent.shortName}</strong>
                <small>{agent.name}</small>
              </span>
              <i />
            </button>
          ))}
        </nav>

        <div className="sidebar-spacer" />

        <button type="button" className="profile-nav" onClick={() => setShowProfile(true)}>
          <span>◎</span>
          <div>
            <strong>{profile?.companyName || "Company profile"}</strong>
            <small>Skills · services · filters</small>
          </div>
        </button>

        <div className="runtime">
          <i /> LOCAL-FIRST RUNTIME <span>Human approval on</span>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div>
            <span className="eyebrow">
              {activeMeta?.shortName?.toUpperCase() || "AGENT"} / {activeMeta?.version || "1.0"}
            </span>
            <h1>{activeMeta?.name || "Revenue Agent"}</h1>
            <p>{activeMeta?.description}</p>
          </div>
          <button type="button" className="profile-button" onClick={() => setShowProfile(true)}>
            Company profile <b>{profile?.skills.length || 0} skills</b>
          </button>
        </header>

        {error && <div className="global-error">{error}</div>}
        {showProfile && profile && <ProfilePanel profile={profile} onSave={updateProfile} onClose={() => setShowProfile(false)} />}

        <section className="agent-monitor">
          <AgentCore status={status} stage={stage} label={activeMeta?.shortName || "Agent"} />
          <RunTimeline events={activeRun?.events || []} />
        </section>

        {activeAgent === "opportunity-engine" && (
          <OpportunityWorkspace result={engineResult} busy={busy} onScan={scan} onProposal={(item) => void chooseProposal(item)} onPlan={(item) => void choosePlan(item)} />
        )}

        {activeAgent === "proposal" && (
          <ProposalWorkspace selected={selected} result={proposal} busy={busy} onGenerate={() => void generateProposal()} />
        )}

        {activeAgent === "project-planner" && (
          <PlannerWorkspace selected={selected} result={plan} busy={busy} onGenerate={() => void generatePlan()} />
        )}
      </section>
    </main>
  );
}
