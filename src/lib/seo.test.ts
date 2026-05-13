import { describe, expect, it } from "vitest";
import { siteConfig } from "./content";
import {
  buildOrganizationJsonLd,
  buildWebSiteJsonLd,
  canonicalPath,
  serializeJsonLd,
} from "./seo";

describe("SEO helpers", () => {
  it("normalizes canonical paths for metadata", () => {
    expect(canonicalPath()).toBe("/");
    expect(canonicalPath("musicians")).toBe("/musicians");
    expect(canonicalPath("/musicians/riverfront-brass-union")).toBe(
      "/musicians/riverfront-brass-union",
    );
  });

  it("serializes JSON-LD without leaving raw HTML tags", () => {
    const serialized = serializeJsonLd({
      "@context": "https://schema.org",
      "@type": "Thing",
      name: "<script>alert('x')</script>",
    });

    expect(serialized).toContain("\\u003cscript>");
    expect(serialized).not.toContain("<script>");
  });

  it("builds site entity schema from the public site config", () => {
    expect(buildOrganizationJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
      email: siteConfig.email,
      telephone: siteConfig.phone,
    });

    expect(buildWebSiteJsonLd()).toMatchObject({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: siteConfig.name,
      url: siteConfig.url,
      inLanguage: "en-US",
    });
  });
});
