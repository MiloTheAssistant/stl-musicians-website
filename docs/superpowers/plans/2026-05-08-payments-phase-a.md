# Payments Phase A Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Stripe-hosted subscription checkout, one-time paid promotion checkout, webhook fulfillment, and dashboard/admin payment visibility for STL-Musicians.com.

**Architecture:** Use Stripe Checkout Sessions for subscription and promotion payments, Stripe Customer Portal for subscription management, and a verified webhook route as the source of truth. Store local payment state in Neon through Drizzle tables while keeping booking payouts and Stripe Connect out of this phase.

**Tech Stack:** Next.js 16 App Router, React 19, Clerk, Stripe Node SDK, Drizzle ORM, Neon Postgres, Vitest.

---

## File Structure

- Modify `package.json` and `package-lock.json`: add the server-side `stripe` SDK.
- Modify `.env.example`: document required Stripe price variables.
- Modify `src/db/schema.ts`: add Stripe customer, subscription, checkout session, and promotion payment tables.
- Create `src/lib/payment-products.ts`: server-owned subscription price mapping, billing intervals, promotion product definitions, and formatting helpers.
- Create `src/lib/payment-products.test.ts`: unit tests for plan, price, and promotion validation.
- Create `src/lib/stripe-client.ts`: Stripe client initialization and environment validation.
- Create `src/lib/payment-records.ts`: Drizzle persistence helpers used by actions and webhooks.
- Create `src/lib/stripe-webhooks.ts`: event handling logic that can be tested without constructing a route request.
- Create `src/app/api/webhook/stripe/route.ts`: raw-body Stripe webhook verification endpoint.
- Create `src/app/pricing/actions.ts`: Server Functions for subscription checkout, promotion checkout, and billing portal redirects.
- Modify `src/app/pricing/page.tsx`: replace future-state pricing copy with real checkout forms.
- Create `src/app/pricing/page.test.ts`: render-level tests for paid tiers and promotion checkout affordances.
- Modify `src/app/dashboard/[role]/page.tsx`: show musician billing state and admin payment operations summary.
- Modify `src/app/dashboard/[role]/page.test.ts`: verify billing/admin payment sections.
- Modify `README.md`: add Stripe setup and webhook notes.

## Task 1: Payment Product Configuration

**Files:**
- Create: `src/lib/payment-products.ts`
- Create: `src/lib/payment-products.test.ts`

- [ ] **Step 1: Write failing tests for subscription and promotion products**

Expected tests:

```ts
expect(getSubscriptionPriceId("song", "monthly", env)).toBe("price_song_monthly");
expect(() => getSubscriptionPriceId("basic", "monthly", env)).toThrow("Basic Trial");
expect(getPromotionProductById("song-release").amountCents).toBeGreaterThan(0);
```

- [ ] **Step 2: Implement product helpers**

Create typed helpers for:

```ts
export type BillingInterval = "monthly" | "yearly";
export type PaidSubscriptionPlanId = "song" | "album";
export function getPaidSubscriptionPlans(): SubscriptionPlan[];
export function getSubscriptionPriceId(planId: SubscriptionPlanId, interval: BillingInterval, env?: NodeJS.ProcessEnv): string;
export function getPromotionProductById(id: string): PromotionProduct;
export function formatCents(cents: number): string;
```

- [ ] **Step 3: Run the targeted tests**

Run: `npm test -- src/lib/payment-products.test.ts`

Expected: all tests in that file pass.

## Task 2: Stripe Client and Database Schema

**Files:**
- Modify: `.env.example`
- Modify: `src/db/schema.ts`
- Create: `src/lib/stripe-client.ts`

- [ ] **Step 1: Add tests only if pure validation is extracted**

Keep environment validation simple and deterministic:

```ts
export function getStripeConfig(env = process.env) {
  if (!env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is required");
  if (!env.NEXT_PUBLIC_APP_URL) throw new Error("NEXT_PUBLIC_APP_URL is required");
  return { secretKey: env.STRIPE_SECRET_KEY, appUrl: env.NEXT_PUBLIC_APP_URL };
}
```

- [ ] **Step 2: Add schema tables**

Add tables for:

```ts
stripeCustomers
stripeSubscriptions
stripeCheckoutSessions
promotionPayments
```

Use unique constraints on Stripe customer id, subscription id, and checkout session id. Store Clerk user id directly because Clerk is the current source of authentication identity.

- [ ] **Step 3: Add env documentation**

Add these variables to `.env.example`:

```env
STRIPE_PRICE_SONG_MONTHLY=
STRIPE_PRICE_SONG_YEARLY=
STRIPE_PRICE_ALBUM_MONTHLY=
STRIPE_PRICE_ALBUM_YEARLY=
```

## Task 3: Payment Persistence and Webhook Handling

**Files:**
- Create: `src/lib/payment-records.ts`
- Create: `src/lib/stripe-webhooks.ts`
- Create: `src/app/api/webhook/stripe/route.ts`

- [ ] **Step 1: Implement persistence helpers**

Create functions for:

```ts
recordCheckoutSession(...)
upsertSubscriptionFromStripe(...)
recordPromotionPaymentFromCheckout(...)
getBillingSummaryForUser(...)
getPaymentOperationsSummary(...)
```

- [ ] **Step 2: Implement webhook event routing**

Handle:

```ts
checkout.session.completed
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
```

Ignore unknown events after returning a received response.

- [ ] **Step 3: Implement route handler**

Use raw text and signature verification:

```ts
const body = await request.text();
const signature = request.headers.get("stripe-signature");
const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
```

Return `400` for missing/invalid signatures.

## Task 4: Checkout and Portal Server Functions

**Files:**
- Create: `src/app/pricing/actions.ts`

- [ ] **Step 1: Implement authenticated checkout actions**

Create:

```ts
export async function createSubscriptionCheckout(formData: FormData): Promise<void>;
export async function createPromotionCheckout(formData: FormData): Promise<void>;
export async function createCustomerPortalSession(): Promise<void>;
```

- [ ] **Step 2: Validate all client inputs server-side**

Read only server-owned prices and product definitions. Never trust client-provided amount, currency, or Stripe price ids.

## Task 5: Pricing and Dashboard UI

**Files:**
- Modify: `src/app/pricing/page.tsx`
- Create: `src/app/pricing/page.test.ts`
- Modify: `src/app/dashboard/[role]/page.tsx`
- Modify: `src/app/dashboard/[role]/page.test.ts`

- [ ] **Step 1: Replace future-state pricing UI**

Show:

```txt
Basic Trial
Song Tier
Album Tier
Paid promotion packages
```

Paid tiers should render checkout forms with monthly and yearly buttons. Promotion packages should render one-time checkout buttons.

- [ ] **Step 2: Add dashboard billing and admin payment panels**

Musician dashboard should show active plan/status. Admin dashboard should show compact subscription and promotion payment operations summaries.

- [ ] **Step 3: Run render tests**

Run:

```bash
npm test -- src/app/pricing/page.test.ts src/app/dashboard/[role]/page.test.ts
```

Expected: pricing and dashboard tests pass.

## Task 6: Verification, Commit, and Deployment Readiness

**Files:**
- Modify: `README.md`

- [ ] **Step 1: Add README setup notes**

Document Stripe price variables, webhook route `/api/webhook/stripe`, and reserved local dev port `3006`.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm test
npm run typecheck
npm run lint
npm run build
```

Expected: all commands exit 0.

- [ ] **Step 3: Commit implementation**

Commit with:

```bash
git add .
git commit -m "feat: add stripe subscriptions and promotion checkout"
```

- [ ] **Step 4: Production setup**

Before production checkout can be used, configure Stripe products/prices, set Vercel env vars, and configure Stripe webhook delivery to:

```txt
https://stl-musicians.com/api/webhook/stripe
```
