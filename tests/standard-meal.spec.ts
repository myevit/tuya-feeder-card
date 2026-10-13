import { test, expect } from "@playwright/test";
import { setup, attrs, calls } from "./fixtures";
test("standard meal icon is the only immediate toggle; title only edits", async ({
  page,
}) => {
  await setup(page);
  await expect(page.locator(".meal > .meal-toggle")).toHaveCount(2);
  await expect(page.locator(".meal input")).toHaveCount(0);
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  expect((await calls(page)).length).toBe(1);
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toHaveCount(0);
});
test("last feeding subtitle uses HA timezone and no persistent status footer", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    last_feed_at: "2026-01-01T20:00:00Z",
    last_feed_source: "local_dp4_feeding_edge",
  });
  await page.clock.install({ time: new Date("2026-01-01T23:00:00Z") });
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = { ...c.hass, config: { time_zone: "America/Edmonton" } };
  });
  await expect(page.locator(".last-feed")).toHaveText("Last fed 13:00");
  await expect(page.locator("ha-card > .status")).toHaveCount(0);
});

for (const [value, expected] of [
  [null, "No recent feeding"],
  ["invalid", "No recent feeding"],
  ["2026-01-01T13:00:00", "No recent feeding"],
  ["2026-01-02T20:00:00Z", "No recent feeding"],
  ["2025-12-31T23:30:00Z", "Last fed yesterday · 16:30"],
  ["2025-12-29T23:30:00Z", "Last fed Dec 29 · 16:30"],
])
  test(`last feed safe formatting ${String(value)}`, async ({ page }) => {
    await setup(page, { ...attrs, last_feed_at: value });
    await page.clock.install({ time: new Date("2026-01-01T23:00:00Z") });
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.hass = { ...c.hass, config: { time_zone: "America/Edmonton" } };
    });
    await expect(page.locator(".last-feed")).toHaveText(expected);
  });
test("rapid title/icon keyboard actions stay isolated", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).focus();
  await page.keyboard.press("Enter");
  await expect(page.locator("tuya-feeder-meal-dialog")).toHaveCount(1);
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).focus();
  await page.keyboard.press("Space");
  expect((await calls(page)).length).toBe(1);
  await expect(page.locator("tuya-feeder-meal-dialog")).toHaveCount(0);
});
