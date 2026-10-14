import { test, expect } from "@playwright/test";
import { setup, calls, attrs } from "./fixtures";

for (const [name, meals, valid, source, state, active] of [
  ["zero", [], true, "received", "ready", false],
  [
    "disabled",
    attrs.meals.map((m) => ({ ...m, enabled: false })),
    true,
    "received",
    "ready",
    false,
  ],
  ["one", attrs.meals, true, "received", "ready", true],
  [
    "multiple",
    attrs.meals.map((m) => ({ ...m, enabled: true })),
    true,
    "received",
    "ready",
    true,
  ],
  ["invalid", attrs.meals, false, "received", "ready", false],
  ["unknown", attrs.meals, true, "received", "unknown", false],
  ["restored", attrs.meals, true, "restored", "ready", true],
] as const)
  test(`confirmed active style ${name}`, async ({ page }) => {
    await setup(page, {
      ...attrs,
      meals,
      schedule_valid: valid,
      snapshot_source: source,
    });
    await page.evaluate((state) => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.hass = {
        ...c.hass,
        states: {
          "sensor.mock_feeder": {
            ...c.hass.states["sensor.mock_feeder"],
            state,
          },
        },
      };
    }, state);
    await expect(page.locator("ha-card")).toHaveAttribute(
      "data-active",
      String(active),
    );
    expect(await calls(page)).toEqual([]);
  });

test("draft enable does not change active card until matching confirmed attributes arrive", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    meals: attrs.meals.map((m) => ({ ...m, enabled: false })),
  });
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await expect(page.locator("ha-card")).toHaveAttribute("data-active", "false");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("data-active", "false");
  await page.evaluate((a) => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: {
        "sensor.mock_feeder": {
          state: "ready",
          attributes: {
            ...a,
            revision: 2,
            last_received_at: "2026-01-01T00:01:00Z",
          },
        },
      },
    };
  }, attrs);
  await expect(page.locator("ha-card")).toHaveAttribute("data-active", "true");
});

test("independent standard surfaces use saved meal activity and transparent wrapper", async ({
  page,
}) => {
  await setup(page);
  await page.addStyleTag({
    content:
      "tuya-feeder-card {--accent-color:orange;--primary-text-color:white;--secondary-text-color:gray;}",
  });
  const actual = await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card"),
      r = c.shadowRoot;
    const styles = (el: any) => ({
      bg: getComputedStyle(el).backgroundColor,
      color: getComputedStyle(el).color,
    });
    return {
      outer: styles(r.querySelector("ha-card")),
      header: styles(r.querySelector("header")),
      rows: [...r.querySelectorAll(".meal")].map((el: any) => ({
        surface: styles(el),
        title: styles(el.querySelector(".time")),
        detail: styles(el.querySelector(".detail")),
        icon: styles(el.querySelector("ha-icon")),
      })),
    };
  });
  expect(actual.outer.bg).toBe("rgba(0, 0, 0, 0)");
  expect(actual.header.bg).toBe("rgb(255, 255, 255)");
  expect(actual.rows[0].surface.bg).toBe("rgb(255, 255, 255)");
  expect(actual.rows[0].title.color).toBe("rgb(0, 0, 0)");
  expect(actual.rows[0].detail.color).toBe("rgba(0, 0, 0, 0.5)");
  expect(actual.rows[0].icon.bg).toBe("rgb(255, 165, 0)");
  expect(actual.rows[1].surface.bg).toBe("rgba(0, 0, 0, 0.3)");
  expect(actual.rows[1].title.color).toBe("rgb(255, 255, 255)");
  expect(actual.rows[1].detail.color).toBe("rgba(255, 255, 255, 0.5)");
  expect(actual.rows[1].icon.bg).toBe("rgba(0, 0, 0, 0.2)");
  expect(actual.rows[1].icon.color).toBe("rgb(255, 255, 255)");
});

test("single identity header merges manual controls and preserves legacy fallback", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      manual_feed: true,
      feed_title: "Example",
      feed_icon: "mdi:food-drumstick",
    });
  });
  await expect(page.locator("header")).toHaveCount(1);
  await expect(page.locator("h2")).toHaveText("Example");
  await expect(page.locator("header .identity-add ha-icon")).toHaveCount(1);
  expect(
    await page
      .locator("header .identity-add ha-icon")
      .evaluate((e: any) => e._icon),
  ).toBe("mdi:food-drumstick");
  await expect(
    page.locator("header").getByLabel("Feeding portions", { exact: true }),
  ).toBeVisible();
  await expect(page.locator("ha-card")).not.toContainText("Feeder schedule");
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder" });
  });
  await expect(page.locator("h2")).toHaveText("Feeder");
  expect(await calls(page)).toEqual([]);
});
