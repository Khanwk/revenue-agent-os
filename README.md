# Revenue Agent OS v2.0

Private-beta AI operating system for a small software company. It combines authenticated company context, opportunity discovery, sales agents, delivery agents, growth agents, live Socket.IO execution, persistent run history and a server-enforced demo quota.

## Agents included

**Sales**: Scout (opportunity discovery/ranking), Pitch (proposal), Prospector (lead research), Reach (outreach), Discover (client discovery), Estimate (pricing/estimation).

**Delivery**: Architect (project plan), Spec (requirements/acceptance criteria), Guardian (QA/release).

**Growth**: Growth (marketing), Expand (retention/upsell/referrals), Proof (case studies).

**Operations**: Ops (SOP/process), Advisor (company decisions).

## Architecture

```text
Next.js web
   | Supabase user session
   | REST + Socket.IO
   v
Node/Express API
   |-- authenticated agent runner
   |-- Scout source adapters
   |-- optional Redis socket adapter
   |-- Gemini or mock AI provider
   v
Supabase
   |-- Auth
   |-- per-user company profiles
   |-- per-user agent runs
   |-- 5-scan demo quota
   |-- encrypted Upwork OAuth connection records
```

The API does not depend on Railway. It can run on Railway, Render, Fly.io, AWS, DigitalOcean, a VPS, Docker, or any host that supports a persistent Node HTTP/WebSocket server.

## 1. Create Supabase project

Create a Supabase project, then open SQL Editor and run:

```text
apps/api/supabase/001_initial.sql
```

Get:
- Project URL
- anon/public key (for the web app)
- service-role key (API only; never expose it in `NEXT_PUBLIC_*`)

For a closed private demo, you can disable open signup in Supabase after creating/inviting the tester accounts you want.

## 2. Environment

API (`apps/api/.env`):

```env
PORT=4100
WEB_ORIGIN=http://localhost:3000
AI_PROVIDER=mock
SUPABASE_URL=https://YOUR_PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
OAUTH_ENCRYPTION_KEY=use-a-long-random-secret-at-least-32-characters
DEMO_SCAN_LIMIT=5
AGENT_RUNS_PER_HOUR=30
DEMO_SOURCE_ENABLED=true
```

Optional Gemini:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-3.7-flash
```

Optional Redis (needed only when horizontally scaling Socket.IO):

```env
REDIS_URL=redis://...
```

Web (`apps/web/.env.local`):

```env
NEXT_PUBLIC_API_URL=http://localhost:4100
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

## 3. Local run

```bash
npm install
npm run dev
```

Web: http://localhost:3000  
API: http://localhost:4100  
Health: http://localhost:4100/api/health

## 4. Demo quota

Every Supabase user receives 5 Scout scans. The quota is consumed atomically in PostgreSQL, not just disabled in the UI. If a Scout execution itself fails, the run is refunded. Other agents do not consume Scout scans. A separate hourly agent-run guard limits accidental API spend.

To change one tester's allowance, update `public.user_usage.scan_limit` in Supabase.

## 5. Upwork

Upwork is optional. Configure the official OAuth/API credentials on the API host, set the redirect URL to:

```text
https://YOUR_API_HOST/api/integrations/upwork/callback
```

Set `OAUTH_ENCRYPTION_KEY`. OAuth tokens are encrypted before being stored in Supabase and belong to the authenticated user who started the OAuth flow.

## 6. Deployment

Recommended private beta:

```text
Web: Vercel or Railway
API: Railway / Render / Fly / VPS
Auth + DB: Supabase
Redis: optional (only for multiple API replicas)
```

For Railway/Render, use:

```text
Build: npm run build -w @revenue-agent/api
Start: npm run start -w @revenue-agent/api
```

and set the service root/repository configuration according to the host. The API listens on `process.env.PORT` and `0.0.0.0`.

The two Dockerfiles at repository root provide another portable deployment path.

## Security model

- Supabase access token required for all company/agent endpoints.
- Socket.IO authenticates with the same access token.
- A user can subscribe only to their own run room.
- Service-role key stays on the API.
- Per-user Upwork OAuth tokens are encrypted at rest by the application.
- CORS restricts browser origins to `WEB_ORIGIN`.
- Helmet + request rate limiting enabled.
- Human approval remains required before sending proposals/outreach externally.
- Private beta pages are `noindex`.

## Before public launch

This is designed for controlled demos and early private users. Before open public signup/payment, add billing, admin/audit tooling, automated integration tests, monitoring/error reporting, backups/retention policy, legal/privacy pages, email abuse controls and a durable background job queue for long-running agent workflows.

## Agent input guide and demo data

Open `/agents-guide` in the web app for agent-specific input guidance and ready-to-paste demo briefs. The same tailored guidance appears beside each generic agent input. A complete copyable demo library is also available at `docs/DEMO_INPUTS.md`.
