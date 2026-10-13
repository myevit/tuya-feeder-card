// Unit-only HA control/manager doubles. Real frontend acceptance is separate.
export async function setupNativeDoubles(page) {
  await page.evaluate(() => {
    if (customElements.get("ha-dialog")) return;
    class Dialog extends HTMLElement {
      set open(value) {
        this.hidden = !value;
      }
      connectedCallback() {
        this.addEventListener("keydown", (e) => {
          if (e.key === "Escape") this.dispatchEvent(new Event("closed"));
        });
      }
    }
    class Button extends HTMLElement {
      static get observedAttributes() {
        return ["disabled"];
      }
      constructor() {
        super();
        this.b = document.createElement("button");
        this.b.append(document.createElement("slot"));
        this.attachShadow({ mode: "open" }).append(this.b);
      }
      attributeChangedCallback() {
        this.b.disabled = this.hasAttribute("disabled");
      }
      set disabled(value) {
        this.toggleAttribute("disabled", value);
      }
    }
    class Form extends HTMLElement {
      reportValidity() {
        return [...this.querySelectorAll("input")].every((i) =>
          i.checkValidity(),
        );
      }
      connectedCallback() {
        this.render();
      }
      set hass(value) {}
      render() {
        this.textContent = "";
        for (const s of this.schema ?? []) {
          const l = document.createElement("label"),
            i = document.createElement("input");
          l.textContent = this.computeLabel(s);
          i.setAttribute("aria-label", this.computeLabel(s));
          i.type = s.selector?.time
            ? "time"
            : s.selector?.number
              ? "number"
              : "checkbox";
          if (s.name === "enabled") i.setAttribute("role", "switch");
          if (s.selector?.number) {
            i.min = String(s.selector.number.min);
            i.max = String(s.selector.number.max);
          }
          i.required = s.required ?? false;
          if (i.type === "checkbox") i.checked = this.data[s.name];
          else i.value = String(this.data[s.name]);
          i.addEventListener("input", () => {
            this.data = {
              ...this.data,
              [s.name]:
                i.type === "checkbox"
                  ? i.checked
                  : i.type === "number"
                    ? Number(i.value)
                    : i.value,
            };
            this.dispatchEvent(
              new CustomEvent("value-changed", {
                detail: { value: this.data },
              }),
            );
          });
          l.append(i);
          this.append(l);
        }
      }
    }
    customElements.define("ha-dialog", Dialog);
    customElements.define("ha-button", Button);
    customElements.define("ha-form", Form);
    customElements.define("ha-dialog-footer", class extends HTMLElement {});
    document.addEventListener("show-dialog", async (e) => {
      const d = document.createElement(e.detail.dialogTag);
      d.addEventListener("dialog-closed", () => d.remove());
      document.body.append(d);
      await d.showDialog(e.detail.dialogParams);
    });
  });
}
