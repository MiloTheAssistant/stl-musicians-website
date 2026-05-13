# STL-Musicians Brand Library

This folder contains reusable STL-Musicians brand assets that are not one-off page imagery.

## Selected System

- Primary profile-stamp / logo: `masters/profile-stamp.png`
- Website profile-stamp copy: `website/profile-stamp.png`
- Favicon source: `masters/favicon-source.png`
- Current header mark: `../images/stl-musicians-mark.png`
- Current Next.js app icons generated from favicon source:
  - `../../src/app/favicon.ico`
  - `../../src/app/icon.png`
  - `../../src/app/apple-icon.png`

## Visual Direction

The selected direction uses the St. Louis Gateway Arch as the local anchor point and combines it with a premium, photoreal, artistic music-stamp treatment. The identity should feel like a serious St. Louis music platform, not a generic music app and not a fabrication-studio asset.

Core cues:

- Gateway Arch as the primary local signal.
- Dark live-venue energy.
- Warm brass and cream highlights.
- Subtle oxblood red and river-blue accents.
- Circular-crop-safe composition for profile use.
- Strong silhouette for small favicon use.

## Masters

```text
masters/arch-profile-stamp-concepts-contact-sheet.png
masters/profile-stamp.png
masters/favicon-source.png
masters/arch-vinyl-soundwave-alt.png
masters/arch-star-badge-alt.png
```

`profile-stamp.png` is the selected first concept and should be treated as the primary logo/profile-stamp source.

`favicon-source.png` is the selected second concept and should remain the source for favicon/app-icon refreshes.

The vinyl/soundwave and star-badge files are approved alternates kept for future platform branding, social art, or promotional surfaces.

## Rules

- Keep the Arch anchor visible in future profile-stamp/logo variants.
- Do not add readable text inside stamp art.
- Do not overwrite generated masters without preserving a dated or clearly named alternate.
- Update `public/README.md` and `BrandImageLibrary.md` when the live brand asset set changes.
- If an image is wired into app code, run the relevant Next.js checks after changing it.
