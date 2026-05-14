import { describe, expect, it } from "vitest";
import { isMissingStripeCustomerError } from "./stripe-customers";

describe("stripe customers", () => {
  it("detects Stripe missing-customer errors when switching API modes", () => {
    expect(
      isMissingStripeCustomerError({
        type: "StripeInvalidRequestError",
        code: "resource_missing",
        statusCode: 404,
      }),
    ).toBe(true);
  });

  it("does not swallow unrelated Stripe errors", () => {
    expect(
      isMissingStripeCustomerError({
        type: "StripeAuthenticationError",
        code: "api_key_expired",
        statusCode: 401,
      }),
    ).toBe(false);
  });
});
