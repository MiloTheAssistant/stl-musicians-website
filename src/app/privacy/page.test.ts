import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/content";
import PrivacyPage, { metadata } from "./page";

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

describe("PrivacyPage", () => {
  it("publishes a functional STL-Musicians privacy policy", () => {
    const page = PrivacyPage();
    const text = getText(page).replace(/\s+/g, " ");
    const links = collectLinks(page);

    expect(metadata.title).toBe("Privacy Policy");
    expect(siteConfig.legalOperator).toBe("Digital Energy Holdings, LLC");

    expect(text).toContain("Digital Energy Holdings, LLC");
    expect(text).toContain("Last updated: May 6, 2026");
    expect(text).toContain("The platform is intended for users who are 18 or older.");
    expect(text).toContain("account, profile, booking, messaging, promotion, payment, and subscription information");
    expect(text).toContain("Moderated profile, event, photo, video, audio, and other media submissions");
    expect(text).toContain("Google Analytics, Google advertising tools, Meta Pixel, and Meta advertising tools");
    expect(text).toContain("payments, subscriptions, paid promotions, booking requests, invoices, receipts, risk review, refunds, chargebacks, and tax or accounting records");
    expect(text).toContain("St. Louis, MO");
    expect(text).not.toContain("placeholder");
    expect(text).not.toContain("Shopify");

    expect(links).toContainEqual({
      href: "mailto:contact@stl-musicians.com",
      text: "contact@stl-musicians.com",
    });
    expect(links).toContainEqual({
      href: "tel:+15735000064",
      text: "(573) 500-0064",
    });
  });
});
