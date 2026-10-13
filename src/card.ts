import { LitElement, html, css, nothing } from "lit";
const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];
type Meal = {
  days: string[];
  time: string;
  portions: number;
  enabled: boolean;
};
type Config = { type?: string; entity: string; title?: string; icon?: string };
type Hass = {
  states: Record<string, { state: string; attributes: Record<string, any> }>;
  callService: (domain: string, service: string, data: unknown) => Promise<any>;
};
const clone = (m: Meal[]) => m.map((x) => ({ ...x, days: [...x.days] }));
const valid = (m: unknown, max = 10, portions = 60): m is Meal[] =>
  Array.isArray(m) &&
  m.length <= Math.min(10, max) &&
  m.every(
    (x) =>
      x &&
      Array.isArray(x.days) &&
      x.days.length === 7 &&
      new Set(x.days).size === 7 &&
      DAYS.every((d) => x.days.includes(d)) &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(x.time) &&
      Number.isInteger(x.portions) &&
      x.portions >= 1 &&
      x.portions <= Math.min(60, portions) &&
      typeof x.enabled === "boolean",
  );
export class TuyaFeederCard extends LitElement {
  static properties = {
    config: { state: true },
    draft: { state: true },
    dirty: { state: true },
    conflict: { state: true },
    busy: { state: true },
    message: { state: true },
    dialogOpen: { state: true },
  };
  config!: Config;
  draft: Meal[] = [];
  dirty = false;
  conflict = false;
  busy = false;
  message = "";
  dialogOpen = false;
  private _hass?: Hass;
  private base: unknown;
  private sent?: Meal[];
  private sentAt?: string;
  setConfig(c: Config) {
    if (!c.entity?.startsWith("sensor."))
      throw new Error("Select a schedule sensor");
    if (this.busy)
      throw new Error("Wait for schedule confirmation before changing entity");
    this.config = { ...c };
    this.dirty = false;
    this.conflict = false;
    this.load();
  }
  set hass(h: Hass) {
    this._hass = h;
    const a = this.attrs;
    if (this.busy) {
      if (a.error) {
        this.busy = false;
        this.message = String(a.error);
        this.conflict = true;
      } else if (
        this.writable &&
        a.observation_kind === "confirmed" &&
        !a.pending &&
        a.revision !== this.base &&
        a.last_received_at !== this.sentAt &&
        this.sent?.length === a.meals.length &&
        this.sent?.every(
          (m, i) =>
            m.time === a.meals[i].time &&
            m.portions === a.meals[i].portions &&
            m.enabled === a.meals[i].enabled,
        )
      ) {
        this.busy = false;
        this.dirty = false;
        this.sent = undefined;
        this.load();
        this.message = "Schedule confirmed by incoming device report.";
      }
    } else if (this.dirty && a.revision !== this.base) {
      this.conflict = true;
      this.message =
        "Schedule changed while editing. Reload explicitly before saving.";
      this.closeDialog();
    } else if (!this.dirty) this.load();
    this.requestUpdate();
  }
  get hass() {
    return this._hass!;
  }
  private get attrs() {
    return this._hass?.states[this.config?.entity]?.attributes ?? {};
  }
  private get writable() {
    const s = this._hass?.states[this.config?.entity],
      a = this.attrs;
    return (
      !!s &&
      !["unknown", "unavailable"].includes(s.state) &&
      a.supports_schedule_write === true &&
      a.supported_days_mode === "every_day" &&
      (typeof a.revision === "string" || typeof a.revision === "number") &&
      a.revision !== "" &&
      typeof a.last_received_at === "string" &&
      !!a.last_received_at &&
      a.observation_kind === "confirmed" &&
      a.pending === false &&
      !a.error &&
      Number.isInteger(a.max_meals) &&
      a.max_meals > 0 &&
      Number.isInteger(a.max_portions) &&
      a.max_portions > 0 &&
      valid(a.meals, a.max_meals, a.max_portions)
    );
  }
  private get locked() {
    return !this.writable || this.conflict || this.busy;
  }
  private load() {
    if (!this.config) return;
    const a = this.attrs;
    this.base = a.revision;
    this.draft = Array.isArray(a.meals)
      ? a.meals.map((m: any) => ({
          ...m,
          days:
            m.days === "Everyday"
              ? [...DAYS]
              : Array.isArray(m.days)
                ? [...m.days]
                : [],
        }))
      : [];
    this.requestUpdate();
  }
  private edit(i: number, key: keyof Meal, value: any) {
    if (this.locked) return;
    this.draft = this.draft.map((m, n) =>
      n === i ? { ...m, [key]: value } : m,
    );
    this.dirty = true;
  }
  private add() {
    if (this.locked || this.draft.length >= Math.min(10, this.attrs.max_meals))
      return;
    this.draft = [
      ...this.draft,
      { days: [...DAYS], time: "23:59", portions: 1, enabled: false },
    ];
    this.dirty = true;
  }
  private reset() {
    if (this.busy) return;
    this.dirty = false;
    this.conflict = false;
    this.message = "";
    this.closeDialog();
    this.load();
  }
  private get saveable() {
    return (
      !this.locked &&
      this.dirty &&
      valid(this.draft, this.attrs.max_meals, this.attrs.max_portions)
    );
  }
  private async review() {
    if (!this.saveable) return;
    this.dialogOpen = true;
    await this.updateComplete;
    const d = this.renderRoot.querySelector("dialog")!;
    d.showModal();
    d.querySelector<HTMLButtonElement>("[data-cancel]")?.focus();
  }
  private closeDialog() {
    this.renderRoot.querySelector<HTMLDialogElement>("dialog")?.close();
    this.dialogOpen = false;
    this.renderRoot.querySelector<HTMLButtonElement>("[data-save]")?.focus();
  }
  private async confirm() {
    if (!this.saveable) return;
    this.sent = clone(this.draft);
    this.sentAt = this.attrs.last_received_at;
    this.busy = true;
    this.closeDialog();
    this.message =
      "Awaiting confirmed incoming schedule. An empty acknowledgement is not confirmation.";
    try {
      const r = await this.hass.callService("tuya_feeder", "set_schedule", {
        entity_id: this.config.entity,
        expected_revision: this.base,
        meals: clone(this.sent),
      });
      if (r?.error) {
        this.busy = false;
        this.conflict = true;
        this.message = String(r.error);
      }
    } catch (e) {
      this.busy = false;
      this.conflict = true;
      this.message = `Save failed: ${String(e)}. Reload before retrying.`;
    }
  }
  static getConfigElement() {
    return document.createElement("tuya-feeder-card-editor");
  }
  static getStubConfig() {
    return { entity: "", title: "Feeder schedule", icon: "mdi:calendar-clock" };
  }
  getCardSize() {
    return 2 + this.draft.length;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  render() {
    if (!this.config) return nothing;
    return html`<ha-card
      ><header>
        <ha-icon .icon=${this.config.icon ?? "mdi:calendar-clock"}></ha-icon>
        <div>
          <h2>${this.config.title ?? "Feeder schedule"}</h2>
          <small>Device-owned · Every day</small>
        </div>
        ${this.dirty ? html`<span class="badge">Draft</span>` : nothing}
      </header>
      <div class="status" role="status">
        ${this.message || (!this.writable ? "Read only — confirmed writable snapshot required." : "Changes remain local until you confirm Save.")}
      </div>
      <section aria-label="Schedule draft" ?inert=${this.busy}>
        <fieldset ?disabled=${this.locked}>
          ${this.draft.map(
            (m, i) =>
              html`<div class="meal">
                <input
                  type="text"
                  inputmode="numeric"
                  maxlength="5"
                  placeholder="HH:MM"
                  pattern="([01][0-9]|2[0-3]):[0-5][0-9]"
                  aria-label=${`Time ${i + 1}`}
                  .value=${m.time ?? ""}
                  @input=${(e: Event) => this.edit(i, "time", (e.target as HTMLInputElement).value)}
                />
                <div class="stepper">
                  <button
                    aria-label=${`Decrease portions ${i + 1}`}
                    ?disabled=${m.portions <= 1}
                    @click=${() => this.edit(i, "portions", m.portions - 1)}
                  >
                    −</button
                  ><output aria-label=${`Portions ${i + 1}`}
                    >${m.portions}</output
                  ><button
                    aria-label=${`Increase portions ${i + 1}`}
                    ?disabled=${m.portions >= Math.min(60, this.attrs.max_portions ?? 60)}
                    @click=${() => this.edit(i, "portions", m.portions + 1)}
                  >
                    +
                  </button>
                </div>
                <input
                  class="switch"
                  type="checkbox"
                  role="switch"
                  aria-label=${`Enabled ${i + 1}`}
                  .checked=${m.enabled === true}
                  @change=${(e: Event) => this.edit(i, "enabled", (e.target as HTMLInputElement).checked)}
                />
              </div>`,
          )}<button
            class="add"
            ?disabled=${this.draft.length >= Math.min(10, this.attrs.max_meals ?? 10)}
            @click=${this.add}
          >
            Add disabled meal
          </button>
        </fieldset>
      </section>
      <footer>
        <button @click=${this.reset} ?disabled=${this.busy}>
          ${this.conflict ? "Reload schedule" : "Reset draft"}</button
        ><button
          data-save
          class="accent"
          ?disabled=${!this.saveable}
          @click=${this.review}
        >
          Save
        </button>
      </footer>
      ${
        this.dialogOpen
          ? html`<dialog
              aria-labelledby="confirm-title"
              @cancel=${(e: Event) => {
                e.preventDefault();
                this.closeDialog();
              }}
            >
              <h2 id="confirm-title">Replace device schedule?</h2>
              <p>
                The complete plan below replaces the device plan. No immediate
                feeding command is sent.
              </p>
              <ol>
                ${this.draft.map((m) => html`<li>Every day · ${m.time} · ${m.portions} portion${m.portions === 1 ? "" : "s"} · ${m.enabled ? "Enabled" : "Disabled"}</li>`)}
              </ol>
              <div class="dialog-actions">
                <button data-cancel @click=${this.closeDialog}>Cancel</button
                ><button
                  class="accent"
                  ?disabled=${!this.saveable}
                  @click=${this.confirm}
                >
                  Confirm Save
                </button>
              </div>
            </dialog>`
          : nothing
      }</ha-card
    >`;
  }
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color);
      font-family: var(--ha-font-family-body, system-ui);
      font-size: 14px;
    }
    ha-card {
      display: block;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: var(--ha-card-border-radius, 20px);
      border: 1px solid var(--divider-color, #ddd);
      overflow: hidden;
    }
    header {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 18px 16px 8px;
    }
    ha-icon {
      color: var(--primary-color);
      width: 24px;
    }
    h2 {
      font-size: 18px;
      letter-spacing: -0.4px;
      margin: 0 0 3px;
      font-weight: 600;
    }
    small,
    .status {
      color: var(--secondary-text-color, #666);
    }
    .badge {
      margin-left: auto;
      font-size: 12px;
      color: var(--primary-color);
    }
    .status {
      padding: 8px 16px 12px;
      font-size: 12px;
      line-height: 1.45;
    }
    fieldset {
      border: 0;
      padding: 0;
      margin: 0;
      min-width: 0;
    }
    section {
      padding: 0 12px;
    }
    .meal {
      height: 68px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    input[type="text"] {
      box-sizing: border-box;
      width: 94px;
      min-width: 0;
      font: inherit;
      font-size: 16px;
      border: 0;
      background: transparent;
      color: inherit;
      padding: 0;
      height: 44px;
      font-variant-numeric: tabular-nums;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 0;
    }
    .stepper output {
      width: 30px;
      text-align: center;
      font-size: 21px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .stepper button {
      width: 44px;
      padding: 0;
      font-size: 22px;
      background: var(--secondary-background-color, #f2f2f7);
    }
    button {
      min-height: 44px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 0 12px;
      cursor: pointer;
      touch-action: manipulation;
      transition: none;
      transform: none;
    }
    button:disabled {
      opacity: 0.35;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color);
      outline-offset: 2px;
    }
    .switch {
      appearance: none;
      width: 44px;
      height: 44px;
      flex: 0 0 44px;
      margin: 0;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/40px 24px no-repeat;
      border-radius: 22px;
      position: relative;
      cursor: pointer;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 5px;
      top: 12px;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: white;
    }
    .switch:checked {
      background: linear-gradient(var(--primary-color), var(--primary-color))
        center/40px 24px no-repeat;
    }
    .switch:checked:after {
      left: 19px;
    }
    .switch:disabled {
      opacity: 0.4;
      cursor: default;
    }
    .add {
      width: 100%;
      color: var(--primary-color);
      text-align: left;
    }
    footer {
      display: flex;
      justify-content: space-between;
      gap: 20px;
      padding: 12px 16px;
      border-top: 1px solid var(--divider-color, #eee);
    }
    .accent {
      background: var(--primary-color);
      color: var(--text-primary-color, #fff);
      min-width: 80px;
    }
    dialog {
      max-width: min(400px, calc(100vw - 64px));
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 20px;
      background: var(--card-background-color, #fff);
      color: var(--primary-text-color, #222);
      padding: 20px;
    }
    dialog::backdrop {
      background: #0006;
    }
    dialog p,
    li {
      line-height: 1.6;
    }
    ol {
      padding-left: 20px;
    }
    .dialog-actions {
      display: flex;
      gap: 20px;
      justify-content: flex-end;
    }
    [inert] {
      pointer-events: none;
    }
  `;
}
class TuyaFeederCardEditor extends LitElement {
  static properties = { hass: { attribute: false }, config: { state: true } };
  hass?: Hass;
  config?: Config;
  setConfig(c: Config) {
    this.config = { ...c };
  }
  render() {
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[
        {
          name: "entity",
          required: true,
          selector: { entity: { domain: "sensor" } },
        },
        { name: "title", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
      ]}
      .computeLabel=${(s: { name: string }) => (s.name === "entity" ? "Schedule sensor" : s.name === "title" ? "Title" : "Icon")}
      @value-changed=${(e: CustomEvent) => {
        this.config = { ...this.config, ...e.detail.value };
        this.dispatchEvent(
          new CustomEvent("config-changed", {
            detail: { config: this.config },
            bubbles: true,
            composed: true,
          }),
        );
      }}
    ></ha-form>`;
  }
}
customElements.define("tuya-feeder-card", TuyaFeederCard);
customElements.define("tuya-feeder-card-editor", TuyaFeederCardEditor);
const w = window as unknown as { customCards: unknown[] };
w.customCards = w.customCards || [];
w.customCards.push({
  type: "tuya-feeder-card",
  name: "Tuya Feeder Schedule",
  description:
    "Draft and confirm a device-owned daily schedule. No feed actions.",
  documentationURL: "https://github.com/myevit/tuya-feeder-card",
});
