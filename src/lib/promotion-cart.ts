import { getPromotionProductById } from "./payment-products";

export type PromotionCartItemInput = {
  productId: string;
  campaignId?: string | null;
  quantity: number;
};

export type PromotionCartDisplayItem = PromotionCartItemInput & {
  name: string;
  description: string;
  unitAmountCents: number;
  currency: "usd";
  amountCents: number;
};

function normalizedCampaignId(campaignId: string | null | undefined) {
  return campaignId?.trim() || null;
}

function normalizedQuantity(quantity: number) {
  if (!Number.isFinite(quantity)) {
    return 1;
  }

  return Math.max(1, Math.min(99, Math.trunc(quantity)));
}

function sameCartItem(
  item: PromotionCartItemInput,
  nextItem: PromotionCartItemInput,
) {
  return (
    item.productId === nextItem.productId &&
    normalizedCampaignId(item.campaignId) === normalizedCampaignId(nextItem.campaignId)
  );
}

export function addPromotionCartItem(
  items: PromotionCartItemInput[],
  nextItem: PromotionCartItemInput,
) {
  const normalizedNextItem = {
    productId: nextItem.productId,
    campaignId: normalizedCampaignId(nextItem.campaignId),
    quantity: normalizedQuantity(nextItem.quantity),
  };
  let didMerge = false;

  const updatedItems = items.map((item) => {
    if (!sameCartItem(item, normalizedNextItem)) {
      return {
        productId: item.productId,
        campaignId: normalizedCampaignId(item.campaignId),
        quantity: normalizedQuantity(item.quantity),
      };
    }

    didMerge = true;

    return {
      productId: item.productId,
      campaignId: normalizedCampaignId(item.campaignId),
      quantity: normalizedQuantity(item.quantity + normalizedNextItem.quantity),
    };
  });

  return didMerge ? updatedItems : [...updatedItems, normalizedNextItem];
}

export function removePromotionCartItem(
  items: PromotionCartItemInput[],
  productId: string,
  campaignId?: string | null,
) {
  const normalizedId = normalizedCampaignId(campaignId);

  return items.filter(
    (item) =>
      item.productId !== productId ||
      normalizedCampaignId(item.campaignId) !== normalizedId,
  );
}

export function getPromotionCartDisplayItems(items: PromotionCartItemInput[]) {
  return items.map<PromotionCartDisplayItem>((item) => {
    const product = getPromotionProductById(item.productId);
    const quantity = normalizedQuantity(item.quantity);

    return {
      productId: product.id,
      campaignId: normalizedCampaignId(item.campaignId),
      quantity,
      name: product.name,
      description: product.description,
      unitAmountCents: product.amountCents,
      currency: product.currency,
      amountCents: product.amountCents * quantity,
    };
  });
}

export function getPromotionCartTotalCents(items: PromotionCartItemInput[]) {
  return getPromotionCartDisplayItems(items).reduce(
    (total, item) => total + item.amountCents,
    0,
  );
}

export function buildPromotionCartCheckoutLineItems(
  items: PromotionCartItemInput[],
) {
  return getPromotionCartDisplayItems(items).map((item) => ({
    price_data: {
      currency: item.currency,
      product_data: {
        name: item.name,
        description: item.description,
        metadata: {
          promotionProductId: item.productId,
          ...(item.campaignId ? { promotionCampaignId: item.campaignId } : {}),
        },
      },
      unit_amount: item.unitAmountCents,
    },
    quantity: item.quantity,
  }));
}
