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
    id: "song-release",
    name: "Song release promotion",
    description: "Boost a single song release across discovery and social placements.",
    amountCents: 4900,
    currency: "usd",
  },
  {
    id: "album-launch",
    name: "Album launch campaign",
    description: "Coordinate launch visibility for a full album or EP campaign.",
    amountCents: 9900,
    currency: "usd",
  },
  {
    id: "event-attendance",
    name: "Event attendance push",
    description: "Promote an upcoming show or venue date to local music fans.",
    amountCents: 6900,
    currency: "usd",
  },
  {
    id: "featured-artist",
    name: "Featured artist placement",
    description: "Place a musician or band in featured discovery surfaces.",
    amountCents: 7900,
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

  if (!getPlanById(planId)) {
    throw new Error(`Unknown subscription plan: ${planId}`);
  }

  return priceId;
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
