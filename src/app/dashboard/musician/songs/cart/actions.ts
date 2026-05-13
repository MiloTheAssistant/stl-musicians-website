"use server";

import { currentUser, type User } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { notFound, redirect } from "next/navigation";
import {
  findStripeCustomerByClerkUserId,
  recordCheckoutSession,
  upsertStripeCustomerRecord,
} from "@/lib/payment-records";
import { getPromotionProductById } from "@/lib/payment-products";
import {
  buildPromotionCartCheckoutLineItems,
  getPromotionCartTotalCents,
} from "@/lib/promotion-cart";
import {
  addCookiePromotionCartItem,
  getCookiePromotionCartItems,
  removeCookiePromotionCartItem,
} from "@/lib/promotion-cart-cookie";
import {
  addPromotionProductToCart,
  getPromotionCartItemsForCart,
  getPromotionCartRecord,
  getPromotionCartItemsForScope,
  hasPromotionCartDatabase,
  markPromotionCartCheckoutStarted,
  removePromotionProductFromCart,
  type PromotionCartScope,
} from "@/lib/promotion-cart-records";
import { getStripe, getStripeConfig } from "@/lib/stripe-client";
import { getCase44DashboardBand } from "@/lib/band-dashboard";
import {
  canAccessBandWorkspace,
  getPrimaryEmail,
} from "@/lib/dashboard-access";
import { getSongPromotionWorkspaceForBand } from "@/lib/song-promotion";

function getUserEmail(user: User) {
  const email =
    user.primaryEmailAddress?.emailAddress ??
    user.emailAddresses.find((item) => item.emailAddress)?.emailAddress;

  if (!email) {
    throw new Error("A verified email address is required for checkout");
  }

  return email;
}

function getUserName(user: User) {
  return user.fullName ?? user.username ?? user.firstName ?? null;
}

async function getOrCreateStripeCustomer(user: User) {
  const existing = await findStripeCustomerByClerkUserId(user.id);

  if (existing) {
    return existing.stripeCustomerId;
  }

  const customer = await getStripe().customers.create({
    email: getUserEmail(user),
    name: getUserName(user) ?? undefined,
    metadata: {
      clerkUserId: user.id,
    },
  });

  await upsertStripeCustomerRecord({
    clerkUserId: user.id,
    email: getUserEmail(user),
    name: getUserName(user),
    stripeCustomerId: customer.id,
  });

  return customer.id;
}

async function requireCase44CartScope(): Promise<{
  user: User;
  scope: PromotionCartScope;
}> {
  const user = await currentUser();

  if (!user) {
    redirect("/sign-in?redirect_url=/dashboard/musician/songs");
  }

  const band = getCase44DashboardBand();
  const workspace = getSongPromotionWorkspaceForBand(band.slug);

  if (!workspace) {
    notFound();
  }

  if (!canAccessBandWorkspace(band.slug, getPrimaryEmail(user))) {
    notFound();
  }

  return {
    user,
    scope: {
      clerkUserId: user.id,
      bandSlug: band.slug,
      campaignId: workspace.activeCampaign.id,
    },
  };
}

function requirePromotionProductId(formData: FormData) {
  const productId = formData.get("promotionProductId");

  if (typeof productId !== "string") {
    throw new Error("A valid promotion product is required");
  }

  getPromotionProductById(productId);

  return productId;
}

function getCampaignId(formData: FormData, fallbackCampaignId?: string | null) {
  const campaignId = formData.get("promotionCampaignId");

  return typeof campaignId === "string" && campaignId.length > 0
    ? campaignId
    : fallbackCampaignId ?? null;
}

export async function addPromotionToCart(formData: FormData) {
  const { scope } = await requireCase44CartScope();
  const productId = requirePromotionProductId(formData);
  const campaignId = getCampaignId(formData, scope.campaignId);

  if (hasPromotionCartDatabase()) {
    await addPromotionProductToCart(scope, {
      productId,
      campaignId,
      quantity: 1,
    });
  } else {
    await addCookiePromotionCartItem(scope, {
      productId,
      campaignId,
      quantity: 1,
    });
  }

  revalidatePath("/dashboard/musician/songs");
  revalidatePath("/dashboard/musician/songs/cart");
  redirect("/dashboard/musician/songs/cart?cart=updated");
}

export async function removePromotionFromCart(formData: FormData) {
  const { scope } = await requireCase44CartScope();
  const productId = requirePromotionProductId(formData);
  const campaignId = getCampaignId(formData, scope.campaignId);

  if (hasPromotionCartDatabase()) {
    await removePromotionProductFromCart(scope, productId, campaignId);
  } else {
    await removeCookiePromotionCartItem(scope, productId, campaignId);
  }

  revalidatePath("/dashboard/musician/songs/cart");
  redirect("/dashboard/musician/songs/cart?cart=removed");
}

export async function createPromotionCartCheckout() {
  const { user, scope } = await requireCase44CartScope();
  const cart = hasPromotionCartDatabase()
    ? await getPromotionCartRecord(scope)
    : null;
  const items = cart
    ? await getPromotionCartItemsForCart(cart.id)
    : hasPromotionCartDatabase()
      ? await getPromotionCartItemsForScope(scope)
      : await getCookiePromotionCartItems(scope);

  if (items.length === 0) {
    redirect("/dashboard/musician/songs/cart?cart=empty");
  }

  const { appUrl } = getStripeConfig();
  const stripeCustomerId = await getOrCreateStripeCustomer(user);
  const session = await getStripe().checkout.sessions.create({
    mode: "payment",
    customer: stripeCustomerId,
    line_items: buildPromotionCartCheckoutLineItems(items),
    success_url: `${appUrl}/dashboard/musician/songs/cart?checkout=success`,
    cancel_url: `${appUrl}/dashboard/musician/songs/cart?checkout=cancelled`,
    metadata: {
      kind: "promotion-cart",
      clerkUserId: user.id,
      bandSlug: scope.bandSlug,
      promotionCampaignId: scope.campaignId ?? "",
      ...(cart ? { promotionCartId: cart.id } : {}),
    },
  });

  await recordCheckoutSession({
    stripeSessionId: session.id,
    kind: "promotion-cart",
    clerkUserId: user.id,
    promotionCartId: cart?.id ?? null,
    promotionCampaignId: null,
    status: session.status ?? "open",
    amountTotalCents: session.amount_total ?? getPromotionCartTotalCents(items),
    currency: session.currency,
  });

  if (cart) {
    await markPromotionCartCheckoutStarted({
      cartId: cart.id,
      stripeCheckoutSessionId: session.id,
      amountTotalCents: session.amount_total,
      currency: session.currency,
    });
  }

  if (!session.url) {
    throw new Error("Stripe did not return a checkout URL");
  }

  redirect(session.url);
}
