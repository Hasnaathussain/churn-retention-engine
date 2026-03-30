# Database

## Current State

The repository does not yet have a production relational schema. Preview data is split across:

- `engine/auth_store.py`
- `engine/state.py`
- `engine/seed_data.py`
- `engine/database.py`

That makes the product useful for demos, but not safe for real customer production usage.

## Recommended Core Tables

- `organizations`
- `users`
- `organization_memberships`
- `sessions`
- `oauth_accounts`
- `password_reset_tokens`
- `email_verification_tokens`
- `customers`
- `customer_events`
- `churn_predictions`
- `interventions`
- `intervention_logs`
- `reports`
- `report_runs`
- `report_cache`
- `integrations`
- `api_keys`
- `webhooks`
- `team_invitations`
- `audit_logs`
- `plans`
- `notifications`
- `usage_records`
- `feature_flags`
- `job_runs`

## Indexing Priorities

- All foreign keys
- `org_id` on every org-scoped table
- `email` on user and invitation tables
- `created_at` on event/log/report tables
- `risk_score` on predictions/customers
- Composite indexes for:
  - `org_id + created_at`
  - `org_id + status`
  - `org_id + customer_id`

## Migration Path

1. Introduce SQLAlchemy models alongside the current preview store.
2. Add Alembic migration management.
3. Replace auth/session store first.
4. Replace customer/report/playbook state next.
5. Decommission `engine/state.py` and `engine/auth_store.py` after parity.

## Recommendation

Do not accept real tenant data until the database migration layer exists and the in-memory preview path is no longer the source of truth.
