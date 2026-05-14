import { describe, expect, it } from "vitest";
import {
  buildPromotionClickEvent,
  normalizeFanLeadInput,
} from "./song-promotion-analytics";

describe("song promotion analytics", () => {
  it("builds a click event for a public SmartLink destination", () => {
    expect(
      buildPromotionClickEvent({
        releaseSlug: "case44-long-way-home",
        platformId: "spotify",
        source: "instagram-bio",
      }),
    ).toMatchObject({
      releaseSlug: "case44-long-way-home",
      platformId: "spotify",
      source: "instagram-bio",
    });
  });

  it("normalizes fan capture without accepting invalid email addresses", () => {
    expect(
      normalizeFanLeadInput({
        releaseSlug: "case44-long-way-home",
        email: "  FAN@Example.COM ",
        source: "smartlink",
      }),
    ).toEqual({
      releaseSlug: "case44-long-way-home",
      email: "fan@example.com",
      source: "smartlink",
    });

    expect(() =>
      normalizeFanLeadInput({
        releaseSlug: "case44-long-way-home",
        email: "not-an-email",
      }),
    ).toThrow("A valid email address is required");
  });
});
