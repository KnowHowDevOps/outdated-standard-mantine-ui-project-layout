import { test, expect, type Page } from "@playwright/test";

test.describe("Register page", () => {
  test("renders form fields and navigation link", async ({
    page,
  }: {
    page: Page;
  }) => {
    await page.goto("/register");

    await expect(
      page.getByRole("heading", { name: "Create your account" })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Create Account" })
    ).toBeVisible();

    await expect(page.getByLabel("First Name")).toBeVisible();
    await expect(page.getByLabel("Last Name")).toBeVisible();
    await expect(page.getByLabel("Email")).toBeVisible();
    await expect(page.getByLabel("Password")).toBeVisible();
    await expect(page.getByLabel("Confirm Password")).toBeVisible();

    await expect(
      page.getByRole("button", { name: "Create Account" })
    ).toBeVisible();

    const loginLink = page.getByRole("link", { name: "Sign in" });
    await expect(loginLink).toBeVisible();
    await expect(loginLink).toHaveAttribute("href", "/login");
  });
});
