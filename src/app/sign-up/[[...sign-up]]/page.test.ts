import { SignUp } from "@clerk/nextjs";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import SignUpPage from "./page";

function findElementByType(node: ReactNode, type: unknown): ReactElement | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findElementByType(child, type);

      if (match) {
        return match;
      }
    }
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return undefined;
  }

  if (node.type === type) {
    return node;
  }

  return findElementByType(node.props.children, type);
}

describe("SignUpPage", () => {
  it("sends local musician sign-up attempts back to the accessible dashboard when Clerk is not configured", async () => {
    const originalPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const originalSecretKey = process.env.CLERK_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    delete process.env.CLERK_SECRET_KEY;

    try {
      await expect(
        SignUpPage({
          searchParams: Promise.resolve({ role: "musician" }),
        } as never),
      ).rejects.toThrow("NEXT_REDIRECT");
    } finally {
      if (originalPublishableKey) {
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalPublishableKey;
      }
      if (originalSecretKey) {
        process.env.CLERK_SECRET_KEY = originalSecretKey;
      }
    }
  });

  it("sends a musician role sign-up to the musician dashboard", async () => {
    const originalPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    const originalSecretKey = process.env.CLERK_SECRET_KEY;
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock";
    process.env.CLERK_SECRET_KEY = "sk_test_mock";

    try {
      const page = await SignUpPage({
        searchParams: Promise.resolve({ role: "musician" }),
      } as never);
      const signUp = findElementByType(page, SignUp);

      expect(signUp?.props).toMatchObject({
        fallbackRedirectUrl: "/dashboard/musician",
        forceRedirectUrl: "/dashboard/musician",
      });
    } finally {
      if (originalPublishableKey) {
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalPublishableKey;
      } else {
        delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      }
      if (originalSecretKey) {
        process.env.CLERK_SECRET_KEY = originalSecretKey;
      } else {
        delete process.env.CLERK_SECRET_KEY;
      }
    }
  });
});
