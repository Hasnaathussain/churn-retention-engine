# Changelog

## v1.0.0 - 2026-03-31

Initial Anchoryn production-launch foundation release.

- Rebranded the product from Synapse to Anchoryn across metadata, UI, and brand assets.
- Added Anchoryn SVG logo assets for light and dark usage.
- Rebuilt the marketing site around Anchoryn messaging, pricing, legal pages, demo entry points, and API docs navigation.
- Added persistent light/dark theme controls and shared brand styling.
- Expanded the app shell into dashboard, customers, analysis, playbooks, reports, integrations, team, account, billing, admin, and sessions surfaces.
- Added branded 404, 500, 403, and maintenance pages.
- Added new backend `/api/v1` product/auth/customer/report/webhook API surface.
- Added preview auth/session handling with Argon2 password hashing and JWT-based access tokens.
- Added organization switching, session listing, and password reset / verification preview flows.
- Added security headers to frontend and backend responses.
- Removed the currently reported frontend `npm audit` vulnerabilities.
- Produced `AUDIT.md` documenting current gaps, risks, and next priorities.
- Replaced placeholder documentation with Anchoryn-focused project docs.
