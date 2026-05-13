import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import SongsCartPage from "./page";

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

describe("SongsCartPage", () => {
  it("renders an empty campaign cart with multi-item checkout guidance", async () => {
    const page = await SongsCartPage();
    const text = getText(page);

    expect(text).toContain("Campaign Cart");
    expect(text).toContain("Pump Up The Jams");
    expect(text).toContain("Multi-item Stripe Checkout");
    expect(text).toContain("Add more boosts");
    expect(text).toContain("No campaign boosts yet");
  });
});
