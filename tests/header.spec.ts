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
  await page.getByRole("button", { name: "Save", exact: true }).click();
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

test("computed defaults match generic standard action/entity reference, not an accent inactive icon", async ({
  page,
}) => {
  await setup(page, { ...attrs, meals: [] });
  await page.addStyleTag({
    content: `body { --primary-color: #ff9f09; --accent-color: #ff9f09; --state-icon-color: white; --primary-text-color: white; --ha-card-background: rgba(10,10,10,.4); } .reference { color:white; background:var(--ha-card-background); } .reference .icon {color:#9da0a2;background:transparent;} .reference.active {color:black;background:white;} .reference.active .icon {color:white;background:var(--accent-color);}`,
  });
  await page.evaluate(() => {
    const e = document.createElement("div");
    e.className = "reference";
    e.innerHTML = '<span class="icon"></span>';
    document.body.append(e);
  });
  for (const active of [false, true]) {
    await page.evaluate(
      ({ active, a }) => {
        document
          .querySelector(".reference")!
          .classList.toggle("active", active);
        const c: any = document.querySelector("tuya-feeder-card");
        c.hass = {
          ...c.hass,
          states: {
            "sensor.mock_feeder": {
              state: "ready",
              attributes: { ...a, meals: active ? a.meals : [] },
            },
          },
        };
      },
      { active, a: attrs },
    );
    const ref = await page
      .locator(".reference")
      .evaluate((e) => ({
        background: getComputedStyle(e).backgroundColor,
        text: getComputedStyle(e).color,
        icon: getComputedStyle(e.querySelector(".icon")!).color,
        iconBackground: getComputedStyle(e.querySelector(".icon")!)
          .backgroundColor,
      }));
    const card = await page
      .locator("ha-card")
      .evaluate((e) => ({
        background: getComputedStyle(e).backgroundColor,
        text: getComputedStyle(e).color,
        icon: getComputedStyle(e.querySelector("header > ha-icon")!).color,
        iconBackground: getComputedStyle(e.querySelector("header > ha-icon")!)
          .backgroundColor,
      }));
    expect(card).toEqual(ref);
  }
  await page.addStyleTag({
    content:
      "tuya-feeder-card { --feeder-active-card-background: rgb(20,30,40); --feeder-active-text-color: rgb(200,210,220); --feeder-active-icon-background: rgb(50,60,70); --feeder-active-icon-color: rgb(230,240,250); }",
  });
  expect(
    await page
      .locator("ha-card")
      .evaluate((e) => getComputedStyle(e).backgroundColor),
  ).toBe("rgb(20, 30, 40)");
  expect(
    await page
      .locator("header > ha-icon")
      .evaluate((e) => getComputedStyle(e).color),
  ).toBe("rgb(230, 240, 250)");
  expect(await calls(page)).toEqual([]);
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
  await expect(page.locator("header > ha-icon")).toHaveCount(1);
  expect(
    await page.locator("header > ha-icon").evaluate((e: any) => e._icon),
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
