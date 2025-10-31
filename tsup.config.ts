import { defineConfig } from "tsup";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    outDir: "dist",
    format: ["esm", "cjs"],
    dts: true,
    sourcemap: false,
    clean: true,
    target: "es2022",
    platform: "neutral",
  },
  {
    entry: ["src/cli/index.ts"],
    outDir: "dist/cli",
    format: ["esm", "cjs"],
    sourcemap: false,
    clean: false,
    target: "es2022",
    platform: "node",
    banner: { js: "#!/usr/bin/env node" },
    onSuccess: "chmod +x dist/cli/index.js",
  },
]);
