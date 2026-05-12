import { expect, test } from "@playwright/test"

test("starter app renders and updates the counter", async ({ page }) => {
  await page.goto("/")

  await expect(
    page.getByRole("heading", { name: "Power + Code" })
  ).toBeVisible()

  const counter = page.getByRole("button", { name: "count is 0" })
  await counter.click()

  await expect(page.getByRole("button", { name: "count is 1" })).toBeVisible()
})
