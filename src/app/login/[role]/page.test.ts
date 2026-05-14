import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import RoleLoginPage from "./page";

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

describe("RoleLoginPage", () => {
  it("uses a role-specific photorealistic musician hero instead of the old abstract block", async () => {
    const page = await RoleLoginPage({
      params: Promise.resolve({ role: "musician" }),
    });
    const text = getText(page);

    expect(text).toContain("Musician / Band Login");
    expect(text).toContain("Release command");
    expect(text).toContain("Manage songs, shows, assets, and launch packages");
    expect(text).not.toContain("stage-visual");
    expect(
      collectElementsWithProp(
        page,
        "src",
        "/images/hero-ai-03.png",
      ),
    ).toHaveLength(1);
  });
});
