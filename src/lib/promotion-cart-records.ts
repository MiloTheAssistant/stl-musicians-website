import { and, desc, eq, isNull } from "drizzle-orm";
import type Stripe from "stripe";
import { hasDatabaseUrl } from "@/db/env";
import { getDb } from "@/db";
import {
  promotionCartItems,
  promotionCarts,
  promotionOrderItems,
} from "@/db/schema";
import {
  addPromotionCartItem,
  getPromotionCartDisplayItems,
  getPromotionCartTotalCents,
  removePromotionCartItem,
  type PromotionCartItemInput,
} from "./promotion-cart";
import { activateFulfillmentForPaidProducts } from "./promotion-fulfillment";
import { queuePromotionNotification } from "./promotion-notifications";
import { getSongPromotionCampaignById } from "./song-promotion";

export type PromotionCartScope = {
  clerkUserId: string;
  bandSlug: string;
  campaignId?: string | null;
};

export type PromotionCartRecord = typeof promotionCarts.$inferSelect;

export function hasPromotionCartDatabase() {
  return hasDatabaseUrl();
}

function normalizedCampaignId(campaignId: string | null | undefined) {
  return campaignId?.trim() || null;
}

async function getOpenCart(scope: PromotionCartScope) {
  const campaignId = normalizedCampaignId(scope.campaignId);
  const [cart] = await getDb()
    .select()
    .from(promotionCarts)
    .where(
      and(
        eq(promotionCarts.clerkUserId, scope.clerkUserId),
        eq(promotionCarts.bandSlug, scope.bandSlug),
        campaignId
          ? eq(promotionCarts.campaignId, campaignId)
          : isNull(promotionCarts.campaignId),
        eq(promotionCarts.status, "open"),
      ),
    )
    .orderBy(desc(promotionCarts.updatedAt))
    .limit(1);

  return cart ?? null;
}

async function createOpenCart(scope: PromotionCartScope) {
  const [cart] = await getDb()
    .insert(promotionCarts)
    .values({
      clerkUserId: scope.clerkUserId,
      bandSlug: scope.bandSlug,
      campaignId: normalizedCampaignId(scope.campaignId),
      status: "open",
      updatedAt: new Date(),
    })
    .returning();

  return cart;
}

async function getOrCreateOpenCart(scope: PromotionCartScope) {
  return (await getOpenCart(scope)) ?? (await createOpenCart(scope));
}

export async function getPromotionCartRecord(scope: PromotionCartScope) {
  if (!hasPromotionCartDatabase()) {
    return null;
  }

  return getOpenCart(scope);
}

export async function getPromotionCartItemsForCart(cartId: string) {
  if (!hasPromotionCartDatabase()) {
    return [];
  }

  const items = await getDb()
    .select()
    .from(promotionCartItems)
    .where(eq(promotionCartItems.cartId, cartId));

  return items.map<PromotionCartItemInput>((item) => ({
    productId: item.promotionProductId,
    campaignId: item.promotionCampaignId,
    quantity: item.quantity,
  }));
}

export async function getPromotionCartItemsForScope(scope: PromotionCartScope) {
  const cart = await getPromotionCartRecord(scope);

  if (!cart) {
    return [];
  }

  return getPromotionCartItemsForCart(cart.id);
}

async function replaceCartItems(cartId: string, items: PromotionCartItemInput[]) {
  const displayItems = getPromotionCartDisplayItems(items);

  await getDb()
    .delete(promotionCartItems)
    .where(eq(promotionCartItems.cartId, cartId));

  if (displayItems.length === 0) {
    await getDb()
      .update(promotionCarts)
      .set({
        amountTotalCents: 0,
        updatedAt: new Date(),
      })
      .where(eq(promotionCarts.id, cartId));
    return;
  }

  await getDb().insert(promotionCartItems).values(
    displayItems.map((item) => ({
      cartId,
      promotionProductId: item.productId,
      promotionCampaignId: item.campaignId,
      promotionPackage: item.name,
      description: item.description,
      quantity: item.quantity,
      unitAmountCents: item.unitAmountCents,
      amountCents: item.amountCents,
      currency: item.currency,
      updatedAt: new Date(),
    })),
  );

  await getDb()
    .update(promotionCarts)
    .set({
      amountTotalCents: getPromotionCartTotalCents(items),
      currency: "usd",
      updatedAt: new Date(),
    })
    .where(eq(promotionCarts.id, cartId));
}

export async function addPromotionProductToCart(
  scope: PromotionCartScope,
  item: PromotionCartItemInput,
) {
  const cart = await getOrCreateOpenCart(scope);
  const currentItems = await getPromotionCartItemsForCart(cart.id);
  const updatedItems = addPromotionCartItem(currentItems, item);

  await replaceCartItems(cart.id, updatedItems);

  return cart;
}

export async function removePromotionProductFromCart(
  scope: PromotionCartScope,
  productId: string,
  campaignId?: string | null,
) {
  const cart = await getPromotionCartRecord(scope);

  if (!cart) {
    return null;
  }

  const currentItems = await getPromotionCartItemsForCart(cart.id);
  const updatedItems = removePromotionCartItem(currentItems, productId, campaignId);

  await replaceCartItems(cart.id, updatedItems);

  return cart;
}

export async function markPromotionCartCheckoutStarted(input: {
  cartId: string;
  stripeCheckoutSessionId: string;
  amountTotalCents: number | null;
  currency: string | null;
}) {
  await getDb()
    .update(promotionCarts)
    .set({
      status: "checkout",
      stripeCheckoutSessionId: input.stripeCheckoutSessionId,
      amountTotalCents: input.amountTotalCents,
      currency: input.currency ?? "usd",
      updatedAt: new Date(),
    })
    .where(eq(promotionCarts.id, input.cartId));
}

export async function recordPromotionCartOrderFromCheckout(
  session: Stripe.Checkout.Session,
) {
  const metadata = session.metadata ?? {};
  const promotionCartId = metadata.promotionCartId;
  const clerkUserId = metadata.clerkUserId;

  if (!promotionCartId || !clerkUserId) {
    return;
  }

  const items = await getDb()
    .select()
    .from(promotionCartItems)
    .where(eq(promotionCartItems.cartId, promotionCartId));

  if (items.length === 0) {
    return;
  }

  const existingOrderItems = await getDb()
    .select({ status: promotionOrderItems.status })
    .from(promotionOrderItems)
    .where(eq(promotionOrderItems.stripeCheckoutSessionId, session.id));
  const shouldNotifyPayment =
    existingOrderItems.length === 0 ||
    existingOrderItems.some((item) => item.status !== "paid");

  await getDb()
    .delete(promotionOrderItems)
    .where(eq(promotionOrderItems.stripeCheckoutSessionId, session.id));

  await getDb().insert(promotionOrderItems).values(
    items.map((item) => ({
      clerkUserId,
      promotionCartId,
      stripeCheckoutSessionId: session.id,
      promotionProductId: item.promotionProductId,
      promotionCampaignId: item.promotionCampaignId,
      promotionPackage: item.promotionPackage,
      quantity: item.quantity,
      unitAmountCents: item.unitAmountCents,
      amountCents: item.amountCents,
      currency: item.currency,
      status: "paid",
      updatedAt: new Date(),
    })),
  );

  await getDb()
    .update(promotionCarts)
    .set({
      status: "paid",
      stripeCheckoutSessionId: session.id,
      amountTotalCents: session.amount_total ?? getPromotionCartTotalCents(items.map((item) => ({
        productId: item.promotionProductId,
        campaignId: item.promotionCampaignId,
        quantity: item.quantity,
      }))),
      currency: session.currency ?? "usd",
      updatedAt: new Date(),
    })
    .where(eq(promotionCarts.id, promotionCartId));

  const productIdsByCampaignId = new Map<string, string[]>();

  for (const item of items) {
    if (!item.promotionCampaignId) {
      continue;
    }

    productIdsByCampaignId.set(item.promotionCampaignId, [
      ...(productIdsByCampaignId.get(item.promotionCampaignId) ?? []),
      item.promotionProductId,
    ]);
  }

  for (const [campaignId, productIds] of productIdsByCampaignId) {
    const campaign = getSongPromotionCampaignById(campaignId);

    if (campaign) {
      await activateFulfillmentForPaidProducts({ campaign, productIds });
    }
  }

  if (shouldNotifyPayment) {
    queuePromotionNotification({
      eventType: "payment-completed",
      checkoutSessionId: session.id,
      clerkUserId,
      promotionPackage:
        items.length === 1
          ? items[0].promotionPackage
          : `${items.length} promotion packages`,
      promotionCampaignId: metadata.promotionCampaignId || null,
      source: "cart",
      amountCents:
        session.amount_total ??
        getPromotionCartTotalCents(
          items.map((item) => ({
            productId: item.promotionProductId,
            campaignId: item.promotionCampaignId,
            quantity: item.quantity,
          })),
        ),
      currency: session.currency ?? items[0].currency,
      itemCount: items.length,
    });
  }
}
