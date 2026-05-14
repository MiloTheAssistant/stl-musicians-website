import { describe, expect, it, vi } from "vitest";
import {
  buildPromotionNotificationEmail,
  getPromotionNotificationConfig,
  sendPromotionNotification,
} from "./promotion-notifications";

describe("promotion notifications", () => {
  it("stays disabled until Resend is configured", async () => {
    const send = vi.fn();
    const result = await sendPromotionNotification(
      {
        eventType: "checkout-started",
        checkoutSessionId: "cs_test_started",
        clerkUserId: "user_123",
        promotionPackage: "SmartLink Setup",
        promotionProductId: "smartlink-setup",
        promotionCampaignId: "campaign_123",
        source: "single",
        amountCents: 4900,
        currency: "usd",
      },
      { env: {}, send },
    );

    expect(result).toEqual({ status: "skipped", reason: "not-configured" });
    expect(send).not.toHaveBeenCalled();
  });

  it("builds guarded checkout and payment emails for internal recipients", () => {
    const config = getPromotionNotificationConfig({
      RESEND_API_KEY: "re_test",
      PROMOTION_NOTIFICATIONS_FROM: "STL-Musicians <ops@stl-musicians.com>",
      PROMOTION_NOTIFICATIONS_TO: "ops@stl-musicians.com, admin@example.com",
    });

    expect(config).toEqual({
      apiKey: "re_test",
      from: "STL-Musicians <ops@stl-musicians.com>",
      to: ["ops@stl-musicians.com", "admin@example.com"],
    });

    const email = buildPromotionNotificationEmail(
      {
        eventType: "payment-completed",
        checkoutSessionId: "cs_test_paid",
        clerkUserId: "user_123",
        promotionPackage: "Local STL Push",
        promotionProductId: "local-stl-push",
        promotionCampaignId: "campaign_123",
        source: "cart",
        amountCents: 14900,
        currency: "usd",
        itemCount: 1,
      },
      config!,
    );

    expect(email).toMatchObject({
      from: "STL-Musicians <ops@stl-musicians.com>",
      to: ["ops@stl-musicians.com", "admin@example.com"],
      subject: "STL-Musicians promotion payment received: Local STL Push",
    });
    expect(email.text).toContain("Event: Payment received");
    expect(email.text).toContain("Checkout session: cs_test_paid");
    expect(email.text).toContain("Campaign: campaign_123");
    expect(email.text).not.toContain("re_test");
  });
});
