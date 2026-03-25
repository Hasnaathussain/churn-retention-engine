# Synapse Churn Retention Engine

A flagship churn-retention platform built as two connected surfaces:

- A cinematic public website for positioning, conversion, and demo access.
- A protected workspace app for account intelligence, campaigns, playbooks, billing, and integrations.

The stack stays lightweight and practical:

- Frontend: Next.js App Router, Supabase Auth, Framer Motion, Recharts
- Backend: FastAPI, Pydantic, Stripe, OpenAI, optional Supabase persistence

## What changed

- Public routes now live at `/`, `/product`, `/solutions`, `/pricing`, `/demo`, `/docs`, and `/contact`.
- Protected workspace routes now live under `/app/*`.
- Backend API is versioned under `/v1`.
- Stripe docs no longer collide with the marketing docs page because FastAPI docs moved to `/api/docs`.
- Demo mode is seeded and workspace-aware, so the app works without live credentials.

## Backend API

Core endpoints:

- `GET /v1/dashboard/summary`
- `GET /v1/accounts`
- `GET /v1/accounts/{account_id}`
- `GET /v1/accounts/{account_id}/timeline`
- `POST /v1/accounts/{account_id}/score`
- `POST /v1/accounts/{account_id}/campaigns/generate`
- `POST /v1/campaigns/{campaign_id}/deploy`
- `GET /v1/playbooks`
- `GET /v1/integrations/status`
- `POST /v1/billing/checkout-session`
- `POST /v1/billing/portal-session`
- `POST /v1/webhooks/stripe`

FastAPI docs:

- `http://localhost:8000/api/docs`

## Local development

From the repo root:

```bash
cd engine
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

In a second terminal:

```bash
cd web
npm install
npm run dev
```

Open:

- `http://localhost:3000`
- `http://localhost:3000/demo`
- `http://localhost:3000/app/overview`

## Vercel deployment

Deploy the `web/` folder to Vercel as the frontend app. In the Vercel project settings, set the root directory to `web/` so the Next.js app is detected correctly.

Recommended environment variables in Vercel:

- `NEXT_PUBLIC_API_BASE_URL` pointing to your backend, for example `https://your-engine-host.com/v1`
- `NEXT_PUBLIC_APP_URL` set to your Vercel domain if you want to override auth links explicitly
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_ALLOW_DEMO_MODE=true`

The sign-in flow now defaults to the current deployed origin, so `NEXT_PUBLIC_APP_URL` is optional for the frontend as long as your Vercel domain is public and stable.

If you want the full live experience, host the Python engine separately on a Python platform such as Render, Fly, or Railway, then point `NEXT_PUBLIC_API_BASE_URL` at that URL. If you only want the polished website and seeded app demo on Vercel first, leave the API URL unset and use `/demo` or `/auth/demo?next=/app/overview`.

## Environment

Copy `.env.example` to `.env` and fill in the values you need.

Important variables:

- `NEXT_PUBLIC_API_BASE_URL`
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `APP_URL`
- `API_URL`
- `CORS_ORIGINS`
- `OPENAI_API_KEY`
- `OPENAI_MODEL`
- `OPENAI_LIVE_ENABLED`
- `STRIPE_API_KEY`
- `STRIPE_LIVE_ENABLED`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_LIVE_ENABLED`

## Notes

- Demo mode is intentionally seeded so the UI stays polished without backend wiring.
- Billing and integration actions are owner-gated on the backend.
- The churn scorer is heuristic for now, but the service layer is structured so a trained model can replace it later without changing the UI contract.
