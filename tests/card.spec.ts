import { test, expect } from "@playwright/test";
import { attrs, setup, calls } from "./fixtures";
const open = (page: any) =>
  page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
const plus = (page: any) =>
  page.getByLabel("Portions", { exact: true }).fill("4");
const save = (page: any) =>
  page.getByRole("button", { name: "Save", exact: true }).click();
const changed = () =>
  attrs.meals.map((m, i) => ({ ...m, portions: i === 0 ? 4 : m.portions }));
const incoming = (page: any, a: any) =>
  page.evaluate((a: any) => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: { "sensor.mock_feeder": { state: "ready", attributes: a } },
    };
  }, a);

test("one logical update, unchanged rows preserved, empty ACK remains busy until matching fresh report", async ({
  page,
}) => {
  await setup(page);
  await open(page);
  await plus(page);
  await save(page);
  await expect(page.getByLabel("Time", { exact: true })).toHaveCount(0);
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "update_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 1,
        meal_index: 0,
        meal: changed()[0],
      },
    ],
  ]);
  await incoming(page, { ...attrs, pending: true, error: "transient report" });
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
  for (const a of [
    { ...attrs, meals: changed() },
    { ...attrs, revision: 2, meals: changed() },
    {
      ...attrs,
      revision: 2,
      meals: changed(),
      schedule_valid: false,
      last_received_at: "2026-01-01T00:01:00Z",
    },
    {
      ...attrs,
      revision: 2,
      meals: changed(),
      snapshot_source: "restored",
      last_received_at: "2026-01-01T00:01:00Z",
    },
  ]) {
    await incoming(page, a);
    await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
  }
  await incoming(page, {
    ...attrs,
    revision: 2,
    meals: changed(),
    last_received_at: "2026-01-01T00:01:00Z",
  });
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.getByLabel("Portions 1", { exact: true })).toHaveText("4");
  await expect(page.getByLabel("Portions 2", { exact: true })).toHaveText("2");
  expect((await calls(page)).length).toBe(1);
});

test("matching report before handler rejection cannot show success or leak technical error", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass.callService = (...a: any[]) => {
      (window as any).calls.push(a);
      return new Promise((_, reject) => {
        (window as any).rejectSave = reject;
      });
    };
  });
  await open(page);
  await plus(page);
  await save(page);
  await incoming(page, {
    ...attrs,
    revision: 2,
    meals: changed(),
    last_received_at: "2026-01-01T00:01:00Z",
  });
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
  await page.evaluate(() =>
    (window as any).rejectSave(new Error("Stale revision private details")),
  );
  await expect(page.locator(".status")).toHaveText("Couldn’t save. Try again.");
  await expect(page.locator("ha-card")).not.toContainText("private details");
  expect((await calls(page)).length).toBe(1);
});

test("watchdog retains edit; explicit retry reopens it and never automatically resends", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await open(page);
  await plus(page);
  await save(page);
  await page.clock.fastForward(21000);
  await expect(page.locator(".status")).toHaveText("Couldn’t save. Try again.");
  expect((await calls(page)).length).toBe(1);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByLabel("Portions", { exact: true })).toHaveValue("4");
  expect((await calls(page)).length).toBe(1);
  await save(page);
  expect((await calls(page)).length).toBe(2);
});

test("revision change even without dirty fields aborts editor and cannot delete shifted index", async ({
  page,
}) => {
  await setup(page);
  await open(page);
  await incoming(page, { ...attrs, revision: 2, meals: [attrs.meals[1]] });
  await expect(page.getByLabel("Time", { exact: true })).toHaveCount(0);
  await expect(page.locator(".status")).toHaveText(
    "Schedule changed. Reload to continue.",
  );
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Reload", exact: true }).click();
  await expect(page.locator(".time")).toHaveText("19:45");
  await open(page);
  await page.getByRole("button", { name: "Delete", exact: true }).click();
  await incoming(page, { ...attrs, revision: 3 });
  await expect(
    page.getByRole("button", { name: "Delete", exact: true }),
  ).toHaveCount(0);
  expect(await calls(page)).toEqual([]);
});

test("add is one disabled meal with same-level Save and no automatic service", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Add meal" }).click();
  await expect(page.getByLabel("Time", { exact: true })).toHaveValue("23:59");
  await expect(
    page.getByRole("switch", { name: "Enabled", exact: true }),
  ).not.toBeChecked();
  await expect(page.getByLabel("Portions", { exact: true })).toHaveValue("1");
  await expect(page.getByLabel("Portions", { exact: true })).toHaveAttribute(
    "min",
    "1",
  );
  expect(await calls(page)).toEqual([]);
  await save(page);
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

test("unchanged/reverted edit and invalid time disable Save, bounds clamp safely", async ({
  page,
}) => {
  await setup(page);
  await open(page);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await plus(page);
  await page.getByLabel("Portions", { exact: true }).fill("3");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Time", { exact: true }).fill("");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await incoming(page, {
    ...attrs,
    revision: 2,
    meals: [{ ...attrs.meals[0], portions: 60 }],
  });
  await open(page);
  await page.getByLabel("Portions", { exact: true }).fill("61");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  expect(await calls(page)).toEqual([]);
});

test("ten meals disable add, Escape closes edit without calls", async ({
  page,
}) => {
  await setup(page, { ...attrs, meals: Array(10).fill(attrs.meals[0]) });
  await expect(page.getByRole("button", { name: "Add meal" })).toBeDisabled();
  await open(page);
  await plus(page);
  await page.keyboard.press("Escape");
  await expect(
    page.getByRole("button", { name: "Edit meal 1", exact: true }),
  ).toBeFocused();
  expect(await calls(page)).toEqual([]);
});

for (const [name, a] of Object.entries({
  unknown: {},
  legacy: {
    meals: [{ days: "Everyday", time: "12:30", portions: 1, enabled: true }],
  },
  weekday: { ...attrs, meals: [{ ...attrs.meals[0], days: ["monday"] }] },
  time: { ...attrs, meals: [{ ...attrs.meals[0], time: "24:00" }] },
  boolean: { ...attrs, meals: [{ ...attrs.meals[0], enabled: "yes" }] },
  zero: { ...attrs, meals: [{ ...attrs.meals[0], portions: 0 }] },
  over: { ...attrs, meals: [{ ...attrs.meals[0], portions: 61 }] },
  rows: { ...attrs, meals: Array(11).fill(attrs.meals[0]) },
  pending: { ...attrs, pending: true },
  unconfirmed: { ...attrs, schedule_valid: false },
  restored: { ...attrs, snapshot_source: "restored" },
  revision_string: { ...attrs, revision: "1" },
  revision_zero: { ...attrs, revision: 0 },
  receipt_invalid: { ...attrs, last_received_at: "bad" },
  extra_fields: { ...attrs, meals: [{ ...attrs.meals[0], extra: true }] },
  coerced_time: { ...attrs, meals: [{ ...attrs.meals[0], time: ["08:12"] }] },
  capability: { ...attrs, supports_schedule_write: false },
  error: { ...attrs, error: "private technical error" },
})) {
  test(`fail closed ${name} with plain unavailable and Retry`, async ({
    page,
  }) => {
    await setup(page, a);
    await expect(page.locator("ha-card")).toContainText("Schedule unavailable");
    await expect(
      page.getByRole("button", { name: "Retry", exact: true }),
    ).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Save", exact: true }),
    ).toHaveCount(0);
    expect(await calls(page)).toEqual([]);
  });
}

test("historical acknowledgement is explicit in-card checkbox and only one logical operation", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    snapshot_source: "restored",
    supports_schedule_write: false,
    supports_restored_schedule_write: true,
    requires_restored_snapshot_acknowledgement: true,
  });
  await open(page);
  await plus(page);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await page.getByRole("checkbox", { name: "Use saved plan?" }).check();
  await save(page);
  expect((await calls(page))[0][2].acknowledge_restored_snapshot).toBe(true);
  await expect(page.getByRole("dialog")).toHaveCount(0);
});

test("service error preserves failed draft and only explicit retry can send again", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass.callService = async (...a: any[]) => {
      (window as any).calls.push(a);
      throw new Error("synthetic refusal");
    };
  });
  await open(page);
  await plus(page);
  await save(page);
  await expect(page.locator(".status")).toHaveText("Couldn’t save. Try again.");
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await expect(page.getByLabel("Portions", { exact: true })).toHaveValue("4");
  expect((await calls(page)).length).toBe(1);
});
