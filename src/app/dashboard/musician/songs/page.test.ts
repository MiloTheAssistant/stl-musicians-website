import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import SongsDashboardPage from "./page";

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

describe("SongsDashboardPage", () => {
  it("renders the musician song command center for Case44", async () => {
    const page = await SongsDashboardPage();
    const text = getText(page);
    const forms = collectElements(page, "form");

    expect(text).toContain("Songs Command Center");
    expect(text).toContain("Long Way Home");
    expect(text).toContain("Release visibility");
    expect(text).toContain("Account readiness");
    expect(text).toContain("Spotify Campaign Kit");
    expect(text).toContain("Apple Music Promote");
    expect(text).toContain("TikTok for Artists");
    expect(text).toContain("Bandsintown");
    expect(text).toContain("STL-Musicians paid boosts");
    expect(text).toContain("OAuth later");
    expect(forms.length).toBeGreaterThanOrEqual(4);
  });
});
