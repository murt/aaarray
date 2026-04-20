import { test, expect } from "@playwright/test";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const testPage = `file://${resolve(dirname(fileURLToPath(import.meta.url)), "resources/index.html")}`;

test.describe("aaarray#browser", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(testPage);
    });

    test("Should load the test page", async ({ page }) => {
        expect(await page.title()).toBe("AAArray");
    });

    test("Should have an exported AA wrapper function", async ({ page }) => {
        expect(await page.evaluate(() => typeof (window as any).AA.AA)).toBe("function");
    });

    test("Should have an exported AAArray class", async ({ page }) => {
        expect(await page.evaluate(() => typeof (window as any).AA.AAArray)).toBe("function");
    });

    test("Should wait for AAArray to map", async ({ page }) => {
        const result = await page.evaluate(() =>
            (window as any).AA.AA([1, 2, 3])
                .map((n: number) => n + 1)
                .get(0)
        );
        expect(result).toBe(2);
    });
});
