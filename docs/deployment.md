# STL-Musicians.com Deployment Notes

## Vercel Setup

1. Link this repository to Vercel with GitHub previews enabled.
2. Add environment variables from `.env.example`.
3. Provision Clerk, Neon Postgres, Vercel Blob, Resend, and Stripe when each phase is ready.
4. Keep production canonical as `https://stl-musicians.com`.

## Domain Cutover

The current apex domain resolves to GoDaddy Website Builder. After preview approval:

1. Add `stl-musicians.com` and `www.stl-musicians.com` to the Vercel project.
2. Set the apex A record to the Vercel-provided value, typically `76.76.21.21`.
3. Set `www` to the Vercel-provided CNAME.
4. Verify SSL, apex canonical redirect, `robots.txt`, `sitemap.xml`, and Open Graph image.

## Verification

Run before every preview or production deploy:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```
