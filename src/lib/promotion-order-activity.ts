import { desc } from "drizzle-orm";
import { getDb } from "@/db";
import { hasDatabaseUrl } from "@/db/env";
import { promotionOrderItems, promotionPayments } from "@/db/schema";

type PromotionPaymentActivityRecord = Pick<
  typeof promotionPayments.$inferSelect,
  | "id"
  | "promotionCampaignId"
  | "promotionProductId"
  | "promotionPackage"
  | "stripeCheckoutSessionId"
  | "amountCents"
  | "currency"
  | "status"
  | "createdAt"
>;

type PromotionOrderItemActivityRecord = Pick<
  typeof promotionOrderItems.$inferSelect,
  | "id"
  | "promotionCampaignId"
  | "promotionProductId"
  | "promotionPackage"
  | "stripeCheckoutSessionId"
  | "quantity"
  | "amountCents"
  | "currency"
  | "status"
  | "createdAt"
>;

export type PromotionOrderActivityItem = {
  id: string;
  source: "single" | "cart";
  packageName: string;
  productId: string;
  campaignId: string | null;
  stripeCheckoutSessionId: string;
  quantity: number;
  amountCents: number;
  currency: string;
  status: string;
  createdAt: Date | null;
};

export function summarizePromotionOrderActivity({
  payments,
  orderItems,
}: {
  payments: PromotionPaymentActivityRecord[];
  orderItems: PromotionOrderItemActivityRecord[];
}): PromotionOrderActivityItem[] {
  return [
    ...payments.map<PromotionOrderActivityItem>((payment) => ({
      id: `single:${payment.id}`,
      source: "single",
      packageName: payment.promotionPackage,
      productId: payment.promotionProductId,
      campaignId: payment.promotionCampaignId,
      stripeCheckoutSessionId: payment.stripeCheckoutSessionId,
      quantity: 1,
      amountCents: payment.amountCents,
      currency: payment.currency,
      status: payment.status,
      createdAt: payment.createdAt,
    })),
    ...orderItems.map<PromotionOrderActivityItem>((item) => ({
      id: `cart:${item.id}`,
      source: "cart",
      packageName: item.promotionPackage,
      productId: item.promotionProductId,
      campaignId: item.promotionCampaignId,
      stripeCheckoutSessionId: item.stripeCheckoutSessionId,
      quantity: item.quantity,
      amountCents: item.amountCents,
      currency: item.currency,
      status: item.status,
      createdAt: item.createdAt,
    })),
  ].sort((left, right) => {
    const leftTime = left.createdAt?.getTime() ?? 0;
    const rightTime = right.createdAt?.getTime() ?? 0;

    return rightTime - leftTime;
  });
}

export async function getPromotionOrderActivity(limit = 8) {
  if (!hasDatabaseUrl()) {
    return [];
  }

  const [payments, orderItems] = await Promise.all([
    getDb()
      .select()
      .from(promotionPayments)
      .orderBy(desc(promotionPayments.createdAt))
      .limit(limit),
    getDb()
      .select()
      .from(promotionOrderItems)
      .orderBy(desc(promotionOrderItems.createdAt))
      .limit(limit),
  ]);

  return summarizePromotionOrderActivity({ payments, orderItems }).slice(0, limit);
}
