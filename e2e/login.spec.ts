import { test, expect, type Page } from "@playwright/test";

test.describe("Login page", () => {
  test("renders form fields and navigation link", async ({ page }: { page: Page }) => {
    await page.goto("/login");

    await expect(page.getByRole("heading", { name: "Welcome back!" })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Sign In" })).toBeVisible();

    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();

    await expect(page.getByRole("button", { name: "Sign In" })).toBeVisible();

    const registerLink = page.getByRole("link", { name: "Create account" });
    await expect(registerLink).toBeVisible();
    await expect(registerLink).toHaveAttribute("href", "/register");
  });
});
