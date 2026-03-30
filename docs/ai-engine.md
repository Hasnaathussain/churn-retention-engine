# AI Engine

## Current State

Anchoryn currently uses a heuristic churn model plus optional AI-generation hooks for richer language output.

The backend scoring workflow already supports:

- Customer scoring
- Risk probability output
- Timeline and campaign generation helpers
- Optional live OpenAI usage behind env flags

## Suggested Input Features

- `days_since_last_login`
- `login_frequency_30d`
- `feature_usage_score`
- `support_ticket_count`
- `mrr`
- `plan_age_days`
- `billing_failures`
- `nps_score`
- `engagement_trend`

## Current Gaps

- No queue-backed prediction refresh jobs
- No persistent model versioning table
- No report cache for monthly summaries
- No fully implemented explanation/recommendation storage

## Production Direction

- Persist predictions per customer and org
- Add job queue for daily/weekly refreshes
- Separate deterministic scoring from LLM-generated explanation layers
- Add alert dedupe and quiet-hour logic
