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
      { productId: "smartlink-setup", campaignId: "case44-long-way-home", quantity: 1 },
    ];

    const updated = addPromotionCartItem(items, {
      productId: "smartlink-setup",
      campaignId: "case44-long-way-home",
      quantity: 1,
    });

    expect(updated).toEqual([
      {
        productId: "smartlink-setup",
        campaignId: "case44-long-way-home",
        quantity: 2,
      },
    ]);
  });

  it("keeps the same product separate when campaign context differs", () => {
    const updated = addPromotionCartItem(
      [
        {
          productId: "smartlink-setup",
          campaignId: "case44-long-way-home",
          quantity: 1,
        },
      ],
      {
        productId: "smartlink-setup",
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
      { productId: "smartlink-setup", campaignId: "case44-long-way-home", quantity: 1 },
      { productId: "full-release-campaign", campaignId: "case44-long-way-home", quantity: 2 },
    ];

    expect(getPromotionCartTotalCents(items)).toBe(54_700);
    expect(buildPromotionCartCheckoutLineItems(items)).toEqual([
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: "SmartLink Setup",
            description:
              "Create the public release landing page, tracked outbound links, and fan capture path.",
            metadata: {
              promotionProductId: "smartlink-setup",
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
            name: "Full Release Campaign",
            description:
              "Bundle SmartLink, launch prep, short-form guidance, and local STL release push.",
            metadata: {
              promotionProductId: "full-release-campaign",
              promotionCampaignId: "case44-long-way-home",
            },
          },
          unit_amount: 24_900,
        },
        quantity: 2,
      },
    ]);
  });
});
