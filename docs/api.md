# API Reference

## Base URLs

- Legacy compatibility API: `/v1`
- Product API: `/api/v1`

## Response Shape

Success:

```json
{
  "success": true,
  "data": {},
  "meta": {}
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "example_code",
    "message": "Human-readable message",
    "details": {}
  }
}
```

## Authentication

- Cookie-based auth for frontend users
- Bearer API keys for selected API consumers

## Product API Endpoints

### Auth

- `POST /api/v1/auth/signup`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `POST /api/v1/auth/refresh`
- `POST /api/v1/auth/forgot-password`
- `POST /api/v1/auth/reset-password`
- `POST /api/v1/auth/verify-email`
- `POST /api/v1/auth/resend-verification`
- `GET /api/v1/auth/oauth/{provider}`
- `GET /api/v1/auth/oauth/{provider}/callback`
- `GET /api/v1/auth/sessions`
- `DELETE /api/v1/auth/sessions/{id}`
- `POST /api/v1/auth/sessions/revoke-all`
- `POST /api/v1/organizations/switch`

### Customers

- `POST /api/v1/customers`
- `GET /api/v1/customers`
- `GET /api/v1/customers/{id}`
- `PATCH /api/v1/customers/{id}`
- `DELETE /api/v1/customers/{id}`
- `POST /api/v1/customers/{id}/events`
- `GET /api/v1/customers/{id}/events`
- `GET /api/v1/customers/{id}/prediction`
- `POST /api/v1/customers/{id}/predict`

### Reports

- `GET /api/v1/reports/churn-summary`
- `GET /api/v1/reports/at-risk`
- `GET /api/v1/reports/revenue-impact`

### Webhooks

- `POST /api/v1/webhooks`
- `GET /api/v1/webhooks`
- `DELETE /api/v1/webhooks/{id}`

## Example Requests

```bash
curl http://localhost:8000/api/v1/customers \
  -H "Authorization: Bearer ank_live_demo_51f8b9c1"
```

```bash
curl -X POST http://localhost:8000/api/v1/customers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ank_live_demo_51f8b9c1" \
  -d '{"name":"Northlane","email":"ops@northlane.com","company":"Northlane","plan":"Growth","mrr":4200}'
```

## Known Limitations

- Some endpoints are backed by preview state instead of a database.
- OAuth endpoints are placeholders.
- `PATCH /api/v1/customers/{id}` still needs a strict schema.
