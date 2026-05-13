import { describe, expect, it } from "vitest";
import {
  getMissingAccountLinks,
  getSongPromotionWorkspaceForBand,
  songPromotionChannels,
} from "./song-promotion";

describe("song promotion workspace", () => {
  it("builds a balanced Case44 release command center", () => {
    const workspace = getSongPromotionWorkspaceForBand("case44");

    expect(workspace?.bandSlug).toBe("case44");
    expect(workspace?.adminEmail).toBe("case44@stl-musicians.com");
    expect(workspace?.activeCampaign.goal).toBe("Release visibility");
    expect(workspace?.activeCampaign.release.title).toBe("Long Way Home");
    expect(workspace?.activeCampaign.paidBoostProductIds).toEqual([
      "song-release",
      "album-launch",
      "event-attendance",
      "featured-artist",
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
});
