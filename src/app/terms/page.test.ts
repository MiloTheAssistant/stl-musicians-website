import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/content";
import TermsPage, { metadata } from "./page";

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

describe("TermsPage", () => {
  it("publishes functional STL-Musicians terms for platform transactions and content", () => {
    const page = TermsPage();
    const text = getText(page).replace(/\s+/g, " ");
    const links = collectLinks(page);

    expect(metadata.title).toBe("Terms of Service");
    expect(siteConfig.legalOperator).toBe("Digital Energy Holdings, LLC");

    expect(text).toContain("Digital Energy Holdings, LLC");
    expect(text).toContain("Last updated: May 6, 2026");
    expect(text).toContain("You must be 18 or older to use the platform.");
    expect(text).toContain("STL-Musicians.com facilitates bookings, paid promotions, subscriptions, messaging, and other platform transactions");
    expect(text).toContain("platform fees, service fees, subscription fees, promotion fees, booking fees, payment processing fees, taxes, refunds, chargebacks, and cancellation terms");
    expect(text).toContain("All profile, event, photo, video, audio, message, and promotional content may be moderated");
    expect(text).toContain("You may not upload, post, link, stream, sell, promote, or transmit content that infringes copyright, trademark, publicity, privacy, or other rights");
    expect(text).toContain("musicians, bands, promoters, small venues, members, and administrators");
    expect(text).toContain("Missouri law governs these Terms");
    expect(text).not.toContain("placeholder");
    expect(text).not.toContain("Shopify");

    expect(links).toContainEqual({
      href: "/privacy",
      text: "Privacy Policy",
    });
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
