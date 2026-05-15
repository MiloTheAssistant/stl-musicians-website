import { describe, expect, it } from "vitest";
import {
  getCanonicalRedirectUrl,
  isProtectedDashboardPath,
  shouldRunClerkProtection,
} from "./proxy";

describe("proxy dashboard protection", () => {
  it("keeps the dashboard access landing page public", () => {
    expect(isProtectedDashboardPath("/dashboard")).toBe(false);
    expect(isProtectedDashboardPath("/dashboard/musician")).toBe(true);
    expect(isProtectedDashboardPath("/dashboard/promoter")).toBe(true);
    expect(isProtectedDashboardPath("/dashboard/member")).toBe(true);
    expect(isProtectedDashboardPath("/dashboard/admin")).toBe(true);
  });

  it("runs Clerk protection only for protected dashboard workspaces", () => {
    expect(shouldRunClerkProtection("/")).toBe(false);
    expect(shouldRunClerkProtection("/musicians")).toBe(false);
    expect(shouldRunClerkProtection("/dashboard")).toBe(false);
    expect(shouldRunClerkProtection("/dashboard/musician")).toBe(true);
  });
});

describe("canonical host redirect", () => {
  it("sends the public Vercel fallback host to the production domain", () => {
    const redirectUrl = getCanonicalRedirectUrl(
      "https://stl-musicians-website.vercel.app/sign-in?role=musician",
    );

    expect(redirectUrl?.toString()).toBe(
      "https://stl-musicians.com/sign-in?role=musician",
    );
  });

  it("leaves the production domain alone", () => {
    expect(
      getCanonicalRedirectUrl("https://stl-musicians.com/sign-in?role=musician"),
    ).toBeNull();
  });
});
