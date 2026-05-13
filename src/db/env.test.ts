import { describe, expect, it } from "vitest";
import { getDatabaseUrl, hasDatabaseUrl } from "./env";

describe("database env", () => {
  it("uses the standard DATABASE_URL first", () => {
    expect(
      getDatabaseUrl({
        DATABASE_URL: "postgres://standard",
        Command_Center_DATABASE_URL: "postgres://neon-prefixed",
      }),
    ).toBe("postgres://standard");
  });

  it("uses the Vercel Neon integration variable when DATABASE_URL is absent", () => {
    expect(
      getDatabaseUrl({
        Command_Center_DATABASE_URL: "postgres://neon-prefixed",
      }),
    ).toBe("postgres://neon-prefixed");
    expect(
      hasDatabaseUrl({
        Command_Center_DATABASE_URL: "postgres://neon-prefixed",
      }),
    ).toBe(true);
  });
});
