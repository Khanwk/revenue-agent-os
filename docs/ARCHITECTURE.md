# Architecture

```text
Company Profile
      ↓
Scout / Opportunity Engine
      ↓
Ranked real projects + source links
      ↓
Human selects one
      ├─────────────┐
      ↓             ↓
Pitch            Architect
Proposal         Delivery plan
      └──────┬──────┘
             ↓
       Human decision
```

Marketplace adapters only retrieve and normalize public/authorized project data. Scout only sees normalized opportunities. This means Upwork, Freelancer or a later source can change without rewriting ranking, proposal or planning agents.

Scout uses deterministic pre-scoring before LLM analysis so only the best candidates consume AI tokens.

Version 1 is local-first: company profile is JSON, run state is in memory, and no project data is permanently stored beyond that configuration. Move these to PostgreSQL/MongoDB when multi-user history is needed.
