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
      typeof x === "object" &&
      Object.keys(x).sort().join(",") === "days,enabled,portions,time" &&
      Array.isArray(x.days) &&
      x.days.length === 7 &&
      new Set(x.days).size === 7 &&
      DAYS.every((d) => x.days.includes(d)) &&
      typeof x.time === "string" &&
      /^([01]\d|2[0-3]):[0-5]\d$/.test(x.time) &&
      Number.isInteger(x.portions) &&
      x.portions >= 1 &&
      x.portions <= Math.min(60, portions) &&
      typeof x.enabled === "boolean",
  );
const samePlan = (a: Meal[], b: Meal[]) =>
  a.length === b.length &&
  a.every(
    (m, i) =>
      m.time === b[i].time &&
      m.portions === b[i].portions &&
      m.enabled === b[i].enabled &&
      m.days.length === b[i].days.length &&
      m.days.every((d) => b[i].days.includes(d)),
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
    editing: { state: true },
    deleteConfirm: { state: true },
    infoOpen: { state: true },
  };
  config!: Config;
  draft: Meal[] = [];
  dirty = false;
  conflict = false;
  busy = false;
  message = "";
  dialogOpen = false;
  editing: number | null = null;
  deleteConfirm = false;
  infoOpen = false;
  private _hass?: Hass;
  private base: unknown;
  private sent?: Meal[];
  private sentAt?: string;
  private serviceCompleted = false;
  private confirmationTimer?: ReturnType<typeof setTimeout>;
  private clearConfirmationTimer() {
    if (this.confirmationTimer) clearTimeout(this.confirmationTimer);
    this.confirmationTimer = undefined;
  }
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
      if (a.error && !a.pending) {
        this.clearConfirmationTimer();
        this.busy = false;
        this.message = String(a.error);
        this.conflict = true;
      } else if (
        this.writable &&
        this.attrs.snapshot_source === "received" &&
        this.serviceCompleted &&
        !a.pending &&
        a.revision > (this.base as number) &&
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
        this.clearConfirmationTimer();
        this.load();
        this.message = "Schedule confirmed by incoming device report.";
      }
    } else if (this.dirty && a.revision !== this.base) {
      this.conflict = true;
      this.message =
        "Schedule changed while editing. Reload explicitly before saving.";
      this.closeDialog();
      this.closeEditor();
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
      ((a.supports_schedule_write === true &&
        a.snapshot_source === "received") ||
        (a.supports_restored_schedule_write === true &&
          a.snapshot_source === "restored" &&
          a.requires_restored_snapshot_acknowledgement === true)) &&
      a.supported_days_mode === "every_day" &&
      Number.isSafeInteger(a.revision) &&
      a.revision > 0 &&
      typeof a.last_received_at === "string" &&
      !!a.last_received_at &&
      Number.isFinite(Date.parse(a.last_received_at)) &&
      a.schedule_valid === true &&
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
    this.dirty = !samePlan(this.draft, this.attrs.meals);
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
    this.closeEditor();
    this.load();
  }
  private get saveable() {
    return (
      !this.locked &&
      this.dirty &&
      !samePlan(this.draft, this.attrs.meals) &&
      valid(this.draft, this.attrs.max_meals, this.attrs.max_portions)
    );
  }
  private async review() {
    if (!this.saveable) return;
    this.dialogOpen = true;
    await this.updateComplete;
    const d = this.renderRoot.querySelector<HTMLDialogElement>(
      "dialog[data-review]",
    )!;
    d.showModal();
    d.querySelector<HTMLButtonElement>("[data-cancel]")?.focus();
  }
  private closeDialog() {
    this.renderRoot
      .querySelector<HTMLDialogElement>("dialog[data-review]")
      ?.close();
    this.dialogOpen = false;
    this.renderRoot.querySelector<HTMLButtonElement>("[data-save]")?.focus();
  }
  private async confirm() {
    if (!this.saveable) return;
    this.sent = clone(this.draft);
    this.sentAt = this.attrs.last_received_at;
    this.serviceCompleted = false;
    this.busy = true;
    this.clearConfirmationTimer();
    this.confirmationTimer = setTimeout(() => {
      if (!this.busy) return;
      this.busy = false;
      this.conflict = true;
      this.message =
        "Confirmation timed out. Draft retained; check incoming state and reload before trying again. No retry was sent.";
      this.requestUpdate();
    }, 20000);
    this.closeDialog();
    this.message =
      "Awaiting confirmed incoming schedule. An empty acknowledgement is not confirmation.";
    try {
      const r = await this.hass.callService("tuya_feeder", "set_schedule", {
        entity_id: this.config.entity,
        expected_revision: this.base,
        meals: clone(this.sent),
        ...(this.attrs.snapshot_source === "restored"
          ? { acknowledge_restored_snapshot: true }
          : {}),
      });
      if (r?.error && this.busy) {
        this.clearConfirmationTimer();
        this.busy = false;
        this.conflict = true;
        this.message = String(r.error);
      } else if (this.busy) {
        // A report can arrive before the handler rejects a stale revision.
        // Wait for handler completion as well as an independently matching receipt.
        this.serviceCompleted = true;
        this.hass = this.hass;
      }
    } catch (e) {
      if (!this.busy) return;
      this.clearConfirmationTimer();
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
  private async openEditor(i: number) {
    if (this.locked) return;
    this.editing = i;
    this.deleteConfirm = false;
    await this.updateComplete;
    this.renderRoot
      .querySelector<HTMLDialogElement>("dialog[data-editor]")
      ?.showModal();
  }
  private closeEditor() {
    const i = this.editing;
    this.renderRoot
      .querySelector<HTMLDialogElement>("dialog[data-editor]")
      ?.close();
    this.editing = null;
    this.deleteConfirm = false;
    if (i !== null)
      this.renderRoot
        .querySelector<HTMLButtonElement>(`[data-meal="${i}"]`)
        ?.focus();
  }
  private removeMeal() {
    if (this.locked || this.editing === null || !this.deleteConfirm) return;
    this.draft = this.draft.filter((_, i) => i !== this.editing);
    this.dirty = !samePlan(this.draft, this.attrs.meals);
    this.closeEditor();
  }
  render() {
    if (!this.config) return nothing;
    const i = this.editing,
      m = i === null ? undefined : this.draft[i];
    return html`<ha-card>
      <header>
        <div>
          <h2>${this.config.title ?? "Feeder schedule"}</h2>
          <small>Device-owned · Every day</small>
        </div>
        <button
          class="info"
          aria-label="Schedule information"
          @click=${() => (this.infoOpen = !this.infoOpen)}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            width="22"
            height="22"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
          >
            <circle cx="12" cy="12" r="9" />
            <path d="M12 10v7" />
            <circle cx="12" cy="7" r=".8" fill="currentColor" stroke="none" />
          </svg>
        </button>
      </header>
      ${
        this.infoOpen
          ? html`<aside>
              <p>
                Last locally reported snapshot, not an active query. External
                app changes may be stale until a new local report.
              </p>
              <p>
                Source: ${this.attrs.snapshot_source ?? "unknown"} · Revision:
                ${this.attrs.revision ?? 0}<br />Received:
                ${this.attrs.last_received_at ?? "Not yet received"}
              </p>
              <p>
                Saved sources are manually trusted HA metadata, not fresh device
                evidence. Import a selected passive LAN DP1 sensor with the
                integration's Import snapshot action.
              </p>
            </aside>`
          : nothing
      }
      <section aria-label="Schedule draft" ?inert=${this.busy}>
        ${this.draft.map(
          (meal, n) =>
            html`<div class="meal">
              <button
                class="open"
                data-meal=${n}
                aria-label=${`Edit meal ${n + 1}`}
                ?disabled=${this.locked}
                @click=${() => this.openEditor(n)}
              >
                <span class="time">${meal.time}</span
                ><span class="detail"
                  >Every day ·
                  <span aria-label=${`Portions ${n + 1}`}
                    >${meal.portions}</span
                  >
                  portion${meal.portions === 1 ? "" : "s"}</span
                >
              </button>
              <input
                class="switch"
                type="checkbox"
                role="switch"
                aria-label=${`Enabled ${n + 1}`}
                ?disabled=${this.locked}
                .checked=${meal.enabled === true}
                @change=${(e: Event) => this.edit(n, "enabled", (e.target as HTMLInputElement).checked)}
              />
            </div>`,
        )}
        <button
          class="add accent"
          aria-label="Add disabled meal"
          ?disabled=${this.locked || this.draft.length >= Math.min(10, this.attrs.max_meals ?? 10)}
          @click=${this.add}
        >
          Add meal
        </button>
      </section>
      <div class="status" role="status">
        ${this.message || (this.busy ? "Awaiting device report…" : this.dirty ? "Unsaved changes" : this.attrs.snapshot_source === "restored" ? "Saved schedule · confirmation required to overwrite" : this.writable ? "Changes stay local until Save" : "No editable snapshot · see information")}
      </div>
      ${this.dirty || this.conflict ? html`<footer><button @click=${this.reset} ?disabled=${this.busy}>${this.conflict ? "Reload schedule" : "Reset draft"}</button>${this.dirty ? html`<button data-save class="accent" ?disabled=${!this.saveable} @click=${this.review}>Save</button>` : nothing}</footer>` : nothing}
      ${
        m && i !== null
          ? html`<dialog
              data-editor
              aria-labelledby="editor-title"
              @cancel=${(e: Event) => {
                e.preventDefault();
                this.closeEditor();
              }}
            >
              <h2 id="editor-title">Edit meal</h2>
              <fieldset ?disabled=${this.locked}>
                <label class="field"
                  >Time<input
                    type="time"
                    aria-label=${`Time ${i + 1}`}
                    .value=${m.time}
                    @input=${(e: Event) => this.edit(i, "time", (e.target as HTMLInputElement).value)}
                /></label>
                <div class="field">
                  <span>Portions</span>
                  <div class="stepper">
                    <button
                      aria-label=${`Decrease portions ${i + 1}`}
                      ?disabled=${m.portions <= 1}
                      @click=${() => this.edit(i, "portions", m.portions - 1)}
                    >
                      −</button
                    ><output>${m.portions}</output
                    ><button
                      aria-label=${`Increase portions ${i + 1}`}
                      ?disabled=${m.portions >= Math.min(60, this.attrs.max_portions ?? 60)}
                      @click=${() => this.edit(i, "portions", m.portions + 1)}
                    >
                      +
                    </button>
                  </div>
                </div>
                <label class="field"
                  >Enabled<input
                    class="switch"
                    type="checkbox"
                    role="switch"
                    aria-label="Meal enabled"
                    .checked=${m.enabled === true}
                    @change=${(e: Event) => this.edit(i, "enabled", (e.target as HTMLInputElement).checked)}
                /></label>
                <div class="field">
                  <span>Repeat</span><span>Every day</span>
                </div>
                ${
                  this.deleteConfirm
                    ? html`<p>
                          Remove this meal from the draft? The device is
                          unchanged until Confirm Save.
                        </p>
                        <div class="dialog-actions">
                          <button @click=${() => (this.deleteConfirm = false)}>
                            Keep meal</button
                          ><button class="danger" @click=${this.removeMeal}>
                            Confirm Delete
                          </button>
                        </div>`
                    : html`<button
                        class="danger delete"
                        @click=${() => (this.deleteConfirm = true)}
                      >
                        Delete meal
                      </button>`
                }
              </fieldset>
              <div class="dialog-actions">
                <button class="accent" @click=${this.closeEditor}>Done</button>
              </div>
            </dialog>`
          : nothing
      }
      ${
        this.dialogOpen
          ? html`<dialog
              data-review
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
              ${this.attrs.snapshot_source === "restored" ? html`<p class="historical">Based on saved schedule from ${this.attrs.last_received_at}. External app changes could be overwritten. Confirm Save explicitly accepts this historical baseline.</p>` : nothing}
              <ol>
                ${this.draft.map((meal) => html`<li>Every day · ${meal.time} · ${meal.portions} portion${meal.portions === 1 ? "" : "s"} · ${meal.enabled ? "Enabled" : "Disabled"}</li>`)}
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
      }
    </ha-card>`;
  }
  static styles = css`
    :host {
      display: block;
      color: var(--primary-text-color, #222);
      font-family: var(--ha-font-family-body, system-ui);
      font-size: 14px;
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 18px;
      background: var(--card-background-color, var(--ha-card-background, #fff));
      border-radius: var(--ha-card-border-radius, 20px);
      border: 1px solid var(--divider-color, #ddd);
    }
    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 20px;
      gap: 12px;
    }
    h2 {
      font-size: 23px;
      letter-spacing: -0.6px;
      margin: 0 0 6px;
      font-weight: 600;
    }
    small,
    .status,
    .detail {
      color: var(--secondary-text-color, #666);
    }
    .info {
      font-size: 22px;
      width: 44px;
      padding: 0;
      flex-shrink: 0;
    }
    .meal {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid var(--divider-color, #ddd);
      background: var(--secondary-background-color, #f9f9fb);
      border-radius: 20px;
      margin: 10px 0;
      overflow: hidden;
    }
    .open {
      flex: 1;
      min-width: 0;
      text-align: left;
      padding: 18px 20px;
      border-radius: 0;
    }
    .time {
      display: block;
      font-size: 34px;
      letter-spacing: -1px;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .detail {
      display: block;
      font-size: 13px;
      margin-top: 7px;
    }
    button {
      min-height: 44px;
      border: 0;
      border-radius: 24px;
      background: transparent;
      color: inherit;
      font: inherit;
      padding: 10px 16px;
      cursor: pointer;
      touch-action: manipulation;
      transition: none;
      transform: none;
    }
    button:disabled {
      opacity: 0.4;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--primary-color, #f4a631);
      outline-offset: 2px;
    }
    .accent {
      background: var(--primary-color, #f4a631);
      color: var(--text-primary-color, #241907);
      font-weight: 600;
    }
    .add {
      width: 100%;
      margin-top: 16px;
    }
    .status {
      font-size: 12px;
      line-height: 1.5;
      margin-top: 14px;
      min-height: 18px;
      overflow-wrap: anywhere;
    }
    footer {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 12px;
      gap: 10px;
    }
    footer > button:first-child {
      color: var(--secondary-text-color, #666);
    }
    .switch {
      appearance: none;
      width: 49px;
      height: 44px;
      flex: 0 0 49px;
      margin: 0 18px 0 0;
      border-radius: 22px;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/49px 30px no-repeat;
      position: relative;
      cursor: pointer;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 3px;
      top: 10px;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: white;
    }
    .switch:checked {
      background: linear-gradient(
          var(--primary-color, #f4a631),
          var(--primary-color, #f4a631)
        )
        center/49px 30px no-repeat;
    }
    .switch:checked:after {
      left: 22px;
    }
    .switch:disabled {
      opacity: 0.4;
      cursor: default;
    }
    dialog {
      width: 380px;
      max-width: calc(100vw - 30px);
      max-height: calc(100dvh - 30px);
      overflow: auto;
      padding: 22px;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 24px;
      background: var(--card-background-color, #fff);
      color: inherit;
    }
    dialog::backdrop {
      background: #0007;
    }
    dialog h2 {
      font-size: 21px;
      margin: 0 0 20px;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 15px 0;
      border-bottom: 1px solid var(--divider-color, #ddd);
      gap: 12px;
    }
    fieldset {
      border: 0;
      margin: 0;
      padding: 0;
      min-width: 0;
    }
    input[type="time"] {
      color: inherit;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 10px;
      padding: 8px;
      font: inherit;
      min-height: 44px;
      max-width: 160px;
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stepper button {
      width: 44px;
      height: 44px;
      padding: 0;
      font-size: 22px;
      background: var(--secondary-background-color, #f2f2f7);
    }
    .stepper output {
      min-width: 24px;
      text-align: center;
      font-size: 20px;
      font-variant-numeric: tabular-nums;
    }
    .field .switch {
      margin: 0;
    }
    .danger {
      color: var(--error-color, #d83232);
    }
    .delete {
      width: 100%;
      text-align: left;
      margin: 10px 0;
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    p,
    li {
      line-height: 1.6;
      overflow-wrap: anywhere;
    }
    ol {
      padding-left: 20px;
    }
    aside {
      font-size: 12px;
      color: var(--secondary-text-color, #666);
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
