# Security Policy

## Reporting a Vulnerability

If you discover a security issue in Anchoryn, do not open a public issue with exploit details. Report it privately to the maintainer or security contact for the project and include:

- A clear description of the vulnerability
- Steps to reproduce it
- Impact assessment
- Any relevant logs or screenshots

## Data Collected and Stored

The current repository is a launch-foundation build and may process:

- User profile data such as name and email
- Organization metadata
- Customer/account metadata and health signals
- Session metadata such as IP address and device information
- Billing metadata when Stripe is connected
- Integration configuration metadata

The current preview build still uses in-memory stores for some of this data and should not be treated as a final audited production persistence model.

## Data Retention Policy

Recommended production policy:

- Auth/session logs: 30 to 90 days
- Audit logs: at least 1 year
- Billing records: per legal/accounting requirements
- Customer analytics and churn signals: per contract and privacy policy
- Deleted account/org data: remove or anonymize after export and grace-period windows

## GDPR / Right to Erasure

Before public launch, implement a documented deletion flow that:

- Verifies the requester
- Exports requested data when required
- Deletes or anonymizes user, org, session, customer, and audit-linked data where legally permitted
- Preserves only records that must be retained for billing, fraud, or compliance reasons

## Security Measures Currently in Place

- Frontend and backend security headers
- HttpOnly cookies for auth tokens
- Argon2 password hashing
- JWT-based access token handling
- Rate limiting on selected routes
- Environment-variable-based secret loading
- Frontend dependency audit currently clean

## Security Gaps Still Open

- No persistent database-backed auth/session store yet
- No CSRF protection on cookie-authenticated write routes
- OAuth is still placeholder-only
- No structured audit log storage
- No Sentry integration
- No Redis-backed rate limiting or session/cache store
- No full secret rotation runbook implemented in code
