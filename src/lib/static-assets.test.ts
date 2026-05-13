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

  it("publishes a curated llms.txt for public AI navigation", () => {
    const llms = readFileSync(join(process.cwd(), "public", "llms.txt"), "utf8");

    expect(llms).toMatch(/^# STL-Musicians\.com/);
    expect(llms).toContain("https://stl-musicians.com/musicians");
    expect(llms).toContain("https://stl-musicians.com/contact");
    expect(llms).toContain("contact@stl-musicians.com");
    expect(llms).not.toContain("/dashboard");
    expect(llms).not.toContain("/sign-in");
    expect(llms).not.toContain("/sign-up");
  });
});
