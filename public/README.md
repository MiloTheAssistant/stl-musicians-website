# Public Asset Structure

This folder contains static assets served by the STL-Musicians website.

In this Next.js app, files under `public/` are served from the site root. For example, `public/images/stl-musicians-mark.png` is available at `/images/stl-musicians-mark.png`.

## Source Of Truth

- `BrandImageLibrary.md` in the repo root defines the brand-library prompt, asset targets, generation rules, and approval standards.
- This file explains the folder structure for everything under `public`.
- `src/app/opengraph-image.tsx` currently generates the Open Graph image. There is not currently a static `public/og-image.png`.

## Current Folder Structure

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

## What Belongs Where

`public/images/` contains app-wired website imagery and current brand references.

`public/images/hero-ai-01.png` through `public/images/hero-ai-04.png` are the current live-music scene images used by the homepage.

`public/images/stl-musicians-mark.png` is the current app-wired header logo/profile-stamp copy generated from `public/brand/masters/profile-stamp.png`.

`public/images/stl-musicians-logo.svg` and `public/images/stl-musicians-mark.svg` are legacy vector identity references kept for comparison until the Arch-based image system fully replaces them.

`public/images/case44/` contains Case44 band/workspace imagery used by the dashboard. Keep Case44 assets separate from core STL-Musicians platform identity assets.

`public/brand/` contains the generated brand-library system described in `BrandImageLibrary.md`. Use it for reusable profile, source-family, website, and platform social assets.

## Brand Library Structure

Use this structure:

```text
public/brand/
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
```

## Current Brand-Relevant Assets

```text
public/images/hero-ai-01.png
public/images/hero-ai-02.png
public/images/hero-ai-03.png
public/images/hero-ai-04.png
public/images/stl-musicians-logo.svg
public/images/stl-musicians-mark.png
public/images/stl-musicians-mark.svg
public/images/case44/1bdbd8c8-case44-lettered.png
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

## Rules

- Do not move existing app-referenced assets unless the code references are updated in the same change.
- Do not overwrite the current homepage hero images unless explicitly asked.
- Generated brand-library assets should follow the `public/brand/` platform folder structure from `BrandImageLibrary.md`.
- Keep the selected profile-stamp source in `public/brand/masters/profile-stamp.png`.
- Keep the selected favicon source in `public/brand/masters/favicon-source.png`.
- Keep STL-Musicians platform identity assets separate from Case44 featured-band assets.
- Avoid dumping one-off generated images directly into the `public/` root.
- Do not commit fake readable text, fake event posters, fake logos, watermarks, or AI-generated UI screenshots as brand assets.
