import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
    testDir: "./test",
    testMatch: "**/browser.test.ts",
    timeout: 120000,
    projects: [
        { name: "chromium", use: { ...devices["Desktop Chrome"], headless: true } },
        { name: "firefox", use: { ...devices["Desktop Firefox"], headless: true } },
        { name: "webkit", use: { ...devices["Desktop Safari"], headless: true } },
    ],
});
