# Payments Phase A Design

## Goal

Launch the first real payment layer for STL-Musicians.com with Stripe-backed subscriptions and paid promotion checkout. Booking payments, musician payouts, and Stripe Connect onboarding remain outside this phase so the platform can validate billing and promotion payment operations before moving marketplace funds between parties.

## Scope

This phase includes:

- Stripe Billing checkout for paid musician subscription tiers.
- Stripe Checkout for one-time paid promotion purchases.
- Stripe webhook fulfillment as the source of truth for payment state.
- Neon-backed storage for customers, subscriptions, checkout sessions, and promotion payment state.
- Dashboard billing visibility for musicians and payment visibility for admins.
- Stripe Customer Portal access for subscription management.

This phase excludes:

- Stripe Connect connected-account onboarding.
- Destination charges, transfers, or musician payouts.
- Booking escrow, split payments, cancellation policies, or payout timing.
- Custom card forms or raw card handling.

## Current Repo Context

The repo already has planning-level subscription content in `src/lib/subscription-plans.ts`:

- `Basic Trial`, free for 60 days.
- `Song Tier`, currently modeled at `$19/month` or `$190/year`.
- `Album Tier`, currently modeled at `$39/month` or `$390/year`.
- `paymentArchitecture` already distinguishes Stripe Billing subscriptions from future Stripe Connect marketplace payments.

The current pricing page is informational only. There is no Stripe SDK dependency, no checkout action, no webhook route, no billing persistence, and no route handlers under `src/app/api`.

Next.js 16 route handlers and Server Functions are supported in this app. Payment mutations must verify authentication and authorization server-side because Server Functions and route handlers can be invoked directly.

## Payment Architecture

Use Stripe Checkout Sessions for all Phase A customer-facing payments:

- `mode: "subscription"` for Song and Album tiers.
- `mode: "payment"` for one-time paid promotion purchases.
- Stripe-hosted checkout for Phase A to minimize PCI and UI complexity.
- Stripe Customer Portal for subscription changes, cancellations, and payment method updates.

Use Stripe webhooks for fulfillment:

- Checkout success redirects may show a confirmation screen, but they must not unlock paid state by themselves.
- The webhook route verifies the raw request body with `STRIPE_WEBHOOK_SECRET`.
- The webhook updates Neon records for subscription state, promotion payment state, and checkout session history.

Use the latest Stripe Node SDK and configure the client with API version `2026-02-25.clover`.

## Environment Variables

Required server variables:

- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `DATABASE_URL`
- `CLERK_SECRET_KEY`

Required public variables:

- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

Optional price variables:

- `STRIPE_PRICE_SONG_MONTHLY`
- `STRIPE_PRICE_SONG_YEARLY`
- `STRIPE_PRICE_ALBUM_MONTHLY`
- `STRIPE_PRICE_ALBUM_YEARLY`

The app should fail closed for payment actions when required Stripe variables are missing. Public pages can still render pricing content, but checkout forms should route through server-side validation instead of exposing broken links.

## Data Model

Add relational records for payment state:

- Stripe customer mapping keyed by Clerk user id and email.
- Stripe subscription state keyed by Stripe subscription id and internal plan id.
- Stripe checkout session records for idempotency and auditability.
- Promotion payment records connected to promotion campaign records where available.

Subscription state should store:

- Clerk user id.
- Stripe customer id.
- Stripe subscription id.
- Internal plan id.
- Billing interval.
- Status.
- Current period dates when provided by Stripe.
- Cancellation flags when provided by Stripe.

Promotion payment state should store:

- Clerk user id.
- Promotion package id or label.
- Stripe checkout session id.
- Stripe payment intent id when available.
- Amount, currency, and status.
- Created and updated timestamps.

## User Flows

### Subscription Checkout

1. A signed-in musician opens `/pricing`.
2. The user selects Song or Album and monthly or yearly billing.
3. A Server Function validates the plan, interval, Clerk user, Stripe env, and app URL.
4. The Server Function creates or reuses a Stripe customer for the Clerk user.
5. The Server Function creates a Stripe Checkout Session in subscription mode.
6. The user completes checkout on Stripe.
7. Stripe redirects to a success route, but paid state remains pending until webhook confirmation.
8. The webhook records the subscription and updates dashboard-visible billing state.

### Customer Portal

1. A signed-in user opens dashboard billing.
2. If a Stripe customer exists, a Server Function creates a Customer Portal session.
3. The user manages payment method, cancellation, or subscription changes in Stripe.
4. Stripe webhooks update local state after changes.

### Paid Promotion Checkout

1. A signed-in musician selects a paid promotion package.
2. A Server Function validates the package, user, and optional campaign context.
3. The Server Function creates a Stripe Checkout Session in payment mode.
4. The webhook marks the promotion payment as paid and updates the related campaign to `paid` when a campaign id is present.

## Dashboard and Admin Behavior

Musician dashboard billing should show:

- Current plan name.
- Subscription status.
- Billing interval when known.
- Trial/free state when no paid subscription exists.
- Manage billing action when a Stripe customer exists.

Admin dashboard should show:

- Active and non-active subscription summaries.
- Paid and pending promotion payments.
- Failed, canceled, or incomplete payment states that need attention.

The admin view can start as a compact read-only operational panel. It does not need refund controls, manual overrides, or detailed ledger exports in Phase A.

## Security and Failure Handling

Payment actions must:

- Require a signed-in Clerk user.
- Validate the user role where the action is role-specific.
- Validate plan ids, billing intervals, promotion ids, and campaign ids against server-owned data.
- Avoid trusting client-provided prices or Stripe price ids.
- Store idempotent records keyed by Stripe event id or checkout session id.

Webhook handling must:

- Read the request body as raw text.
- Verify the Stripe signature.
- Return a 400 response for invalid signatures.
- Ignore duplicate events safely.
- Handle unknown event types without failing the endpoint.

## Testing Strategy

Add tests for:

- Plan-to-price environment mapping.
- Checkout input validation.
- Missing Stripe environment handling.
- Webhook event routing helpers where extractable.
- Dashboard billing display using mocked payment state.
- Pricing page rendering real paid plans and promotion checkout affordances.

Run the existing verification path before deployment:

- `npm test`
- `npm run typecheck`
- `npm run lint`
- `npm run build`

## Rollout

1. Add Stripe SDK and payment configuration helpers.
2. Extend Drizzle schema for billing and promotion payment state.
3. Add checkout and portal Server Functions.
4. Add Stripe webhook route.
5. Update pricing and dashboard UI.
6. Add tests.
7. Verify locally using the repo's reserved ports `3006-3007`.
8. Configure Stripe/Vercel env vars.
9. Deploy to production and verify live routes.

## Open Decisions Deferred to Connect Phase

The following decisions are intentionally deferred:

- Whether STL-Musicians or connected musicians are merchant of record for bookings.
- Connected account responsibilities, dashboard type, and liability model.
- Platform fee percentage or fixed fee for booking payments.
- Payout timing, refund rules, cancellation policy, and dispute ownership.
