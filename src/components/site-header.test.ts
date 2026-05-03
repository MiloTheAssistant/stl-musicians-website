import { Show, SignOutButton } from "@clerk/nextjs";
import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { BrandLogo } from "./brand-logo";
import { SiteHeader } from "./site-header";

type LinkMatch = {
  href: string;
  text: string;
};

function getText(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(getText).join("");
  }

  if (isValidElement<{ children?: ReactNode }>(node)) {
    return getText(node.props.children);
  }

  return "";
}

function collectLinks(node: ReactNode): LinkMatch[] {
  if (Array.isArray(node)) {
    return node.flatMap(collectLinks);
  }

  if (!isValidElement<{ href?: string; children?: ReactNode }>(node)) {
    return [];
  }

  const children = collectLinks(node.props.children);

  if (typeof node.props.href === "string") {
    return [
      {
        href: node.props.href,
        text: getText(node.props.children).replace(/\s+/g, " ").trim(),
      },
      ...children,
    ];
  }

  return children;
}

function findElementByType<TProps extends { children?: ReactNode }>(
  node: ReactNode,
  type: string | unknown,
): React.ReactElement<TProps> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findElementByType<TProps>(child, type);

      if (match) {
        return match;
      }
    }
  }

  if (!isValidElement<TProps>(node)) {
    return undefined;
  }

  if (node.type === type) {
    return node;
  }

  return findElementByType(node.props.children, type);
}

describe("SiteHeader", () => {
  it("renders a professional STL-Musicians brand lockup for the header", () => {
    const logo = BrandLogo({ variant: "header" });
    const text = getText(logo);

    expect(text).toContain("STL-Musicians.Com");
    expect(text).toContain("St. Louis music. One room. All night");
    expect(text).not.toContain("STL MusiciansSt. Louis");
  });

  it("uses one sign-up and sign-in link for dashboard access", () => {
    const links = collectLinks(SiteHeader());
    const labels = links.map((link) => link.text);

    expect(labels).not.toContain("Dashboard Login");
    expect(labels).not.toContain("Musician Login");
    expect(labels).not.toContain("Join");
    expect(links).toContainEqual({ href: "/dashboard", text: "Sign-Up / Sign-In" });
  });

  it("keeps the discovery navigation visible in the header", () => {
    const nav = findElementByType<{ children?: ReactNode; className?: string }>(SiteHeader(), "nav");

    expect(nav?.props.className).toContain("flex");
    expect(nav?.props.className).toContain("order-3");
    expect(nav?.props.className).not.toContain("hidden");
  });

  it("exposes dashboard and sign-out controls when signed in", () => {
    const originalPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = "pk_test_mock";

    try {
      const header = SiteHeader();
      const show = findElementByType<{ children?: ReactNode; fallback?: ReactNode; when?: string }>(
        header,
        Show,
      );
      const signOutButton = findElementByType<{ children?: ReactNode; redirectUrl?: string }>(
        show?.props.fallback,
        SignOutButton,
      );
      const signedInLinks = collectLinks(show?.props.fallback);

      expect(show?.props.when).toBe("signed-out");
      expect(signedInLinks).toContainEqual({ href: "/dashboard", text: "Dashboard" });
      expect(getText(show?.props.fallback)).toContain("Sign out");
      expect(signOutButton?.props.redirectUrl).toBe("/dashboard");
    } finally {
      if (originalPublishableKey) {
        process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = originalPublishableKey;
      } else {
        delete process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
      }
    }
  });
});
