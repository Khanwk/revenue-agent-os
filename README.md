# Revenue Agent OS

Local-first agent workspace for a small software company that wants to find better freelance work, prepare stronger proposals and plan delivery without making the founder the bottleneck.

## Agents included

### 1. Scout — Opportunity Engine

- Reads your company profile once: skills, strength, services, target budgets, preferred work and avoid-list.
- Creates its own search queries when the search box is blank.
- Searches every configured source.
- Deterministically pre-scores every discovered project first (cheap).
- Sends only the best candidates to AI for deeper fit analysis.
- Produces a ranked TOP 10 with BID / CONSIDER / SKIP.
- Every real project card includes **Open original ↗** to the source listing.

### 2. Pitch — Proposal Agent

- Receives the exact ranked opportunity from Scout.
- Uses only real company-profile evidence.
- Produces price direction, opening angle, full proposal draft, questions and milestones.
- Never submits automatically.

### 3. Architect — Project Planner

- Receives the selected opportunity and Scout analysis.
- Produces assumptions, architecture, phases, role allocation, risks, discovery questions and definition of done.

## Sources included

- **Freelancer.com**: live adapter using the official active-project API. No app code changes needed.
- **Upwork**: official GraphQL API adapter. It is enabled only when `UPWORK_ACCESS_TOKEN` is configured.
- **Demo Feed**: local examples so the complete UI works even with no external credentials/network.

No Upwork scraping or automatic bidding is included.

## Stack

```text
Next.js UI
   ↓ REST + Socket.IO
Node.js / Express Agent Runtime
   ├── Agent Registry
   ├── Run Engine
   ├── Company Profile Store
   ├── Opportunity Sources
   ├── Fast deterministic ranking
   └── AI Provider
        ├── Mock (free/local testing)
        └── Gemini
```

## Run on Windows

Requirements: Node.js 20.9+.

PowerShell:

```powershell
npm install
Copy-Item apps/api/.env.example apps/api/.env
Copy-Item apps/web/.env.local.example apps/web/.env.local
npm run dev
```

Open `http://localhost:3000`.

The API runs at `http://localhost:4100`.

## Start free

The default `.env.example` uses:

```env
AI_PROVIDER=mock
```

Everything works without an AI API key. Freelancer live discovery needs internet; demo projects remain available if a source is unavailable.

To use Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-3.7-flash
```

## Upwork setup

Use the official Upwork developer API. Configure your approved OAuth app and then click **connect** beside Upwork in the Scout source strip.

```env
UPWORK_CLIENT_ID=your_client_id
UPWORK_CLIENT_SECRET=your_client_secret
UPWORK_REDIRECT_URI=http://localhost:4100/api/integrations/upwork/callback
UPWORK_TENANT_ID=
```

The API stores the OAuth token locally in `apps/api/data/upwork-token.json` (gitignored) and refreshes it when needed. `UPWORK_ACCESS_TOKEN` remains available as a manual fallback.

The adapter uses:

```text
https://api.upwork.com/graphql
```

Scout obtains `ciphertext` from `marketplaceJobPostingsContents` and builds the original listing link as:

```text
https://www.upwork.com/jobs/<ciphertext>
```

If Upwork changes a GraphQL field/filter, change only `apps/api/src/sources/upwork-source.ts`; the agents and UI do not change.

## Configure what “best for us” means

Open **Company profile** in the UI. Configure:

- skills and 1–5 strength
- services
- preferred project keywords
- avoid keywords
- minimum fixed budget
- minimum hourly rate
- maximum desired project length
- weekly delivery capacity
- preferred regions
- real portfolio evidence
- proposal tone

The profile is persisted locally in:

```text
apps/api/data/company-profile.json
```

For a multi-user deployment, replace this file store with PostgreSQL/MongoDB later.

## Opportunity scoring

Scout deliberately uses two levels:

```text
all discovered projects
        ↓
fast deterministic score
(skill + budget + competition + recency + preferred/avoid signals)
        ↓
top candidates only
        ↓
AI commercial/technical review
        ↓
combined final score
        ↓
ranked Top 10
```

This is cheaper and more auditable than sending every marketplace listing directly to an LLM.

## Adding another project source

Implement `OpportunitySource` in `apps/api/src/sources/`:

```ts
export const newSource: OpportunitySource = {
  status() {
    return {
      id: "new-source",
      label: "New Source",
      platform: "other",
      configured: true,
    };
  },

  async search(input) {
    return [
      {
        id: "new-source:123",
        sourceId: "123",
        platform: "other",
        platformLabel: "New Source",
        title: "...",
        description: "...",
        budget: "...",
        skills: [],
        clientInfo: "...",
        url: "https://original-project-link"
      }
    ];
  }
};
```

Register it in `apps/api/src/sources/index.ts`.

## Adding another agent

Create a folder under `apps/api/src/agents/`, implement `AgentDefinition`, and register it in `apps/api/src/agents/index.ts`. The sidebar is loaded from the API so the UI automatically sees registered agents; create a workspace component only when that agent needs a custom result view.

## Safety / operating rule

The system recommends and drafts. A human reviews before bidding, messaging a client, committing price, or accepting scope.
