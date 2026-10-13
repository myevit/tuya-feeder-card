import { test, expect } from "@playwright/test";
import { attrs, setup, calls } from "./fixtures";

test("busy list cannot toggle/add or repeat a confirmed Save", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await page.getByLabel("Portions", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("switch", { name: "Enabled 1", exact: true }),
  ).toBeDisabled();
  await expect(page.getByRole("button", { name: "Add meal" })).toBeDisabled();
  expect((await calls(page)).length).toBe(1);
});

async function manual(page: any, helper = false) {
  await setup(page, {
    ...attrs,
    supports_manual_feed: true,
    manual_feed_pending: false,
  });
  await page.evaluate((helper: boolean) => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      manual_feed: true,
      ...(helper ? { portions_entity: "input_number.mock_portions" } : {}),
    });
    if (helper)
      c.hass = {
        ...c.hass,
        states: {
          ...c.hass.states,
          "input_number.mock_portions": {
            state: "4",
            attributes: { min: 1, max: 60 },
          },
        },
      };
  }, helper);
}

test("manual selection makes no feeding call, confirmation snapshots exact dose, cancel sends nothing", async ({
  page,
}) => {
  await manual(page);
  await page.getByRole("button", { name: "Increase feeding portions" }).click();
  await expect(page.getByLabel("Feeding portions", { exact: true })).toHaveText(
    "2",
  );
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Feed", exact: true }).click();
  await expect(page.locator("ha-dialog")).toHaveAttribute(
    "header-title",
    "Feed 2 portions?",
  );
  await expect(page.getByRole("dialog")).toHaveCount(0);
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Feed", exact: true }).click();
  await page.getByRole("button", { name: "Feed now", exact: true }).click();
  expect(await calls(page)).toEqual([
    ["tuya_feeder", "feed", { entity_id: "sensor.mock_feeder", portions: 2 }],
  ]);
});

test("persistent helper keeps existing value and bounds; helper updates never feed; confirmation dose immutable", async ({
  page,
}) => {
  await manual(page, true);
  await expect(page.getByLabel("Feeding portions", { exact: true })).toHaveText(
    "4",
  );
  await page.getByRole("button", { name: "Increase feeding portions" }).click();
  expect(await calls(page)).toEqual([
    ["input_number", "increment", { entity_id: "input_number.mock_portions" }],
  ]);
  await page.getByRole("button", { name: "Feed", exact: true }).click();
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: {
        ...c.hass.states,
        "input_number.mock_portions": {
          state: "60",
          attributes: { min: 1, max: 60 },
        },
      },
    };
  });
  await expect(page.locator("ha-dialog")).toHaveAttribute(
    "header-title",
    "Feed 4 portions?",
  );
  await page.getByRole("button", { name: "Feed now", exact: true }).click();
  expect((await calls(page))[1]).toEqual([
    "tuya_feeder",
    "feed",
    { entity_id: "sensor.mock_feeder", portions: 4 },
  ]);
  await expect(
    page.getByRole("button", { name: "Increase feeding portions" }),
  ).toBeDisabled();
});

test("manual row is optional, unsupported service disables feed, no calls on container tap", async ({
  page,
}) => {
  await setup(page);
  await expect(
    page.getByRole("button", { name: "Feed", exact: true }),
  ).toHaveCount(0);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true });
  });
  await expect(
    page.getByRole("button", { name: "Feed", exact: true }),
  ).toBeDisabled();
  await page.locator("h2").click();
  expect(await calls(page)).toEqual([]);
});

for (const width of [640, 320])
  test(`combined manual row does not overflow ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 760 });
    await manual(page, true);
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.setConfig({ ...c.config, title: "Pet", icon: "mdi:food-drumstick" });
    });
    await expect(page.locator("h2")).toHaveText("Pet");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    const b = (await page.locator(".manual").boundingBox())!;
    expect(b.height).toBeGreaterThanOrEqual(68);
    await page.screenshot({
      path: `test-results/kiosk-combined-mock-${width}.png`,
      fullPage: true,
    });
    expect(await calls(page)).toEqual([]);
  });
