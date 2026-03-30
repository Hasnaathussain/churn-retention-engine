# Authentication

## Current Flow

1. User signs up or logs in through the Anchoryn auth form.
2. Backend issues an access token and refresh token.
3. Both tokens are stored in HttpOnly cookies.
4. Protected frontend routes read session context server-side.
5. `/api/v1/auth/refresh` rotates refresh tokens.

## Current Strengths

- Argon2 password hashing
- JWT access tokens
- Refresh token rotation logic exists
- Session listing and revocation endpoints exist
- Email verification and reset-token flows exist in preview form

## Current Gaps

- Session store is in memory
- No CSRF protection
- OAuth is not implemented
- Logout does not revoke the current session server-side
- No persistent multi-organization membership storage yet

## Production Auth Target

- Database-backed users, memberships, sessions, reset tokens, and verification tokens
- Secure cookie strategy across `app.` and `api.` subdomains
- Real Google and GitHub OAuth with account linking
- Device/session metadata with revoke-all capability
- Audit logging for auth-sensitive events
