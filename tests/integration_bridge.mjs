// Synthetic-only Chromium bridge driven by the real HA pytest harness.
import { chromium, expect } from "@playwright/test";
import { readFile } from "node:fs/promises";
import { createInterface } from "node:readline";
const browser = await chromium.launch(
  process.env.CHROMIUM_PATH
    ? { executablePath: process.env.CHROMIUM_PATH, args: ["--no-sandbox"] }
    : {},
);
const page = await browser.newPage();
await page.setContent("<body></body>");
await page.addScriptTag({
  type: "module",
  content: await readFile(
    new URL("../dist/tuya-feeder-card.js", import.meta.url),
    "utf8",
  ),
});
for await (const line of createInterface({ input: process.stdin })) {
  try {
    const cmd = JSON.parse(line);
    if (cmd.action === "init") {
      await page.evaluate(async (state) => {
        await customElements.whenDefined("tuya-feeder-card");
        const card = document.createElement("tuya-feeder-card");
        card.setConfig({ entity: state.entity_id });
        window.calls = [];
        card.hass = {
          states: { [state.entity_id]: state },
          callService: async (...args) => {
            window.calls.push(args);
            return {};
          },
        };
        document.body.append(card);
      }, cmd.state);
    } else if (cmd.action === "state") {
      await page.evaluate((state) => {
        const card = document.querySelector("tuya-feeder-card");
        card.hass = { ...card.hass, states: { [state.entity_id]: state } };
      }, cmd.state);
    } else if (cmd.action === "save") {
      await page.getByRole("button", { name: "Increase portions 1" }).click();
      await page.getByRole("button", { name: "Save", exact: true }).click();
      await page.getByRole("button", { name: "Confirm Save" }).click();
    } else if (cmd.action === "editable") {
      await expect(
        page.getByRole("button", { name: "Add disabled meal" }),
      ).toBeEnabled();
    } else if (cmd.action === "readonly") {
      await expect(
        page.getByRole("button", { name: "Add disabled meal" }),
      ).toBeDisabled();
    } else if (cmd.action === "busy") {
      await expect(page.locator("section")).toHaveAttribute("inert", "");
    } else if (cmd.action === "confirmed") {
      await expect(page.locator(".status")).toContainText(
        "confirmed by incoming",
      );
      await expect(page.locator("section")).not.toHaveAttribute("inert", "");
    } else if (cmd.action === "error") {
      await expect(page.locator(".status")).toContainText(cmd.error);
      await expect(page.locator("section")).not.toHaveAttribute("inert", "");
    } else if (cmd.action === "conflict") {
      await expect(page.locator(".status")).toContainText(
        "changed while editing",
      );
      await expect(
        page.getByRole("button", { name: "Save", exact: true }),
      ).toBeDisabled();
    } else if (cmd.action === "edit") {
      await page.getByRole("button", { name: "Increase portions 1" }).click();
    } else if (cmd.action === "close") {
      break;
    }
    const calls = await page.evaluate(() => window.calls);
    console.log(JSON.stringify({ ok: true, calls }));
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: String(error) }));
  }
}
await browser.close();
process.stdin.destroy();
