import { test, expect } from "@playwright/test";
import { attrs, setup } from "./fixtures";

test("native schedule uses typed response-capable LocalTuya service", async ({
  page,
}) => {
  await setup(page, { ...attrs, native_feeder_profile: "ft11w" });
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await page.getByLabel("Portions", { exact: true }).fill("4");
  await page.getByRole("button", { name: "Save", exact: true }).click();
  const call = await page.evaluate(() => (window as any).calls[0]);
  expect(call).toEqual([
    "localtuya",
    "update_feeder_meal",
    {
      entity_id: "sensor.mock_feeder",
      expected_revision: 1,
      meal_index: 0,
      meal: { ...attrs.meals[0], portions: 4 },
    },
    undefined,
    undefined,
    true,
  ]);
});

test("lost feed acknowledgement stays guarded against duplicate taps", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    native_feeder_profile: "ft11w",
    supports_manual_feed: true,
    feeding_pending: false,
    feeding_state: "idle",
  });
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true });
    c.hass.callService = async (...args: any[]) => {
      (window as any).calls.push(args);
      throw new Error("private refusal");
    };
  });
  await page.getByRole("button", { name: "Feed", exact: true }).click();
  await page.getByRole("button", { name: "Feed now", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Feed", exact: true }),
  ).toBeDisabled();
  const calls = await page.evaluate(() => (window as any).calls);
  expect(calls).toEqual([
    [
      "localtuya",
      "feed",
      { entity_id: "sensor.mock_feeder", portions: 1, confirmed: true },
      undefined,
      undefined,
      true,
    ],
  ]);
  await expect(page.locator(".status")).toContainText("Check the feeder");
});

for (const profile of [undefined, "other"])
  test(`non-native profile ${profile} cannot schedule or feed`, async ({
    page,
  }) => {
    await setup(page, {
      ...attrs,
      native_feeder_profile: profile,
      supports_manual_feed: true,
    });
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true });
    });
    await expect(page.getByRole("button", { name: "Add meal" })).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Feed", exact: true }),
    ).toBeDisabled();
    expect(await page.evaluate(() => (window as any).calls)).toEqual([]);
  });

test("native last meal cannot be deleted; restored read-only meals remain visible", async ({
  page,
}) => {
  await setup(page, { ...attrs, meals: [attrs.meals[0]] });
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Delete", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: {
        "sensor.mock_feeder": {
          state: "1",
          attributes: {
            ...c.hass.states["sensor.mock_feeder"].attributes,
            snapshot_source: "restored",
            supports_schedule_write: false,
            supports_restored_schedule_write: false,
          },
        },
      },
    };
  });
  await expect(page.locator(".time")).toHaveText("08:15");
  await expect(
    page.getByRole("button", { name: "Edit meal 1", exact: true }),
  ).toBeDisabled();
  expect(await page.evaluate(() => (window as any).calls)).toEqual([]);
});
