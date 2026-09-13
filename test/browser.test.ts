import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

//import { test, expect } from "@playwright/test";
import { describe, expect, it, beforeEach } from "vite-plus/test";

const testPage = `file://${resolve(dirname(fileURLToPath(import.meta.url)), "resources/index.html")}`;

describe("aaarray#browser", () => {
  beforeEach(async ({ page }) => {
    await page.goto(testPage);
  });

  it("Should load the test page", async ({ page }) => {
    expect(await page.title()).toBe("AAArray");
  });

  it("Should have an exported AA wrapper function", async ({ page }) => {
    expect(await page.evaluate(() => typeof (window as any).AA)).toBe("function");
  });

  it("Should have an exported AAArray class", async ({ page }) => {
    expect(await page.evaluate(() => typeof (window as any).AAArray)).toBe("function");
  });

  it("Should wait for AAArray to map", async ({ page }) => {
    const result = await page.evaluate(() =>
      (window as any)
        .AA([1, 2, 3])
        .map((n: number) => n + 1)
        .get(0),
    );
    expect(result).toBe(2);
  });
});
