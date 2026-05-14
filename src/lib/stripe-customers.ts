import type { User } from "@clerk/nextjs/server";
import type Stripe from "stripe";
import {
  findStripeCustomerByClerkUserId,
  upsertStripeCustomerRecord,
} from "./payment-records";
import { getStripe } from "./stripe-client";

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

function isStripeDeletedCustomer(
  customer: Stripe.Customer | Stripe.DeletedCustomer,
) {
  return "deleted" in customer && customer.deleted;
}

export function isMissingStripeCustomerError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const stripeError = error as {
    code?: string;
    statusCode?: number;
    type?: string;
  };

  return (
    stripeError.statusCode === 404 &&
    stripeError.code === "resource_missing" &&
    stripeError.type === "StripeInvalidRequestError"
  );
}

async function hasUsableStripeCustomer(stripeCustomerId: string) {
  try {
    const customer = await getStripe().customers.retrieve(stripeCustomerId);

    return !isStripeDeletedCustomer(customer);
  } catch (error) {
    if (isMissingStripeCustomerError(error)) {
      return false;
    }

    throw error;
  }
}

async function createStripeCustomerForUser(user: User) {
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

export async function getOrCreateStripeCustomerForUser(user: User) {
  const existing = await findStripeCustomerByClerkUserId(user.id);

  if (
    existing &&
    (await hasUsableStripeCustomer(existing.stripeCustomerId))
  ) {
    return existing.stripeCustomerId;
  }

  return createStripeCustomerForUser(user);
}
