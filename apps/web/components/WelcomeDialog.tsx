"use client";

import Link from "next/link";
import styles from "./WelcomeDialog.module.css";

interface WelcomeDialogProps {
  companyName?: string;
  scansRemaining?: number;
  scanLimit?: number;
  onClose: () => void;
}

const capabilities = [
  { label: "Sales", detail: "Scout · Pitch · Leads · Outreach" },
  { label: "Delivery", detail: "Planning · Specs · QA" },
  { label: "Growth", detail: "Marketing · Expansion · Proof" },
  { label: "Operations", detail: "SOPs · Decisions" },
];

export function WelcomeDialog({ companyName, scansRemaining, scanLimit, onClose }: WelcomeDialogProps) {
  const remaining = scansRemaining ?? scanLimit ?? 5;
  const limit = scanLimit ?? 5;

  return (
    <div className={styles.backdrop} role="presentation" onMouseDown={onClose}>
      <section
        className={styles.dialog}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <button className={styles.close} type="button" aria-label="Close introduction" onClick={onClose}>
          <span>×</span>
        </button>

        <div className={styles.shell}>
          <aside className={styles.brandPanel}>
            <div className={styles.brandTop}>
              <div className={styles.logoMark}>RA</div>
              <span className={styles.privateBadge}>PRIVATE BETA</span>
            </div>

            <div className={styles.brandCopy}>
              <span className={styles.eyebrow}>YOUR AI COMPANY WORKSPACE</span>
              <h2 id="welcome-title">Welcome to Revenue Agent OS</h2>
              <p>
                {companyName ? `${companyName} now has` : "You now have"} a coordinated workspace of specialist agents for finding work, preparing sales material, planning delivery and running day-to-day operations.
              </p>
            </div>

            <div className={styles.capabilityList}>
              {capabilities.map((item) => (
                <div className={styles.capability} key={item.label}>
                  <span>{item.label}</span>
                  <p>{item.detail}</p>
                </div>
              ))}
            </div>

            <div className={styles.controlNote}>
              <span className={styles.controlIcon}>✓</span>
              <div>
                <strong>You stay in control</strong>
                <p>Agents prepare and advise. You review important client-facing actions before anything goes out.</p>
              </div>
            </div>
          </aside>

          <main className={styles.contentPanel}>
            <div className={styles.topRow}>
              <div>
                <span className={styles.sectionLabel}>GET STARTED</span>
                <h3>Your first 3 minutes</h3>
              </div>
              <div className={styles.quotaPill} title="Scout demo allowance">
                <span className={styles.quotaDot} />
                <strong>{remaining}/{limit}</strong>
                <span>Scout scans</span>
              </div>
            </div>

            <div className={styles.steps}>
              <article className={styles.stepCard}>
                <div className={styles.stepNumber}>01</div>
                <div className={styles.stepBody}>
                  <strong>Tell the system what your company does</strong>
                  <p>Complete Company Profile with your skills, services, project preferences and filters. This makes every agent more specific.</p>
                  <span className={styles.stepMeta}>About 1 minute</span>
                </div>
              </article>

              <article className={styles.stepCard}>
                <div className={styles.stepNumber}>02</div>
                <div className={styles.stepBody}>
                  <strong>Start with Scout or choose a specialist</strong>
                  <p>Scout finds and ranks opportunities. For other work, open an agent and paste the real context it asks for.</p>
                  <span className={styles.stepMeta}>Each agent tells you what to provide</span>
                </div>
              </article>

              <article className={styles.stepCard}>
                <div className={styles.stepNumber}>03</div>
                <div className={styles.stepBody}>
                  <strong>Watch the run, then review the result</strong>
                  <p>Live Trace shows progress in real time. The final result is a structured working draft you can refine, save or use in the next step.</p>
                  <span className={styles.stepMeta}>Realtime with reconnect fallback</span>
                </div>
              </article>
            </div>

            <div className={styles.firstRunCard}>
              <div className={styles.firstRunHeader}>
                <div>
                  <span className={styles.sectionLabel}>RECOMMENDED FIRST RUN</span>
                  <strong>Find work that actually fits your company</strong>
                </div>
                <span className={styles.scoutTag}>SCOUT</span>
              </div>
              <p>After your profile is ready, try a focused search instead of a broad keyword.</p>
              <div className={styles.promptPreview}>
                <span>Example</span>
                <code>Next.js + Node.js SaaS or ecommerce projects above $500</code>
              </div>
            </div>

            <div className={styles.helperRow}>
              <div className={styles.helperText}>
                <span className={styles.helperIcon}>?</span>
                <p><strong>Not sure what to paste?</strong> Every agent has a guide and ready-to-load demo input.</p>
              </div>
              <Link href="/agents-guide" className={styles.guideLink} onClick={onClose}>
                Browse Agent Guide <span>↗</span>
              </Link>
            </div>

            <footer className={styles.footer}>
              <button className={styles.secondary} type="button" onClick={onClose}>I’ll explore myself</button>
              <button className={styles.primary} type="button" onClick={onClose}>
                Enter workspace <span>→</span>
              </button>
            </footer>
          </main>
        </div>
      </section>
    </div>
  );
}
