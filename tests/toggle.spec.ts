import { test, expect } from "@playwright/test";
import { setup, calls, attrs } from "./fixtures";
async function deferred(page: any) {
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      callService: (...a: any[]) => {
        (window as any).calls.push(a);
        return new Promise((resolve, reject) => {
          (window as any).resolve = resolve;
          (window as any).reject = reject;
        });
      },
    };
  });
}
async function incoming(page: any, overrides: any = {}) {
  await page.evaluate(
    ({ a, overrides }: any) => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.hass = {
        ...c.hass,
        states: {
          ...c.hass.states,
          "sensor.mock_feeder": {
            state: "ready",
            attributes: {
              ...a,
              revision: 2,
              last_received_at: "2026-01-01T00:01:00Z",
              meals: a.meals.map((m: any, i: number) =>
                i === 0 ? { ...m, enabled: false } : m,
              ),
              ...overrides,
            },
          },
        },
      };
    },
    { a: attrs, overrides },
  );
}
for (const order of ["before", "after"])
  test(`toggle waits for both genuine report and handler completion: report ${order}`, async ({
    page,
  }) => {
    await setup(page);
    await deferred(page);
    await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      const s = c.renderRoot.querySelector(".meal-toggle");
      s.dispatchEvent(new Event("change"));
    });
    expect((await calls(page)).length).toBe(1);
    if (order === "before") {
      await incoming(page);
      await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
      await page.evaluate(() =>
        (window as any).resolve({ confirmed: true, revision: 2 }),
      );
    } else {
      await page.evaluate(() =>
        (window as any).resolve({ confirmed: true, revision: 2 }),
      );
      await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
      await incoming(page);
    }
    await expect(page.locator(".status")).toHaveCount(0);
    await expect(
      page.getByRole("switch", { name: "Enabled 1", exact: true }),
    ).not.toBeChecked();
    expect((await calls(page)).length).toBe(1);
  });
for (const outcome of ["rejection", "explicit-unconfirmed", "error"])
  test(`toggle ${outcome} never claims success or retries`, async ({
    page,
  }) => {
    await setup(page);
    await deferred(page);
    await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
    if (outcome === "explicit-unconfirmed") await incoming(page);
    await page.evaluate((outcome) => {
      if (outcome === "rejection")
        (window as any).reject(Error("stale expected_revision"));
      else
        (window as any).resolve(
          outcome === "error"
            ? { error: "busy" }
            : { confirmed: false, revision: 2 },
        );
    }, outcome);
    await expect(page.locator(".status")).toContainText("Couldn’t change meal");
    await expect(
      page.getByRole("button", { name: "Save", exact: true }),
    ).toHaveCount(0);
    await expect(
      page.getByRole("button", { name: "Try again", exact: true }),
    ).toHaveCount(0);
    expect((await calls(page)).length).toBe(1);
    if (outcome !== "explicit-unconfirmed")
      await expect(
        page.getByRole("switch", { name: "Enabled 1", exact: true }),
      ).toBeChecked();
  });
for (const override of [
  { revision: 1 },
  { pending: true },
  {
    snapshot_source: "restored",
    supports_restored_schedule_write: true,
    requires_restored_snapshot_acknowledgement: true,
  },
  { last_received_at: attrs.last_received_at },
])
  test(`partial report does not finish ${JSON.stringify(override)}`, async ({
    page,
  }) => {
    await setup(page);
    await deferred(page);
    await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
    await page.evaluate(() => (window as any).resolve({}));
    await incoming(page, override);
    await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
    expect((await calls(page)).length).toBe(1);
  });
test("restored switch intent supplies strict true acknowledgement without checkbox", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    snapshot_source: "restored",
    supports_schedule_write: false,
    supports_restored_schedule_write: true,
    requires_restored_snapshot_acknowledgement: true,
  });
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "update_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 1,
        meal_index: 0,
        meal: { ...attrs.meals[0], enabled: false },
        acknowledge_restored_snapshot: true,
      },
    ],
  ]);
  await expect(page.getByLabel("Use saved plan?")).toHaveCount(0);
});
for (const override of [
  { schedule_valid: false },
  { supported_days_mode: "mixed" },
  { supports_schedule_write: false },
  { pending: true },
  { error: "unknown" },
  { meals: [{ ...attrs.meals[0], time: "invalid" }] },
  {
    snapshot_source: "restored",
    supports_restored_schedule_write: false,
    requires_restored_snapshot_acknowledgement: true,
  },
])
  test(`invalid snapshot blocks toggle ${JSON.stringify(override)}`, async ({
    page,
  }) => {
    await setup(page, { ...attrs, ...override });
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.toggle(0, { target: { checked: false } });
    });
    expect(await calls(page)).toEqual([]);
  });
test("schedule toggle blocks header Feed and external feed pending blocks toggle", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    supports_manual_feed: true,
    feeding_pending: false,
  });
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true });
  });
  await deferred(page);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Feed", exact: true }),
  ).toBeDisabled();
});
test("external backend feeding lock blocks list toggle and feed action", async ({
  page,
}) => {
  await setup(page, {
    ...attrs,
    supports_manual_feed: true,
    feeding_pending: true,
  });
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder", manual_feed: true });
  });
  await expect(
    page.getByRole("switch", { name: "Enabled 1", exact: true }),
  ).toBeDisabled();
  await expect(
    page.getByRole("button", { name: "Feed", exact: true }),
  ).toBeDisabled();
  expect(await calls(page)).toEqual([]);
});
test("external changed schedule during toggle denies rather than overwriting a shifted meal", async ({
  page,
}) => {
  await setup(page);
  await deferred(page);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await incoming(page, { meals: [attrs.meals[1], attrs.meals[0]] });
  await expect(page.locator(".status")).toContainText("Couldn’t change meal");
  await page.evaluate(() =>
    (window as any).resolve({ confirmed: true, revision: 2 }),
  );
  await expect(page.locator(".status")).toContainText("Couldn’t change meal");
  expect((await calls(page)).length).toBe(1);
});
test("unknown timeout reverts switch; old handler cannot complete a newer explicit toggle", async ({
  page,
}) => {
  await setup(page);
  await page.clock.install();
  await deferred(page);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await page.evaluate(
    () => ((window as any).oldResolve = (window as any).resolve),
  );
  await page.clock.fastForward(20001);
  await expect(page.locator(".status")).toContainText("Couldn’t change meal");
  await expect(
    page.getByRole("switch", { name: "Enabled 1", exact: true }),
  ).toBeChecked();
  expect((await calls(page)).length).toBe(1);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  await incoming(page);
  await page.evaluate(() =>
    (window as any).oldResolve({ confirmed: true, revision: 2 }),
  );
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
  await page.evaluate(() =>
    (window as any).resolve({ confirmed: true, revision: 2 }),
  );
  await expect(page.locator(".status")).toHaveCount(0);
  expect((await calls(page)).length).toBe(2);
});
test("toggle uses latest reported index/revision and preserves all non-enabled fields", async ({
  page,
}) => {
  await setup(page);
  await incoming(page, {
    revision: 7,
    meals: [attrs.meals[1], attrs.meals[0]],
  });
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "update_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 7,
        meal_index: 0,
        meal: { ...attrs.meals[1], enabled: true },
      },
    ],
  ]);
});
for (const width of [320, 640])
  test(`standard action header and entity title/subtitle meal geometry at ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 800 });
    await setup(page);
    await page.addStyleTag({
      content: "body { margin:0 } tuya-feeder-card {max-width:none}",
    });
    await page.evaluate(() => {
      const c: any = document.querySelector("tuya-feeder-card");
      c.setConfig({
        entity: "sensor.mock_feeder",
        title: "Example",
        manual_feed: true,
      });
    });
    const geometry = await page.locator("ha-card").evaluate((e) => {
      const b = e.getBoundingClientRect(),
        icon = e
          .querySelector("header .identity-add ha-icon")!
          .getBoundingClientRect(),
        title = e.querySelector("h2")!.getBoundingClientRect(),
        time = e.querySelector(".time")!.getBoundingClientRect(),
        detail = e.querySelector(".detail")!.getBoundingClientRect();
      return {
        titleLeft:
          title.x - b.x - parseFloat(getComputedStyle(e).borderLeftWidth),
        iconLeft:
          icon.x - b.x - parseFloat(getComputedStyle(e).borderLeftWidth),
        gap: title.x - icon.right,
        subtitleBelowTitle: detail.top >= time.bottom - 0.1,
        alignedLabels: Math.abs(time.left - detail.left) < 0.1,
        mealTitleLeft:
          time.left - e.querySelector(".meal")!.getBoundingClientRect().left,
        overflow: document.documentElement.scrollWidth > innerWidth,
        detailHeight: detail.height,
      };
    });
    expect(geometry.titleLeft).toBe(64);
    expect(geometry.iconLeft).toBe(11.5);
    expect(geometry.gap).toBe(7.5);
    expect(geometry.subtitleBelowTitle).toBe(true);
    expect(geometry.alignedLabels).toBe(true);
    expect(geometry.mealTitleLeft).toBe(66);
    expect(geometry.overflow).toBe(false);
    expect(geometry.detailHeight).toBeLessThan(20);
  });
test("list switch directly sends one exact current-baseline update without editor or confirmation", async ({
  page,
}) => {
  await setup(page);
  await page.getByRole("switch", { name: "Enabled 1", exact: true }).click();
  expect(await calls(page)).toEqual([
    [
      "tuya_feeder",
      "update_meal",
      {
        entity_id: "sensor.mock_feeder",
        expected_revision: 1,
        meal_index: 0,
        meal: { ...attrs.meals[0], enabled: false },
      },
    ],
  ]);
  await expect(
    page.getByRole("button", { name: "Save", exact: true }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("button", { name: "Cancel", exact: true }),
  ).toHaveCount(0);
  await expect(page.getByRole("dialog")).toHaveCount(0);
  await expect(
    page.getByRole("switch", { name: "Enabled 1", exact: true }),
  ).toBeDisabled();
  await expect(page.locator(".status")).toHaveCount(0);
  await expect(page.locator("ha-card")).toHaveAttribute("aria-busy", "true");
});
