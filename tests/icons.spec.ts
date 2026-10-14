import { test, expect } from "@playwright/test";
import { setup, calls, attrs } from "./fixtures";

for (const [label, extra] of [
  [
    "maximum",
    { meals: Array.from({ length: 10 }, () => ({ ...attrs.meals[0] })) },
  ],
  ["pending", { pending: true }],
  ["unavailable", { supports_schedule_write: false }],
  ["physical pending", { feeding_pending: true }],
] as const) {
  test(`Add identity is disabled for ${label}`, async ({ page }) => {
    await setup(page, { ...attrs, ...extra });
    await expect(
      page.getByRole("button", { name: "Add meal", exact: true }),
    ).toBeDisabled();
    expect(await calls(page)).toEqual([]);
  });
}

test("portion plus remains a helper-only action and Feed retains separate physical confirmation", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    supports_manual_feed: true,
    feeding_pending: false,
  });
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      manual_feed: true,
      portions_entity: "input_number.mock_portions",
    });
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        "input_number.mock_portions": {
          state: "3",
          attributes: { min: 1, max: 60, step: 1 },
        },
      },
    };
  });
  await page
    .getByRole("button", { name: "Increase feeding portions", exact: true })
    .click();
  expect(await calls(page)).toEqual([
    ["input_number", "increment", { entity_id: "input_number.mock_portions" }],
  ]);
  await page.getByRole("button", { name: "Add meal", exact: true }).click();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await calls(page)).length).toBe(1);
  await page.getByRole("button", { name: "Feed", exact: true }).click();
  await expect(
    page.getByText("This dispenses food immediately."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect((await calls(page)).length).toBe(1);
});

test("meal glyphs follow scheduled local HH:MM with all day boundaries and fixed override", async ({
  page,
}) => {
  const times = [
    "00:00",
    "04:59",
    "05:00",
    "10:59",
    "11:00",
    "15:59",
    "16:00",
    "20:59",
    "21:00",
    "23:59",
  ];
  await setup(page, {
    ...attrs,
    meals: times.map((time) => ({ ...attrs.meals[0], time })),
  });
  const icons = () =>
    page
      .locator(".meal-toggle ha-icon")
      .evaluateAll((es: any[]) => es.map((e) => e._icon));
  expect(await icons()).toEqual([
    "mdi:weather-night",
    "mdi:weather-night",
    "mdi:weather-sunset-up",
    "mdi:weather-sunset-up",
    "mdi:white-balance-sunny",
    "mdi:white-balance-sunny",
    "mdi:weather-sunset-down",
    "mdi:weather-sunset-down",
    "mdi:weather-night",
    "mdi:weather-night",
  ]);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      icon: "mdi:cat",
      meal_icon_mode: "fixed",
      meal_icon: "mdi:clock-outline",
    });
  });
  expect(await icons()).toEqual(times.map(() => "mdi:clock-outline"));
  expect(await calls(page)).toEqual([]);
});

test("icon palette is independent of Feed accent with state contrast", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      appearance: { icon_color: "rgb(10, 180, 170)" },
    });
    c.style.setProperty("--accent-color", "orange");
  });
  const styles = await page.evaluate(() => {
    const r: any = document.querySelector("tuya-feeder-card")!.shadowRoot;
    return [
      ...r.querySelectorAll(".identity-add ha-icon,.meal-toggle ha-icon"),
    ].map((e: any) => ({
      bg: getComputedStyle(e).backgroundColor,
      color: getComputedStyle(e).color,
    }));
  });
  expect(styles).toEqual([
    { bg: "rgb(10, 180, 170)", color: "rgb(255, 255, 255)" },
    { bg: "rgb(10, 180, 170)", color: "rgb(255, 255, 255)" },
    { bg: "rgba(0, 0, 0, 0)", color: "rgb(10, 180, 170)" },
  ]);
  expect(await calls(page)).toEqual([]);
});

test("identity icon is the only Add target; opening and cancelling never writes", async ({
  page,
}) => {
  await setup(page);
  const add = page
    .locator("header")
    .getByRole("button", { name: "Add meal", exact: true });
  await expect(add).toHaveCount(1);
  await expect(
    page.getByRole("button", { name: "Add meal", exact: true }),
  ).toHaveCount(1);
  await expect(page.locator("section .add")).toHaveCount(0);
  const box = await add.boundingBox();
  expect(box!.width).toBeGreaterThanOrEqual(44);
  expect(box!.height).toBeGreaterThanOrEqual(44);
  await add.click();
  await expect(page.locator("ha-form")).toBeVisible();
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await add.click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "add_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 1,
        meal: {
          days: attrs.meals[0].days,
          time: "23:59",
          portions: 1,
          enabled: false,
        },
      },
    ],
  ]);
});
