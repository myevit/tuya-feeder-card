import { test, expect } from "@playwright/test";
import { attrs, setup, calls } from "./fixtures";

test("rounded tiles open sheet; independent toggle; local edit/delete/reset make no calls", async ({
  page,
}) => {
  await setup(page);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Time 1", { exact: true })).toHaveCount(0);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByLabel("Time 1", { exact: true }).fill("09:13");
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await expect(page.locator(".time").first()).toHaveText("09:13");
  await page.getByRole("button", { name: "Edit meal 2", exact: true }).click();
  await page.getByRole("button", { name: "Delete meal", exact: true }).click();
  await page
    .getByRole("button", { name: "Confirm Delete", exact: true })
    .click();
  await expect(page.locator(".meal")).toHaveCount(1);
  await page.getByRole("button", { name: "Reset draft" }).click();
  await expect(page.locator(".meal")).toHaveCount(2);
  expect(await calls(page)).toEqual([]);
  const switchBox = (await page
    .getByRole("switch", { name: "Enabled 1", exact: true })
    .boundingBox())!;
  expect(switchBox.width).toBeGreaterThanOrEqual(44);
  expect(switchBox.height).toBeGreaterThanOrEqual(44);
  const tile = await page
    .getByRole("button", { name: "Edit meal 1", exact: true })
    .evaluate((el) => ({
      font: getComputedStyle(el.querySelector(".time")!).fontSize,
      radius: getComputedStyle(el.parentElement!).borderRadius,
    }));
  expect(tile).toEqual({ font: "34px", radius: "20px" });
  await page.screenshot({ path: "test-results/apple-tiles-synthetic.png" });
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await page.screenshot({ path: "test-results/apple-sheet-synthetic.png" });
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Edit meal 1", exact: true }),
  ).toBeFocused();
});

test("historical Save explicitly acknowledges original receipt warning", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    snapshot_source: "restored",
    supports_schedule_write: false,
    supports_restored_schedule_write: true,
    requires_restored_snapshot_acknowledgement: true,
  });
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Done", exact: true }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("dialog")).toContainText(
    "Based on saved schedule from",
  );
  await expect(page.getByRole("dialog")).toContainText(
    "External app changes could be overwritten",
  );
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Confirm Save" }).click();
  expect((await calls(page))[0][2].acknowledge_restored_snapshot).toBe(true);
  await expect(page.locator("section")).toHaveAttribute("inert", "");
});
