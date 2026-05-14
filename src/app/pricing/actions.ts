"use server";

import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  recordCheckoutSession,
  findStripeCustomerByClerkUserId,
} from "@/lib/payment-records";
import {
  getPromotionProductById,
  getSubscriptionPriceId,
  type BillingInterval,
} from "@/lib/payment-products";
import { getStripe, getStripeConfig } from "@/lib/stripe-client";
import { getOrCreateStripeCustomerForUser } from "@/lib/stripe-customers";
import {
  getPlanById,
  type SubscriptionPlanId,
} from "@/lib/subscription-plans";

function requireBillingInterval(value: FormDataEntryValue | null) {
  if (value === "monthly" || value === "yearly") {
    return value satisfies BillingInterval;
  }

  throw new Error("A valid billing interval is required");
}

function requireSubscriptionPlanId(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !getPlanById(value as SubscriptionPlanId)) {
    throw new Error("A valid subscription plan is required");
  }

  return value as SubscriptionPlanId;
}

async function requireSignedInUser() {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/pricing");
  }

  return user;
}

function requireStripeCheckoutUrl(url: string | null) {
  if (!url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  return url;
}

export async function createSubscriptionCheckout(formData: FormData) {
  const user = await requireSignedInUser();
  const planId = requireSubscriptionPlanId(formData.get("planId"));
  const billingInterval = requireBillingInterval(formData.get("billingInterval"));
  const priceId = getSubscriptionPriceId(planId, billingInterval);
  const { appUrl } = getStripeConfig();
  const stripeCustomerId = await getOrCreateStripeCustomerForUser(user);

  const session = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer: stripeCustomerId,
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${appUrl}/dashboard/musician?checkout=success`,
    cancel_url: `${appUrl}/pricing?checkout=cancelled`,
    metadata: {
      kind: "subscription",
      clerkUserId: user.id,
      planId,
      billingInterval,
    },
    subscription_data: {
      metadata: {
        clerkUserId: user.id,
        planId,
        billingInterval,
      },
    },
  });

  await recordCheckoutSession({
    stripeSessionId: session.id,
    kind: "subscription",
    clerkUserId: user.id,
    planId,
    billingInterval,
    status: session.status ?? "open",
    amountTotalCents: session.amount_total,
    currency: session.currency,
  });

  redirect(requireStripeCheckoutUrl(session.url));
}

export async function createPromotionCheckout(formData: FormData) {
  const user = await requireSignedInUser();
  const productId = formData.get("promotionProductId");

  if (typeof productId !== "string") {
    throw new Error("A valid promotion product is required");
  }

  const product = getPromotionProductById(productId);
  const promotionCampaignId = formData.get("promotionCampaignId");
  const campaignId =
    typeof promotionCampaignId === "string" && promotionCampaignId.length > 0
      ? promotionCampaignId
      : null;
  const { appUrl } = getStripeConfig();
  const stripeCustomerId = await getOrCreateStripeCustomerForUser(user);

  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    line_items: [
      {
        price_data: {
          currency: product.currency,
          product_data: {
            name: product.name,
            description: product.description,
          },
          unit_amount: product.amountCents,
        },
        quantity: 1,
      },
    ],
    success_url: `${appUrl}/dashboard/musician?promotion=success`,
    cancel_url: `${appUrl}/pricing?promotion=cancelled`,
    metadata: {
      kind: "promotion",
      clerkUserId: user.id,
      promotionProductId: product.id,
      promotionPackage: product.name,
      ...(campaignId ? { promotionCampaignId: campaignId } : {}),
    },
  });

  await recordCheckoutSession({
    stripeSessionId: session.id,
    kind: "promotion",
    clerkUserId: user.id,
    promotionProductId: product.id,
    promotionPackage: product.name,
    promotionCampaignId: campaignId,
    status: session.status ?? "open",
    amountTotalCents: session.amount_total,
    currency: session.currency,
  });

  redirect(requireStripeCheckoutUrl(session.url));
}

export async function createCustomerPortalSession() {
  const user = await requireSignedInUser();
  const customer = await findStripeCustomerByClerkUserId(user.id);

  if (!customer) {
    redirect("/pricing?billing=missing");
  }

  const { appUrl } = getStripeConfig();
  const session = await getStripe().billingPortal.sessions.create({
    customer: customer.stripeCustomerId,
    return_url: `${appUrl}/dashboard/musician`,
  });

  redirect(session.url);
}
