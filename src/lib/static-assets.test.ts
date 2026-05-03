import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

describe("static browser assets", () => {
  it("serves a no-op service worker instead of routing /sw.js through the app", () => {
    const serviceWorker = readFileSync(join(process.cwd(), "public", "sw.js"), "utf8");

    expect(serviceWorker).toContain("self.addEventListener");
    expect(serviceWorker).toContain("install");
    expect(serviceWorker).toContain("fetch");
  });
});
