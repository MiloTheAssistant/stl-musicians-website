import type Stripe from "stripe";
import {
  recordCheckoutSession,
  recordPromotionPaymentFromCheckout,
  upsertSubscriptionFromStripe,
} from "./payment-records";
import { recordPromotionCartOrderFromCheckout } from "./promotion-cart-records";
import { getStripe } from "./stripe-client";

function stringMetadata(value: string | undefined) {
  return value && value.trim().length > 0 ? value : null;
}

export async function handleStripeWebhookEvent(event: Stripe.Event) {
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const metadata = session.metadata ?? {};
      const kind = stringMetadata(metadata.kind);
      const clerkUserId = stringMetadata(metadata.clerkUserId);

      if (!clerkUserId) {
        return { handled: false };
      }

      if (kind === "subscription") {
        await recordCheckoutSession({
          stripeSessionId: session.id,
          kind,
          clerkUserId,
          planId: stringMetadata(metadata.planId),
          billingInterval: stringMetadata(metadata.billingInterval),
          status: session.status ?? "complete",
          amountTotalCents: session.amount_total,
          currency: session.currency,
        });

        if (typeof session.subscription === "string") {
          const subscription = await getStripe().subscriptions.retrieve(
            session.subscription,
          );
          await upsertSubscriptionFromStripe(subscription);
        }
      }

      if (kind === "promotion") {
        await recordCheckoutSession({
          stripeSessionId: session.id,
          kind,
          clerkUserId,
          promotionProductId: stringMetadata(metadata.promotionProductId),
          promotionPackage: stringMetadata(metadata.promotionPackage),
          promotionCampaignId: stringMetadata(metadata.promotionCampaignId),
          status: session.status ?? "complete",
          amountTotalCents: session.amount_total,
          currency: session.currency,
        });
        await recordPromotionPaymentFromCheckout(session);
      }

      if (kind === "promotion-cart") {
        await recordCheckoutSession({
          stripeSessionId: session.id,
          kind,
          clerkUserId,
          promotionCartId: stringMetadata(metadata.promotionCartId),
          status: session.status ?? "complete",
          amountTotalCents: session.amount_total,
          currency: session.currency,
        });
        await recordPromotionCartOrderFromCheckout(session);
      }

      return { handled: true };
    }
    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      await upsertSubscriptionFromStripe(
        event.data.object as Stripe.Subscription,
      );
      return { handled: true };
    }
    default:
      return { handled: false };
  }
}
