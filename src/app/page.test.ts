import { isValidElement, type ReactElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import Home from "./page";

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

function collectElements<TProps extends { children?: ReactNode }>(
  node: ReactNode,
  predicate: (element: ReactElement<TProps>) => boolean,
): ReactElement<TProps>[] {
  if (Array.isArray(node)) {
    return node.flatMap((child) => collectElements(child, predicate));
  }

  if (!isValidElement<TProps>(node)) {
    return [];
  }

  const matches = predicate(node) ? [node] : [];

  return [...matches, ...collectElements(node.props.children, predicate)];
}

describe("Home", () => {
  it("keeps login portal cards uniform when a title is longer", () => {
    const page = Home();
    const portalCards = collectElements<{ children?: ReactNode; className?: string }>(
      page,
      (element) =>
        element.type === "article" &&
        getText(element).includes("Member / Small Venue Login"),
    );

    expect(portalCards).toHaveLength(1);
    expect(portalCards[0].props.className).toContain("flex");
    expect(portalCards[0].props.className).toContain("min-h-72");

    const titles = collectElements<{ children?: ReactNode; className?: string }>(
      page,
      (element) =>
        element.type === "h3" &&
        ["Musician / Band Login", "Promoter Login", "Member / Small Venue Login", "Admin Login"].includes(
          getText(element).trim(),
        ),
    );

    expect(titles).toHaveLength(4);
    for (const title of titles) {
      expect(title.props.className).toContain("min-h-14");
      expect(title.props.className).toContain("text-lg");
      expect(title.props.className).toContain("leading-tight");
    }

    const memberTitle = titles.find((title) => getText(title).trim() === "Member / Small Venue Login");

    expect(memberTitle?.props.className).toContain("text-balance");
  });
});
