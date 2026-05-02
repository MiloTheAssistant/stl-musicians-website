import { describe, expect, it } from "vitest";
import {
  canAccessDashboardRole,
  getDashboardLandingForUser,
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

  it("limits the admin dashboard to administrator email addresses", () => {
    expect(canAccessDashboardRole("admin", "milotheassistant@gmail.com")).toBe(true);
    expect(canAccessDashboardRole("admin", "artist@example.com")).toBe(false);
    expect(canAccessDashboardRole("musician", "artist@example.com")).toBe(true);
  });
});
