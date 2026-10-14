import { test, expect } from "@playwright/test";
import { setup, attrs, calls } from "./fixtures";
test("pending schedule stays silent with stable geometry and one guarded operation", async ({ page }) => {
  await setup(page);
  await page.evaluate(() => { const c: any = document.querySelector("tuya-feeder-card"); c.hass.callService = (...a: any[]) => { (window as any).calls.push(a); return new Promise(resolve => (window as any).resolve = resolve); }; });
  const card = page.locator("ha-card");
  const before = await card.boundingBox();
  const text = await card.innerText();
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(card).toHaveAttribute("aria-busy", "true");
  expect(await card.boundingBox()).toEqual(before);
  expect(await card.innerText()).toBe(text);
  await page.evaluate(() => { const c: any = document.querySelector("tuya-feeder-card"); for (let n = 0; n < 12; n++) c.shadowRoot.querySelector(".meal-toggle").click(); });
  expect((await calls(page)).length).toBe(1);
  await page.evaluate((a) => { const c: any = document.querySelector("tuya-feeder-card"); c.hass = { ...c.hass, states: { "sensor.mock_feeder": { state: "ready", attributes: { ...a, revision: 2, last_received_at: "2026-01-01T00:01:00Z", meals: a.meals.map((m: any, i: number) => ({ ...m, enabled: i === 0 ? false : m.enabled })) } } } }; }, attrs);
  await expect(card).toHaveAttribute("aria-busy", "true");
  await expect(page.locator(".status")).toHaveCount(0);
  await page.evaluate(() => (window as any).resolve({}));
  await expect(card).toHaveAttribute("aria-busy", "false");
  await expect(page.locator(".status")).toHaveCount(0);
  const completed = await card.boundingBox();
  expect(completed!.width).toBe(before!.width);
  // Genuine ON/OFF typography differs by one pixel; no feedback row is inserted.
  expect(Math.abs(completed!.height - before!.height)).toBeLessThanOrEqual(1);
  expect((await calls(page)).length).toBe(1);
});
