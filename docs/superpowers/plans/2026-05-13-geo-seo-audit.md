# STL-Musicians GEO SEO Audit Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Use the Codex GEO/SEO auditor skill to audit `https://stl-musicians.com`, check AI crawler access, draft `llms.txt`, and produce a prioritized GEO improvement plan for the Next.js site.

**Architecture:** This is audit-first. Run the live URL checks and local Next.js source inspection before editing public files. Store evidence and recommendations under `docs/geo/`; only promote changes such as `public/llms.txt`, metadata, schema, `robots.ts`, or `sitemap.ts` after the audit findings justify them.

**Tech Stack:** Next.js 16.2.4 App Router, React 19, TypeScript, Vitest, ESLint, Vercel, Codex `geo-seo-auditor` skill scripts, PowerShell.

---

## Scope

Audit target:

- Live site: `https://stl-musicians.com`
- Local checkout: `D:\Dev\STL-Musicians-Website`
- Normal local dev port: `3006`
- Alternate/preview/debug port: `3007`

AI visibility targets:

- ChatGPT: `OAI-SearchBot`, `GPTBot`, `ChatGPT-User`
- Claude: `ClaudeBot`, `Claude-User`, `Claude-SearchBot`
- Perplexity: `PerplexityBot`
- Gemini / Google AI surfaces: `Googlebot`, `GoogleOther`, `Google-Extended`
- Google AI Overview: evaluate through Google Search crawl/index foundations, page quality, answer extraction, structured data, and entity clarity. Do not treat Google AI Overview as a separate controllable crawler.

Current Next.js docs already reviewed for this plan:

- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/robots.md`
- `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/sitemap.md`
- `node_modules/next/dist/docs/01-app/02-guides/json-ld.md`

External platform docs to re-check during execution because crawler behavior changes:

- OpenAI crawler docs: `https://developers.openai.com/api/docs/bots`
- Anthropic crawler docs: `https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler`
- Perplexity robots.txt docs: `https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt`
- Google common crawlers: `https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers`

## Expected Artifacts

- Create: `docs/geo/GEO-QUICK-SNAPSHOT.md`
- Create: `docs/geo/GEO-AUDIT-REPORT.md`
- Create: `docs/geo/AI-CRAWLER-ACCESS.md`
- Create: `docs/geo/llms.generated.txt`
- Create if implementation is approved: `public/llms.txt`
- Modify only if implementation is approved: `src/app/robots.ts`
- Modify only if implementation is approved: `src/app/sitemap.ts`
- Modify only if implementation is approved: `src/app/layout.tsx`
- Modify only if implementation is approved: `src/app/page.tsx`
- Modify only if implementation is approved: `src/app/about/page.tsx`
- Modify only if implementation is approved: `src/app/musicians/page.tsx`
- Modify only if implementation is approved: `src/app/musicians/[slug]/page.tsx`
- Modify only if implementation is approved: `src/app/events/page.tsx`
- Modify only if implementation is approved: `src/app/venues/page.tsx`
- Modify only if implementation is approved: `src/app/contact/page.tsx`
- Modify only if implementation is approved: `src/lib/content.ts`
- Create if implementation is approved: `src/lib/seo.ts`
- Create if implementation is approved: `src/lib/seo.test.ts`
- Create if implementation is approved: `src/components/json-ld.tsx`

## Task 1: Baseline Repo And Live Site Context

**Files:**

- Read: `package.json`
- Read: `src/lib/content.ts`
- Read: `src/app/layout.tsx`
- Read: `src/app/robots.ts`
- Read: `src/app/sitemap.ts`
- Read: `src/app/**/page.tsx`
- Create: `docs/geo/GEO-QUICK-SNAPSHOT.md`

- [ ] **Step 1: Confirm clean starting state**

Run:

```powershell
git status --short
```

Expected: Either no output or only unrelated user work. Do not revert unrelated changes.

- [ ] **Step 2: Confirm scripts and Next version**

Run:

```powershell
npm pkg get scripts dependencies.next
```

Expected: includes `lint`, `typecheck`, `test`, `build`, and `next` equal to `16.2.4`.

- [ ] **Step 3: Run the no-dependency GEO quick audit**

Run:

```powershell
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty
```

Expected: command exits `0` and returns JSON evidence for homepage fetch, `robots.txt`, `sitemap.xml`, `llms.txt`, metadata, headings, schema hints, links, images, findings, and score.

- [ ] **Step 4: Save a human-readable quick snapshot**

Create `docs/geo/GEO-QUICK-SNAPSHOT.md` with:

```markdown
# GEO Quick Snapshot: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com
**Local Repo:** D:\Dev\STL-Musicians-Website

## Technical Snapshot

- Homepage status:
- Robots status:
- Sitemap status:
- llms.txt status:
- Title:
- Meta description:
- H1 count:
- JSON-LD blocks:
- Internal link count:
- Image alt coverage:

## Immediate Findings

### Critical

### High

### Medium

### Low

## Raw Command

`python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty`
```

Expected: every blank field is filled from the quick audit output before moving on.

## Task 2: AI Crawler Access Audit

**Files:**

- Read: live `https://stl-musicians.com/robots.txt`
- Read: live `https://stl-musicians.com/sitemap.xml`
- Create: `docs/geo/AI-CRAWLER-ACCESS.md`

- [ ] **Step 1: Fetch robots.txt with a normal user agent**

Run:

```powershell
Invoke-WebRequest -Uri "https://stl-musicians.com/robots.txt" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected:

- HTTP `200`
- Plain robots directives, not HTML
- `Sitemap: https://stl-musicians.com/sitemap.xml`
- No accidental `Disallow: /` for `User-agent: *`

- [ ] **Step 2: Test the AI crawler user-agent paths**

Run:

```powershell
$agents = @(
  "OAI-SearchBot",
  "GPTBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "PerplexityBot",
  "Googlebot",
  "GoogleOther",
  "Google-Extended"
)

foreach ($agent in $agents) {
  $home = Invoke-WebRequest -Uri "https://stl-musicians.com/" -Headers @{ "User-Agent" = $agent } -UseBasicParsing -MaximumRedirection 5
  $robots = Invoke-WebRequest -Uri "https://stl-musicians.com/robots.txt" -Headers @{ "User-Agent" = $agent } -UseBasicParsing -MaximumRedirection 5
  [pscustomobject]@{
    Agent = $agent
    HomeStatus = $home.StatusCode
    RobotsStatus = $robots.StatusCode
    HomeContentType = $home.Headers["Content-Type"]
    RobotsContentType = $robots.Headers["Content-Type"]
  }
}
```

Expected:

- Homepage status is `200` for each agent.
- `robots.txt` status is `200` for each agent.
- No agent receives a bot-block page, CAPTCHA page, login page, or `403`.

- [ ] **Step 3: Check sitemap availability**

Run:

```powershell
Invoke-WebRequest -Uri "https://stl-musicians.com/sitemap.xml" -UseBasicParsing | Select-Object -ExpandProperty Content
```

Expected:

- HTTP `200`
- XML includes homepage, `/musicians`, `/events`, `/venues`, `/about`, `/contact`, `/pricing`, `/privacy`, `/terms`, and each `artistProfiles` slug from `src/lib/content.ts`.

- [ ] **Step 4: Write crawler access findings**

Create `docs/geo/AI-CRAWLER-ACCESS.md` with:

```markdown
# AI Crawler Access: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com

## Summary

| Platform | User-Agent Token | Access Result | Visibility Meaning | Action |
| --- | --- | --- | --- | --- |
| ChatGPT Search | OAI-SearchBot |  |  |  |
| OpenAI Training | GPTBot |  |  |  |
| ChatGPT User Fetch | ChatGPT-User |  |  |  |
| Claude Training | ClaudeBot |  |  |  |
| Claude User Fetch | Claude-User |  |  |  |
| Claude Search | Claude-SearchBot |  |  |  |
| Perplexity | PerplexityBot |  |  |  |
| Google Search / AIO base | Googlebot |  |  |  |
| Google generic fetch | GoogleOther |  |  |  |
| Gemini / Vertex control | Google-Extended |  |  |  |

## Robots.txt Evidence

```txt
Paste the live robots.txt response here.
```

## Sitemap Evidence

- Sitemap status:
- Sitemap URL count:
- Missing expected URLs:
```

Expected: table cells are filled with actual fetch results and source-doc interpretation.

## Task 3: Generate And Validate llms.txt

**Files:**

- Create: `docs/geo/llms.generated.txt`
- Create if approved: `public/llms.txt`

- [ ] **Step 1: Check current live llms.txt**

Run:

```powershell
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" validate
```

Expected: JSON reports whether `https://stl-musicians.com/llms.txt` exists, whether it has a title, description, sections, and links, and whether `llms-full.txt` exists.

- [ ] **Step 2: Generate an llms.txt draft from the live site**

Run:

```powershell
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" generate
```

Expected: JSON includes `generated_llmstxt`, `generated_llmstxt_full`, `pages_analyzed`, and section data.

- [ ] **Step 3: Create a curated draft**

Create `docs/geo/llms.generated.txt` with this shape, replacing page notes with verified page summaries from the audit:

```markdown
# STL-Musicians.com

> STL-Musicians.com is a St. Louis music discovery and promotion platform connecting musicians, bands, venues, promoters, small venues, and fans.

## Core Pages

- [Home](https://stl-musicians.com/): Overview of the St. Louis music discovery platform and launch portals.
- [Musicians](https://stl-musicians.com/musicians): Browse featured St. Louis artist and band profiles by genre, home base, and booking focus.
- [Events](https://stl-musicians.com/events): Upcoming St. Louis music events and showcase listings.
- [Venues](https://stl-musicians.com/venues): Local venue discovery and room-fit context.
- [About](https://stl-musicians.com/about): Platform background, purpose, and St. Louis market focus.
- [Contact](https://stl-musicians.com/contact): Contact path for musicians, venues, promoters, and platform inquiries.
- [Pricing](https://stl-musicians.com/pricing): Current platform and promotion package options.

## Artist Profiles

- [Riverfront Brass Union](https://stl-musicians.com/musicians/riverfront-brass-union): Jazz collective based in Soulard.
- [North Side Current](https://stl-musicians.com/musicians/north-side-current): Hip-Hop project based in North City.
- [Red Clay Revival](https://stl-musicians.com/musicians/red-clay-revival): Country project based in Metro East.
- [Arc Light Saints](https://stl-musicians.com/musicians/arc-light-saints): Rock band based in The Grove.
- [Blue Hour Confessional](https://stl-musicians.com/musicians/blue-hour-confessional): Blues act based in Benton Park.
- [Lo-Fi Arch Session](https://stl-musicians.com/musicians/lofi-arch-session): EDM / DJ project based in Downtown West.

## Contact

- Email: contact@stl-musicians.com
- Phone: (573) 500-0064
- Location: St. Louis, MO
```

Expected:

- Keep it factual and navigational.
- Do not include private dashboard routes, auth pages, secrets, or admin-only content.
- Use exact public contact values from `siteConfig`.

- [ ] **Step 4: If implementation is approved, publish llms.txt**

Copy the curated contents into `public/llms.txt`.

Expected after local dev starts:

```powershell
Invoke-WebRequest -Uri "http://localhost:3006/llms.txt" -UseBasicParsing | Select-Object -ExpandProperty Content
```

The response is plain text and starts with `# STL-Musicians.com`.

## Task 4: Local Next.js GEO Source Audit

**Files:**

- Read: `src/app/layout.tsx`
- Read: `src/app/page.tsx`
- Read: `src/app/about/page.tsx`
- Read: `src/app/musicians/page.tsx`
- Read: `src/app/musicians/[slug]/page.tsx`
- Read: `src/app/events/page.tsx`
- Read: `src/app/venues/page.tsx`
- Read: `src/app/contact/page.tsx`
- Read: `src/app/robots.ts`
- Read: `src/app/sitemap.ts`
- Read: `src/lib/content.ts`
- Create: `docs/geo/GEO-AUDIT-REPORT.md`

- [ ] **Step 1: Inventory metadata exports**

Run:

```powershell
rg -n "export const metadata|generateMetadata|openGraph|twitter|alternates|canonical|application/ld\\+json|robots|sitemap" src
```

Expected: captures root metadata in `src/app/layout.tsx`, dynamic artist metadata in `src/app/musicians/[slug]/page.tsx`, existing JSON-LD in artist profiles, and route handlers for `robots.ts` and `sitemap.ts`.

- [ ] **Step 2: Inventory public pages and private pages**

Run:

```powershell
rg --files src\app | rg "page\.tsx$"
```

Expected: public pages are separated from auth/dashboard pages. The audit should recommend public crawl improvements for marketing/discovery pages only; dashboard and sign-in routes should not be added to `llms.txt`.

- [ ] **Step 3: Inspect generated page HTML locally**

Start local dev:

```powershell
npm run dev -- -p 3006
```

In a second PowerShell session, run:

```powershell
$routes = @(
  "/",
  "/musicians",
  "/musicians/riverfront-brass-union",
  "/events",
  "/venues",
  "/about",
  "/contact",
  "/robots.txt",
  "/sitemap.xml"
)

foreach ($route in $routes) {
  $response = Invoke-WebRequest -Uri "http://localhost:3006$route" -UseBasicParsing -MaximumRedirection 5
  [pscustomobject]@{
    Route = $route
    Status = $response.StatusCode
    TitlePresent = $response.Content -match "<title>"
    DescriptionPresent = $response.Content -match 'name="description"'
    JsonLdPresent = $response.Content -match 'application/ld\+json'
    H1Present = $response.Content -match "<h1"
  }
}
```

Expected:

- Public routes return `200`.
- Each HTML page has an H1.
- Key pages have title and meta description.
- Artist profile routes include JSON-LD.
- `/robots.txt` and `/sitemap.xml` return generated text/XML content.

- [ ] **Step 4: Write the audit report**

Create `docs/geo/GEO-AUDIT-REPORT.md` with:

```markdown
# GEO Audit Report: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com
**Local Repo:** D:\Dev\STL-Musicians-Website
**Business Type:** Local music discovery, artist promotion, venue/promoter marketplace
**Pages Analyzed:**

## Executive Summary

## Score Breakdown

| Category | Score | Weight | Notes |
| --- | ---: | ---: | --- |
| AI citability and visibility |  | 25% |  |
| Brand authority and entity signals |  | 20% |  |
| Content quality and E-E-A-T |  | 20% |  |
| Technical foundations |  | 15% |  |
| Structured data |  | 10% |  |
| Platform optimization |  | 10% |  |

## Findings

### Critical

### High

### Medium

### Low

## ChatGPT Visibility

## Claude Visibility

## Perplexity Visibility

## Gemini Visibility

## Google AI Overview Visibility

## Quick Wins

## 30-Day Plan

## Appendix

- Pages checked:
- Commands run:
- Fetch failures:
- Assumptions:
```

Expected: no blank fields remain. Every finding includes evidence, impact, and recommended implementation path.

## Task 5: GEO Improvement Plan For Approved Implementation

**Files:**

- Modify if approved: `src/lib/content.ts`
- Create if approved: `src/lib/seo.ts`
- Create if approved: `src/components/json-ld.tsx`
- Modify if approved: `src/app/layout.tsx`
- Modify if approved: `src/app/**/page.tsx`
- Modify if approved: `src/app/robots.ts`
- Modify if approved: `src/app/sitemap.ts`
- Create if approved: `public/llms.txt`
- Create if approved: `src/lib/seo.test.ts`

- [ ] **Step 1: Prioritize fixes from the audit**

Use this order unless the audit reveals a critical blocker:

1. `public/llms.txt` with curated public routes.
2. Page-specific metadata for `/about`, `/musicians`, `/events`, `/venues`, `/contact`, and `/pricing`.
3. Sanitized JSON-LD helper using `JSON.stringify(value).replace(/</g, "\\u003c")`.
4. Organization or LocalBusiness JSON-LD on the home/root surface using exact `siteConfig` values.
5. MusicGroup JSON-LD upgrades on artist profile pages with URL, area served, same site canonical URL, and booking context.
6. Sitemap `changeFrequency`, `priority`, and artist page coverage if missing or weak.
7. Robots policy changes only if current access blocks desired AI/search visibility.
8. Content upgrades to add concise answer blocks, entity facts, and citability summaries on key public pages.

Expected: each recommended fix maps to a finding in `GEO-AUDIT-REPORT.md`.

- [ ] **Step 2: Define implementation tests before editing**

Expected tests for approved implementation:

```powershell
npm run lint
npm run typecheck
npm test
npm run build
```

Expected: all commands exit `0`.

- [ ] **Step 3: Define route-level verification after editing**

Expected local route checks:

```powershell
npm run dev -- -p 3006
```

Then:

```powershell
$routes = @(
  "/",
  "/about",
  "/musicians",
  "/musicians/riverfront-brass-union",
  "/events",
  "/venues",
  "/contact",
  "/pricing",
  "/robots.txt",
  "/sitemap.xml",
  "/llms.txt"
)

foreach ($route in $routes) {
  $response = Invoke-WebRequest -Uri "http://localhost:3006$route" -UseBasicParsing -MaximumRedirection 5
  [pscustomobject]@{
    Route = $route
    Status = $response.StatusCode
    HasTitle = $route -match "\.txt|\.xml" -or $response.Content -match "<title>"
    HasDescription = $route -match "\.txt|\.xml" -or $response.Content -match 'name="description"'
    HasJsonLd = $route -in @("/", "/musicians/riverfront-brass-union") -and $response.Content -match 'application/ld\+json'
  }
}
```

Expected:

- All listed routes return `200`.
- `/llms.txt` starts with `# STL-Musicians.com`.
- `/robots.txt` includes the sitemap URL.
- `/sitemap.xml` includes each public route and musician slug.
- Home and artist profile pages include valid JSON-LD.

- [ ] **Step 4: Define post-deploy tests if publishing is requested**

Run after deployment:

```powershell
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" validate
```

Expected:

- Quick audit score improves or critical/high issues are resolved.
- Live `llms.txt` validates with title, description, sections, and links.
- Live robots and sitemap still return `200`.
- No private dashboard, sign-in, or sign-up pages are exposed in `llms.txt`.

## Task 6: Final Handoff

**Files:**

- Update: `docs/geo/GEO-AUDIT-REPORT.md`
- Update: `docs/geo/AI-CRAWLER-ACCESS.md`
- Update: `docs/geo/GEO-QUICK-SNAPSHOT.md`
- Update: `docs/geo/llms.generated.txt`

- [ ] **Step 1: Summarize decisions**

Add a final section to `docs/geo/GEO-AUDIT-REPORT.md`:

```markdown
## Recommended Next Implementation Batch

1.
2.
3.

## Tests To Run After Implementation

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run build`
- Local route checks on `http://localhost:3006`
- Live GEO quick audit after deploy
```

Expected: the next implementation batch is small enough to complete and verify in one pass.

- [ ] **Step 2: Report completion**

Final response should include:

- Audit artifacts created.
- Top critical/high findings.
- Whether `llms.txt` already exists live.
- Whether AI crawler access is open or blocked.
- Recommended implementation batch.
- Tests run and any tests not run.
