# GEO Audit Report: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com
**Local Repo:** D:\Dev\STL-Musicians-Website
**Business Type:** Local music discovery, artist promotion, venue/promoter marketplace
**Pages Analyzed:** 18 discovered by `llmstxt_generator.py`; 8 representative public pages fetched directly; 9 local routes checked

## Executive Summary

STL-Musicians.com is crawlable, indexable, and structurally healthy at the basic technical layer: homepage, robots, sitemap, key public routes, metadata, and H1s all return correctly. The GEO gap is not access; it is machine understanding and citation quality. The site currently lacks `llms.txt`, canonical links, homepage/root Organization and WebSite schema, and strong answer-ready content blocks that AI systems can quote or summarize confidently.

The quick GEO/SEO script scored the live site `76/good`, but the fuller GEO score below is `63/100` because it weights citability, entity clarity, and structured data more heavily than a basic technical crawl.

## Implementation Update

After this audit, the first recommended implementation batch was completed locally:

- Added curated `public/llms.txt`.
- Added canonical metadata for root, public index/legal routes, and artist profile routes.
- Added sanitized Organization and WebSite JSON-LD through the shared root layout.
- Updated artist profile JSON-LD to use the same safe serializer and include profile URL plus booking context.

Local verification now shows `/llms.txt` returns `200` and validates with title, description, sections, and links. Live production will still show the original audit state until these changes are deployed.

## Score Breakdown

| Category | Score | Weight | Notes |
| --- | ---: | ---: | --- |
| AI citability and visibility | 62 | 25% | Crawler access is open, but `llms.txt` is missing and the homepage citability scorer averaged only `20.5`. |
| Brand authority and entity signals | 58 | 20% | Name, contact, phone, location, and operator exist in source, but there is no homepage Organization/LocalBusiness schema or sameAs profile map. |
| Content quality and E-E-A-T | 60 | 20% | Pages are clear and useful, but many sections are short launch copy rather than self-contained answer blocks with durable proof. |
| Technical foundations | 82 | 15% | Homepage, key routes, robots, sitemap, metadata, and H1s are healthy; canonical links are missing. |
| Structured data | 45 | 10% | Artist profile pages include `MusicGroup` JSON-LD, but homepage and index pages do not have Organization, WebSite, ItemList, Event, Venue, or pricing schema. |
| Platform optimization | 72 | 10% | OpenAI, Anthropic, Perplexity, and Google crawler access is open; platform-specific discoverability is held back by missing `llms.txt`, schema, and citable summaries. |

**Composite GEO Score:** `63/100`

## Findings

### Critical

- None found.

### High

#### Missing llms.txt

Evidence: `https://stl-musicians.com/llms.txt` returns `404`; local `http://localhost:3006/llms.txt` also returns `404`.

Impact: AI agents that look for `llms.txt` receive no curated public map of the site. The raw generator found useful pages but also included dashboard/login routes, so a curated version is required.

Safest implementation path: copy `docs/geo/llms.generated.txt` into `public/llms.txt`, keep private/auth/checkout routes out, then validate local and live `/llms.txt`.

#### Missing homepage/root entity schema

Evidence: quick audit found `schema_block_count: 0` on the homepage. Live and local checks show no JSON-LD on `/`, `/musicians`, `/events`, `/venues`, `/about`, `/contact`, or `/pricing`. Artist profile pages do include JSON-LD.

Impact: Search engines and AI crawlers must infer the site entity, operator, locality, contact points, and platform purpose from prose alone.

Safest implementation path: add a small sanitized JSON-LD component and render Organization or LocalBusiness plus WebSite schema from `siteConfig` in `src/app/layout.tsx` or the homepage.

### Medium

#### Canonical links are missing

Evidence: live checks on `/`, `/musicians`, `/events`, `/venues`, `/about`, `/contact`, `/pricing`, and `/musicians/riverfront-brass-union` all returned `CanonicalPresent = False`.

Impact: The proxy enforces `stl-musicians.com`, but HTML still lacks explicit canonical signals for search and AI retrieval systems.

Safest implementation path: add `alternates.canonical` to root and route metadata, including dynamic artist profile canonical URLs.

#### Homepage citability is weak

Evidence: `citability_scorer.py` analyzed two homepage content blocks, both graded `F`, with average citability `20.5`.

Impact: The site is visually clear, but AI systems have limited self-contained passages to cite for questions like "What is STL-Musicians.com?" or "How do musicians use it?"

Safest implementation path: add concise answer-ready sections to the homepage, About, Musicians, Venues, and Pricing pages. Do not keyword-stuff; make each block useful to a human and independently understandable.

#### Structured data is too narrow

Evidence: `src/app/musicians/[slug]/page.tsx` renders `MusicGroup` JSON-LD, but only with name, genre, areaServed, and description. Other public page types have no schema.

Impact: Artist entities are partially described, but the broader marketplace, event list, venue list, organization, and pricing surface are opaque to structured parsers.

Safest implementation path: expand artist schema with URL and booking context, add ItemList schema to musician/venue/event indexes, and only add Event schema where the event details are real enough to support it.

### Low

#### Image alt review needed

Evidence: quick audit reported `4` images and `2` missing alt values on the homepage.

Impact: Some empty alt text is correct for decorative background imagery, but meaningful visual assets should be described.

Safest implementation path: review every `next/image` use. Keep decorative hero overlays as `alt=""`; add descriptive alt only where the image conveys content.

#### Sitemap entries lack priority and change frequency

Evidence: live sitemap includes all expected public URLs, but each entry only has `loc` and `lastmod`.

Impact: This is not a blocker, but priority and change frequency can make the sitemap more expressive for crawlers.

Safest implementation path: add `changeFrequency` and `priority` to `src/app/sitemap.ts`, following Next.js `MetadataRoute.Sitemap`.

## ChatGPT Visibility

Access is open. `OAI-SearchBot`, `GPTBot`, and `ChatGPT-User` all received homepage `200` and robots `200`. The strongest next improvements for ChatGPT search are keeping `OAI-SearchBot` allowed, adding `llms.txt`, adding canonical URLs, and adding citable answer blocks.

## Claude Visibility

Access is open. `ClaudeBot`, `Claude-User`, and `Claude-SearchBot` all received homepage `200` and robots `200`. The strongest next improvements for Claude visibility are maintaining access for `Claude-SearchBot` and `Claude-User`, adding `llms.txt`, and improving short self-contained explanations of the platform, artists, venues, and promotion model.

## Perplexity Visibility

Access is open. `PerplexityBot` received homepage `200` and robots `200`. Perplexity-style visibility should benefit from stronger citable sections, clear page titles/descriptions, and public profile pages with concise facts.

## Gemini Visibility

Access is open. `Googlebot`, `GoogleOther`, and `Google-Extended` all received homepage `200` and robots `200`. `Google-Extended` controls Gemini/Vertex training and grounding usage, while Google Search visibility depends on Googlebot-accessible content, canonical URLs, metadata, content quality, and structured data.

## Google AI Overview Visibility

There is no separate public "Google AI Overview crawler" to optimize for in the same way as a robots token. Treat Google AI Overview readiness as Google Search readiness plus extractable, trustworthy answer content. Current blockers are missing canonicals, weak entity schema, and limited answer-ready content.

## Quick Wins

1. Publish curated `public/llms.txt` from `docs/geo/llms.generated.txt`.
2. Add canonical URLs through App Router metadata.
3. Add sanitized Organization or LocalBusiness plus WebSite JSON-LD.
4. Expand artist `MusicGroup` JSON-LD with `url`, `areaServed`, and booking/service context.
5. Add one concise "What STL-Musicians.com is" answer block to the homepage and About page.
6. Review hero and visual image alt behavior so decorative images are intentionally empty and meaningful images are descriptive.

## 30-Day Plan

1. Week 1: Implement `llms.txt`, canonical metadata, homepage/root schema, and schema tests.
2. Week 1: Run `npm run lint`, `npm run typecheck`, `npm test`, `npm run build`, local route checks, and live GEO quick audit after deploy.
3. Week 2: Add ItemList schema for musicians, venues, and events, using only current real page data.
4. Week 2: Improve homepage, About, Musicians, Events, Venues, and Pricing content with short citable summaries.
5. Week 3: Add entity profile fields to `siteConfig`, including sameAs URLs only after official profiles exist.
6. Week 4: Re-run the GEO audit, compare score movement, and decide whether to add `llms-full.txt`.

## Recommended Next Implementation Batch

1. Add `public/llms.txt` using the curated draft.
2. Add canonical metadata to root, static public routes, and artist profile routes.
3. Add a sanitized JSON-LD helper plus homepage Organization/WebSite schema.

## Tests To Run After Implementation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Local route checks on `http://localhost:3006`
- `python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty`
- `python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" validate`

## Appendix

### Pages Checked

- `https://stl-musicians.com/`
- `https://stl-musicians.com/musicians`
- `https://stl-musicians.com/events`
- `https://stl-musicians.com/venues`
- `https://stl-musicians.com/about`
- `https://stl-musicians.com/contact`
- `https://stl-musicians.com/pricing`
- `https://stl-musicians.com/musicians/riverfront-brass-union`
- `https://stl-musicians.com/robots.txt`
- `https://stl-musicians.com/sitemap.xml`
- `https://stl-musicians.com/llms.txt`

### Local Routes Checked

- `http://localhost:3006/`
- `http://localhost:3006/musicians`
- `http://localhost:3006/musicians/riverfront-brass-union`
- `http://localhost:3006/events`
- `http://localhost:3006/venues`
- `http://localhost:3006/about`
- `http://localhost:3006/contact`
- `http://localhost:3006/robots.txt`
- `http://localhost:3006/sitemap.xml`
- `http://localhost:3006/llms.txt`

### Commands Run

```powershell
git status --short
npm pkg get scripts dependencies.next
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" validate
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" generate
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\citability_scorer.py" "https://stl-musicians.com"
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\brand_scanner.py" "STL-Musicians.com" "stl-musicians.com"
Invoke-WebRequest -Uri "https://stl-musicians.com/robots.txt" -UseBasicParsing
Invoke-WebRequest -Uri "https://stl-musicians.com/sitemap.xml" -UseBasicParsing
```

### Fetch Failures

- `https://stl-musicians.com/llms.txt`: `404`
- `http://localhost:3006/llms.txt`: `404`

### Assumptions

- The public contact values in `src/lib/content.ts` are authoritative: `contact@stl-musicians.com`, `(573) 500-0064`, and `St. Louis, MO`.
- Dashboard, sign-in, sign-up, role-login, checkout, and admin routes should not be listed in `llms.txt`.
- Google AI Overview readiness should be treated as Google Search readiness plus structured, trustworthy, answer-ready content.
