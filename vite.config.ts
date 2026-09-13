import { defineConfig } from "vite-plus";
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
});
