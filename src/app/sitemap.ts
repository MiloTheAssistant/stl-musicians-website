import type { MetadataRoute } from "next";
import { artistProfiles, siteConfig } from "@/lib/content";
import {
  getPublishedSmartLinkReleases,
  getReleaseSmartLinkPath,
} from "@/lib/song-promotion";

const staticRoutes = [
  "",
  "/musicians",
  "/events",
  "/venues",
  "/about",
  "/contact",
  "/pricing",
  "/privacy",
  "/terms",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    ...staticRoutes.map((route) => ({
      url: `${siteConfig.url}${route}`,
      lastModified: now,
    })),
    ...artistProfiles.map((artist) => ({
      url: `${siteConfig.url}/musicians/${artist.slug}`,
      lastModified: now,
    })),
    ...getPublishedSmartLinkReleases().map((release) => ({
      url: `${siteConfig.url}${getReleaseSmartLinkPath(release)}`,
      lastModified: now,
    })),
  ];
}
