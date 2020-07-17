import { WebDriver, Builder, Capabilities } from "selenium-webdriver";
import { Server } from "node-static";
import http from "http";

const BROWSER = process.env.BROWSER || "chrome";

// Async runner function that is bound to a driver instance to execute a wrapped async script.
async function execScript(this: WebDriver, script: string): Promise<any> {
    return this.executeAsyncScript(`var done = arguments[0]; (${script}).then(done)`);
}

describe("aaarray#xbrowser", () => {
    // Set the timeout for all tests to be longer for the sake of CI systems
    jest.setTimeout(120000);

    // Re-usable static web server
    let server: http.Server;

    // Re-usable WebDriver instance
    let driver: WebDriver;

    //  pointer to script execution function
    let AAScript: (script: string) => ReturnType<typeof execScript>;

    // Create the web server to get around browser restrictions for local fiels that require GUI interaction.
    // Note that this is bound to the base directory in order to access the built files.
    beforeAll(async () => {
        const file = new Server(".");

        server = http.createServer((req, res) => {
            req.addListener("end", () => file.serve(req, res)).resume();
        });

        return new Promise((resolve, reject) => {
            server.on("listening", resolve);
            server.on("error", reject);

            server.listen(8080);
        });
    });

    beforeAll(async () => {
        const capabilities: Capabilities = ((browser: string): Capabilities => {
            switch (browser) {
                case "ie": {
                    require("iedriver");
                    return Capabilities.ie()
                        .set("ignoreProtectedModeSettings", true)
                        .set("ignoreZoomSetting", true);
                }

                case "edge": {
                    require("edgedriver");
                    return Capabilities.edge();
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
                        args: ["--headless", "--no-sandbox", "--disable-gpu"],
                    });
                }

                default:
                    throw new Error(`Unknown browser type "${browser}"`);
            }
        })(BROWSER);

        // Create the driver
        driver = await new Builder()
            .forBrowser(BROWSER)
            .withCapabilities(capabilities)
            .build();

        // Assign the script executor
        AAScript = execScript.bind(driver);

        // Navigate the driver to the page for testing
        await driver.get("http://localhost:8080/test/resources/index.html");
    });

    afterAll(async () => {
        return new Promise((resolve, reject) => {
            server.close((err?: Error) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
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
        expect(await AAScript("AA([1,2,3]).map(function(n) { return n + 1; }).get(0)")).toBe(2);
    });
});
