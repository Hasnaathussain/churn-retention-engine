# Billing

## Pricing Model

- Starter: `$49/month` or `$470/year`
- Growth: `$149/month` or `$1,430/year`
- Scale: `$399/month` or `$3,830/year`
- Enterprise: custom

## Current Implementation

- Pricing is represented in the frontend mock data.
- Billing UI exists in the Anchoryn app.
- Backend helper endpoints exist for checkout and portal session creation.
- Stripe webhooks are handled through `/v1/webhooks/stripe`.

## Current Gaps

- No persistent subscription table
- No invoice sync persistence
- No real plan enforcement middleware
- No production dunning workflows
- No usage metering

## Production Billing Target

- Stripe Checkout for new subscriptions
- Stripe Customer Portal for self-service management
- Durable subscription sync via webhooks
- Plan-based feature gates and usage limits
- Invoice history persisted per organization
