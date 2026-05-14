import { describe, expect, it } from "vitest";
import {
  artistAccountLinks,
  bandReleases,
  promotionCampaigns,
  promotionCampaignTasks,
  promotionClickEvents,
  promotionFanLeads,
  promotionFulfillmentNotes,
  releaseLandingPages,
  releasePlatformLinks,
} from "./schema";

describe("music promotion schema", () => {
  it("exposes persistent tables for releases, account links, and campaigns", () => {
    expect(bandReleases).toBeDefined();
    expect(artistAccountLinks).toBeDefined();
    expect(promotionCampaigns).toBeDefined();
    expect(releaseLandingPages).toBeDefined();
    expect(releasePlatformLinks).toBeDefined();
    expect(promotionCampaignTasks).toBeDefined();
    expect(promotionFulfillmentNotes).toBeDefined();
    expect(promotionClickEvents).toBeDefined();
    expect(promotionFanLeads).toBeDefined();
  });
});
