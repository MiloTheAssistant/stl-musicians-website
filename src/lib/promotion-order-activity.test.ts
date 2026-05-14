import { describe, expect, it } from "vitest";
import { summarizePromotionOrderActivity } from "./promotion-order-activity";

describe("promotion order activity", () => {
  it("normalizes single package payments and cart orders for admin fulfillment", () => {
    const activity = summarizePromotionOrderActivity({
      payments: [
        {
          id: "payment_1",
          promotionCampaignId: "campaign_1",
          promotionProductId: "smartlink-setup",
          promotionPackage: "SmartLink Setup",
          stripeCheckoutSessionId: "cs_single_123",
          amountCents: 4900,
          currency: "usd",
          status: "paid",
          createdAt: new Date("2026-05-14T12:00:00Z"),
        },
      ],
      orderItems: [
        {
          id: "order_item_1",
          promotionCampaignId: "campaign_1",
          promotionProductId: "local-stl-push",
          promotionPackage: "Local STL Push",
          stripeCheckoutSessionId: "cs_cart_123",
          quantity: 2,
          amountCents: 38000,
          currency: "usd",
          status: "paid",
          createdAt: new Date("2026-05-14T13:00:00Z"),
        },
      ],
    });

    expect(activity).toEqual([
      {
        id: "cart:order_item_1",
        source: "cart",
        packageName: "Local STL Push",
        productId: "local-stl-push",
        campaignId: "campaign_1",
        stripeCheckoutSessionId: "cs_cart_123",
        quantity: 2,
        amountCents: 38000,
        currency: "usd",
        status: "paid",
        createdAt: new Date("2026-05-14T13:00:00Z"),
      },
      {
        id: "single:payment_1",
        source: "single",
        packageName: "SmartLink Setup",
        productId: "smartlink-setup",
        campaignId: "campaign_1",
        stripeCheckoutSessionId: "cs_single_123",
        quantity: 1,
        amountCents: 4900,
        currency: "usd",
        status: "paid",
        createdAt: new Date("2026-05-14T12:00:00Z"),
      },
    ]);
  });
});
