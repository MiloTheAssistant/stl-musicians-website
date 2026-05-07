import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { siteConfig } from "@/lib/content";
import { SiteFooter } from "./site-footer";

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

describe("SiteFooter", () => {
  it("publishes the site contact email, phone, and location", () => {
    const footer = SiteFooter();
    const text = getText(footer).replace(/\s+/g, " ");
    const links = collectLinks(footer);

    expect(siteConfig.email).toBe("contact@stl-musicians.com");
    expect(siteConfig.phone).toBe("(573) 500-0064");
    expect(siteConfig.location).toBe("St. Louis, MO");

    expect(text).toContain("Contact email: contact@stl-musicians.com");
    expect(text).toContain("Contact phone: (573) 500-0064");
    expect(text).toContain("Location: St. Louis, MO");

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
