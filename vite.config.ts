import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { fileURLToPath } from "url";

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
        sourcemap: true,
        rollupOptions: {
            output: {
                exports: "named",
            },
        },
    },
    esbuild: {
        target: "es2022",
    },
});
