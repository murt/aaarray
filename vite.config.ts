import { defineConfig } from "vite-plus";
//import { playwright } from "vite-plus/test/browser-playwright";
import { resolve } from "path";
import { fileURLToPath } from "url";

import pkg from "./package.json" with { type: "json" };

const __dirname = fileURLToPath(new URL(".", import.meta.url));


export default defineConfig({
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "AA",
            formats: ["umd"],
        },
        target: "es2022",
        sourcemap: true,
        rollupOptions: {
            output: {
                exports: "named",
                banner: `/*! aaarray v${pkg.version} | MIT */`,
            },
        },
    },
    test: {
        include: ["test/*.test.ts"],
        exclude: ["test/browser.test.ts"],
        browser: {
            //provider: playwright()
        }
    },
    fmt: {
        printWidth: 120,
        trailingComma: "es5",
        singleQuote: false,
        quoteProps: "consistent",
        tabWidth: 4,
        useTabs: false,
    },
});
