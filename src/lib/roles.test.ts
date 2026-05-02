import { describe, expect, it } from "vitest";
import { getDashboardForRole, isKnownRole } from "./roles";

describe("role routing", () => {
  it("routes every supported role to its dashboard", () => {
    expect(getDashboardForRole("musician")).toBe("/dashboard/musician");
    expect(getDashboardForRole("promoter")).toBe("/dashboard/promoter");
    expect(getDashboardForRole("member")).toBe("/dashboard/member");
    expect(getDashboardForRole("admin")).toBe("/dashboard/admin");
  });

  it("rejects unknown role values", () => {
    expect(isKnownRole("promoter")).toBe(true);
    expect(isKnownRole("venue")).toBe(false);
    expect(isKnownRole(undefined)).toBe(false);
  });
});
