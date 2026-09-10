import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"],
  target: "es2022",
  sourcemap: true,
  clean: true,
  alias: {
    "@": "./src",
  },
})