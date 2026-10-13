import { test, expect } from "@playwright/test";
import { attrs, setup, calls } from "./fixtures";

test("editor replaces list in card and Save sends exactly one meal", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(page.locator(".meal")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Back", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "update_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 1,
        meal_index: 0,
        meal: { ...attrs.meals[0], portions: 4 },
      },
    ],
  ]);
  await expect(page.locator(".status")).toHaveText("Saving…");
});

test("Cancel discards only this edit and list toggle opens approval in card", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Meal enabled", exact: true }),
  ).not.toBeChecked();
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(
    page.getByRole("switch", { name: "Enabled 1", exact: true }),
  ).toBeChecked();
  expect(await calls(page)).toEqual([]);
});

test("delete confirmation replaces edit view and never opens popup", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Edit meal 2", exact: true }).click();
  await page.getByRole("button", { name: "Delete meal", exact: true }).click();
  await expect(page.getByLabel("Time 2", { exact: true })).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await expect(page.getByLabel("Time 2", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Delete meal", exact: true }).click();
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "delete_meal",
      { entity_id: "sensor.mock_feeder", expected_revision: 1, meal_index: 1 },
    ],
  ]);
});

test("compact header Add icon is a distinct accessible 44px target; cancel sends nothing", async ({
  page,
}) => {
  await setup(page);
  const add = page.getByRole("button", { name: "Add meal", exact: true });
  expect(await add.innerText()).toBe("");
  const b = (await add.boundingBox())!;
  expect(b.width).toBeGreaterThanOrEqual(44);
  expect(b.height).toBeGreaterThanOrEqual(44);
  await add.click();
  await expect(page.getByLabel("Time 3", { exact: true })).toBeVisible();
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Back", exact: true }).click();
  await expect(page.locator(".meal")).toHaveCount(2);
  expect(await calls(page)).toEqual([]);
});

test("backend not yet reloaded cannot expose falsely working schedule controls", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = { ...c.hass, services: { tuya_feeder: { set_schedule: {} } } };
  });
  await expect(page.locator("ha-card")).toContainText("Schedule unavailable");
  await expect(
    page.getByRole("button", { name: "Add meal", exact: true }),
  ).toHaveCount(0);
  expect(await calls(page)).toEqual([]);
});
