import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import ReleaseSmartLinkPage from "./page";

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

describe("ReleaseSmartLinkPage", () => {
  it("renders the public Case44 SmartLink release page", async () => {
    const page = await ReleaseSmartLinkPage({
      params: Promise.resolve({ releaseSlug: "case44-long-way-home" }),
    });
    const text = getText(page);

    expect(text).toContain("Long Way Home");
    expect(text).toContain("Case44");
    expect(text).toContain("Listen, follow, and catch the local STL release push");
    expect(text).toContain("Spotify");
    expect(text).toContain("Apple Music");
    expect(text).toContain("YouTube");
    expect(text).toContain("Get release updates");
    expect(text).toContain("No passwords. No guaranteed playlist claims.");
    expect(text).toContain("Featured STL release");
    expect(text).toContain("Built for fans, venues, and launch-day sharing.");
    expect(
      collectElementsWithProp(page, "src", "/images/hero-ai-01.png"),
    ).toHaveLength(1);
  });
});
