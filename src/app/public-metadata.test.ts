import { describe, expect, it } from "vitest";
import { metadata as aboutMetadata } from "./about/page";
import { metadata as contactMetadata } from "./contact/page";
import { metadata as eventsMetadata } from "./events/page";
import { generateMetadata as generateArtistMetadata } from "./musicians/[slug]/page";
import { metadata as musiciansMetadata } from "./musicians/page";
import { metadata as pricingMetadata } from "./pricing/page";
import { metadata as privacyMetadata } from "./privacy/page";
import { generateMetadata as generateReleaseMetadata } from "./releases/[releaseSlug]/page";
import { metadata as termsMetadata } from "./terms/page";
import { metadata as venuesMetadata } from "./venues/page";

describe("public route metadata", () => {
  it("declares canonical paths for public index routes", () => {
    expect(aboutMetadata.alternates?.canonical).toBe("/about");
    expect(contactMetadata.alternates?.canonical).toBe("/contact");
    expect(eventsMetadata.alternates?.canonical).toBe("/events");
    expect(musiciansMetadata.alternates?.canonical).toBe("/musicians");
    expect(pricingMetadata.alternates?.canonical).toBe("/pricing");
    expect(privacyMetadata.alternates?.canonical).toBe("/privacy");
    expect(termsMetadata.alternates?.canonical).toBe("/terms");
    expect(venuesMetadata.alternates?.canonical).toBe("/venues");
  });

  it("declares canonical paths for artist profile routes", async () => {
    const metadata = await generateArtistMetadata({
      params: Promise.resolve({ slug: "riverfront-brass-union" }),
    });

    expect(metadata.alternates?.canonical).toBe(
      "/musicians/riverfront-brass-union",
    );
  });

  it("declares canonical paths for public SmartLink release routes", async () => {
    const metadata = await generateReleaseMetadata({
      params: Promise.resolve({ releaseSlug: "case44-long-way-home" }),
    });

    expect(metadata.alternates?.canonical).toBe(
      "/releases/case44-long-way-home",
    );
  });
});
