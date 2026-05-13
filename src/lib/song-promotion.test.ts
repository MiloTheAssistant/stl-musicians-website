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
    expect(workspace?.activeCampaign.goal).toBe("Release visibility");
    expect(workspace?.activeCampaign.release.title).toBe("Long Way Home");
    expect(workspace?.activeCampaign.paidBoostProductIds).toEqual([
      "song-release",
      "album-launch",
      "event-attendance",
      "featured-artist",
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
