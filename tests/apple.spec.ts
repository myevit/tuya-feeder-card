import { test, expect } from "@playwright/test";
import { attrs, setup, calls } from "./fixtures";

for (const width of [640, 320])
  test(`kiosk geometry and synthetic screenshots ${width}`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 760 });
    await setup(page);
    const geometry = await page
      .locator(".time")
      .first()
      .evaluate((el) => ({
        font: getComputedStyle(el).fontSize,
        weight: getComputedStyle(el).fontWeight,
        title: getComputedStyle(el.getRootNode().querySelector("h2")).fontSize,
      }));
    expect(geometry).toEqual({ font: "32px", weight: "500", title: "18px" });
    await expect(page.locator("ha-card")).not.toContainText(
      /revision|snapshot|Device-owned|technical|locally|report/i,
    );
    await page.screenshot({
      path: `test-results/kiosk-list-mock-${width}.png`,
      fullPage: true,
    });
    await page
      .getByRole("button", { name: "Edit meal 1", exact: true })
      .click();
    for (const name of ["Increase portions 1", "Decrease portions 1"]) {
      const b = (await page.getByRole("button", { name }).boundingBox())!;
      expect(b.width).toBeGreaterThanOrEqual(44);
      expect(b.height).toBeGreaterThanOrEqual(44);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    ).toBe(false);
    await page.screenshot({
      path: `test-results/kiosk-edit-mock-${width}.png`,
      fullPage: true,
    });
    await page.getByRole("button", { name: "Back", exact: true }).click();
    expect(await calls(page)).toEqual([]);
  });

test("optional CSS variables and shadow parts override real component; defaults work without card-mod", async ({
  page,
}) => {
  await setup(page);
  const before = await page
    .locator(".time")
    .first()
    .evaluate((el) => getComputedStyle(el).fontSize);
  expect(before).toBe("32px");
  await page.addStyleTag({
    content:
      "tuya-feeder-card { --feeder-meal-time-font-size: 38px; --feeder-accent-color: rgb(90, 30, 120); } tuya-feeder-card::part(title) { color: rgb(10, 80, 90); }",
  });
  expect(
    await page
      .locator(".time")
      .first()
      .evaluate((el) => getComputedStyle(el).fontSize),
  ).toBe("38px");
  expect(
    await page.locator("h2").evaluate((el) => getComputedStyle(el).color),
  ).toBe("rgb(10, 80, 90)");
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  expect(
    await page
      .getByRole("button", { name: "Save", exact: true })
      .evaluate((el) => getComputedStyle(el).backgroundColor),
  ).toBe("rgb(90, 30, 120)");
  expect(
    await page.evaluate(() => customElements.get("card-mod")),
  ).toBeUndefined();
  expect(await calls(page)).toEqual([]);
});

test("safe appearance config and visual editor fields; reject CSS injection", async ({
  page,
}) => {
  await setup(page);
  const result = await page.evaluate(async () => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      appearance: {
        accent_color: "var(--primary-color)",
        header_font_size: "18px",
        meal_time_font_size: "36px",
        control_size: "20px",
        row_background: "rgba(0,0,0,0.045)",
        font_family: "system-ui",
      },
    });
    await c.updateComplete;
    let rejected = 0;
    for (const value of [
      "red;display:none",
      "url(https://example.com)",
      "</style><script>",
      "red!important",
      "expression(1)",
    ]) {
      try {
        c.setConfig({
          entity: "sensor.mock_feeder",
          appearance: { row_background: value },
        });
      } catch {
        rejected++;
      }
    }
    const e: any = document.createElement("tuya-feeder-card-editor");
    e.setConfig({ entity: "sensor.mock_feeder" });
    document.body.append(e);
    await e.updateComplete;
    const schema: any = e.shadowRoot.querySelector("ha-form").schema;
    let emitted: any;
    e.addEventListener(
      "config-changed",
      (ev: any) => (emitted = ev.detail.config),
    );
    e.shadowRoot.querySelector("ha-form").dispatchEvent(
      new CustomEvent("value-changed", {
        detail: {
          value: {
            entity: "sensor.mock_other",
            appearance: { accent_color: "#123456" },
            manual_feed: true,
          },
        },
      }),
    );
    return { rejected, schema: schema.map((s: any) => s.name), emitted };
  });
  expect(result.rejected).toBe(5);
  expect(result.schema).toContain("appearance");
  expect(result.schema).toContain("portions_entity");
  expect(result.emitted.appearance.accent_color).toBe("#123456");
  await page.getByRole("button", { name: "Edit meal 1", exact: true }).click();
  const b = (await page
    .getByRole("button", { name: "Increase portions 1" })
    .boundingBox())!;
  expect(b.width).toBeGreaterThanOrEqual(44);
  expect(await calls(page)).toEqual([]);
});
