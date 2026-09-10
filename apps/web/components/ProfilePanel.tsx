"use client";

import { useEffect, useState } from "react";
import type { CompanyProfile } from "@/types";

function lines(values: string[]) {
  return values.join("\n");
}

function list(value: string) {
  return value
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ProfilePanel({
  profile,
  onSave,
  onClose,
}: {
  profile: CompanyProfile;
  onSave: (profile: CompanyProfile) => Promise<void>;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState(profile);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => setDraft(profile), [profile]);

  const update = <K extends keyof CompanyProfile>(key: K, value: CompanyProfile[K]) => {
    setDraft((current) => ({ ...current, [key]: value }));
  };

  async function save() {
    setSaving(true);
    setMessage("");
    try {
      await onSave(draft);
      setMessage("Saved. Scout will use this profile on the next scan.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="profile-panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">COMPANY MEMORY</span>
          <h2>What should Scout look for?</h2>
          <p>Configure this once. Every revenue agent uses the same company profile.</p>
        </div>
        <button className="icon-btn" type="button" onClick={onClose} aria-label="Close company profile">
          ×
        </button>
      </div>

      <div className="profile-grid">
        <label>
          <span>Company name</span>
          <input value={draft.companyName} onChange={(event) => update("companyName", event.target.value)} />
        </label>

        <label>
          <span>Positioning</span>
          <input value={draft.positioning} onChange={(event) => update("positioning", event.target.value)} />
        </label>

        <label className="wide">
          <span>Team summary</span>
          <textarea rows={2} value={draft.teamSummary} onChange={(event) => update("teamSummary", event.target.value)} />
        </label>

        <label className="wide">
          <span>Skills — one per line, add :1-5 strength</span>
          <textarea
            rows={6}
            value={draft.skills.map((skill) => `${skill.name}:${skill.strength}`).join("\n")}
            onChange={(event) =>
              update(
                "skills",
                event.target.value
                  .split("\n")
                  .map((row) => {
                    const [name, ...rest] = row.split(":");
                    const strength = Math.max(1, Math.min(5, Number(rest.join(":")) || 3));
                    return { name: name.trim(), strength };
                  })
                  .filter((skill) => skill.name),
              )
            }
          />
        </label>

        <label>
          <span>Services</span>
          <textarea rows={5} value={lines(draft.services)} onChange={(event) => update("services", list(event.target.value))} />
        </label>

        <label>
          <span>Preferred project keywords</span>
          <textarea
            rows={5}
            value={lines(draft.preferredKeywords)}
            onChange={(event) => update("preferredKeywords", list(event.target.value))}
          />
        </label>

        <label>
          <span>Avoid keywords</span>
          <textarea rows={4} value={lines(draft.avoidKeywords)} onChange={(event) => update("avoidKeywords", list(event.target.value))} />
        </label>

        <label>
          <span>Preferred regions</span>
          <textarea
            rows={4}
            value={lines(draft.preferredRegions)}
            onChange={(event) => update("preferredRegions", list(event.target.value))}
          />
        </label>

        <label>
          <span>Minimum fixed budget (USD)</span>
          <input
            type="number"
            min="0"
            value={draft.minimumFixedBudgetUsd}
            onChange={(event) => update("minimumFixedBudgetUsd", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Minimum hourly rate (USD)</span>
          <input
            type="number"
            min="0"
            value={draft.minimumHourlyRateUsd}
            onChange={(event) => update("minimumHourlyRateUsd", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Max project length (weeks)</span>
          <input
            type="number"
            min="1"
            value={draft.maxProjectWeeks}
            onChange={(event) => update("maxProjectWeeks", Number(event.target.value))}
          />
        </label>

        <label>
          <span>Weekly delivery capacity (hours)</span>
          <input
            type="number"
            min="1"
            value={draft.weeklyCapacityHours}
            onChange={(event) => update("weeklyCapacityHours", Number(event.target.value))}
          />
        </label>

        <label className="wide">
          <span>Portfolio evidence — only real claims</span>
          <textarea
            rows={5}
            value={lines(draft.portfolioHighlights)}
            onChange={(event) => update("portfolioHighlights", list(event.target.value))}
          />
        </label>

        <label className="wide">
          <span>Proposal tone</span>
          <input value={draft.proposalTone} onChange={(event) => update("proposalTone", event.target.value)} />
        </label>
      </div>

      <div className="profile-actions">
        <span>{message}</span>
        <button className="secondary-btn" type="button" onClick={onClose}>
          Close
        </button>
        <button className="primary-btn" type="button" disabled={saving} onClick={() => void save()}>
          {saving ? "Saving..." : "Save company profile"}
        </button>
      </div>
    </section>
  );
}
