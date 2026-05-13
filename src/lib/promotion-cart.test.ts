import { describe, expect, it } from "vitest";
import {
  addPromotionCartItem,
  buildPromotionCartCheckoutLineItems,
  getPromotionCartTotalCents,
  type PromotionCartItemInput,
} from "./promotion-cart";

describe("promotion cart", () => {
  it("adds duplicate products for one campaign by increasing quantity", () => {
    const items: PromotionCartItemInput[] = [
      { productId: "song-release", campaignId: "case44-long-way-home", quantity: 1 },
    ];

    const updated = addPromotionCartItem(items, {
      productId: "song-release",
      campaignId: "case44-long-way-home",
      quantity: 1,
    });

    expect(updated).toEqual([
      {
        productId: "song-release",
        campaignId: "case44-long-way-home",
        quantity: 2,
      },
    ]);
  });

  it("keeps the same product separate when campaign context differs", () => {
    const updated = addPromotionCartItem(
      [
        {
          productId: "song-release",
          campaignId: "case44-long-way-home",
          quantity: 1,
        },
      ],
      {
        productId: "song-release",
        campaignId: "case44-album-launch",
        quantity: 1,
      },
    );

    expect(updated).toHaveLength(2);
    expect(updated.map((item) => item.campaignId)).toEqual([
      "case44-long-way-home",
      "case44-album-launch",
    ]);
  });

  it("builds multi-item Stripe Checkout line items and cart totals", () => {
    const items: PromotionCartItemInput[] = [
      { productId: "song-release", campaignId: "case44-long-way-home", quantity: 1 },
      { productId: "album-launch", campaignId: "case44-long-way-home", quantity: 2 },
    ];

    expect(getPromotionCartTotalCents(items)).toBe(24_700);
    expect(buildPromotionCartCheckoutLineItems(items)).toEqual([
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Song release promotion",
            description:
              "Boost a single song release across discovery and social placements.",
            metadata: {
              promotionProductId: "song-release",
              promotionCampaignId: "case44-long-way-home",
            },
          },
          unit_amount: 4_900,
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "Album launch campaign",
            description:
              "Coordinate launch visibility for a full album or EP campaign.",
            metadata: {
              promotionProductId: "album-launch",
              promotionCampaignId: "case44-long-way-home",
            },
          },
          unit_amount: 9_900,
        },
        quantity: 2,
      },
    ]);
  });
});
