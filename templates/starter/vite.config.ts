import { configDefaults, defineConfig } from "vitest/config"
import path from "path"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { powerApps } from "@microsoft/power-apps-vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), powerApps()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      reporter: ["text", "json-summary", "json"],
      thresholds: {
        branches: 80,
        functions: 80,
        lines: 80,
        statements: 80,
      },
    },
    environment: "jsdom",
    exclude: [...configDefaults.exclude, "e2e/**"],
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
    setupFiles: "./src/test/setup.ts",
    css: true,
  },
})
