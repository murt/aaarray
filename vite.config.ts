import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { fileURLToPath } from "url";
import pkg from "./package.json" with { type: "json" };

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
    plugins: [dts({ rollupTypes: true })],
    build: {
        lib: {
            entry: resolve(__dirname, "src/index.ts"),
            name: "AA",
            formats: ["umd"],
            fileName: () => "aaarray.js",
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
