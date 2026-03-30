# Anchoryn Codebase Audit

Audit date: 2026-03-31  
Repository: `c:\churn-retention-engine`

## Executive Summary

The repo has progressed from a single-surface MVP into a branded two-surface application, but it is still a launch foundation rather than a fully production-ready SaaS product. The frontend now builds and lints cleanly, and the backend test suite currently passes, but major platform areas remain seeded, in-memory, or partially implemented.

The most important conclusion is this:

- The **public site and app shell are usable** for demos and design validation.
- The **new `/api/v1` auth and customer API exists**, but parts of it are still preview-grade.
- The **legacy `/v1` API, in-memory workspace state, and seeded mock data are still core runtime dependencies**.
- The repo **does not yet have a real database migration system, persistent auth/session storage, queueing, email delivery, or complete billing/integration infrastructure**.

## 1. Frontend Inventory

### App Routes

| Route | File | Status | Notes |
| --- | --- | --- | --- |
| `/` | `web/src/app/(marketing)/page.tsx` | `OK` | Anchoryn home page with hero, features, testimonials, pricing, FAQ, CTA. |
| `/product` | `web/src/app/(marketing)/product/page.tsx` | `OK` | Product storytelling page. |
| `/pricing` | `web/src/app/(marketing)/pricing/page.tsx` | `OK` | Public pricing page with Anchoryn tiers. |
| `/demo` | `web/src/app/(marketing)/demo/page.tsx` | `[INCOMPLETE]` | Polished demo surface, but still seeded preview data rather than live org-backed data. |
| `/contact` | `web/src/app/(marketing)/contact/page.tsx` | `OK` | Branded contact page. |
| `/login` | `web/src/app/(marketing)/login/page.tsx` | `[INCOMPLETE]` | Functional form shell; backend auth exists, but OAuth and full production session behavior are incomplete. |
| `/signup` | `web/src/app/(marketing)/signup/page.tsx` | `[INCOMPLETE]` | Functional form shell; onboarding and real org provisioning remain preview-grade. |
| `/forgot-password` | `web/src/app/(marketing)/forgot-password/page.tsx` | `[INCOMPLETE]` | Works against preview auth service; no real email sending yet. |
| `/reset-password` | `web/src/app/(marketing)/reset-password/page.tsx` | `[INCOMPLETE]` | Uses preview token flow; no email provider yet. |
| `/verify-email` | `web/src/app/(marketing)/verify-email/page.tsx` | `[INCOMPLETE]` | Uses preview token flow; no production verification email delivery yet. |
| `/docs` | `web/src/app/(marketing)/docs/page.tsx` | `OK` | Redirects to `/docs/api`. |
| `/docs/api` | `web/src/app/(marketing)/docs/api/page.tsx` | `[INCOMPLETE]` | Human-friendly overview only; not a real interactive API playground. |
| `/solutions` | `web/src/app/(marketing)/solutions/page.tsx` | `OK` | Redirect/legacy consolidation route. |
| `/signin` | `web/src/app/(marketing)/signin/page.tsx` | `OK` | Redirects to `/login`. |
| `/legal/privacy` | `web/src/app/(marketing)/legal/privacy/page.tsx` | `OK` | Real legal page exists. |
| `/legal/terms` | `web/src/app/(marketing)/legal/terms/page.tsx` | `OK` | Real legal page exists. |
| `/legal/cookies` | `web/src/app/(marketing)/legal/cookies/page.tsx` | `OK` | Real legal page exists. |
| `/forbidden` | `web/src/app/(marketing)/forbidden/page.tsx` | `OK` | Added branded 403 surface. |
| `/maintenance` | `web/src/app/(marketing)/maintenance/page.tsx` | `OK` | Added branded maintenance surface. |
| `/onboarding` | `web/src/app/(app)/onboarding/page.tsx` | `[INCOMPLETE]` | Exists, but not a full multi-step persisted onboarding flow. |
| `/app/dashboard` | `web/src/app/(app)/app/dashboard/page.tsx` | `[INCOMPLETE]` | Strong UI shell with seeded summary data; not yet backed by production analytics/reporting stack. |
| `/app/customers` | `web/src/app/(app)/app/customers/page.tsx` | `[INCOMPLETE]` | Good UI surface; data is still demo-first. |
| `/app/customers/[customerId]` | `web/src/app/(app)/app/customers/[customerId]/page.tsx` | `[INCOMPLETE]` | Detail experience exists, but notes/interventions/email generation are not complete systems. |
| `/app/analysis` | `web/src/app/(app)/app/analysis/page.tsx` | `[INCOMPLETE]` | Presentation exists; not a full background-job analysis workflow yet. |
| `/app/playbooks` | `web/src/app/(app)/app/playbooks/page.tsx` | `[INCOMPLETE]` | Library/presentation exists; no full condition builder, cooldown engine, or persistent editing. |
| `/app/reports` | `web/src/app/(app)/app/reports/page.tsx` | `[INCOMPLETE]` | Prebuilt report-style UI only; no custom report builder or scheduler. |
| `/app/integrations` | `web/src/app/(app)/app/integrations/page.tsx` | `[INCOMPLETE]` | Status cards exist; real provider connection management is not fully implemented. |
| `/app/team` | `web/src/app/(app)/app/team/page.tsx` | `[INCOMPLETE]` | Member UI exists; no invitation backend or full RBAC admin workflow. |
| `/app/account` | `web/src/app/(app)/app/account/page.tsx` | `[INCOMPLETE]` | Settings shell exists; profile/avatar/password/preferences are not fully wired. |
| `/app/billing` | `web/src/app/(app)/app/billing/page.tsx` | `[INCOMPLETE]` | Strong billing UI shell; depends on legacy billing/session services and demo fallbacks. |
| `/app/admin` | `web/src/app/(app)/app/admin/page.tsx` | `[INCOMPLETE]` | Role-gated UI surface exists; internal admin controls are not fully real. |
| `/app/sessions` | `web/src/app/(app)/app/sessions/page.tsx` | `[INCOMPLETE]` | Session listing UI exists; backend session model is in-memory only. |
| `/app/overview` | `web/src/app/(app)/app/overview/page.tsx` | `OK` | Redirect to `/app/dashboard`. |
| `/app/accounts` | `web/src/app/(app)/app/accounts/page.tsx` | `OK` | Redirect to `/app/customers`. |
| `/app/accounts/[accountId]` | `web/src/app/(app)/app/accounts/[accountId]/page.tsx` | `OK` | Redirect to `/app/customers/[customerId]`. |
| `/app/campaigns` | `web/src/app/(app)/app/campaigns/page.tsx` | `OK` | Redirect to `/app/playbooks`. |
| `/app/settings` | `web/src/app/(app)/app/settings/page.tsx` | `OK` | Redirect to `/app/account`. |
| `404` | `web/src/app/not-found.tsx` | `OK` | Added branded not-found page. |
| `500` | `web/src/app/error.tsx` | `OK` | Added branded global error page. |

### Route Handlers

| Route | File | Status | Notes |
| --- | --- | --- | --- |
| `/auth/demo` | `web/src/app/auth/demo/route.ts` | `[INCOMPLETE]` | Demo login shortcut; useful for preview, not production auth. |
| `/auth/callback` | `web/src/app/auth/callback/route.ts` | `[INCOMPLETE]` | Handles callback path, but overall auth stack is still mid-migration. |
| `/auth/logout` | `web/src/app/auth/logout/route.ts` | `OK` | Clears frontend cookies and redirects. |

### Components

| Component | File | Status | Notes |
| --- | --- | --- | --- |
| `AppShell` | `web/src/components/app-shell.tsx` | `OK` | Main shell now builds correctly. |
| `AuthFormCard` | `web/src/components/auth-form-card.tsx` | `[INCOMPLETE]` | Production-style forms exist, but OAuth and full backend auth integration are incomplete. |
| `BillingPanel` | `web/src/components/billing-panel.tsx` | `[INCOMPLETE]` | Rich UI; still consumes demo billing data and fallback sessions. |
| `BrandLogo` | `web/src/components/brand-logo.tsx` | `OK` | Anchoryn icon/lockup component. |
| `AccountTable` | `web/src/components/account-table.tsx` | `[INCOMPLETE]` | Strong seeded table UI; no real TanStack table integration yet. |
| `CampaignBoard` | `web/src/components/campaign-board.tsx` | `[INCOMPLETE]` | Interactions still optimistic/demo-heavy. |
| `Charts` | `web/src/components/charts.tsx` | `[INCOMPLETE]` | Visual layer exists; no lazy loading/data-query abstraction yet. |
| `WorkspacePreview` | `web/src/components/workspace-preview.tsx` | `[INCOMPLETE]` | Excellent preview component, but tied to demo summary data. |
| `SiteHeader` | `web/src/components/site-header.tsx` | `OK` | Branded primary nav. |
| `SiteFooter` | `web/src/components/site-footer.tsx` | `[INCOMPLETE]` | Newsletter form is visual only; no submission backend. |
| `ThemeToggle` | `web/src/components/theme-toggle.tsx` | `OK` | Persistent theme preference exists. |
| `SignInPanel` | `web/src/components/signin-panel.tsx` | `[INCOMPLETE]` | Legacy Supabase magic-link component; no longer aligned with backend-owned auth direction. |

## 2. Backend Inventory

### Main FastAPI Endpoints

| Endpoint | File | Status | Notes |
| --- | --- | --- | --- |
| `GET /` | `engine/main.py` | `OK` | Root health/metadata response. |
| `GET /health` | `engine/main.py` | `OK` | Basic health endpoint. |
| `GET /health/detailed` | `engine/main.py` | `[INCOMPLETE]` | Returns static memory-backed status, not real dependency checks. |
| `POST /webhooks/stripe` | `engine/main.py` | `[INCOMPLETE]` | Legacy passthrough route. |
| `POST /create-checkout-session` | `engine/main.py` | `[INCOMPLETE]` | Legacy billing shortcut; not canonical API design. |
| `POST /train` | `engine/main.py` | `[INCOMPLETE]` | Legacy training endpoint with local sample data. |
| `POST /predict` | `engine/main.py` | `[INCOMPLETE]` | Legacy public prediction endpoint without tenant/session model. |
| `POST /generate-retention-campaign` | `engine/main.py` | `[INCOMPLETE]` | Legacy campaign generation endpoint. |

### Legacy Workspace API (`/v1`)

| Endpoint | File | Status | Notes |
| --- | --- | --- | --- |
| `GET /v1/health` | `engine/api.py` | `OK` | Simple health endpoint. |
| `GET /v1/dashboard/summary` | `engine/api.py` | `[INCOMPLETE]` | Backed by in-memory state. |
| `GET /v1/accounts` | `engine/api.py` | `[INCOMPLETE]` | Legacy naming preserved for compatibility. |
| `GET /v1/accounts/{account_id}` | `engine/api.py` | `[INCOMPLETE]` | Legacy naming preserved for compatibility. |
| `GET /v1/accounts/{account_id}/timeline` | `engine/api.py` | `[INCOMPLETE]` | In-memory timeline data. |
| `POST /v1/accounts/{account_id}/score` | `engine/api.py` | `[INCOMPLETE]` | Deterministic preview scoring. |
| `POST /v1/accounts/{account_id}/campaigns/generate` | `engine/api.py` | `[INCOMPLETE]` | Preview campaign generation. |
| `POST /v1/campaigns/{campaign_id}/deploy` | `engine/api.py` | `[INCOMPLETE]` | Preview deploy flow. |
| `GET /v1/playbooks` | `engine/api.py` | `[INCOMPLETE]` | In-memory playbooks. |
| `GET /v1/integrations/status` | `engine/api.py` | `[INCOMPLETE]` | Hybrid live/mock integration status. |
| `POST /v1/billing/checkout-session` | `engine/api.py` | `[INCOMPLETE]` | Works only when Stripe is configured; otherwise demo fallback. |
| `POST /v1/billing/portal-session` | `engine/api.py` | `[INCOMPLETE]` | Same limitation as checkout. |
| `POST /v1/webhooks/stripe` | `engine/api.py` | `[INCOMPLETE]` | Uses current lightweight webhook handling. |

### New Platform API (`/api/v1`)

| Endpoint | File | Status | Notes |
| --- | --- | --- | --- |
| `POST /api/v1/auth/signup` | `engine/platform_api.py` | `[INCOMPLETE]` | Creates in-memory user/org only. |
| `POST /api/v1/auth/login` | `engine/platform_api.py` | `[INCOMPLETE]` | Issues cookies from in-memory session store. |
| `POST /api/v1/auth/logout` | `engine/platform_api.py` | `[INCOMPLETE]` | Clears cookies but does not revoke current server session. |
| `POST /api/v1/auth/refresh` | `engine/platform_api.py` | `[INCOMPLETE]` | Refresh rotation exists, but storage is still in memory. |
| `POST /api/v1/auth/forgot-password` | `engine/platform_api.py` | `[INCOMPLETE]` | No real email delivery; preview token only in non-production. |
| `POST /api/v1/auth/reset-password` | `engine/platform_api.py` | `[INCOMPLETE]` | Works only against in-memory token store. |
| `POST /api/v1/auth/verify-email` | `engine/platform_api.py` | `[INCOMPLETE]` | Works only against in-memory token store. |
| `POST /api/v1/auth/resend-verification` | `engine/platform_api.py` | `[INCOMPLETE]` | No real email provider yet. |
| `GET /api/v1/auth/oauth/{provider}` | `engine/platform_api.py` | `[PLACEHOLDER]` | Returns “unconfigured” message only. |
| `GET /api/v1/auth/oauth/{provider}/callback` | `engine/platform_api.py` | `[PLACEHOLDER]` | Callback stub only. |
| `GET /api/v1/auth/sessions` | `engine/platform_api.py` | `[INCOMPLETE]` | Sessions are preview-grade and in memory. |
| `DELETE /api/v1/auth/sessions/{id}` | `engine/platform_api.py` | `[INCOMPLETE]` | Works in memory only. |
| `POST /api/v1/auth/sessions/revoke-all` | `engine/platform_api.py` | `[INCOMPLETE]` | Works in memory only. |
| `POST /api/v1/organizations/switch` | `engine/platform_api.py` | `[INCOMPLETE]` | Rotates access token only; not full cookie/session switch. |
| `POST /api/v1/customers` | `engine/platform_api.py` | `[INCOMPLETE]` | Creates customer in in-memory workspace state. |
| `GET /api/v1/customers` | `engine/platform_api.py` | `[INCOMPLETE]` | Offset pagination exists, but data is preview-backed. |
| `GET /api/v1/customers/{id}` | `engine/platform_api.py` | `[INCOMPLETE]` | Preview-backed. |
| `PATCH /api/v1/customers/{id}` | `engine/platform_api.py` | `[BROKEN]` | Accepts arbitrary dict payload and mutates matching attributes without strict allowlist validation. |
| `DELETE /api/v1/customers/{id}` | `engine/platform_api.py` | `[INCOMPLETE]` | Hard delete from in-memory list; no soft deletes. |
| `POST /api/v1/customers/{id}/events` | `engine/platform_api.py` | `[INCOMPLETE]` | Preview event insertion only. |
| `GET /api/v1/customers/{id}/events` | `engine/platform_api.py` | `[INCOMPLETE]` | Preview event list only. |
| `GET /api/v1/customers/{id}/prediction` | `engine/platform_api.py` | `[INCOMPLETE]` | Calls deterministic preview scoring. |
| `POST /api/v1/customers/{id}/predict` | `engine/platform_api.py` | `[INCOMPLETE]` | Same limitation. |
| `GET /api/v1/reports/churn-summary` | `engine/platform_api.py` | `[INCOMPLETE]` | Summary only; not a full reporting engine. |
| `GET /api/v1/reports/at-risk` | `engine/platform_api.py` | `[INCOMPLETE]` | Derived from preview state. |
| `GET /api/v1/reports/revenue-impact` | `engine/platform_api.py` | `[INCOMPLETE]` | Derived from preview state. |
| `POST /api/v1/webhooks` | `engine/platform_api.py` | `[INCOMPLETE]` | In-memory storage only. |
| `GET /api/v1/webhooks` | `engine/platform_api.py` | `[INCOMPLETE]` | In-memory storage only. |
| `DELETE /api/v1/webhooks/{id}` | `engine/platform_api.py` | `[INCOMPLETE]` | In-memory storage only. |

## 3. Hardcoded, Mocked, Seeded, or Dummy Data

### Seeded and Mock Sources

- `web/src/lib/mock-data.ts`
  - Large Anchoryn-branded seeded dataset for marketing stats, pricing, team members, sessions, invoices, reports, integrations, customers, playbooks, campaigns, and timeline.
- `engine/seed_data.py`
  - Full demo workspace seed state, demo customers, campaigns, playbooks, integrations, and timeline.
- `engine/auth_store.py`
  - Seeded demo organization, user, password, memberships, and public API key.
- `web/src/lib/api.ts`
  - Falls back to demo state when live API calls fail or when `NEXT_PUBLIC_API_BASE_URL` is missing.
- `web/src/lib/auth.ts`
  - Falls back to demo session and still has a Supabase compatibility path.

### Hardcoded Sensitive or Semi-Sensitive Values

- `engine/auth_store.py`
  - Seeded preview password: `Anchoryn!123`
  - Seeded API key: `ank_live_demo_51f8b9c1`
- `engine/config.py`
  - Default JWT secret: `anchoryn-development-secret`
- Various files still contain fallback local URLs like `http://localhost:3000` and `http://localhost:8000/v1`.

### TODO / Placeholder Scan

- No active `TODO`, `FIXME`, `XXX`, or `HACK` markers were found in tracked source files.
- Placeholder behavior still exists even without TODO comments:
  - OAuth routes are stubbed.
  - Newsletter signup is not wired.
  - Email flows are token previews only.
  - Billing, reporting, onboarding, and integrations are partial experience layers on top of preview services.
- `web/README.md` is still the default `create-next-app` README at the time of audit and must be replaced or pointed to project docs.

## 4. Security Findings

### Critical / High Priority

1. `[BROKEN]` `engine/config.py`
   - `AUTH_JWT_SECRET` has an insecure hardcoded development fallback.
   - Production should fail fast if the secret is missing instead of silently using a default.

2. `[BROKEN]` `engine/platform_api.py`
   - `PATCH /api/v1/customers/{id}` accepts an unvalidated `dict[str, Any]` and mutates matching attributes directly.
   - This is too permissive for a production API and bypasses schema-level field allowlists.

3. `[INCOMPLETE]` `engine/platform_api.py`
   - Cookie-authenticated state-changing routes do not implement CSRF protection.
   - `SameSite=Lax` helps, but it is not a full CSRF defense for a production SaaS.

4. `[INCOMPLETE]` `engine/auth_store.py` and `engine/platform_api.py`
   - Auth, refresh tokens, session tracking, verification tokens, password-reset tokens, API keys, rate limits, and org memberships are all stored in process memory.
   - Restarting the app drops state, and horizontal scaling would break behavior.

5. `[INCOMPLETE]` `engine/main.py`
   - Legacy endpoints like `/predict`, `/generate-retention-campaign`, and `/train` still exist outside the canonical `/api/v1` surface and do not share the new org-scoped auth model.

### Medium Priority

6. `[INCOMPLETE]` `engine/platform_api.py`
   - `POST /api/v1/auth/logout` clears cookies but does not revoke the active refresh token/session server-side.

7. `[INCOMPLETE]` `engine/platform_api.py`
   - OAuth routes are stubs and do not perform provider redirects, state validation, or account linking.

8. `[INCOMPLETE]` `engine/main.py`
   - Security headers are present, but CSP is minimal and not yet tailored to actual asset/script needs.

9. `[INCOMPLETE]` `engine/platform_api.py`
   - Rate limiting exists only for selected routes and uses in-memory buckets without `Retry-After`.

10. `[INCOMPLETE]` `engine/main.py`
    - No structured JSON logging, request IDs, or Sentry integration are present.

11. `[INCOMPLETE]` `engine/platform_api.py`
    - API key authentication exists, but keys are seeded preview values rather than persisted org-managed credentials.

12. `[INCOMPLETE]` `engine/database.py`
    - The database abstraction is still pseudo-persistent/demo-oriented and not a real relational data layer with migrations.

## 5. Performance Findings

1. `[INCOMPLETE]` `web/src/lib/mock-data.ts`
   - Large seeded datasets are loaded into multiple pages and components, increasing bundle and render cost.

2. `[INCOMPLETE]` `web/src/components/workspace-preview.tsx`
   - Demo-heavy preview UI is reused on marketing and dashboard surfaces, which increases initial render work.

3. `[INCOMPLETE]` `web/src/lib/api.ts`
   - No query caching or request deduplication layer is used yet, even though `@tanstack/react-query` is installed.

4. `[INCOMPLETE]` `engine/state.py` and `engine/auth_store.py`
   - In-memory storage prevents realistic production scaling and makes performance characteristics misleading.

5. `[INCOMPLETE]` `engine/main.py`
   - Health checks do not actually probe dependencies such as database, Redis, queue, email, or Stripe.

6. `[INCOMPLETE]` Frontend broadly
   - Charts and app surfaces are not yet split behind query-driven loading boundaries or skeleton loaders backed by real async data.

## 6. What Is Broken, Placeholder, Missing, or Incomplete

### Broken

- `PATCH /api/v1/customers/{id}` input model is too permissive and bypasses strict validation.
- Production auth still depends on preview-grade in-memory state, which means sessions/tokens are not durable.

### Placeholder

- OAuth provider endpoints.
- `web/README.md`.
- API docs playground experience at `/docs/api` is explanatory rather than interactive.

### Missing

- Real database schema + migrations system.
- Persistent organizations/users/sessions/reporting/integration storage.
- Real email delivery system and templates.
- Real queue/worker infrastructure.
- Real Stripe customer portal/invoice sync persistence.
- Real audit log persistence.
- Real public API docs playground backed by live OpenAPI examples.

### Incomplete

- Onboarding flow.
- Team/invitation management.
- Billing lifecycle.
- Reports and exports.
- Integrations management.
- Admin controls.
- PWA/offline support.
- i18n.
- Structured observability.

## 7. Immediate Remediation Priorities

1. Replace in-memory auth/session/org/customer state with a real database-backed model.
2. Remove or fully gate the legacy unauthenticated endpoints in `engine/main.py`.
3. Replace permissive `PATCH /api/v1/customers/{id}` payload handling with a strict schema.
4. Enforce production env validation for secrets, URLs, Stripe, and email credentials.
5. Implement real email sending, verification, reset, and invitation delivery.
6. Replace placeholder OAuth routes with full Google/GitHub flows.
7. Add structured logging, request IDs, Sentry, and durable audit logs.
8. Move seeded preview mode behind explicit development/demo flags only.

## 8. Verification Snapshot

The following checks passed during this audit session:

- `web`: `npm run build`
- `web`: `npm run lint`
- `web`: `npm audit` -> `0 vulnerabilities`
- `engine`: `python -m unittest discover -s tests -v`

This audit report reflects the repository after stabilizing the Anchoryn frontend build and removing the currently reported `npm audit` vulnerabilities.
