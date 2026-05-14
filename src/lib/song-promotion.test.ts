import { describe, expect, it } from "vitest";
import {
  getCampaignFulfillmentTasks,
  getReleaseSmartLinkPath,
  getMissingAccountLinks,
  getSongPromotionCampaignById,
  getSmartLinkReleaseBySlug,
  getSongPromotionWorkspaceForBand,
  songPromotionChannels,
} from "./song-promotion";

describe("song promotion workspace", () => {
  it("builds a balanced Case44 release command center", () => {
    const workspace = getSongPromotionWorkspaceForBand("case44");

    expect(workspace?.bandSlug).toBe("case44");
    expect(workspace?.adminEmail).toBe("case44@stl-musicians.com");
    expect(
      getSongPromotionCampaignById("11111111-1111-4111-8111-111111111111")
        ?.title,
    ).toBe("Long Way Home release push");
    expect(workspace?.activeCampaign.goal).toBe("Release visibility");
    expect(workspace?.activeCampaign.release.title).toBe("Long Way Home");
    expect(workspace?.activeCampaign.paidBoostProductIds).toEqual([
      "smartlink-setup",
      "launch-prep",
      "local-stl-push",
      "full-release-campaign",
    ]);
    expect(workspace?.activeCampaign.actions).toHaveLength(5);
    expect(
      workspace?.activeCampaign.actions.map((action) => action.ctaUrl),
    ).toEqual([
      "https://artists.spotify.com/en/campaign-kit",
      "https://artists.apple.com/support/3392-make-most-promote",
      "https://newsroom.tiktok.com/en-US/tiktok-for-artists-launches?lang=en-GB",
      "https://support.distrokid.com/hc/en-us/articles/360013647913-What-Is-HyperFollow",
      "https://www.artist.bandsintown.com/features",
    ]);
    expect(songPromotionChannels.map((channel) => channel.id)).toEqual([
      "streaming",
      "social-video",
      "direct-to-fan",
      "local-stl",
      "paid-boosts",
    ]);
  });

  it("reports missing account setup without requiring OAuth", () => {
    const workspace = getSongPromotionWorkspaceForBand("case44");

    expect(workspace).toBeDefined();
    expect(getMissingAccountLinks(workspace!)).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          platform: "Amazon Music",
          status: "missing",
          setupMode: "profile-link",
        }),
        expect.objectContaining({
          platform: "Bandsintown",
          status: "missing",
          setupMode: "profile-link",
        }),
      ]),
    );
  });

  it("publishes a public SmartLink release page contract for the campaign", () => {
    const smartLink = getSmartLinkReleaseBySlug("case44-long-way-home");

    expect(smartLink).toMatchObject({
      slug: "case44-long-way-home",
      bandSlug: "case44",
      campaignId: "11111111-1111-4111-8111-111111111111",
      title: "Long Way Home",
      fanCaptureEnabled: true,
    });
    expect(getReleaseSmartLinkPath(smartLink!)).toBe(
      "/releases/case44-long-way-home",
    );
    expect(smartLink?.destinationLinks.map((link) => link.platform)).toEqual([
      "Spotify",
      "Apple Music",
      "YouTube",
      "Bandcamp / DistroKid",
      "Bandsintown",
    ]);
  });

  it("tracks concierge fulfillment tasks without promising platform outcomes", () => {
    const tasks = getCampaignFulfillmentTasks(
      "11111111-1111-4111-8111-111111111111",
    );

    expect(tasks.map((task) => task.title)).toEqual([
      "SmartLink page setup",
      "Spotify pitch-prep handoff",
      "Apple Music asset pack",
      "Short-form launch kit",
      "Local STL release push",
      "Post-launch proof and recap",
    ]);
    expect(tasks.every((task) => task.requiresOfficialAccess)).toBe(false);
    expect(tasks.some((task) => task.guardrail.includes("No password"))).toBe(true);
  });
});
