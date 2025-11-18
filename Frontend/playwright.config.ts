import { defineConfig } from "@playwright/test";

// Configurazione Playwright per test end-to-end
export default defineConfig({
  testDir: "tests",
  timeout: 30_000,
  use: {
    baseURL: process.env.BASE_URL || "http://localhost:5173",
    headless: true,
  },
});