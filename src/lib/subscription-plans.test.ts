import { describe, expect, it } from "vitest";
import {
  getPlanById,
  paymentArchitecture,
  storageArchitecture,
  subscriptionPlans,
} from "./subscription-plans";

describe("subscriptionPlans", () => {
  it("defines the launch tiers with monthly and yearly pricing", () => {
    expect(subscriptionPlans.map((plan) => plan.id)).toEqual([
      "basic",
      "song",
      "album",
    ]);
    expect(getPlanById("basic")).toMatchObject({
      name: "Basic Trial",
      trialDays: 60,
      monthlyPriceCents: 0,
      yearlyPriceCents: 0,
    });
    expect(getPlanById("song")).toMatchObject({
      name: "Song Tier",
      monthlyPriceCents: 1900,
      yearlyPriceCents: 19000,
    });
    expect(getPlanById("album")).toMatchObject({
      name: "Album Tier",
      monthlyPriceCents: 3900,
      yearlyPriceCents: 39000,
    });
  });

  it("keeps platform subscriptions separate from marketplace payments", () => {
    expect(paymentArchitecture.subscriptionProcessor).toBe("Stripe Billing");
    expect(paymentArchitecture.marketplaceProcessor).toBe("Stripe Connect");
    expect(paymentArchitecture.platformFeeModel).toContain("application_fee_amount");
  });

  it("assigns relational data and file assets to the right Vercel storage products", () => {
    expect(storageArchitecture.relationalStore).toBe("Neon Postgres");
    expect(storageArchitecture.fileStore).toBe("Vercel Blob");
    expect(storageArchitecture.futureQueueStore).toBe("Upstash Redis");
  });
});
