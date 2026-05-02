import { isValidElement, type ReactNode } from "react";
import { describe, expect, it } from "vitest";
import DashboardIndexPage from "./page";

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

describe("DashboardIndexPage", () => {
  it("presents login and join choices for each dashboard access type", async () => {
    const page = await DashboardIndexPage();
    const text = getText(page);
    const links = collectLinks(page);

    expect(text).toContain("Dashboard Access");
    expect(text).toContain("Choose how you want to use STL-Musicians.com");
    expect(text).toContain("Musician / Band");
    expect(text).toContain("Promoter");
    expect(text).toContain("Member / Small Venue");
    expect(text).toContain("Admin");
    expect(text).toContain("Manage your public profile, music, photos, videos, shows, and paid promotion requests.");
    expect(text).toContain("Build campaigns, save artists, coordinate show opportunities, and track promotion outreach.");
    expect(text).toContain("Save favorite artists, request availability, plan private or venue bookings, and message directly.");
    expect(text).toContain("Review new profiles, curate events, monitor reports, and keep platform content trustworthy.");

    expect(links).toContainEqual({ href: "/sign-in?role=musician", text: "Login" });
    expect(links).toContainEqual({ href: "/sign-up?role=musician", text: "Join" });
    expect(links).toContainEqual({ href: "/sign-in?role=promoter", text: "Login" });
    expect(links).toContainEqual({ href: "/sign-up?role=promoter", text: "Join" });
    expect(links).toContainEqual({ href: "/sign-in?role=member", text: "Login" });
    expect(links).toContainEqual({ href: "/sign-up?role=member", text: "Join" });
    expect(links).toContainEqual({ href: "/sign-in?role=admin", text: "Login" });
    expect(links).toContainEqual({ href: "/sign-up?role=admin", text: "Join" });
  });
});
