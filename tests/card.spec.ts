import { test, expect } from "@playwright/test";
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
export const attrs = {
  meals: [
    { days, time: "08:15", portions: 3, enabled: true },
    { days, time: "19:45", portions: 2, enabled: false },
  ],
  revision: 1,
  last_received_at: "2026-01-01T00:00:00Z",
  observation_kind:
    "last locally reported snapshot; not an active schedule query",
  schedule_valid: true,
  snapshot_source: "received",
  pending: false,
  error: null,
  supports_schedule_write: true,
  supported_days_mode: "every_day",
  max_meals: 10,
  max_portions: 60,
};
async function setup(page: any, a: any = attrs) {
  await page.goto("/");
  await page.evaluate(async (a: any) => {
    await customElements.whenDefined("tuya-feeder-card");
    (window as any).calls = [];
    const c: any = document.createElement("tuya-feeder-card");
    c.setConfig({
      type: "custom:tuya-feeder-card",
      entity: "sensor.mock_feeder",
      title: "Feeder schedule",
    });
    c.hass = {
      states: { "sensor.mock_feeder": { state: "ready", attributes: a } },
      callService: async (...args: any[]) => {
        (window as any).calls.push(args);
        return {};
      },
    };
    document.body.append(c);
  }, a);
}
async function calls(page: any) {
  return page.evaluate(() => (window as any).calls);
}
async function incoming(page: any, a: any) {
  await page.evaluate((a: any) => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: { "sensor.mock_feeder": { state: "ready", attributes: a } },
    };
  }, a);
}
test("one complete payload; empty ACK stays busy; genuine report confirms", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Confirm Save" }).click();
  const meals = structuredClone(attrs.meals);
  meals[0].portions = 4;
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "set_schedule",
      { entity_id: "sensor.mock_feeder", expected_revision: 1, meals },
    ],
  ]);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  await incoming(page, {
    ...attrs,
    revision: 2,
    meals,
    schedule_valid: false,
  });
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  await incoming(page, {
    ...attrs,
    revision: 2,
    meals,
    last_received_at: "2026-01-01T00:01:00Z",
  });
  await expect(page.locator(".status")).toContainText("confirmed by incoming");
  expect((await calls(page)).length).toBe(1);
});
test("pending transient errors and old receipts never complete Save", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Confirm Save" }).click();
  const meals = structuredClone(attrs.meals);
  meals[0].portions = 4;
  await incoming(page, { ...attrs, pending: true, error: "transient report" });
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  await incoming(page, { ...attrs, meals });
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  await incoming(page, { ...attrs, meals, revision: 2 });
  await expect(page.locator("section")).toHaveAttribute("inert", "");
  await incoming(page, {
    ...attrs,
    meals,
    revision: 2,
    last_received_at: "2026-01-01T00:01:00Z",
  });
  await expect(page.locator(".status")).toContainText("confirmed by incoming");
});
test("missing HA updates time out without retry or discarding draft", async ({
  page,
}) => {
  await page.clock.install();
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Confirm Save" }).click();
  await page.clock.fastForward(21000);
  await expect(page.locator(".status")).toContainText("Confirmation timed out");
  await expect(page.locator("section")).not.toHaveAttribute("inert", "");
  await expect(page.getByLabel("Portions 1", { exact: true })).toHaveText("4");
  expect((await calls(page)).length).toBe(1);
});
test("reverted draft sends nothing", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Decrease portions 1" }).click();
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  expect(await calls(page)).toEqual([]);
});
test("integration descriptive received snapshot is editable", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    revision: 1,
    observation_kind:
      "last locally reported snapshot; not an active schedule query",
    schedule_valid: true,
    snapshot_source: "received",
  });
  await expect(
    page.getByRole("button", { name: "Increase portions 1" }),
  ).toBeEnabled();
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeEnabled();
});
test("stale revision blocks save until explicit reload", async ({ page }) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await incoming(page, { ...attrs, revision: 2 });
  await expect(page.locator(".status")).toContainText("changed while editing");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  expect(await calls(page)).toEqual([]);
  await page.getByRole("button", { name: "Reload schedule" }).click();
  await expect(page.getByLabel("Portions 1", { exact: true })).toHaveText("3");
});
test("add is disabled safe default; ten row and portion bounds", async ({
  page,
}) => {
  await setup(page);
  for (let i = 0; i < 8; i++)
    await page.getByRole("button", { name: "Add disabled meal" }).click();
  await expect(
    page.getByRole("button", { name: "Add disabled meal" }),
  ).toBeDisabled();
  await expect(page.getByLabel("Time 10", { exact: true })).toHaveValue(
    "23:59",
  );
  await expect(
    page.getByRole("switch", { name: "Enabled 10", exact: true }),
  ).not.toBeChecked();
  await expect(page.getByLabel("Portions 10", { exact: true })).toHaveText("1");
  await expect(
    page.getByRole("button", { name: "Decrease portions 10", exact: true }),
  ).toBeDisabled();
  expect(await calls(page)).toEqual([]);
  await incoming(page, { ...attrs, revision: 2 });
  await page.getByRole("button", { name: "Reload schedule" }).click();
  await incoming(page, {
    ...attrs,
    revision: 3,
    meals: [{ ...attrs.meals[0], portions: 60 }],
  });
  await expect(
    page.getByRole("button", { name: "Increase portions 1", exact: true }),
  ).toBeDisabled();
});
for (const [name, a] of Object.entries({
  unknown: {},
  legacy: {
    meals: [{ days: "Everyday", time: "12:30", portions: 1, enabled: true }],
  },
  weekday: { ...attrs, meals: [{ ...attrs.meals[0], days: ["moon"] }] },
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
})) {
  test(`fail closed ${name}`, async ({ page }) => {
    await setup(page, a);
    await expect(
      page.getByRole("button", { name: "Save", exact: true }),
    ).toBeDisabled();
    await expect(
      page.getByRole("button", { name: "Add disabled meal" }),
    ).toBeDisabled();
    expect(await calls(page)).toEqual([]);
  });
}
test("keyboard Escape cancels and restores focus without calls", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeFocused();
  expect(await calls(page)).toEqual([]);
});
test("config editor emits selected sensor, title and icon", async ({
  page,
}) => {
  await setup(page);
  const result = await page.evaluate(async () => {
    const e: any = document.createElement("tuya-feeder-card-editor");
    e.setConfig({ entity: "sensor.mock_feeder" });
    document.body.append(e);
    await e.updateComplete;
    let result: any;
    e.addEventListener(
      "config-changed",
      (ev: any) => (result = ev.detail.config),
    );
    e.shadowRoot.querySelector("ha-form").dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            entity: "sensor.mock_other",
            title: "Example",
            icon: "mdi:calendar",
          },
        },
      }),
    );
    return result;
  });
  expect(result).toEqual({
    entity: "sensor.mock_other",
    title: "Example",
    icon: "mdi:calendar",
  });
  expect(await calls(page)).toEqual([]);
});
test("invalid draft time blocks save and preserves other rows", async ({
  page,
}) => {
  await setup(page);
  await page.getByLabel("Time 1", { exact: true }).fill("");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
  await expect(page.getByLabel("Time 2", { exact: true })).toHaveValue("19:45");
  expect(await calls(page)).toEqual([]);
});
test("service error is visible and requires reload", async ({ page }) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass.callService = async () => {
      throw new Error("synthetic refusal");
    };
  });
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Confirm Save" }).click();
  await expect(page.locator(".status")).toContainText("synthetic refusal");
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toBeDisabled();
});
for (const width of [640, 320])
  test(`mock screenshot ${width}`, async ({ page }) => {
    await page.setViewportSize({ width, height: 760 });
    await setup(page);
    await expect(page.getByLabel("Time 1", { exact: true })).toBeVisible();
    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    );
    expect(overflow).toBe(false);
    await page.screenshot({
      path: `test-results/tuya-feeder-card-mock-${width}.png`,
      fullPage: true,
    });
  });
test("draft changes and confirmation cancellation make zero calls", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("button", { name: "Increase portions 1" }).click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await page.getByRole("button", { name: "Cancel", exact: true }).click();
  await page.getByRole("button", { name: "Reset draft" }).click();
  expect(await calls(page)).toEqual([]);
});
