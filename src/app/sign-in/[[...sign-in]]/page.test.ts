import { SignIn } from "@clerk/nextjs";
import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import SignInPage from "./page";

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

describe("SignInPage", () => {
  it("sends a musician role sign-in to the musician dashboard", async () => {
    const originalPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock";

    try {
      const page = await SignInPage({
        searchParams: Promise.resolve({ role: "musician" }),
      } as never);
      const signIn = findElementByType(page, SignIn);

      expect(signIn?.props).toMatchObject({
        fallbackRedirectUrl: "/dashboard/musician",
        forceRedirectUrl: "/dashboard/musician",
      });
    } finally {
      if (originalPublishableKey) {
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalPublishableKey;
      } else {
        delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      }
    }
  });
});
