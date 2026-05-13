import { describe, expect, it } from "vitest";
import {
  canAccessBandWorkspace,
  canAccessDashboardRole,
  getDashboardLandingForUser,
  getMusicianMembershipForEmail,
  getPrimaryEmail,
  isAdministratorEmail,
} from "./dashboard-access";

describe("dashboard access", () => {
  it("treats milotheassistant@gmail.com as an administrator", () => {
    expect(isAdministratorEmail("milotheassistant@gmail.com")).toBe(true);
    expect(isAdministratorEmail("MiloTheAssistant@gmail.com")).toBe(true);
    expect(isAdministratorEmail("artist@example.com")).toBe(false);
  });

  it("extracts the Clerk primary email address", () => {
    expect(
      getPrimaryEmail({
        primaryEmailAddress: { emailAddress: "milotheassistant@gmail.com" },
      }),
    ).toBe("milotheassistant@gmail.com");
  });

  it("sends administrator users to the admin dashboard from the chooser", () => {
    expect(
      getDashboardLandingForUser({
        primaryEmailAddress: { emailAddress: "milotheassistant@gmail.com" },
      }),
    ).toBe("/dashboard/admin");
  });

  it("maps Case44 musician emails to the musician dashboard membership", () => {
    expect(getMusicianMembershipForEmail("case44@stl-musicians.com")).toMatchObject({
      bandSlug: "case44",
      dashboardHref: "/dashboard/musician",
      role: "admin",
    });
    expect(getMusicianMembershipForEmail("mtest@stl-musicians.com")).toMatchObject({
      bandSlug: "case44",
      dashboardHref: "/dashboard/musician",
      role: "member",
    });
    expect(
      getDashboardLandingForUser({
        primaryEmailAddress: { emailAddress: "mtest@stl-musicians.com" },
      }),
    ).toBe("/dashboard/musician");
  });

  it("limits the admin dashboard to administrator email addresses", () => {
    expect(canAccessDashboardRole("admin", "milotheassistant@gmail.com")).toBe(true);
    expect(canAccessDashboardRole("admin", "artist@example.com")).toBe(false);
    expect(canAccessDashboardRole("musician", "artist@example.com")).toBe(true);
  });

  it("limits the Case44 workspace to admins and the Case44 email", () => {
    expect(canAccessBandWorkspace("case44", "case44@stl-musicians.com")).toBe(true);
    expect(canAccessBandWorkspace("case44", "mtest@stl-musicians.com")).toBe(true);
    expect(canAccessBandWorkspace("case44", "milotheassistant@gmail.com")).toBe(true);
    expect(canAccessBandWorkspace("case44", "artist@example.com")).toBe(false);
  });
});
