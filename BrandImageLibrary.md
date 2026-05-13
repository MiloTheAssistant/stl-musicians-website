# STL-Musicians Brand Image Library Prompt

Use this prompt to generate and maintain a complete, project-specific brand image library for the STL-Musicians website.

## Project

- Website/project name: STL-Musicians.com
- Website domain: https://stl-musicians.com
- Repo: D:\Dev\STL-Musicians-Website
- Business/location/audience: A St. Louis metro music discovery, promotion, and future booking platform for musicians, bands, promoters, small venues, and fans.
- Current hero image/vibe: High-energy live music scenes with stage lights, local venue atmosphere, crowd movement, and a serious discovery-platform feel.
- Brand tone: Local music scene, credible, direct, active, venue-ready, fan-facing, promoter-aware, working-musician friendly, and St. Louis rooted.
- Brand tagline: Where St. Louis musicians, venues, and fans connect.
- Product codename: StageLink STL
- Brand colors or visual cues: Deep ink `#090907`, stage black `#11110f`, cream `#f5ead2`, muted warm brass `#c8b894`, brass `#b58b2a`, brass light `#d8b765`, oxblood `#4b171c`, river blue `#21314d`, red `#c41e3a`, stars, musical notes, venue light, crowd energy, and useful negative space.
- Destination folder for generated brand-library assets: D:\Dev\STL-Musicians-Website\public\brand

## Current Public Asset Structure

```text
public/
  README.md
  brand/
    README.md
    masters/
      arch-profile-stamp-concepts-contact-sheet.png
      profile-stamp.png
      favicon-source.png
      arch-vinyl-soundwave-alt.png
      arch-star-badge-alt.png
    website/
      profile-stamp.png
    facebook/
    instagram/
    tiktok/
    linkedin/
    x/
    case44/
  file.svg
  globe.svg
  next.svg
  sw.js
  vercel.svg
  window.svg
  images/
    hero-ai-01.png
    hero-ai-02.png
    hero-ai-03.png
    hero-ai-04.png
    stl-musicians-logo.svg
    stl-musicians-mark.png
    stl-musicians-mark.svg
    case44/
      1bdbd8c8-case44-lettered.png
```

The repo keeps wired website imagery in `public/images/`, while reusable brand-library assets live in `public/brand/`.

Do not move existing app-referenced assets unless code references are updated in the same change.

## Goal

Create project-specific image assets that complement the existing live-music hero images and give STL-Musicians a stronger reusable identity across the website and major social platforms.

Use a Hybrid Brand Library:

- One strong Arch-anchored profile stamp/profile image for the primary logo source.
- A related family of platform-native photoreal backgrounds.
- Clean supporting images for website, social covers, posts, stories, and future musician/venue promotion surfaces.

## Proposed `public/brand/README.md` Structure

### Purpose

Make `public/brand/README.md` the source of truth for STL-Musicians brand imagery: the visual lane, available assets, generation rules, approval standards, and current inventory.

### Brand Core

STL-Musicians.com: "Where St. Louis musicians, venues, and fans connect." A St. Louis metro music platform built to help working musicians, bands, promoters, small venues, and fans discover, promote, and book the local scene.

### Balanced Trinity

- Local Scene: St. Louis roots, local rooms, local artists, event energy, real audience connection.
- Working Musician: bands, solo artists, releases, event promotion, profile credibility, and booking readiness.
- Venue Discovery: stages, lights, rooms, posters, crowds, calendars, and promoter-friendly context.
- Platform Trust: clean product surfaces, curated profiles, paid promotion credibility, and a professional hub rather than a loose directory.

### Anti-Slop Standard

Artistic freedom stays inside the Trinity. Technical execution stays disciplined: small source families, standard dimensions, no fake readable text, no fake logos, no watermarks, no unrelated city cliches, no distorted instruments or hands, and no one-off visual gimmicks.

### Quality Rules

Photorealistic, premium, overlay-safe, brand-coherent, no fake UI text, no fake event posters, no stock-photo clutter, and no people as dominant identifiable subjects unless specifically requested. People can appear as performers, crowd silhouettes, or secondary scene context.

### Asset System

Masters, website profile, Facebook, Instagram, TikTok, LinkedIn, and X. Keep a source-family approach so each platform asset feels related instead of one-off.

### Prompt Framework

Use the reusable STL-Musicians prompt framework below, with fields already filled and placeholders only where future asset-specific choices are needed.

### Approval Checklist

Lane, use case, visual quality, technical sizing, crop safety, overlay space, no AI slop, continuity with source family, and fit with Local Scene + Working Musician + Venue Discovery.

### Current Inventory

The current file list from `public/images` and, once created, `public/brand`.

## Required Output

1. A main profile stamp/profile image that works as the primary profile picture.
2. Clean photoreal background assets for:
   - Website
   - Facebook
   - Instagram
   - TikTok
   - LinkedIn
   - X / Twitter
3. Optional featured-band or pilot-workspace assets for Case44, stored under a clearly named subfolder or lane rather than mixed into the core STL-Musicians identity.

## Direction

Use a Hybrid Brand Library approach:

- Lead with the St. Louis Gateway Arch as the local anchor and keep the stage-light visual language.
- Keep the assets visually unified, but compose them for each platform's crop and use case.
- Use St. Louis as a grounded local signal without overusing skyline cliches.
- Treat Case44 as a featured test band/workspace asset, not the entire platform brand.
- Keep the product credible for musicians, promoters, venues, fans, and paid promotion flows.

## Profile Stamp Rules

- Circular-crop safe.
- Strong at small profile-picture sizes.
- Must use the St. Louis Gateway Arch as the primary anchor point.
- May combine the Arch with a musical note, stage light, vinyl, soundwave, microphone, or badge signal.
- Should feel like a premium local music platform stamp, not a generic record-label logo.
- Do not rely on AI-generated readable text.
- No fake words, watermarks, slogans, or detailed typography.
- The selected primary source is `public/brand/masters/profile-stamp.png`.
- The selected favicon source is `public/brand/masters/favicon-source.png`.
- The current app-wired header copy is `public/images/stl-musicians-mark.png`.

## Background Rules

- Clean photoreal backgrounds.
- No embedded text, logos, slogans, posters with fake readable text, or watermarks.
- Leave negative space for future overlays.
- Use real-world scenes connected to local music discovery: stages, soundboards, venue entrances, lights, crowds, instruments, setlists without readable text, green rooms, and performance energy.
- Human presence is welcome, but keep people anonymous or secondary unless specifically requested.
- Avoid distorted hands, warped instruments, unreadable fake posters, clutter, and generic stock-photo energy.

## Folder Structure

Use this brand-library structure for reusable generated assets:

```text
public/brand/
  README.md
  masters/
  website/
  facebook/
  instagram/
  tiktok/
  linkedin/
  x/
  case44/
```

Keep the current app-wired files in `public/images/` unless a code update intentionally moves references.

## Asset Targets

```text
public/brand/masters/profile-stamp.png
public/brand/masters/favicon-source.png
public/brand/masters/arch-profile-stamp-concepts-contact-sheet.png
public/brand/masters/arch-vinyl-soundwave-alt.png
public/brand/masters/arch-star-badge-alt.png
public/brand/masters/source-family-local-scene.png
public/brand/masters/source-family-working-musician.png
public/brand/masters/source-family-venue-discovery.png
public/brand/masters/source-family-platform-trust.png
public/brand/masters/contact-sheet.png

public/brand/website/profile-stamp.png
public/brand/website/hero-background.png
public/brand/website/artist-directory-background.png
public/brand/website/venue-discovery-background.png

public/brand/facebook/profile-stamp.png
public/brand/facebook/cover-background.png
public/brand/facebook/post-background.png

public/brand/instagram/profile-stamp.png
public/brand/instagram/profile-background.png
public/brand/instagram/post-background.png
public/brand/instagram/story-background.png

public/brand/tiktok/profile-stamp.png
public/brand/tiktok/profile-background.png
public/brand/tiktok/cover-background.png

public/brand/linkedin/profile-stamp.png
public/brand/linkedin/company-cover-background.png
public/brand/linkedin/post-background.png

public/brand/x/profile-stamp.png
public/brand/x/header-background.png
public/brand/x/post-background.png

public/brand/case44/profile-stamp.png
public/brand/case44/social-background.png
```

## Recommended Platform Dimensions

```text
Profile stamp master: 2048x2048
Website hero background: 2400x1350
Website section background: 1920x1080
Facebook cover: 1640x624
Facebook post: 1200x630
Instagram post: 1080x1080
Instagram story: 1080x1920
TikTok profile/cover background: 1080x1920
LinkedIn company cover: 1536x768
LinkedIn post: 1200x627
X header: 1500x500
X post: 1600x900
Contact sheet: 2400x1800
```

## Reusable Prompt Framework

```text
Create a complete photoreal brand image asset for STL-Musicians.com.

Brand:
- Name: STL-Musicians.com
- Domain: https://stl-musicians.com
- Tagline: Where St. Louis musicians, venues, and fans connect.
- Product codename: StageLink STL
- Identity: St. Louis metro music discovery, promotion, and future booking platform.
- Audience: musicians, bands, promoters, small venues, and fans.
- Vibe: Local Scene with Working Musician credibility, Venue Discovery energy, and Platform Trust discipline.
- Visual cues: dark live venue, warm brass stage light, red and river-blue accents, cream highlights, real instruments, crowd energy, venue atmosphere, useful negative space, credible local music hub.
- Avoid: fake readable text, fake posters, fake UI, fake logos, watermarks, clutter, unrelated city cliches, generic stock-photo people, distorted instruments, distorted hands, and one-off gimmicks.

Asset:
- Platform/use case: [PLATFORM AND USE CASE]
- Orientation/dimensions: [TARGET DIMENSIONS]
- Composition needs: [NEGATIVE SPACE / CROP SAFETY / PROFILE CIRCLE / OVERLAY AREA]
- Source family lane: [Local Scene / Working Musician / Venue Discovery / Platform Trust]
- Optional featured-band lane: [Case44] only when the asset is explicitly for Case44.

Generate a clean, photoreal, premium, overlay-safe asset that feels connected to the STL-Musicians.com website and can live inside the same brand family as the existing hero images and star-note mark. Do not include readable text, fake logos, slogans, fake event posters, or watermarks.
```

## After Generation

- Save all final PNGs into the platform folders.
- Validate that every file exists, opens as an image, has nonzero size, and has sensible platform dimensions.
- Create a contact sheet preview showing all generated assets.
- Do not overwrite the existing hero images unless explicitly asked.
- Do not move existing app-referenced assets unless code references are updated in the same change.
- If an asset is used by app code, update the code reference and run the normal verification path.

## Current Inventory

Current app-wired and brand-relevant files:

```text
public/images/hero-ai-01.png
public/images/hero-ai-02.png
public/images/hero-ai-03.png
public/images/hero-ai-04.png
public/images/stl-musicians-logo.svg
public/images/stl-musicians-mark.png
public/images/stl-musicians-mark.svg
public/images/case44/1bdbd8c8-case44-lettered.png
public/brand/README.md
public/brand/masters/arch-profile-stamp-concepts-contact-sheet.png
public/brand/masters/profile-stamp.png
public/brand/masters/favicon-source.png
public/brand/masters/arch-vinyl-soundwave-alt.png
public/brand/masters/arch-star-badge-alt.png
public/brand/website/profile-stamp.png
src/app/opengraph-image.tsx
src/app/icon.png
src/app/apple-icon.png
src/app/favicon.ico
```

Known current dimensions:

```text
public/images/hero-ai-01.png - 1672x941
public/images/hero-ai-02.png - 1672x941
public/images/hero-ai-03.png - 1672x941
public/images/hero-ai-04.png - 1672x941
public/images/stl-musicians-mark.png - 512x512
public/images/case44/1bdbd8c8-case44-lettered.png - 1000x785
public/brand/website/profile-stamp.png - 512x512
```
