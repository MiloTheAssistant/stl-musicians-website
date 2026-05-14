import { desc, eq } from "drizzle-orm";
import type Stripe from "stripe";
import { hasDatabaseUrl } from "@/db/env";
import { getDb } from "@/db";
import {
  promotionCampaigns,
  promotionPayments,
  stripeCheckoutSessions,
  stripeCustomers,
  stripeSubscriptions,
} from "@/db/schema";
import { activateFulfillmentForPaidProducts } from "./promotion-fulfillment";
import { getSongPromotionCampaignById } from "./song-promotion";
import { getPlanById, type SubscriptionPlanId } from "./subscription-plans";

export type CheckoutSessionKind = "subscription" | "promotion" | "promotion-cart";

export type StripeCustomerRecordInput = {
  clerkUserId: string;
  email: string;
  name?: string | null;
  stripeCustomerId: string;
};

export type CheckoutSessionRecordInput = {
  stripeSessionId: string;
  kind: CheckoutSessionKind;
  clerkUserId: string;
  status: string;
  planId?: string | null;
  billingInterval?: string | null;
  promotionProductId?: string | null;
  promotionPackage?: string | null;
  promotionCampaignId?: string | null;
  promotionCartId?: string | null;
  amountTotalCents?: number | null;
  currency?: string | null;
};

export type BillingSummary = {
  planName: string;
  status: string;
  billingInterval: string | null;
  canManageBilling: boolean;
};

export type PaymentOperationsSummary = {
  activeSubscriptions: number;
  attentionSubscriptions: number;
  paidPromotions: number;
  pendingPromotions: number;
};

function hasDatabase() {
  return hasDatabaseUrl();
}

function toDateFromStripeSeconds(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000) : null;
}

function stripeId(value: string | { id?: string } | null | undefined) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : value.id ?? null;
}

export async function findStripeCustomerByClerkUserId(clerkUserId: string) {
  const [record] = await getDb()
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.clerkUserId, clerkUserId))
    .limit(1);

  return record ?? null;
}

export async function upsertStripeCustomerRecord(input: StripeCustomerRecordInput) {
  const [record] = await getDb()
    .insert(stripeCustomers)
    .values({
      clerkUserId: input.clerkUserId,
      email: input.email,
      name: input.name ?? null,
      stripeCustomerId: input.stripeCustomerId,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: stripeCustomers.clerkUserId,
      set: {
        email: input.email,
        name: input.name ?? null,
        stripeCustomerId: input.stripeCustomerId,
        updatedAt: new Date(),
      },
    })
    .returning();

  return record;
}

export async function recordCheckoutSession(input: CheckoutSessionRecordInput) {
  await getDb()
    .insert(stripeCheckoutSessions)
    .values({
      stripeSessionId: input.stripeSessionId,
      kind: input.kind,
      clerkUserId: input.clerkUserId,
      status: input.status,
      planId: input.planId ?? null,
      billingInterval: input.billingInterval ?? null,
      promotionProductId: input.promotionProductId ?? null,
      promotionPackage: input.promotionPackage ?? null,
      promotionCampaignId: input.promotionCampaignId ?? null,
      promotionCartId: input.promotionCartId ?? null,
      amountTotalCents: input.amountTotalCents ?? null,
      currency: input.currency ?? null,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: stripeCheckoutSessions.stripeSessionId,
      set: {
        status: input.status,
        amountTotalCents: input.amountTotalCents ?? null,
        currency: input.currency ?? null,
        updatedAt: new Date(),
      },
    });
}

export async function upsertSubscriptionFromStripe(
  subscription: Stripe.Subscription,
) {
  const metadata = subscription.metadata ?? {};
  const customerId = stripeId(subscription.customer);

  if (!metadata.clerkUserId || !metadata.planId || !metadata.billingInterval) {
    return;
  }

  if (!customerId) {
    return;
  }

  await getDb()
    .insert(stripeSubscriptions)
    .values({
      clerkUserId: metadata.clerkUserId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscription.id,
      planId: metadata.planId,
      billingInterval: metadata.billingInterval,
      status: subscription.status,
      currentPeriodStart: toDateFromStripeSeconds(
        (subscription as { current_period_start?: number }).current_period_start,
      ),
      currentPeriodEnd: toDateFromStripeSeconds(
        (subscription as { current_period_end?: number }).current_period_end,
      ),
      cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: stripeSubscriptions.stripeSubscriptionId,
      set: {
        status: subscription.status,
        currentPeriodStart: toDateFromStripeSeconds(
          (subscription as { current_period_start?: number }).current_period_start,
        ),
        currentPeriodEnd: toDateFromStripeSeconds(
          (subscription as { current_period_end?: number }).current_period_end,
        ),
        cancelAtPeriodEnd: subscription.cancel_at_period_end ?? false,
        updatedAt: new Date(),
      },
    });
}

export async function recordPromotionPaymentFromCheckout(
  session: Stripe.Checkout.Session,
) {
  const metadata = session.metadata ?? {};
  const promotionProductId = metadata.promotionProductId;
  const promotionPackage = metadata.promotionPackage;
  const clerkUserId = metadata.clerkUserId;

  if (!clerkUserId || !promotionProductId || !promotionPackage) {
    return;
  }

  const paymentIntentId = stripeId(session.payment_intent);
  const promotionCampaignId = metadata.promotionCampaignId || null;

  await getDb()
    .insert(promotionPayments)
    .values({
      clerkUserId,
      promotionProductId,
      promotionPackage,
      promotionCampaignId,
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      amountCents: session.amount_total ?? 0,
      currency: session.currency ?? "usd",
      status: "paid",
      updatedAt: new Date(),
    })
    .onConflictDoUpdate({
      target: promotionPayments.stripeCheckoutSessionId,
      set: {
        stripePaymentIntentId: paymentIntentId,
        amountCents: session.amount_total ?? 0,
        currency: session.currency ?? "usd",
        status: "paid",
        updatedAt: new Date(),
      },
    });

  if (promotionCampaignId) {
    await getDb()
      .update(promotionCampaigns)
      .set({ status: "paid" })
      .where(eq(promotionCampaigns.id, promotionCampaignId));

    const campaign = getSongPromotionCampaignById(promotionCampaignId);

    if (campaign) {
      await activateFulfillmentForPaidProducts({
        campaign,
        productIds: [promotionProductId],
      });
    }
  }
}

export async function getBillingSummaryForUser(
  clerkUserId: string | null | undefined,
): Promise<BillingSummary> {
  const fallbackPlan = getPlanById("basic");

  if (!clerkUserId || !hasDatabase()) {
    return {
      planName: fallbackPlan?.name ?? "Basic Trial",
      status: "trial",
      billingInterval: null,
      canManageBilling: false,
    };
  }

  const [subscription] = await getDb()
    .select()
    .from(stripeSubscriptions)
    .where(eq(stripeSubscriptions.clerkUserId, clerkUserId))
    .orderBy(desc(stripeSubscriptions.updatedAt))
    .limit(1);

  const [customer] = await getDb()
    .select()
    .from(stripeCustomers)
    .where(eq(stripeCustomers.clerkUserId, clerkUserId))
    .limit(1);

  if (!subscription) {
    return {
      planName: fallbackPlan?.name ?? "Basic Trial",
      status: "trial",
      billingInterval: null,
      canManageBilling: Boolean(customer),
    };
  }

  return {
    planName:
      getPlanById(subscription.planId as SubscriptionPlanId)?.name ??
      subscription.planId,
    status: subscription.status,
    billingInterval: subscription.billingInterval,
    canManageBilling: Boolean(customer),
  };
}

export async function getPaymentOperationsSummary(): Promise<PaymentOperationsSummary> {
  if (!hasDatabase()) {
    return {
      activeSubscriptions: 0,
      attentionSubscriptions: 0,
      paidPromotions: 0,
      pendingPromotions: 0,
    };
  }

  const subscriptions = await getDb().select().from(stripeSubscriptions);
  const promotions = await getDb().select().from(promotionPayments);

  return {
    activeSubscriptions: subscriptions.filter((item) =>
      ["active", "trialing"].includes(item.status),
    ).length,
    attentionSubscriptions: subscriptions.filter(
      (item) => !["active", "trialing"].includes(item.status),
    ).length,
    paidPromotions: promotions.filter((item) => item.status === "paid").length,
    pendingPromotions: promotions.filter((item) => item.status !== "paid").length,
  };
}
