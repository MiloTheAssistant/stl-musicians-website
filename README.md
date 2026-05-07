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

## Stack

- Next.js App Router
- TypeScript and Tailwind CSS
- Clerk-ready role auth
- Drizzle schema for Neon Postgres
- Vercel Blob, Resend, and Stripe reserved for later phases
