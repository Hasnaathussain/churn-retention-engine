# Integrations

## Current Integrations Surface

The frontend and backend currently account for:

- Stripe
- OpenAI
- Mixpanel
- Intercom
- Resend
- API key access
- Webhooks

## Setup Notes

- Stripe: add secret key, webhook secret, and product price IDs
- OpenAI: add API key and enable live mode
- Supabase: optional compatibility layer for the current auth transition
- Resend: planned for transactional email
- Slack: planned for alert delivery

## Current Gaps

- No full provider credential persistence layer
- No encrypted integration secret storage
- No live connection test flow in the UI
- No HubSpot, Salesforce, Segment, or Zapier implementation yet
