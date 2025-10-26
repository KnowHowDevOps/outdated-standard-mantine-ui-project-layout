import { test, expect, type Page } from "@playwright/test";

test.describe("About page", () => {
  test("renders core sections and links", async ({ page }: { page: Page }) => {
    await page.goto("/about");

    await expect(
      page.getByRole("heading", { name: "About This Template" })
    ).toBeVisible();

    await expect(page.getByText("Technology Stack")).toBeVisible();
    await expect(page.getByText("React 19")).toBeVisible();

    await expect(page.getByText("Architecture")).toBeVisible();
    await expect(page.getByText("Feature-Sliced Design")).toBeVisible();

    await expect(page.getByText("Getting Started")).toBeVisible();

    const ghLink = page.getByRole("link", { name: "View on GitHub" });
    await expect(ghLink).toBeVisible();
    await expect(ghLink).toHaveAttribute(
      "href",
      "https://github.com/IQKV/standard-mantine-ui-project-layout"
    );
  });
});
