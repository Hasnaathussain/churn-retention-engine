# Architecture

## Current Architecture

Anchoryn is split into two main applications:

- `web/`: Next.js App Router application for the marketing site and authenticated app shell
- `engine/`: FastAPI backend for scoring, auth/session previews, billing helpers, integration status, and APIs

The frontend calls two backend surfaces:

- `/v1` for legacy workspace-compatible app data
- `/api/v1` for newer auth and product APIs

## Current Runtime Model

- Frontend renders public marketing pages statically where possible.
- Protected routes use a server-side session helper in `web/src/lib/auth.ts`.
- When live backend configuration is missing, the frontend falls back to preview data from `web/src/lib/mock-data.ts`.
- The backend uses in-memory auth/session stores and in-memory workspace state seeded from `engine/seed_data.py`.

## Intended Production Architecture

- `app.<domain>` -> Next.js frontend on Vercel
- `api.<domain>` -> FastAPI service on Railway/Render/Fly
- Postgres -> persistent organizations, users, sessions, customers, predictions, reports, billing state
- Redis -> rate limits, session/cache helpers, notification dedupe, background job coordination
- Worker queue -> prediction refresh, email sending, report generation, sync jobs
- Stripe -> subscriptions and invoices
- Resend -> transactional email
- Sentry -> error tracking

## Design Decisions

- Keep the polished demo mode because it accelerates product iteration and investor/customer demos.
- Preserve the legacy `/v1` routes temporarily so the frontend can keep evolving without a flag day migration.
- Normalize around organization/customer concepts while retaining a thin compatibility layer for workspace/account naming during transition.

## Current Gaps

- No relational persistence or migrations
- No worker runtime
- No production email delivery
- No fully implemented OAuth
- No structured observability stack
