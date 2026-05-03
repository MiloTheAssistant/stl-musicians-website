export type SubscriptionPlanId = "basic" | "song" | "album";

export type SubscriptionPlan = {
  id: SubscriptionPlanId;
  name: string;
  summary: string;
  monthlyPriceCents: number;
  yearlyPriceCents: number;
  trialDays?: number;
  songCampaignsPerMonth: number | "unlimited";
  socialDraftsPerMonth: number | "unlimited";
  merchProductLimit: number | "unlimited";
  features: string[];
};

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: "basic",
    name: "Basic Trial",
    summary: "Free onboarding workspace for the first 60 days.",
    monthlyPriceCents: 0,
    yearlyPriceCents: 0,
    trialDays: 60,
    songCampaignsPerMonth: 1,
    socialDraftsPerMonth: 5,
    merchProductLimit: 3,
    features: [
      "Dashboard access",
      "Direct fan, promoter, venue, and member messages",
      "Limited song spotlight",
      "Two-week event view",
    ],
  },
  {
    id: "song",
    name: "Song Tier",
    summary: "Core song promotion, social scheduling, and connected impact stats.",
    monthlyPriceCents: 1900,
    yearlyPriceCents: 19000,
    songCampaignsPerMonth: 4,
    socialDraftsPerMonth: 25,
    merchProductLimit: 10,
    features: [
      "Four song campaigns each month",
      "Connected Facebook, Instagram, TikTok, and LinkedIn reporting",
      "Expanded event and lead calendar",
      "Ten merch products",
    ],
  },
  {
    id: "album",
    name: "Album Tier",
    summary: "Full release workspace for bands running sustained campaigns.",
    monthlyPriceCents: 3900,
    yearlyPriceCents: 39000,
    songCampaignsPerMonth: "unlimited",
    socialDraftsPerMonth: "unlimited",
    merchProductLimit: "unlimited",
    features: [
      "Album and release campaigns",
      "Unlimited promotion usage for launch",
      "Full merch catalog",
      "Priority platform visibility and support",
    ],
  },
];

export const paymentArchitecture = {
  subscriptionProcessor: "Stripe Billing",
  marketplaceProcessor: "Stripe Connect",
  platformFeeModel:
    "Use destination charges with application_fee_amount for venue, promoter, and member payments routed to connected musician accounts.",
  subscriptionCheckout:
    "Use Stripe Checkout in subscription mode with Customer Portal for upgrades, downgrades, cancellations, and payment method updates.",
} as const;

export const storageArchitecture = {
  relationalStore: "Neon Postgres",
  fileStore: "Vercel Blob",
  futureQueueStore: "Upstash Redis",
  relationalUse:
    "Bands, users, plans, Stripe customers, connected accounts, bookings, campaigns, usage, products, and messages.",
  fileUse:
    "Band photos, merch images, song assets, social media drafts, EPK documents, and video thumbnails.",
} as const;

export function getPlanById(planId: SubscriptionPlanId) {
  return subscriptionPlans.find((plan) => plan.id === planId);
}
