# Deployment

## Recommended Split Deployment

- Frontend: Vercel, root `web/`
- Backend: Railway/Render/Fly, root `engine/`

## Frontend

1. Import repo to Vercel.
2. Set root directory to `web`.
3. Add frontend environment variables.
4. Deploy.

## Backend

1. Deploy `engine/` as a Python service.
2. Set backend environment variables.
3. Start with `uvicorn main:app --host 0.0.0.0 --port 8000`.

## Before Going Live

- Replace the default JWT secret.
- Disable demo mode.
- Replace preview auth/session stores with a database.
- Wire Stripe, email, and real OAuth.
- Configure exact CORS origins.
- Add Sentry and structured logging.

## Current Warning

The repo can be deployed today as a polished preview or internal beta, but it still needs database, email, queue, and OAuth completion before it should be treated as a fully hardened paid-production SaaS.
