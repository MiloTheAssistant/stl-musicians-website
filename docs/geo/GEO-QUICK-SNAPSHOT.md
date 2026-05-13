# GEO Quick Snapshot: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com
**Local Repo:** D:\Dev\STL-Musicians-Website

## Technical Snapshot

- Homepage status: `200`
- Final URL: `https://stl-musicians.com`
- Content type: `text/html; charset=utf-8`
- Robots status: `200`
- Sitemap status: `200`
- Sitemap URL count hint: `15`
- llms.txt status: `404`
- Title: `STL-Musicians.com | St. Louis Music Discovery`
- Meta description: `Where St. Louis musicians, venues, and fans connect.`
- Open Graph title: `STL-Musicians.com`
- Twitter card: `summary_large_image`
- H1 count: `1`
- JSON-LD blocks on homepage: `0`
- Internal link count: `18`
- External link count: `2`
- Image count: `4`
- Images missing alt text: `2`
- Word count: `411`
- Quick GEO/SEO score: `76`
- Quick rating: `good`

## Immediate Findings

### Critical

- None found in the quick live scan.

### High

- Homepage has no JSON-LD schema. Add Organization, WebSite, and page-specific schema so AI/search systems can identify the platform, operator, contact points, locality, and site purpose.

### Medium

- `https://stl-musicians.com/llms.txt` returns `404`. Add a curated public `llms.txt` that points AI agents to the public discovery pages, artist profiles, contact details, and platform context.
- Canonical links are not detected on key pages. The proxy redirects to the canonical host, but page HTML should still emit explicit canonical URLs.
- Homepage citability is weak. The citability scorer analyzed two homepage content blocks, both graded `F`, with an average citability score of `20.5`.

### Low

- The quick audit flagged two images with empty alt text. These may be decorative background images, but they should be reviewed so meaningful images have descriptive alt text and decorative images remain intentionally empty.

## Heading Snapshot

- H1: `Where St. Louis musicians, venues, and fans connect.`
- H2: `The St. Louis music scene, all in one place.`
- H2: `Find the sound. Book the room. Build the scene.`
- H2: `Upcoming STL signals`
- H2: `Curated, not scraped into dust.`
- H2: `Every St. Louis stage starts with the right connection.`

## Raw Commands

```powershell
npm pkg get scripts dependencies.next
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\geo_quick_audit.py" "https://stl-musicians.com" --pretty
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\citability_scorer.py" "https://stl-musicians.com"
```

## Source Notes

- `package.json` confirms Next.js `16.2.4` with `lint`, `typecheck`, `test`, and `build` scripts.
- The local dev server was already running at `http://localhost:3006`.
- Local `/llms.txt` also returns `404`, matching production.
