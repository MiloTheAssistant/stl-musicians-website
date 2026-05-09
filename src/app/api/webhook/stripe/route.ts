import { NextResponse } from "next/server";
import { handleStripeWebhookEvent } from "@/lib/stripe-webhooks";
import { getStripe, getStripeWebhookSecret } from "@/lib/stripe-client";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 },
    );
  }

  let event;

  try {
    event = getStripe().webhooks.constructEvent(
      await request.text(),
      signature,
      getStripeWebhookSecret(),
    );
  } catch {
    return NextResponse.json(
      { error: "Invalid Stripe signature" },
      { status: 400 },
    );
  }

  await handleStripeWebhookEvent(event);

  return NextResponse.json({ received: true });
}
