# STL-Musicians.com

St. Louis metro music discovery, promotion, and future booking platform.

## Local Development

STL-Musicians-Website uses the reserved local port range `3006-3007`.

- Primary dev URL: `http://127.0.0.1:3006`
- Alternate local URL: `http://127.0.0.1:3007`
- Full workspace map: [docs/local-port-map.md](docs/local-port-map.md)

```bash
npm install
npm run dev -- --hostname 127.0.0.1 --port 3006
```

Use the alternate port only after stopping any existing `next dev` process for this repo:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3007
```

## Verification

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

## Stripe Payments

Phase A payments use Stripe Checkout for subscriptions and paid promotions, plus
Stripe webhooks for fulfillment.

Required local and Vercel environment variables:

```bash
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
STRIPE_PRICE_SONG_MONTHLY=
STRIPE_PRICE_SONG_YEARLY=
STRIPE_PRICE_ALBUM_MONTHLY=
STRIPE_PRICE_ALBUM_YEARLY=
```

Configure the Stripe webhook endpoint to:

```text
https://stl-musicians.com/api/webhook/stripe
```

For local webhook testing on the reserved primary dev port:

```bash
npm run dev -- --hostname 127.0.0.1 --port 3006
stripe listen --forward-to http://127.0.0.1:3006/api/webhook/stripe
```

Apply the Neon schema before using checkout in production:

```bash
npm run db:push
```

## Stack

- Next.js App Router
- TypeScript and Tailwind CSS
- Clerk-ready role auth
- Drizzle schema for Neon Postgres
- Vercel Blob, Resend, and Stripe reserved for later phases
