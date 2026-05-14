import { describe, expect, it } from "vitest";
import {
  formatCents,
  getPaidSubscriptionPlans,
  getPromotionProductById,
  getSubscriptionPriceId,
  hasSubscriptionPriceIds,
  promotionProducts,
} from "./payment-products";

const stripePriceEnv = {
  STRIPE_PRICE_SONG_MONTHLY: "price_song_monthly",
  STRIPE_PRICE_SONG_YEARLY: "price_song_yearly",
  STRIPE_PRICE_ALBUM_MONTHLY: "price_album_monthly",
  STRIPE_PRICE_ALBUM_YEARLY: "price_album_yearly",
};

describe("payment products", () => {
  it("maps paid subscription plans to Stripe price environment variables", () => {
    expect(getPaidSubscriptionPlans().map((plan) => plan.id)).toEqual([
      "song",
      "album",
    ]);
    expect(getSubscriptionPriceId("song", "monthly", stripePriceEnv)).toBe(
      "price_song_monthly",
    );
    expect(getSubscriptionPriceId("song", "yearly", stripePriceEnv)).toBe(
      "price_song_yearly",
    );
    expect(getSubscriptionPriceId("album", "monthly", stripePriceEnv)).toBe(
      "price_album_monthly",
    );
    expect(getSubscriptionPriceId("album", "yearly", stripePriceEnv)).toBe(
      "price_album_yearly",
    );
  });

  it("does not create Stripe checkout for the free trial plan", () => {
    expect(() =>
      getSubscriptionPriceId("basic", "monthly", stripePriceEnv),
    ).toThrow("Basic Trial is a free onboarding plan");
  });

  it("fails closed when a paid Stripe price variable is missing", () => {
    expect(() => getSubscriptionPriceId("song", "monthly", {})).toThrow(
      "STRIPE_PRICE_SONG_MONTHLY is required",
    );
  });

  it("fails closed when a paid Stripe price variable is not a price ID", () => {
    expect(() =>
      getSubscriptionPriceId("song", "monthly", {
        STRIPE_PRICE_SONG_MONTHLY: "sk_test_not_a_price",
      }),
    ).toThrow("STRIPE_PRICE_SONG_MONTHLY must be a Stripe price_ ID");
    expect(hasSubscriptionPriceIds(stripePriceEnv)).toBe(true);
    expect(
      hasSubscriptionPriceIds({
        ...stripePriceEnv,
        STRIPE_PRICE_ALBUM_YEARLY: "sk_test_not_a_price",
      }),
    ).toBe(false);
  });

  it("defines fixed server-owned promotion products", () => {
    expect(promotionProducts).toHaveLength(4);
    expect(getPromotionProductById("song-release")).toMatchObject({
      id: "song-release",
      name: "Song release promotion",
      amountCents: 4900,
      currency: "usd",
    });
    expect(() => getPromotionProductById("unknown")).toThrow(
      "Unknown promotion product",
    );
  });

  it("formats cents as whole-dollar USD labels", () => {
    expect(formatCents(4900)).toBe("$49");
    expect(formatCents(19000)).toBe("$190");
  });
});
