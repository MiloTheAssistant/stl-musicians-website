import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
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

function findElementByType(node: ReactNode, type: string): React.ReactElement<{ className?: string }> | undefined {
  if (Array.isArray(node)) {
    for (const child of node) {
      const match = findElementByType(child, type);

      if (match) {
        return match;
      }
    }
  }

  if (!isValidElement<{ children?: ReactNode; className?: string }>(node)) {
    return undefined;
  }

  if (node.type === type) {
    return node;
  }

  return findElementByType(node.props.children, type);
}

describe("SiteHeader", () => {
  it("uses one sign-up and sign-in link for dashboard access", () => {
    const links = collectLinks(SiteHeader());
    const labels = links.map((link) => link.text);

    expect(labels).not.toContain("Dashboard Login");
    expect(labels).not.toContain("Musician Login");
    expect(labels).not.toContain("Join");
    expect(links).toContainEqual({ href: "/dashboard", text: "Sign-Up / Sign-In" });
  });

  it("keeps the discovery navigation visible in the header", () => {
    const nav = findElementByType(SiteHeader(), "nav");

    expect(nav?.props.className).toContain("flex");
    expect(nav?.props.className).toContain("order-3");
    expect(nav?.props.className).not.toContain("hidden");
  });
});
