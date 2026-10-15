import { test, expect } from "@playwright/test";
import { setup, attrs, calls } from "./fixtures";

for (const width of [320, 360, 400, 600]) {
  for (const enabled of [false, true]) {
    test(`Feed has comfortable fixed space at ${width}px active=${enabled}`, async ({ page }) => {
      await setup(page, { ...attrs, meals: attrs.meals.map(m => ({ ...m, enabled })) });
      await page.evaluate((width) => {
        const c: any = document.querySelector("tuya-feeder-card");
        c.style.display = "block";
        c.style.width = `${width}px`;
        c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true, feed_title: "Example" });
      }, width);
      const feed = page.locator("header .feed");
      await expect(feed).toBeVisible();
      const geometry = await feed.evaluate(el => {
        const b = el.getBoundingClientRect();
        const header = el.parentElement!.getBoundingClientRect();
        const previous = el.previousElementSibling!.getBoundingClientRect();
        const style = getComputedStyle(el);
        return { width: b.width, height: b.height, right: b.right, limit: header.right, gap: b.left - previous.right, padding: parseFloat(style.paddingLeft), overflow: el.scrollWidth > el.clientWidth };
      });
      expect(geometry.width).toBeGreaterThanOrEqual(76);
      expect(geometry.height).toBeGreaterThanOrEqual(44);
      expect(geometry.padding).toBeGreaterThanOrEqual(16);
      expect(geometry.gap).toBeGreaterThanOrEqual(8);
      expect(geometry.right).toBeLessThanOrEqual(geometry.limit);
      expect(geometry.overflow).toBe(false);
      expect(await calls(page)).toEqual([]);
    });
  }
}
