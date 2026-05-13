import { cookies } from "next/headers";
import {
  addPromotionCartItem,
  removePromotionCartItem,
  type PromotionCartItemInput,
} from "./promotion-cart";
import type { PromotionCartScope } from "./promotion-cart-records";

const promotionCartCookieName = "stl_promotion_cart";

type CookiePromotionCart = {
  bandSlug: string;
  campaignId: string | null;
  items: PromotionCartItemInput[];
};

function normalizedCampaignId(campaignId: string | null | undefined) {
  return campaignId?.trim() || null;
}

function isSameScope(cart: CookiePromotionCart | null, scope: PromotionCartScope) {
  return (
    cart?.bandSlug === scope.bandSlug &&
    cart.campaignId === normalizedCampaignId(scope.campaignId)
  );
}

function parseCookieCart(value: string | undefined): CookiePromotionCart | null {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value) as CookiePromotionCart;

    if (!parsed.bandSlug || !Array.isArray(parsed.items)) {
      return null;
    }

    return {
      bandSlug: parsed.bandSlug,
      campaignId: normalizedCampaignId(parsed.campaignId),
      items: parsed.items
        .filter((item) => typeof item.productId === "string")
        .map((item) => ({
          productId: item.productId,
          campaignId: normalizedCampaignId(item.campaignId),
          quantity: item.quantity,
        })),
    };
  } catch {
    return null;
  }
}

async function getCookieCart() {
  try {
    const cookieStore = await cookies();
    return parseCookieCart(cookieStore.get(promotionCartCookieName)?.value);
  } catch {
    return null;
  }
}

async function setCookieCart(cart: CookiePromotionCart) {
  const cookieStore = await cookies();

  cookieStore.set(promotionCartCookieName, JSON.stringify(cart), {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
}

export async function getCookiePromotionCartItems(scope: PromotionCartScope) {
  const cart = await getCookieCart();

  if (!isSameScope(cart, scope)) {
    return [];
  }

  return cart?.items ?? [];
}

export async function addCookiePromotionCartItem(
  scope: PromotionCartScope,
  item: PromotionCartItemInput,
) {
  const cart = await getCookieCart();
  const currentItems = isSameScope(cart, scope) ? cart?.items ?? [] : [];

  await setCookieCart({
    bandSlug: scope.bandSlug,
    campaignId: normalizedCampaignId(scope.campaignId),
    items: addPromotionCartItem(currentItems, item),
  });
}

export async function removeCookiePromotionCartItem(
  scope: PromotionCartScope,
  productId: string,
  campaignId?: string | null,
) {
  const cart = await getCookieCart();
  const currentItems = isSameScope(cart, scope) ? cart?.items ?? [] : [];

  await setCookieCart({
    bandSlug: scope.bandSlug,
    campaignId: normalizedCampaignId(scope.campaignId),
    items: removePromotionCartItem(currentItems, productId, campaignId),
  });
}
