// Synthetic-only Chromium bridge: state comes from actual HA pytest harness.
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
const button = (name) => page.getByRole("button", { name, exact: true });
for await (const line of createInterface({ input: process.stdin })) {
  try {
    const cmd = JSON.parse(line);
    if (cmd.action === "init") {
      await page.evaluate(
        async ({ state, manual }) => {
          await customElements.whenDefined("tuya-feeder-card");
          const c = document.createElement("tuya-feeder-card");
          c.setConfig({ entity: state.entity_id, manual_feed: !!manual });
          window.calls = [];
          c.hass = {
            states: { [state.entity_id]: state },
            callService: (...args) => {
              window.calls.push(args);
              return new Promise((resolve, reject) => {
                window.resolveService = resolve;
                window.rejectService = reject;
              });
            },
          };
          document.body.append(c);
        },
        { state: cmd.state, manual: cmd.manual },
      );
    } else if (cmd.action === "state") {
      await page.evaluate((state) => {
        const c = document.querySelector("tuya-feeder-card");
        c.hass = { ...c.hass, states: { [state.entity_id]: state } };
      }, cmd.state);
    } else if (cmd.action === "active") {
      await expect(page.locator("ha-card")).toHaveAttribute(
        "data-active",
        String(cmd.expected),
      );
    } else if (cmd.action === "service_result") {
      await page.evaluate(({ result, error }) => {
        if (error) window.rejectService(new Error(error));
        else window.resolveService(result ?? {});
      }, cmd);
    } else if (cmd.action === "toggle") {
      await page
        .getByRole("switch", { name: `Enabled ${cmd.index ?? 1}`, exact: true })
        .click();
      await expect(button("Save")).toHaveCount(0);
      await expect(button("Back")).toHaveCount(0);
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await expect(
        page.getByRole("checkbox", { name: "Use saved plan?" }),
      ).toHaveCount(0);
      await expect(page.locator(".status")).toHaveText("Saving…");
    } else if (cmd.action === "toggle_error") {
      await expect(page.locator(".status")).toContainText(
        "Couldn’t change meal",
      );
      await expect(button("Try again")).toHaveCount(0);
    } else if (cmd.action === "save") {
      if (!(await page.getByLabel("Time 1", { exact: true }).count())) {
        await button("Edit meal 1").click();
        await button("Increase portions 1").click();
      }
      const ack = page.getByRole("checkbox", { name: "Use saved plan?" });
      if (await ack.count()) await ack.check();
      await button("Save").click();
    } else if (cmd.action === "draft_actions") {
      await expect(page.locator(".meal")).toHaveCount(cmd.count);
      await button("Edit meal 1").click();
      await page
        .getByRole("switch", { name: "Meal enabled", exact: true })
        .click();
      await expect(page.getByRole("dialog")).toHaveCount(0);
      await page.getByLabel("Time 1", { exact: true }).fill("09:13");
      await button("Delete meal").click();
      await button("Cancel").click();
      await button("Back").click();
      if (cmd.count < 10) {
        await button("Add meal").click();
        await button("Back").click();
      }
      await expect(page.locator(".meal")).toHaveCount(cmd.count);
      await expect(button("Save")).toHaveCount(0);
      if (await page.evaluate(() => window.calls.length))
        throw new Error("Unexpected service call");
    } else if (cmd.action === "editable")
      await expect(button("Add meal")).toBeEnabled();
    else if (cmd.action === "readonly") {
      const add = button("Add meal");
      if (await add.count()) await expect(add).toBeDisabled();
      else
        await expect(page.locator("ha-card")).toContainText(
          "Schedule unavailable",
        );
    } else if (cmd.action === "busy")
      await expect(page.locator("section")).toHaveAttribute("inert", "");
    else if (cmd.action === "confirmed") {
      await expect(page.locator(".status")).toHaveText("Saved");
      await expect(page.locator("section")).not.toHaveAttribute("inert", "");
    } else if (cmd.action === "error") {
      await expect(page.locator(".status")).toHaveText(
        "Couldn’t save. Try again.",
      );
      await expect(page.locator("section")).not.toHaveAttribute("inert", "");
    } else if (cmd.action === "conflict") {
      await expect(page.locator(".status")).toHaveText(
        "Schedule changed. Reload to continue.",
      );
      await expect(button("Save")).toHaveCount(0);
    } else if (cmd.action === "edit") {
      await button("Edit meal 1").click();
      await button("Increase portions 1").click();
    } else if (cmd.action === "delete") {
      await button(`Edit meal ${cmd.index ?? 1}`).click();
      await button("Delete meal").click();
      const ack = page.getByRole("checkbox", { name: "Use saved plan?" });
      if (await ack.count()) await ack.check();
      await button("Delete").click();
    } else if (cmd.action === "add") {
      await button("Add meal").click();
      const ack = page.getByRole("checkbox", { name: "Use saved plan?" });
      if (await ack.count()) await ack.check();
      await button("Save").click();
    } else if (cmd.action === "feed") {
      await button("Feed").click();
      await button("Feed").click();
    } else if (cmd.action === "close") break;
    else throw new Error(`Unknown action: ${cmd.action}`);
    console.log(
      JSON.stringify({
        ok: true,
        calls: await page.evaluate(() => window.calls),
      }),
    );
  } catch (error) {
    console.log(JSON.stringify({ ok: false, error: String(error) }));
  }
}
await browser.close();
process.stdin.destroy();
