import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import PricingPage from "./page";

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

describe("PricingPage", () => {
  it("renders subscription checkout options and paid promotion products", () => {
    const page = PricingPage();
    const text = getText(page);
    const forms = collectElements(page, "form");

    expect(text).toContain("Basic Trial");
    expect(text).toContain("Song Tier");
    expect(text).toContain("Album Tier");
    expect(text).toContain("$19");
    expect(text).toContain("$190");
    expect(text).toContain("$39");
    expect(text).toContain("$390");
    expect(text).toContain("Monthly checkout");
    expect(text).toContain("Yearly checkout");
    expect(text).toContain("Song release promotion");
    expect(text).toContain("Album launch campaign");
    expect(text).toContain("Event attendance push");
    expect(text).toContain("Featured artist placement");
    expect(text).toContain("Promotion checkout");
    expect(forms).toHaveLength(0);
  });
});
