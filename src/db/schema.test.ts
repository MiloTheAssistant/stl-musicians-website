import { describe, expect, it } from "vitest";
import { artistAccountLinks, bandReleases, promotionCampaigns } from "./schema";

describe("music promotion schema", () => {
  it("exposes persistent tables for releases, account links, and campaigns", () => {
    expect(bandReleases).toBeDefined();
    expect(artistAccountLinks).toBeDefined();
    expect(promotionCampaigns).toBeDefined();
  });
});
