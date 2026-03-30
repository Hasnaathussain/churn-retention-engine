# Anchoryn — AI-Powered Churn Retention Platform

## Overview

Anchoryn is a B2B SaaS platform for spotting churn risk before revenue disappears. It combines customer behavior, account health, support pressure, billing signals, and AI-assisted recommendations into a single operating surface for retention teams, operators, founders, and customer success leaders.

The repository is organized as two connected applications: a premium Next.js marketing site and app shell in `web/`, and a FastAPI service in `engine/` that powers churn scoring, seeded preview data, auth/session endpoints, billing helpers, and the public API surface. The current branch is best described as a launch-foundation build: the public-facing experience is polished, the app shell is strong, and the new Anchoryn brand is in place, but parts of the backend are still preview-grade and memory-backed.

What makes Anchoryn different is the product direction: it is designed as a retention control plane, not just a dashboard. The UI is built around customer risk workflows, playbooks, reporting, billing context, and actionability. The backend is already split into legacy `/v1` compatibility routes and newer `/api/v1` product APIs, which gives the codebase a clear migration path toward a full production SaaS architecture.

## Key Features

- Premium public marketing site with a light-first theme, dark mode, legal pages, product storytelling, pricing, FAQ, and demo entry points.
- Anchoryn brand system with custom SVG logo assets, browser metadata, and shared visual identity across pages.
- Protected app shell with navigation for dashboard, customers, analysis, playbooks, reports, integrations, team, account, billing, admin, and sessions.
- Customer intelligence flows with seeded KPI cards, churn trends, customer detail pages, timeline previews, playbook cards, and revenue-at-risk storytelling.
- Preview-grade auth routes for signup, login, password reset, email verification, session listing, and organization switching.
- Public product API under `/api/v1` for auth, customers, events, predictions, reports, and webhooks.
- Legacy workspace API under `/v1` retained for compatibility while the cutover continues.
- Stripe checkout and portal helper endpoints with demo fallback behavior.
- Security headers on frontend and backend responses, plus demo-safe cookie handling and cleaned-up dependency audit status.
- Branded 404, 500, 403, and maintenance pages.

## Tech Stack

| Layer | Technology | Version / Status | Why it was chosen |
| --- | --- | --- | --- |
| Frontend | Next.js App Router | 16.2.0 | Modern React app routing, server rendering, static marketing pages, and Vercel deployment path. |
| UI Runtime | React | 19.2.4 | Modern component model and compatibility with current Next.js release. |
| Language | TypeScript | 5.x | Strong typing across UI models and routing surfaces. |
| Styling | Global CSS with tokenized design system | Current repo implementation | Gives the app a distinctive Anchoryn aesthetic without depending on a heavy UI framework. |
| Motion | Framer Motion | 12.38.0 | Smooth transitions, overlays, and branded interactions. |
| Charts | Recharts | 3.8.0 | Fast dashboard-style charts for KPI and trend storytelling. |
| Forms | React Hook Form + Zod | 7.72.0 / 4.3.6 | Strong client-side validation with reusable auth forms. |
| Backend | FastAPI | Current `requirements.txt` dependency | Lightweight Python API layer with automatic OpenAPI support. |
| Validation | Pydantic | Current `requirements.txt` dependency | Typed request/response models for the API. |
| Auth Tokens | PyJWT + Argon2 | Current backend dependency set | Short-lived access tokens and strong password hashing for the preview auth flow. |
| Database | In-memory preview store today; Postgres planned for production | Current repo is preview-grade | The codebase still needs a full relational persistence layer and migrations. |
| Cache / Rate Limits | In-memory today; Redis planned for production | Current repo is preview-grade | Redis is the right production target for sessions, rate limits, and caching. |
| Queue / Jobs | Not wired yet; Celery or equivalent planned | Planned | Prediction refresh, email delivery, and report generation need background execution. |
| Payments | Stripe | Current integration helpers | Industry-standard subscription billing, checkout, and customer portal support. |
| AI / ML | OpenAI-compatible generation hooks | Current integration helpers | Natural language churn explanations, recommendations, and retention messaging. |
| Email | Resend planned | Placeholder in current repo | Clean transactional email delivery for verification, billing, and alerts. |
| Auth Fallback | Supabase compatibility layer | Current repo includes compatibility path | Keeps preview auth flexible while backend-owned auth is being built out. |
| Hosting | Vercel for `web`, Railway/Render/Fly for `engine` | Recommended deployment architecture | Clear split between frontend and Python API runtime. |
| Monitoring | Sentry planned | Not yet integrated | Error tracking and operational visibility for production launches. |

## Architecture Diagram

```mermaid
flowchart LR
  Browser -->|HTTPS| Web["Next.js frontend (web/)"]
  Web -->|Cookie auth / fetch| API["FastAPI API (engine/)"]
  API --> Preview["In-memory preview state"]
  API --> Stripe["Stripe"]
  API --> OpenAI["OpenAI-compatible AI provider"]
  API --> Supabase["Supabase compatibility layer"]
  API --> FutureDB["Postgres (planned production store)"]
  API --> FutureRedis["Redis (planned production cache/rate limit store)"]
  API --> FutureEmail["Resend (planned email delivery)"]
```

## Project Structure

```text
churn-retention-engine/
├─ AUDIT.md
├─ CHANGELOG.md
├─ SECURITY.md
├─ README.md
├─ .env.example
├─ .dockerignore
├─ docker-compose.yml
├─ docs/
│  ├─ architecture.md
│  ├─ auth.md
│  ├─ api.md
│  ├─ ai-engine.md
│  ├─ billing.md
│  ├─ contributing.md
│  ├─ database.md
│  ├─ deployment.md
│  ├─ integrations.md
│  └─ roadmap.md
├─ engine/
│  ├─ main.py
│  ├─ api.py
│  ├─ platform_api.py
│  ├─ auth_store.py
│  ├─ services.py
│  ├─ schemas.py
│  ├─ state.py
│  ├─ seed_data.py
│  ├─ config.py
│  ├─ integrations.py
│  ├─ database.py
│  ├─ model.py
│  ├─ requirements.txt
│  └─ tests/
│     └─ test_api.py
└─ web/
   ├─ package.json
   ├─ next.config.ts
   ├─ public/brand/
   ├─ src/app/
   ├─ src/components/
   └─ src/lib/
```

## Prerequisites

- Node.js `20.x` or newer
- npm `10.x` or newer
- Python `3.11+` recommended
- Docker Desktop optional for containerized local setup
- PostgreSQL `15+` and Redis `7+` if you expand beyond the current preview mode

## Local Development Setup

1. Clone the repo.

```bash
git clone <your-repo-url>
cd churn-retention-engine
```

2. Copy the environment template.

```bash
cp .env.example .env
```

3. Fill in the values you need.
   `AUTH_JWT_SECRET` is required for any serious auth testing.
   `OPENAI_API_KEY` is required only if you enable live AI.
   `STRIPE_API_KEY` and `STRIPE_WEBHOOK_SECRET` are required only for live billing flows.

4. Install frontend dependencies.

```bash
cd web
npm install
cd ..
```

5. Create or activate a Python environment and install backend dependencies.

```bash
cd engine
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
pip install argon2-cffi
cd ..
```

6. Start the backend.

```bash
cd engine
venv\Scripts\python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

7. Start the frontend in a second terminal.

```bash
cd web
npm run dev
```

8. Open the app.

- Marketing site: `http://localhost:3000`
- Demo: `http://localhost:3000/demo`
- Login: `http://localhost:3000/login`
- Dashboard: `http://localhost:3000/app/dashboard`
- FastAPI docs: `http://localhost:8000/api/docs`

## Environment Variables Reference

| Variable | Required | Default | Description | Where to get it |
| --- | --- | --- | --- | --- |
| `APP_ENV` | No | `development` | Backend environment mode | Set manually |
| `NODE_ENV` | No | `development` | Frontend environment mode | Set manually |
| `APP_URL` | Yes for deploy | `http://localhost:3000` | Public frontend base URL | Deployment platform |
| `API_URL` | Yes for deploy | `http://localhost:8000/v1` | Legacy workspace API base URL | Deployment platform |
| `CORS_ORIGINS` | Yes for deploy | local allowlist | Comma-separated trusted origins | Deployment platform |
| `NEXT_PUBLIC_APP_URL` | Optional | `http://localhost:3000` | Frontend canonical URL | Deployment platform |
| `NEXT_PUBLIC_API_BASE_URL` | Optional in demo | `http://localhost:8000/v1` | Frontend API base URL | Deployment platform |
| `NEXT_PUBLIC_AUTH_COOKIE_NAME` | No | `anchoryn_access_token` | Frontend access-token cookie name | Usually keep default |
| `NEXT_PUBLIC_SUPABASE_URL` | Optional | blank | Supabase compatibility URL | Supabase dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Optional | blank | Supabase anon key | Supabase dashboard |
| `NEXT_PUBLIC_ALLOW_DEMO_MODE` | No | `true` | Enables seeded preview mode in the UI | Set manually |
| `NEXT_PUBLIC_DEMO_VIDEO_URL` | No | blank | Optional hosted demo reel/video URL | Your CDN or storage |
| `AUTH_JWT_SECRET` | Yes for live auth | none | JWT signing secret | Generate securely |
| `ACCESS_TOKEN_MINUTES` | No | `15` | Access token TTL | Set manually |
| `REFRESH_TOKEN_DAYS` | No | `7` | Default refresh token TTL | Set manually |
| `REMEMBER_ME_DAYS` | No | `30` | Extended refresh TTL when remember-me is enabled | Set manually |
| `ALLOW_DEMO_MODE` | No | `true` | Enables backend demo mode defaults | Set manually |
| `DEMO_WORKSPACE_ID` | No | `org_demo_anchoryn` | Seed org ID for preview mode | Set manually |
| `DEMO_WORKSPACE_NAME` | No | `Anchoryn Launch Preview` | Seed org name for preview mode | Set manually |
| `OPENAI_API_KEY` | Optional | blank | AI provider key | OpenAI dashboard |
| `OPENAI_MODEL` | No | `gpt-4o-mini` | Model used for AI generation helpers | OpenAI docs/dashboard |
| `OPENAI_LIVE_ENABLED` | No | `false` | Enables live AI calls | Set manually |
| `STRIPE_API_KEY` | Optional | blank | Stripe secret key | Stripe dashboard |
| `STRIPE_LIVE_ENABLED` | No | `false` | Enables live Stripe calls | Set manually |
| `STRIPE_WEBHOOK_SECRET` | Optional | blank | Stripe webhook signing secret | Stripe dashboard |
| `STRIPE_PRICE_ID` | Optional | blank | Stripe price ID for checkout helper | Stripe dashboard |
| `STRIPE_CUSTOMER_ID` | Optional | blank | Optional fixed customer for testing | Stripe dashboard |
| `RESEND_API_KEY` | Optional | blank | Transactional email provider key | Resend dashboard |
| `SUPPORT_EMAIL` | No | blank | Reply-to/support address | Your support inbox |
| `MIXPANEL_PROJECT_TOKEN` | Optional | blank | Mixpanel integration token | Mixpanel dashboard |
| `INTERCOM_ACCESS_TOKEN` | Optional | blank | Intercom integration token | Intercom dashboard |
| `SUPABASE_URL` | Optional | blank | Supabase server URL | Supabase dashboard |
| `SUPABASE_ANON_KEY` | Optional | blank | Supabase anon key | Supabase dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Optional | blank | Supabase service role key | Supabase dashboard |
| `SUPABASE_LIVE_ENABLED` | No | `false` | Enables live Supabase usage | Set manually |
| `DATABASE_URL` | Planned | blank | Production Postgres connection string | Managed Postgres provider |
| `REDIS_URL` | Planned | blank | Production Redis connection string | Managed Redis provider |
| `SENTRY_DSN` | Planned | blank | Error tracking DSN | Sentry dashboard |
| `SLACK_WEBHOOK_URL` | Planned | blank | Slack alert delivery URL | Slack app settings |
| `SLACK_BOT_TOKEN` | Planned | blank | Slack bot token | Slack app settings |
| `GOOGLE_CLIENT_ID` | Planned | blank | Google OAuth client ID | Google Cloud console |
| `GOOGLE_CLIENT_SECRET` | Planned | blank | Google OAuth client secret | Google Cloud console |
| `GITHUB_CLIENT_ID` | Planned | blank | GitHub OAuth app client ID | GitHub developer settings |
| `GITHUB_CLIENT_SECRET` | Planned | blank | GitHub OAuth app client secret | GitHub developer settings |

## Database

The current repository does not yet ship with a full production database schema or migrations system. The backend still uses seeded in-memory workspace state plus a pseudo-database adapter for preview persistence.

Current state:

- Auth users, orgs, sessions, reset tokens, and verification tokens live in `engine/auth_store.py`.
- Customer, campaign, playbook, integration, and timeline state live in `engine/state.py` and `engine/seed_data.py`.
- A lightweight adapter exists in `engine/database.py`, but it is not a real relational persistence layer.

See [docs/database.md](docs/database.md) for the recommended target schema and migration path.

## API Reference

Base URLs:

- Legacy internal API: `/v1`
- New product/public API: `/api/v1`

Key routes:

- `POST /api/v1/auth/login`
- `GET /api/v1/auth/sessions`
- `GET /api/v1/customers`
- `POST /api/v1/customers/{id}/predict`
- `GET /api/v1/reports/churn-summary`
- `POST /api/v1/webhooks`
- `GET /v1/dashboard/summary`
- `POST /v1/billing/checkout-session`

Example `curl`:

```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"operator@anchoryn.demo","password":"Anchoryn!123","rememberMe":true}'
```

```bash
curl http://localhost:8000/api/v1/customers \
  -H "Authorization: Bearer ank_live_demo_51f8b9c1"
```

Fuller reference: [docs/api.md](docs/api.md)

## Deployment Guide

Recommended production topology:

- Frontend: Vercel project rooted at `web/`
- Backend: Railway, Render, Fly.io, or another Python host rooted at `engine/`
- Database: Neon or managed Postgres
- Cache/rate limits: Upstash Redis or managed Redis

Frontend deployment:

1. Import the repo into Vercel.
2. Set **Root Directory** to `web`.
3. Add the frontend environment variables from `.env.example`.
4. Set `NEXT_PUBLIC_APP_URL` to your Vercel domain.
5. Set `NEXT_PUBLIC_API_BASE_URL` to your backend domain plus `/v1`.
6. Deploy.

Backend deployment:

1. Deploy the `engine/` service to Railway, Render, Fly.io, or a Docker-capable host.
2. Set `APP_URL`, `API_URL`, `AUTH_JWT_SECRET`, `CORS_ORIGINS`, and any provider secrets.
3. Start the app with `uvicorn main:app --host 0.0.0.0 --port 8000`.

Before going live:

- Replace the development JWT secret.
- Disable demo mode unless you intentionally want a preview environment.
- Set exact CORS origins.
- Configure Stripe webhook delivery.
- Configure your email provider before enabling live password reset or verification flows.
- Replace in-memory state with Postgres/Redis before accepting real customer data.

Expanded guide: [docs/deployment.md](docs/deployment.md)

## Stripe Setup

Create these products/prices in Stripe:

- Starter: `$49/month` and `$470/year`
- Growth: `$149/month` and `$1,430/year`
- Scale: `$399/month` and `$3,830/year`
- Enterprise: sales-assisted / custom

Webhook endpoint:

- `https://your-api-domain.com/v1/webhooks/stripe`

Test locally with the Stripe CLI:

```bash
stripe listen --forward-to http://localhost:8000/v1/webhooks/stripe
```

## AI / API Keys Setup

- Set `OPENAI_API_KEY` and `OPENAI_LIVE_ENABLED=true` to allow live generation.
- Without a key, the product continues using heuristic/demo fallbacks.
- The repo includes a seeded preview API key for `/api/v1` testing. Replace it with org-managed hashed keys before launch.

## Integrations Setup

- Stripe: add secret key, webhook secret, and product price IDs.
- Supabase: optional compatibility layer during auth migration.
- Google OAuth: create an app in Google Cloud Console.
- GitHub OAuth: create an OAuth app in GitHub developer settings.
- Slack: create a webhook or bot app for alerting.
- Resend: create an API key for verification, reset, billing, and alert emails.

More detail: [docs/integrations.md](docs/integrations.md)

## How to Add Features

- New frontend page: add a route under `web/src/app/` and wire navigation in `site-header.tsx` or `app-shell.tsx`.
- New shared UI: add or extend components in `web/src/components/`.
- New frontend API call: extend `web/src/lib/api.ts` or `web/src/lib/client-auth.ts`.
- New backend endpoint: add a route to `engine/platform_api.py` for product APIs or `engine/api.py` for legacy compatibility APIs.
- New backend schema/model: add Pydantic types in `engine/schemas.py`.
- New service behavior: implement logic in `engine/services.py`.
- New seeded preview dataset: update `engine/seed_data.py` and `web/src/lib/mock-data.ts`.
- New docs page: add a markdown file under `docs/`.

## How to Update and Maintain

- Run `npm audit` regularly in `web/`.
- Pin and review Python dependencies in `engine/requirements.txt` before production.
- Re-run frontend build/lint and backend tests before each deploy.
- Rotate `AUTH_JWT_SECRET`, Stripe secrets, and AI provider keys on a schedule.
- Remove preview fallbacks from production branches once the real persistence layer is ready.
- Keep `AUDIT.md` current after major refactors.

## Testing

Frontend:

```bash
cd web
npm run lint
npm run build
npm audit
```

Backend:

```bash
cd engine
venv\Scripts\python -m unittest discover -s tests -v
```

Current coverage includes frontend lint/build validation and backend smoke tests for health, dashboard, scoring, billing ownership, integrations, and Stripe webhook state updates.

## Troubleshooting

- Login fails immediately: confirm `AUTH_JWT_SECRET` is set and the backend is running on the URL your frontend expects.
- Dashboard shows demo content: this happens when `NEXT_PUBLIC_API_BASE_URL` is missing or demo mode is enabled.
- Stripe billing falls back to a demo URL: set `STRIPE_API_KEY`, `STRIPE_PRICE_ID`, and `STRIPE_LIVE_ENABLED=true`.
- CORS errors: check `CORS_ORIGINS` and ensure your frontend origin exactly matches one of the allowed values.
- OAuth buttons do not authenticate: OAuth routes are still placeholders and must be fully implemented before launch.

## Contributing

- Use TypeScript and Python code that is explicit, readable, and production-oriented.
- Prefer small, focused pull requests.
- Update `AUDIT.md` and docs when product architecture changes materially.
- Branch naming convention:
  - `feature/<short-name>`
  - `fix/<short-name>`
  - `docs/<short-name>`

## License

This repository is currently provided without a separate OSS license file. Add the commercial or open-source license that matches your distribution strategy before public release.
