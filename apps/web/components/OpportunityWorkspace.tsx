"use client";

import { useState } from "react";
import type { EngineOutput, RankedOpportunity } from "@/types";
import { getAgentInputHelp } from "@/lib/agent-inputs";

function formatDate(value?: string) {
  if (!value) return "time n/a";
  try {
    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "UTC",
      hour12: false,
    }).format(new Date(value)) + " UTC";
  } catch {
    return value;
  }
}

function mark(platform: string) {
  return platform === "upwork" ? "UW" : platform === "freelancer" ? "FL" : platform === "demo" ? "DM" : "•";
}

export function OpportunityWorkspace({
  result,
  busy,
  onScan,
  onProposal,
  onPlan,
  onConnectUpwork,
  scansRemaining,
}: {
  result?: EngineOutput;
  busy: boolean;
  onScan: (query: string) => Promise<void>;
  onProposal: (item: RankedOpportunity) => void;
  onPlan: (item: RankedOpportunity) => void;
  onConnectUpwork: () => Promise<void>;
  scansRemaining?: number;
}) {
  const [query, setQuery] = useState("");
  const help = getAgentInputHelp("opportunity-engine");

  return (
    <div className="opportunity-workspace">
      <section className="scan-card">
        <div>
          <span className="eyebrow">AUTOMATIC OPPORTUNITY FINDER</span>
          <h2>Find work that fits us, not just work that exists.</h2>
          <p>Leave search blank and Scout creates searches from your company skills. Add a focus when you want to narrow the demo or search toward a specific type of project.</p>
          {help && <div className="scout-help"><span>{help.instruction}</span><div>{help.checklist.map(item => <small key={item}>✓ {item}</small>)}</div></div>}
        </div>
        <form onSubmit={(event) => {
          event.preventDefault();
          void onScan(query);
        }}>
          <label className="context-field-label" htmlFor="scout-query">{help?.label || "Search focus"}</label>
          <input id="scout-query" value={query} onChange={(event) => setQuery(event.target.value)} placeholder={help?.placeholder || "Optional search focus..."} />
          {help && <button type="button" className="demo-fill-btn scout-demo-btn" onClick={() => setQuery(help.demoInput)}>Load demo search</button>}
          <button className="primary-btn" disabled={busy}>{scansRemaining === 0 ? "Demo scan limit reached" : busy ? "Scout is scanning..." : "Scan & rank best projects"}</button>
        </form>
      </section>

      {result && (
        <>
          <div className="scan-summary">
            <div><strong>{result.scannedCount}</strong><span>projects scanned</span></div>
            <div><strong>{result.ranked.length}</strong><span>deeply ranked</span></div>
            <div><strong>{result.ranked.filter((item) => item.recommendation === "bid").length}</strong><span>bid candidates</span></div>
            <div className="source-chips">
              {result.sources.map((source) => (
                <span title={source.note} key={source.id}>
                  <i className={source.configured ? "on" : "off"} />
                  {source.label}
                  {source.id === "upwork" && !source.configured && (
                    <button type="button" className="source-connect" onClick={() => void onConnectUpwork()}>connect</button>
                  )}
                </span>
              ))}
            </div>
          </div>
          {result.sourceErrors.length > 0 && <div className="warning-box">{result.sourceErrors.map((item) => <span key={item}>{item}</span>)}</div>}
        </>
      )}

      <div className="rank-list">
        {!result ? (
          <div className="empty-state"><span>01</span><h3>Your ranked opportunity feed starts here.</h3><p>Save your skills, click scan, and Scout will do the first filtering for you.</p></div>
        ) : result.ranked.length === 0 ? (
          <div className="empty-state"><h3>No strong candidates yet.</h3><p>Try a broader focus or check source configuration.</p></div>
        ) : result.ranked.map((item, index) => (
          <article className={`rank-card verdict-${item.recommendation}`} key={item.opportunity.id}>
            <div className="rank-number">{String(index + 1).padStart(2, "0")}</div>
            <div className="score-badge"><strong>{item.finalScore}</strong><span>/100</span></div>
            <div className="job-main">
              <div className="job-source">
                <b>{mark(item.opportunity.platform)}</b>
                <span>{item.opportunity.platformLabel}</span>
                {index === 0 && <em>TOP MATCH</em>}
                {item.opportunity.isDemo && <em>DEMO</em>}
              </div>
              <h3>{item.opportunity.title}</h3>
              <p>{item.summary}</p>
              <div className="job-meta">
                <span>{item.opportunity.budget}</span>
                <span>{item.opportunity.location || "Location n/a"}</span>
                <span>{item.opportunity.proposals || "Competition n/a"}</span>
                <span>{formatDate(item.opportunity.postedAt)}</span>
              </div>
              <div className="skill-row">{(item.matchedSkills.length ? item.matchedSkills : item.opportunity.skills).slice(0, 6).map((skill) => <span key={skill}>{skill}</span>)}</div>
            </div>
            <div className="decision">
              <span className={`verdict ${item.recommendation}`}>{item.recommendation.toUpperCase()}</span>
              <p>{item.proposalAngle}</p>
              <div className="card-actions">
                {item.opportunity.url ? <a className="link-btn" href={item.opportunity.url} target="_blank" rel="noreferrer">Open original ↗</a> : <button className="link-btn" disabled>No source link</button>}
                <button className="secondary-btn" onClick={() => onPlan(item)}>Plan</button>
                <button className="primary-btn" onClick={() => onProposal(item)}>Create proposal</button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
