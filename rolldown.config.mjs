import { defineConfig } from "rolldown";

export default defineConfig({
  input: "src/index.ts",
  output: [
    {
      file: "dist/honeymate.js",
      format: "iife",
      sourcemap: false,
    },
    {
      file: "dist/honeymate.min.js",
      format: "iife",
      sourcemap: false,
      minify: true,
    },
  ],
});
