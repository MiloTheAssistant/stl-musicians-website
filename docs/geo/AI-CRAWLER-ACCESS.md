# AI Crawler Access: STL-Musicians.com

**Audit Date:** 2026-05-13
**Target:** https://stl-musicians.com

## Summary

All tested crawler-style user agents received the public homepage and live robots file successfully. The current robots policy is broad and permissive:

```txt
User-Agent: *
Allow: /

Sitemap: https://stl-musicians.com/sitemap.xml
```

| Platform | User-Agent Token | Access Result | Visibility Meaning | Action |
| --- | --- | --- | --- | --- |
| ChatGPT Search | `OAI-SearchBot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | OpenAI documents this bot as the crawler used to surface sites in ChatGPT search answers. | Keep allowed. Improve page schema, canonical URLs, and citable answer blocks. |
| OpenAI Training | `GPTBot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | OpenAI documents this bot as training-oriented, independent from `OAI-SearchBot`. | Keep allowed if model-training inclusion is desired. |
| ChatGPT User Fetch | `ChatGPT-User` | Homepage `200`; robots `200`; allowed by `User-agent: *` | OpenAI documents this as user-triggered access, not automatic search crawling. | Keep public pages accessible; do not expose private dashboard routes in `llms.txt`. |
| Claude Training | `ClaudeBot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Anthropic documents this bot as model-training oriented. | Keep allowed if Anthropic model-training inclusion is desired. |
| Claude User Fetch | `Claude-User` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Anthropic documents this as user-directed fetch support. | Keep public pages accessible for user-directed research. |
| Claude Search | `Claude-SearchBot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Anthropic documents this bot as search-result-quality crawling. | Keep allowed to preserve Claude search visibility. |
| Perplexity | `PerplexityBot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Perplexity documents this bot as search-style indexing that respects robots directives. | Keep allowed. Add `llms.txt` and citable page summaries. |
| Google Search / AIO base | `Googlebot` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Google documents Googlebot as the crawler affecting Google Search features. AI Overview visibility depends on Google Search indexing and content quality rather than a separate public AIO crawler. | Keep allowed. Add canonical URLs, structured data, and stronger answer-ready content. |
| Google generic fetch | `GoogleOther` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Google documents this as a generic crawler used by product teams for public content fetching without a specific product effect. | Keep allowed unless server-load policy changes. |
| Gemini / Vertex control | `Google-Extended` | Homepage `200`; robots `200`; allowed by `User-agent: *` | Google documents this token as a control for Gemini/Vertex model training and grounding usage; it does not affect Google Search ranking. | Keep allowed if Gemini/Vertex inclusion is desired. |

## Robots.txt Evidence

```txt
User-Agent: *
Allow: /

Sitemap: https://stl-musicians.com/sitemap.xml
```

## Sitemap Evidence

- Sitemap status: `200`
- Sitemap URL count: `15`
- Missing expected URLs: none from the current public source list.

```txt
https://stl-musicians.com
https://stl-musicians.com/musicians
https://stl-musicians.com/events
https://stl-musicians.com/venues
https://stl-musicians.com/about
https://stl-musicians.com/contact
https://stl-musicians.com/pricing
https://stl-musicians.com/privacy
https://stl-musicians.com/terms
https://stl-musicians.com/musicians/riverfront-brass-union
https://stl-musicians.com/musicians/north-side-current
https://stl-musicians.com/musicians/red-clay-revival
https://stl-musicians.com/musicians/arc-light-saints
https://stl-musicians.com/musicians/blue-hour-confessional
https://stl-musicians.com/musicians/lofi-arch-session
```

## Commands Run

```powershell
Invoke-WebRequest -Uri "https://stl-musicians.com/robots.txt" -UseBasicParsing
Invoke-WebRequest -Uri "https://stl-musicians.com/sitemap.xml" -UseBasicParsing
python "C:\Users\JDSDirectLLC\.codex\skills\geo-seo-auditor\scripts\llmstxt_generator.py" "https://stl-musicians.com" validate
```

Crawler user-agent fetch matrix:

| Agent | Home Status | Robots Status | Home Content Type | Robots Content Type | Site Content Returned |
| --- | ---: | ---: | --- | --- | --- |
| `OAI-SearchBot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `GPTBot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `ChatGPT-User` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `ClaudeBot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `Claude-User` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `Claude-SearchBot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `PerplexityBot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `Googlebot` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `GoogleOther` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |
| `Google-Extended` | 200 | 200 | `text/html; charset=utf-8` | `text/plain; charset=utf-8` | yes |

## Source References Checked

- OpenAI crawler docs: https://developers.openai.com/api/docs/bots
- Anthropic crawler docs: https://support.claude.com/en/articles/8896518-does-anthropic-crawl-data-from-the-web-and-how-can-site-owners-block-the-crawler
- Perplexity robots.txt docs: https://www.perplexity.ai/help-center/en/articles/10354969-how-does-perplexity-follow-robots-txt
- Google common crawler docs: https://developers.google.com/crawling/docs/crawlers-fetchers/google-common-crawlers
