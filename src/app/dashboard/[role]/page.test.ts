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

describe("RoleDashboardPage", () => {
  it("publishes the Case44 website inside the musician dashboard", async () => {
    const page = await RoleDashboardPage({
      params: Promise.resolve({ role: "musician" }),
    });
    const text = getText(page);
    const iframes = collectElements(page, "iframe");

    expect(text).toContain("Musician / Band");
    expect(text).toContain("Published Band Website");
    expect(text).toContain("Case44 Website");
    expect(text).toContain("GitHub repo");
    expect(iframes).toHaveLength(1);
    expect(iframes[0].props).toMatchObject({
      title: "Case44 published website preview",
      src: "https://case44.vercel.app",
    });
  });

  it("does not show the Case44 website preview for other dashboards", async () => {
    const page = await RoleDashboardPage({
      params: Promise.resolve({ role: "promoter" }),
    });

    expect(getText(page)).not.toContain("Published Band Website");
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
  });
});
