import { test, expect } from "@playwright/test";

test("homepage has correct content", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByText("Bas van Driel")).toBeVisible();
});