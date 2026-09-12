"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getAgentInputHelp } from "@/lib/agent-inputs";
import type { AgentMeta, GenericOutput } from "@/types";
import styles from "./GenericWorkspace.module.css";

export function GenericWorkspace({
  agent,
  result,
  busy,
  onRun,
}: {
  agent: AgentMeta;
  result?: GenericOutput;
  busy: boolean;
  onRun: (context: string) => Promise<void>;
}) {
  const [context, setContext] = useState("");
  const help = getAgentInputHelp(agent.id);

  useEffect(() => setContext(""), [agent.id]);

  const canRun = context.trim().length >= 3 && !busy;

  return (
    <div className={styles.workspace}>
      <section className={styles.panel}>
        <header className={styles.header}>
          <div className={styles.headerCopy}>
            <span className={styles.eyebrow}>{agent.category?.toUpperCase()} AGENT</span>
            <h2>{agent.purpose}</h2>
            <p>{agent.description}</p>
          </div>
          <div className={styles.agentBadge}>
            <strong>{agent.shortName}</strong>
            <span>v{agent.version}</span>
          </div>
        </header>

        {help && (
          <div className={styles.guideGrid}>
            <article className={`${styles.guideCard} ${styles.guideCardPrimary}`}>
              <div className={styles.guideTitle}>
                <span className={styles.step}>01</span>
                <div>
                  <strong>What to provide</strong>
                  <small>The facts this agent needs before it can give you a useful answer.</small>
                </div>
              </div>
              <p className={styles.instruction}>{help.instruction}</p>
              <div className={styles.chips}>
                {help.checklist.map((item) => (
                  <span className={styles.chip} key={item}>{item}</span>
                ))}
              </div>
            </article>

            <article className={styles.guideCard}>
              <div className={styles.guideTitle}>
                <span className={styles.step}>02</span>
                <div>
                  <strong>What you will get</strong>
                  <small>A structured result you can review before you use it.</small>
                </div>
              </div>
              <div className={styles.outputList}>
                {help.expected.map((item) => (
                  <span className={styles.outputItem} key={item}>
                    <i className={styles.outputArrow}>→</i>{item}
                  </span>
                ))}
              </div>
            </article>
          </div>
        )}

        <form
          className={styles.formWrap}
          onSubmit={(event) => {
            event.preventDefault();
            if (canRun) void onRun(context);
          }}
        >
          <div className={styles.formTop}>
            <div className={styles.fieldInfo}>
              <label className={styles.label} htmlFor={`agent-context-${agent.id}`}>
                {help?.label || "Agent context"}
              </label>
              <p className={styles.helper}>Paste the real project, client or business context. Specific facts produce a stronger result.</p>
            </div>
            {help && (
              <button
                type="button"
                className={styles.demoButton}
                onClick={() => setContext(help.demoInput)}
              >
                <span className={styles.demoIcon}>◆</span>
                Load demo input
              </button>
            )}
          </div>

          <div className={styles.editor}>
            <textarea
              className={styles.textarea}
              id={`agent-context-${agent.id}`}
              value={context}
              onChange={(event) => setContext(event.target.value)}
              placeholder={help?.placeholder || "Paste the context this agent should work on..."}
              rows={11}
            />
            <div className={styles.editorFooter}>
              <span>{context.trim().length.toLocaleString()} characters</span>
              <span className={context.trim() ? styles.ready : undefined}>
                {context.trim() ? "Context ready" : "Waiting for context"}
              </span>
            </div>
          </div>

          <div className={styles.actions}>
            <Link className={styles.guideLink} href={`/agents-guide?agent=${encodeURIComponent(agent.id)}`}>
              See full guide
            </Link>
            <button className={styles.runButton} disabled={!canRun}>
              {busy ? `${agent.shortName} is working...` : `Run ${agent.shortName}`}
            </button>
          </div>
        </form>
      </section>

      {!result && (
        <section className={styles.empty}>
          <div className={styles.emptyMark}>◆</div>
          <div>
            <span className={styles.eyebrow}>OUTPUT</span>
            <h3>Your analysis will appear here</h3>
            <p>Run the agent to generate prioritized actions, risks, questions and relevant draft material.</p>
          </div>
        </section>
      )}

      {result && (
        <section className={`${styles.result} generic-result`}>
          <article className="objective-card generic-summary-card">
            <span>EXECUTIVE SUMMARY</span>
            <h3>{result.summary}</h3>
          </article>

          <div className="two-cols generic-result-columns">
            <article>
              <span>PRIORITIES</span>
              <ul>{result.priorities.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
            <article>
              <span>RISKS</span>
              <ul>{result.risks.map((item) => <li key={item}>{item}</li>)}</ul>
            </article>
          </div>

          <div className={styles.resultHead}>
            <div>
              <span className={styles.eyebrow}>RECOMMENDED ACTIONS</span>
              <h3>What to do next</h3>
            </div>
            <small>{result.actions.length} actions</small>
          </div>

          <div className="action-grid">
            {result.actions.map((action, index) => (
              <article key={`${action.title}-${index}`}>
                <div>
                  <b>{String(index + 1).padStart(2, "0")}</b>
                  <em className={`priority-${action.priority}`}>{action.priority}</em>
                </div>
                <h4>{action.title}</h4>
                <p>{action.why}</p>
                <span>{action.owner}</span>
              </article>
            ))}
          </div>

          {result.draft && (
            <article className="proposal-copy">
              <span>DRAFT</span>
              <pre>{result.draft}</pre>
            </article>
          )}

          <article className="done-card generic-questions-card">
            <span>QUESTIONS TO RESOLVE</span>
            <ul>{result.questions.map((item) => <li key={item}>{item}</li>)}</ul>
          </article>
        </section>
      )}
    </div>
  );
}
