import { test, expect } from "@playwright/test";
import { setup, attrs, calls } from "./fixtures";

// Sanitized standard entity-card OFF contract, measured from installed button-card.
// The accent remains a category color only for ACTIVE circles.
for (const width of [640, 320])
  for (const mode of ["mixed", "all-off"] as const) {
    test(`standard OFF descendants stay independent at ${width}px ${mode}`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await setup(page, {
        ...attrs,
        meals: attrs.meals.map((m, i) => ({
          ...m,
          enabled: mode === "mixed" && i === 0,
        })),
      });
      await page.evaluate(() => {
        const c: any = document.querySelector("tuya-feeder-card");
        c.setConfig({
          entity: "sensor.mock_feeder",
          appearance: { icon_color: "rgb(10, 180, 170)" },
        });
        c.style.setProperty("--primary-text-color", "white");
        c.style.setProperty("--secondary-text-color", "#d3d3d3");
        c.style.setProperty("--ha-card-border-radius", "14px");
        c.style.setProperty(
          "--ha-font-family-body",
          "Roboto, Noto, sans-serif",
        );
      });
      const off = page.locator('.meal[data-enabled="false"]');
      const circleBox = await off.first().locator("ha-icon").boundingBox();
      expect(circleBox!.width).toBeCloseTo(45, 0);
      expect(circleBox!.height).toBeCloseTo(45, 0);
      for (const el of await off.all()) {
        await expect(el).toHaveCSS("background-color", "rgba(0, 0, 0, 0.3)");
        await expect(el.locator("ha-icon")).toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0.2)",
        );
        await expect(el.locator("ha-icon")).toHaveCSS(
          "color",
          "rgb(255, 255, 255)",
        );
        await expect(el.locator("ha-icon")).toHaveCSS("border-radius", "24px");
        await expect(el.locator(".time")).toHaveCSS(
          "color",
          "rgb(255, 255, 255)",
        );
        await expect(el.locator(".time")).toHaveCSS("font-size", "17px");
        await expect(el.locator(".time")).toHaveCSS("font-weight", "500");
        await expect(el.locator(".time")).toHaveCSS("line-height", "normal");
        await expect(el.locator(".detail")).toHaveCSS(
          "color",
          "rgba(255, 255, 255, 0.5)",
        );
        await expect(el.locator(".detail")).toHaveCSS("font-size", "15px");
        await expect(el.locator(".detail")).toHaveCSS("font-weight", "400");
        await expect(el.locator(".detail")).toHaveCSS("line-height", "normal");
      }
      if (mode === "all-off") {
        await expect(page.locator("header ha-icon")).toHaveCSS(
          "background-color",
          "rgba(0, 0, 0, 0.2)",
        );
        await expect(page.locator("header ha-icon")).toHaveCSS(
          "color",
          "rgb(255, 255, 255)",
        );
        await expect(page.locator("header ha-icon")).toHaveCSS(
          "border-radius",
          "24px",
        );
        await expect(page.locator("header h2")).toHaveCSS(
          "color",
          "rgb(255, 255, 255)",
        );
        await expect(page.locator("header h2")).toHaveCSS("font-size", "17px");
        await expect(page.locator(".last-feed")).toHaveCSS(
          "color",
          "rgba(255, 255, 255, 0.5)",
        );
        await expect(page.locator(".last-feed")).toHaveCSS("font-size", "15px");
      } else {
        await expect(page.locator("header ha-icon")).toHaveCSS(
          "background-color",
          "rgb(10, 180, 170)",
        );
        await expect(
          page.locator('.meal[data-enabled="true"] .time'),
        ).toHaveCSS("color", "rgb(0, 0, 0)");
      }
      expect(await calls(page)).toEqual([]);
    });
  }

test("OFF appearance overrides are isolated from active palette and reset with configuration", async ({
  page,
}) => {
  await setup(page);
  await page.evaluate(() => {
    const c: any = document.querySelector("tuya-feeder-card");
    c.setConfig({
      entity: "sensor.mock_feeder",
      appearance: {
        icon_color: "teal",
        off: {
          background: "navy",
          icon_background: "gray",
          icon_color: "ivory",
          title_color: "white",
          subtitle_color: "silver",
        },
      },
    });
  });
  const off = page.locator('.meal[data-enabled="false"]');
  await expect(off).toHaveCSS("background-color", "rgb(0, 0, 128)");
  await expect(off.locator("ha-icon")).toHaveCSS(
    "background-color",
    "rgb(128, 128, 128)",
  );
  await expect(off.locator("ha-icon")).toHaveCSS("color", "rgb(255, 255, 240)");
  await expect(off.locator(".detail")).toHaveCSS("color", "rgb(192, 192, 192)");
  await expect(page.locator('.meal[data-enabled="true"] ha-icon')).toHaveCSS(
    "background-color",
    "rgb(0, 128, 128)",
  );
  await page.evaluate(() =>
    (document.querySelector("tuya-feeder-card") as any).setConfig({
      entity: "sensor.mock_feeder",
    }),
  );
  await expect(off.locator("ha-icon")).toHaveCSS(
    "background-color",
    "rgba(0, 0, 0, 0.2)",
  );
  expect(await calls(page)).toEqual([]);
});

test("OFF appearance rejects unsafe color payloads and exposes plain editor labels", async ({
  page,
}) => {
  await setup(page);
  const result = await page.evaluate(async () => {
    const c: any = document.querySelector("tuya-feeder-card");
    const rejected = [
      "url(https://example.invalid/pixel)",
      "white;display:none",
      "<script>",
      "red!important",
      "expression(alert(1))",
    ].map((value) => {
      try {
        c.setConfig({
          entity: "sensor.mock_feeder",
          appearance: { off: { icon_color: value } },
        });
        return false;
      } catch {
        return true;
      }
    });
    const editor: any = await c.constructor.getConfigElement();
    document.body.append(editor);
    editor.setConfig({ entity: "sensor.mock_feeder" });
    await editor.updateComplete;
    const form: any = editor.shadowRoot.querySelector("ha-form");
    const off = form.schema
      .find((x: any) => x.name === "appearance")
      .schema.find((x: any) => x.name === "off");
    return {
      rejected,
      names: off.schema.map((x: any) => x.name),
      label: form.computeLabel(off),
    };
  });
  expect(result.rejected).toEqual([true, true, true, true, true]);
  expect(result.names).toEqual([
    "background",
    "icon_background",
    "icon_color",
    "title_color",
    "subtitle_color",
  ]);
  expect(result.label).toBe("Off appearance");
});
