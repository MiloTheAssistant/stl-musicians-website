import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RoleDashboardPage from "./page";

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

function collectElements(node: ReactNode, type: string): ReactElement[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => collectElements(child, type));
  }

  if (!isValidElement<{ children?: ReactNode }>(node)) {
    return [];
  }

  const children = collectElements(node.props.children, type);

  if (node.type === type) {
    return [node, ...children];
  }

  return children;
}

function collectElementsWithProp(
  node: ReactNode,
  propName: string,
  propValue: string,
): ReactElement[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) =>
      collectElementsWithProp(child, propName, propValue),
    );
  }

  if (!isValidElement<Record<string, unknown> & { children?: ReactNode }>(node)) {
    return [];
  }

  const children = collectElementsWithProp(
    node.props.children,
    propName,
    propValue,
  );

  if (node.props[propName] === propValue) {
    return [node, ...children];
  }

  return children;
}

describe("RoleDashboardPage", () => {
  it("presents Case44 as a musician workspace without developer-only links", async () => {
    const page = await RoleDashboardPage({
      params: Promise.resolve({ role: "musician" }),
    });
    const text = getText(page);
    const iframes = collectElements(page, "iframe");

    expect(text).toContain("Musician / Band");
    expect(text).toContain("Case44 Workspace");
    expect(text).toContain("Songs Promoted");
    expect(text).toContain("Social Media Impact");
    expect(text).toContain("Next 14 Days");
    expect(text).toContain("Edit Products");
    expect(text).toContain("Billing");
    expect(text).toContain("Song Tier");
    expect(text).toContain("Current plan:");
    expect(text).toContain("Billing status:");
    expect(text).not.toContain("GitHub repo");
    expect(text).not.toContain("Account entry");
    expect(collectElementsWithProp(page, "alt", "Case44 band logo")).toHaveLength(1);
    expect(iframes).toHaveLength(0);
  });

  it("does not show the Case44 website preview for other dashboards", async () => {
    const page = await RoleDashboardPage({
      params: Promise.resolve({ role: "promoter" }),
    });

    expect(getText(page)).not.toContain("Case44 Workspace");
    expect(collectElements(page, "iframe")).toHaveLength(0);
  });

  it("shows every musician and band in the admin dashboard", async () => {
    const page = await RoleDashboardPage({
      params: Promise.resolve({ role: "admin" }),
    });
    const text = getText(page);

    expect(text).toContain("Musicians / Bands");
    expect(text).toContain("Case44");
    expect(text).toContain("Riverfront Brass Union");
    expect(text).toContain("North Side Current");
    expect(text).toContain("Red Clay Revival");
    expect(text).toContain("Arc Light Saints");
    expect(text).toContain("Blue Hour Confessional");
    expect(text).toContain("Lo-Fi Arch Session");
    expect(text).toContain("Payment Operations");
    expect(text).toContain("Billing and Promotion Status");
    expect(text).toContain("Active subscriptions");
    expect(text).toContain("Paid promotions");
  });
});
