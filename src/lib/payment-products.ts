import {
  getPlanById,
  subscriptionPlans,
  type SubscriptionPlan,
  type SubscriptionPlanId,
} from "./subscription-plans";

export type BillingInterval = "monthly" | "yearly";
export type PaidSubscriptionPlanId = Exclude<SubscriptionPlanId, "basic">;

export type PromotionProduct = {
  id: string;
  name: string;
  description: string;
  amountCents: number;
  currency: "usd";
};

const subscriptionPriceEnvKeys: Record<
  PaidSubscriptionPlanId,
  Record<BillingInterval, string>
> = {
  song: {
    monthly: "STRIPE_PRICE_SONG_MONTHLY",
    yearly: "STRIPE_PRICE_SONG_YEARLY",
  },
  album: {
    monthly: "STRIPE_PRICE_ALBUM_MONTHLY",
    yearly: "STRIPE_PRICE_ALBUM_YEARLY",
  },
};

export const promotionProducts: PromotionProduct[] = [
  {
    id: "smartlink-setup",
    name: "SmartLink Setup",
    description:
      "Create the public release landing page, tracked outbound links, and fan capture path.",
    amountCents: 4900,
    currency: "usd",
  },
  {
    id: "launch-prep",
    name: "Launch Prep",
    description:
      "Prepare pitch-ready metadata, platform handoffs, and authorized release checklists.",
    amountCents: 9900,
    currency: "usd",
  },
  {
    id: "local-stl-push",
    name: "Local STL Push",
    description:
      "Coordinate venue, show, newsletter, and STL-Musicians placement opportunities.",
    amountCents: 14900,
    currency: "usd",
  },
  {
    id: "full-release-campaign",
    name: "Full Release Campaign",
    description:
      "Bundle SmartLink, launch prep, short-form guidance, and local STL release push.",
    amountCents: 24900,
    currency: "usd",
  },
];

function assertPaidPlanId(
  planId: SubscriptionPlanId,
): asserts planId is PaidSubscriptionPlanId {
  if (planId === "basic") {
    throw new Error("Basic Trial is a free onboarding plan");
  }
}

export function getPaidSubscriptionPlans(): SubscriptionPlan[] {
  return subscriptionPlans.filter((plan) => plan.id !== "basic");
}

export function getSubscriptionPriceEnvKey(
  planId: SubscriptionPlanId,
  interval: BillingInterval,
) {
  assertPaidPlanId(planId);
  return subscriptionPriceEnvKeys[planId][interval];
}

export function getSubscriptionPriceId(
  planId: SubscriptionPlanId,
  interval: BillingInterval,
  env: Record<string, string | undefined> = process.env,
) {
  const envKey = getSubscriptionPriceEnvKey(planId, interval);
  const priceId = env[envKey];

  if (!priceId) {
    throw new Error(`${envKey} is required`);
  }

  if (!isStripePriceId(priceId)) {
    throw new Error(`${envKey} must be a Stripe price_ ID`);
  }

  if (!getPlanById(planId)) {
    throw new Error(`Unknown subscription plan: ${planId}`);
  }

  return priceId;
}

export function isStripePriceId(value: string | undefined) {
  return Boolean(value?.startsWith("price_"));
}

export function hasSubscriptionPriceIds(
  env: Record<string, string | undefined> = process.env,
) {
  return getPaidSubscriptionPlans().every((plan) =>
    (["monthly", "yearly"] as const).every((interval) =>
      isStripePriceId(env[getSubscriptionPriceEnvKey(plan.id, interval)]),
    ),
  );
}

export function getPromotionProductById(productId: string) {
  const product = promotionProducts.find((item) => item.id === productId);

  if (!product) {
    throw new Error(`Unknown promotion product: ${productId}`);
  }

  return product;
}

export function formatCents(cents: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(cents / 100);
}
