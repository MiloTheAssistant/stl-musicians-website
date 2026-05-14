import { describe, expect, it } from "vitest";
import {
  buildPromotionClickEvent,
  normalizeFanLeadInput,
  summarizeSmartLinkAnalytics,
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

  it("summarizes clicks, fan captures, package status, and next action", () => {
    const summary = summarizeSmartLinkAnalytics({
      releaseSlug: "case44-long-way-home",
      platformIds: ["spotify", "apple-music", "youtube"],
      packageStatus: "paid",
      nextAction: "SmartLink page setup",
      clicks: [
        { platformId: "spotify" },
        { platformId: "spotify" },
        { platformId: "youtube" },
      ],
      fanLeads: [{ email: "one@example.com" }, { email: "two@example.com" }],
    });

    expect(summary).toEqual({
      releaseSlug: "case44-long-way-home",
      totalClicks: 3,
      fanCaptureCount: 2,
      packageStatus: "paid",
      nextAction: "SmartLink page setup",
      clicksByPlatform: [
        { platformId: "spotify", clicks: 2 },
        { platformId: "apple-music", clicks: 0 },
        { platformId: "youtube", clicks: 1 },
      ],
    });
  });
});
