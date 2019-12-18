import path from "path";

import { WebDriver, Builder, Capabilities } from "selenium-webdriver";

describe("aaarray#xbrowser", () => {
    let driver: WebDriver;

    beforeAll(async () => {
        const capabilities: Capabilities = ((browser: string): Capabilities => {
            switch (browser) {
                case "ie": {
                    const driverPath = path.join(__dirname, "..", "Selenium.WebDriver.IEDriver.3.150.0/driver/");
                    process.env.PATH = `${process.env.PATH};${driverPath};`;
                    return Capabilities.ie()
                        .set("ignoreProtectedModeSettings", true)
                        .set("ignoreZoomSetting", true);
                }

                case "safari": {
                    return Capabilities.safari();
                }

                case "firefox": {
                    require("geckodriver");
                    return Capabilities.firefox().set("acceptInsecureCerts", true);
                }

                case "chrome": {
                    require("chromedriver");
                    return Capabilities.chrome().set("chromeOptions", {
                        args: ["--no-sandbox", "--disable-gpu"],
                    });
                }

                default:
                    throw new Error(`Unknown browser type "${browser}"`);
            }
        })(process.env.BROWSER || "chrome");

        // Create the driver
        driver = await new Builder().withCapabilities(capabilities).build();
        // Navigate the driver to the page for testing
        await driver.get(`file://${path.resolve(__dirname, "resources", "index.html")}`);
    });

    afterAll(async () => {
        await driver.quit();
    });

    it("Should load the test page", async () => {
        expect(await driver.getTitle()).toBe("AAArray");
    });

    it("Should have an exported AA wrapper function", async () => {
        expect(await driver.executeScript("return typeof AA")).toBe("function");
    });

    it("Should have an exported AAArray class", async () => {
        expect(await driver.executeScript("return typeof AAArray")).toBe("function");
    });

    it("Should wait for AAArray to map", async () => {
        expect(await driver.executeScript("return AA([1,2,3]).map(n => n + 1).get(0)")).toBe(2);
    });

});
