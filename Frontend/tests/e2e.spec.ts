import { test, expect } from "@playwright/test";

// E2E: flusso signup -> login -> lista articoli
test.describe("Hextech Hub E2E", () => {
  const apiBase = process.env.API_BASE_URL || "http://localhost:8080";

  test("signup and login", async ({ page, request }) => {
    // Signup via API backend
    const email = `user${Date.now()}@example.com`;
    const password = "Password123!";
    const fullName = "Test User";
    const resp = await request.post(`${apiBase}/api/auth/signup`, {
      data: { email, password, fullName },
    });
    expect(resp.ok()).toBeTruthy();

    // UI login
    await page.goto("/");
    await page.getByRole("button", { name: /login/i }).click();
    await page.getByLabel(/email/i).fill(email);
    await page.getByLabel(/password/i).fill(password);
    await page.getByRole("button", { name: /sign in/i }).click();
    await page.waitForTimeout(500);

    // Verifica che il menu account (logout) sia visibile
    await expect(page.getByRole("button", { name: /logout/i })).toBeVisible();
  });

  test("articles list and create", async ({ page }) => {
    await page.goto("/#/Article");
    // Verifica presenza lista (fallback o backend)
    await expect(page.getByText(/Articles/i)).toBeVisible();
    // Prova a pubblicare (senza login deve mostrare errore)
    await page.getByLabel(/Title/i).fill("My Title");
    await page.getByLabel(/Excerpt/i).fill("Some content...");
    await page.getByRole("button", { name: /publish/i }).click();
    await expect(page.getByText(/Devi effettuare il login/i)).toBeVisible();
  });
});