import { Page } from "@playwright/test";
import { setupNativeDoubles } from "./native-doubles.mjs";
export const days = [
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
  schedule_valid: true,
  snapshot_source: "received",
  pending: false,
  error: null,
  supports_schedule_write: true,
  supported_days_mode: "every_day",
  max_meals: 10,
  max_portions: 60,
};
export async function setup(page: Page, a: any = attrs) {
  await page.goto("/");
  await setupNativeDoubles(page);
  await page.evaluate(async (a) => {
    await customElements.whenDefined("tuya-feeder-card");
    const c: any = document.createElement("tuya-feeder-card");
    c.setConfig({ entity: "sensor.mock_feeder" });
    (window as any).calls = [];
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
export const calls = (page: Page) => page.evaluate(() => (window as any).calls);
