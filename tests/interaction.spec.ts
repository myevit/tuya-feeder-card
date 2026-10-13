import { test, expect } from "@playwright/test";
test("busy container rejects pointer mutation and repeated confirmation; geometry matches", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(async () => {
    await customElements.whenDefined("tuya-feeder-card");
    const days = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];
    const c: any = document.createElement("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder" });
    (window as any).calls = [];
    c.hass = {
      states: {
        "sensor.mock_feeder": {
          state: "ready",
          attributes: {
            meals: [{ days, time: "12:34", portions: 1, enabled: false }],
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
          },
        },
      },
      callService: async (...args: any[]) => {
        (window as any).calls.push(args);
        return {};
      },
    };
    document.body.append(c);
  });
  const plus = page.getByRole("button", { name: "Increase portions 1" });
  const box = (await plus.boundingBox())!;
  expect(box.width).toBe(44);
  expect(box.height).toBe(44);
  expect((await page.locator(".meal").boundingBox())!.height).toBe(68);
  await plus.click();
  await page.getByRole("button", { name: "Save", exact: true }).click();
  await page.getByRole("button", { name: "Confirm Save" }).click();
  await plus.click({ force: true });
  await page
    .getByRole("button", { name: "Save", exact: true })
    .click({ force: true });
  await expect(page.getByLabel("Portions 1", { exact: true })).toHaveText("2");
  expect(await page.evaluate(() => (window as any).calls.length)).toBe(1);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.hass = {
      ...c.hass,
      states: {
        "sensor.mock_feeder": {
          state: "ready",
          attributes: {
            ...c.hass.states["sensor.mock_feeder"].attributes,
            revision: 2,
            last_received_at: "2026-01-01T00:01:00Z",
            meals: [
              {
                enabled: false,
                portions: 2,
                time: "12:34",
                days: [
                  "sunday",
                  "saturday",
                  "friday",
                  "thursday",
                  "wednesday",
                  "tuesday",
                  "monday",
                ],
              },
            ],
          },
        },
      },
    };
  });
  await expect(page.locator(".status")).toContainText("confirmed by incoming");
});
