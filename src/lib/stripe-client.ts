import Stripe from "stripe";

export const stripeApiVersion = "2026-04-22.dahlia";

let stripeClient: Stripe | null = null;

export function getStripeConfig(env: NodeJS.ProcessEnv = process.env) {
  if (!env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY is required");
  }

  if (!env.NEXT_PUBLIC_APP_URL) {
    throw new Error("NEXT_PUBLIC_APP_URL is required");
  }

  return {
    appUrl: env.NEXT_PUBLIC_APP_URL.replace(/\/$/, ""),
    secretKey: env.STRIPE_SECRET_KEY,
    webhookSecret: env.STRIPE_WEBHOOK_SECRET,
  };
}

export function getStripe() {
  const { secretKey } = getStripeConfig();

  if (!stripeClient) {
    stripeClient = new Stripe(secretKey, {
      apiVersion: stripeApiVersion,
      typescript: true,
    });
  }

  return stripeClient;
}

export function getStripeWebhookSecret(env: NodeJS.ProcessEnv = process.env) {
  const webhookSecret = env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is required");
  }

  return webhookSecret;
}
