import { LitElement, html, css, nothing } from "lit";
import { nativeComponents, showMealDialog } from "./native-dialog";
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
type Appearance = Partial<
  Record<
    | "accent_color"
    | "icon_color"
    | "border_radius"
    | "font_family"
    | "header_font_size"
    | "meal_time_font_size"
    | "row_background"
    | "card_background"
    | "control_size",
    string
  >
>;
type Config = {
  type?: string;
  entity: string;
  title?: string;
  icon?: string;
  meal_icon_mode?: "time_of_day" | "fixed";
  meal_icon?: string;
  manual_feed?: boolean;
  feed_title?: string;
  feed_icon?: string;
  portions_entity?: string;
  appearance?: Appearance;
};
type Hass = {
  states: Record<string, { state: string; attributes: Record<string, any> }>;
  services?: Record<string, Record<string, unknown>>;
  config?: { time_zone?: string };
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
const APPEARANCE = [
  "accent_color",
  "icon_color",
  "border_radius",
  "font_family",
  "header_font_size",
  "meal_time_font_size",
  "row_background",
  "card_background",
  "control_size",
] as const;
// Only individual CSS property values, never a stylesheet, HTML, URL or selector.
function safeAppearance(a: Appearance = {}): Appearance {
  const out: Appearance = {};
  const props = {
    accent_color: "color",
    icon_color: "color",
    border_radius: "border-radius",
    font_family: "font-family",
    header_font_size: "font-size",
    meal_time_font_size: "font-size",
    row_background: "background-color",
    card_background: "background-color",
    control_size: "width",
  };
  for (const key of APPEARANCE) {
    const v = a[key];
    if (v === undefined || v === "") continue;
    if (
      typeof v !== "string" ||
      v.length > 160 ||
      /[;{}<>\\]|url\s*\(|expression\s*\(|!important|\/\*/i.test(v) ||
      !CSS.supports(props[key], v)
    )
      throw new Error(`Invalid appearance.${key}`);
    out[key] = v;
  }
  return out;
}
export class TuyaFeederCard extends LitElement {
  static properties = {
    config: { state: true },
    draft: { state: true },
    editing: { state: true },
    view: { state: true },
    busy: { state: true },
    message: { state: true },
    conflict: { state: true },
    acknowledged: { state: true },
    feedPortions: { state: true },
    feedBusy: { state: true },
    helperBusy: { state: true },
  };
  config!: Config;
  draft: Meal[] = [];
  editing: number | null = null;
  view: "list" | "edit" | "delete" | "feed" = "list";
  busy = false;
  feedBusy = false;
  helperBusy = false;
  message = "";
  conflict = false;
  acknowledged = false;
  feedPortions = 1;
  nativeDialog?: any;
  private _hass?: Hass;
  private base = 0;
  private baseline: Meal[] = [];
  private sent?: Meal[];
  private sentAt?: string;
  private serviceCompleted = false;
  private attempt = 0;
  private failed = false;
  private toggling: number | null = null;
  private operation: "update_meal" | "add_meal" | "delete_meal" = "update_meal";
  private feedDose?: number;
  private timer?: ReturnType<typeof setTimeout>;
  setConfig(c: Config) {
    if (!c.entity?.startsWith("sensor."))
      throw new Error("Select a schedule sensor");
    if (c.portions_entity && !c.portions_entity.startsWith("input_number."))
      throw new Error("Select a portions helper");
    if (this.busy || this.feedBusy)
      throw new Error("Wait for completion before changing config");
    if (
      c.meal_icon_mode &&
      !["time_of_day", "fixed"].includes(c.meal_icon_mode)
    )
      throw new Error("Select time_of_day or fixed meal icons");
    this.config = { ...c, appearance: safeAppearance(c.appearance) };
    for (const key of APPEARANCE) {
      this.style.removeProperty(`--feeder-${key.replaceAll("_", "-")}`);
      const v = this.config.appearance?.[key];
      if (v) this.style.setProperty(`--feeder-${key.replaceAll("_", "-")}`, v);
    }
    this.reset();
  }
  set hass(h: Hass) {
    this._hass = h;
    const a = this.attrs;
    if (this.busy) {
      if (a.error && !a.pending) this.failure(a.error);
      else if (
        this.toggling !== null &&
        a.revision > this.base &&
        this.sent &&
        valid(a.meals, a.max_meals, a.max_portions) &&
        !samePlan(this.sent, a.meals)
      )
        this.failure("Schedule changed during update");
      else if (
        this.serviceCompleted &&
        this.writable &&
        a.snapshot_source === "received" &&
        a.revision > this.base &&
        Date.parse(a.last_received_at) > Date.parse(this.sentAt ?? "") &&
        this.sent &&
        samePlan(this.sent, a.meals)
      ) {
        this.clearTimer();
        this.busy = false;
        this.failed = false;
        this.sent = undefined;
        this.toggling = null;
        this.editing = null;
        this.load();
        this.message = "Saved";
      }
    } else if (this.editing !== null || this.failed) {
      if (
        a.revision !== this.base ||
        !this.writable ||
        !samePlan(this.baseline, a.meals)
      ) {
        this.conflict = true;
        this.view = "list";
        this.message = "Schedule changed. Reload to continue.";
        this.nativeDialog?.invalidate();
      }
    } else this.load();
    this.nativeDialog?.requestUpdate();
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
      (!this._hass?.services ||
        ["update_meal", "add_meal", "delete_meal"].every(
          (name) => !!this._hass?.services?.tuya_feeder?.[name],
        )) &&
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
  // Presentation only: confirmed integration attributes, never the editor draft.
  private get scheduleActive() {
    const state = this._hass?.states[this.config?.entity];
    const a = this.attrs;
    return (
      !!state &&
      !["unknown", "unavailable"].includes(state.state) &&
      a.schedule_valid === true &&
      ["received", "restored"].includes(a.snapshot_source) &&
      valid(a.meals, a.max_meals, a.max_portions) &&
      a.meals.some((m: Meal) => m.enabled === true)
    );
  }
  private get locked() {
    return (
      !this.writable ||
      this.conflict ||
      this.busy ||
      this.feedBusy ||
      this.attrs.feeding_pending === true
    );
  }
  private load() {
    this.base = this.attrs.revision;
    this.baseline = valid(
      this.attrs.meals,
      this.attrs.max_meals,
      this.attrs.max_portions,
    )
      ? clone(this.attrs.meals)
      : [];
    this.draft = clone(this.baseline);
  }
  private reset() {
    if (this.busy || this.feedBusy) return;
    this.editing = null;
    this.view = "list";
    this.conflict = false;
    this.failed = false;
    this.toggling = null;
    this.message = "";
    this.acknowledged = false;
    this.load();
  }
  private async openEditor(i: number, enabled?: boolean) {
    if (this.locked || this.view !== "list") return;
    this.load();
    this.operation = "update_meal";
    this.editing = i;
    this.view = "edit";
    this.acknowledged = false;
    this.message = "";
    if (enabled !== undefined) this.edit("enabled", enabled);
    try {
      await nativeComponents();
      showMealDialog(this);
    } catch (e) {
      this.view = "list";
      this.message = "Couldn’t open editor. Refresh Home Assistant.";
      console.error(e);
    }
  }
  private async toggle(i: number, event: Event) {
    const input = event.target as HTMLInputElement;
    const enabled =
      input.tagName === "BUTTON" ? !this.baseline[i]?.enabled : input.checked;
    input.checked =
      this.busy && this.toggling === i
        ? (this.sent?.[i].enabled ?? false)
        : (this.baseline[i]?.enabled ?? false);
    if (this.locked || this.failed || this.view !== "list") return;
    // Refresh the baseline synchronously; backend merges at this exact revision.
    this.load();
    if (!this.baseline[i] || this.baseline[i].enabled === enabled) return;
    this.operation = "update_meal";
    this.editing = i;
    this.toggling = i;
    this.acknowledged = this.attrs.snapshot_source === "restored";
    this.edit("enabled", enabled);
    await this.save();
  }
  private async add() {
    if (
      this.locked ||
      this.view !== "list" ||
      this.baseline.length >= Math.min(10, this.attrs.max_meals)
    )
      return;
    this.load();
    this.editing = this.draft.length;
    this.operation = "add_meal";
    this.view = "edit";
    this.acknowledged = false;
    this.message = "";
    this.draft = [
      ...this.draft,
      { days: [...DAYS], time: "23:59", portions: 1, enabled: false },
    ];
    try {
      await nativeComponents();
      showMealDialog(this);
    } catch (e) {
      this.view = "list";
      this.message = "Couldn’t open editor. Refresh Home Assistant.";
      console.error(e);
    }
  }
  private edit(key: keyof Meal, value: unknown) {
    if (this.locked || this.editing === null) return;
    this.draft = this.draft.map((m, n) =>
      n === this.editing ? { ...m, [key]: value } : m,
    );
  }
  private async cancel() {
    if (this.busy || this.feedBusy) return;
    if (this.view === "delete") {
      this.view = "edit";
      return;
    }
    const i = this.editing;
    this.reset();
    await this.updateComplete;
    this.renderRoot
      .querySelector<HTMLButtonElement>(`[data-meal="${i}"]`)
      ?.focus();
  }
  private get saveable() {
    return (
      !this.locked &&
      this.editing !== null &&
      valid(this.draft, this.attrs.max_meals, this.attrs.max_portions) &&
      !samePlan(this.draft, this.baseline) &&
      (this.attrs.snapshot_source !== "restored" || this.acknowledged)
    );
  }
  private clearTimer() {
    if (this.timer) clearTimeout(this.timer);
    this.timer = undefined;
  }
  private failure(e: unknown) {
    console.error("Tuya feeder operation failed", e);
    this.attempt++;
    this.clearTimer();
    this.busy = false;
    this.failed = true;
    if (this.toggling !== null) {
      this.toggling = null;
      this.sent = undefined;
      this.editing = null;
      this.failed = false;
      this.load();
      this.message =
        "Couldn’t change meal. Check the schedule before trying again.";
      this.requestUpdate();
      return;
    }
    this.message = "Couldn’t save. Try again.";
    this.requestUpdate();
  }
  private async retry() {
    if (
      this.busy ||
      this.conflict ||
      this.editing === null ||
      this.attrs.revision !== this.base ||
      !this.writable ||
      !samePlan(this.baseline, this.attrs.meals)
    )
      return;
    this.failed = false;
    this.view = this.operation === "delete_meal" ? "delete" : "edit";
    this.message = "";
    try {
      await nativeComponents();
      showMealDialog(this);
    } catch (e) {
      this.view = "list";
      this.message = "Couldn’t open editor. Refresh Home Assistant.";
      console.error(e);
    }
  }
  private async save(deleting = false) {
    if (
      this.editing === null ||
      this.locked ||
      this.attrs.revision !== this.base ||
      !samePlan(this.baseline, this.attrs.meals)
    )
      return;
    if (
      deleting
        ? this.view !== "delete" ||
          (this.attrs.snapshot_source === "restored" && !this.acknowledged)
        : !this.saveable
    )
      return;
    if (deleting) this.operation = "delete_meal";
    const index = this.editing;
    this.sent = deleting
      ? clone(this.baseline.filter((_, i) => i !== index))
      : clone(this.draft);
    const data = {
      entity_id: this.config.entity,
      expected_revision: this.base,
      ...(this.operation !== "add_meal" ? { meal_index: index } : {}),
      ...(!deleting ? { meal: clone([this.draft[index]])[0] } : {}),
      ...(this.attrs.snapshot_source === "restored"
        ? { acknowledge_restored_snapshot: true }
        : {}),
    };
    this.sentAt = this.attrs.last_received_at;
    const attempt = ++this.attempt;
    this.serviceCompleted = false;
    this.busy = true;
    this.failed = false;
    this.view = "list";
    this.message = "Saving…";
    this.clearTimer();
    this.timer = setTimeout(() => {
      if (this.busy && this.attempt === attempt)
        this.failure(
          new Error("Schedule confirmation timed out; no retry sent"),
        );
    }, 20000);
    try {
      const r = await this.hass.callService(
        "tuya_feeder",
        this.operation,
        data,
      );
      if (!this.busy || this.attempt !== attempt) return;
      if (
        r?.error ||
        r?.response?.error ||
        r?.confirmed === false ||
        r?.response?.confirmed === false
      )
        this.failure(r?.error ?? r?.response?.error ?? "unconfirmed");
      else {
        this.serviceCompleted = true;
        this.hass = this.hass;
      }
    } catch (e) {
      if (this.busy && this.attempt === attempt) this.failure(e);
    }
  }
  private get helper() {
    return this.config.portions_entity
      ? this._hass?.states[this.config.portions_entity]
      : undefined;
  }
  private get selectedPortions() {
    return this.config.portions_entity
      ? Number(this.helper?.state)
      : this.feedPortions;
  }
  private get feedBounds() {
    if (!this.config.portions_entity) return { min: 1, max: 60 };
    const h = this.helper;
    if (
      !h ||
      ["unknown", "unavailable", ""].includes(h.state) ||
      !Number.isInteger(Number(h.attributes.min)) ||
      !Number.isInteger(Number(h.attributes.max))
    )
      return undefined;
    return {
      min: Math.max(1, Number(h.attributes.min)),
      max: Math.min(60, Number(h.attributes.max)),
    };
  }
  private get feedReady() {
    const n = this.selectedPortions,
      b = this.feedBounds;
    return (
      this.attrs.supports_manual_feed === true &&
      !this.attrs.feeding_pending &&
      !this.attrs.pending &&
      (!this.hass.services || !!this.hass.services.tuya_feeder?.feed) &&
      !!b &&
      Number.isInteger(n) &&
      n >= b.min &&
      n <= b.max &&
      !this.busy &&
      !this.feedBusy &&
      !this.helperBusy
    );
  }
  private async selectFeed(delta: number) {
    const b = this.feedBounds,
      n = this.selectedPortions;
    if (
      !b ||
      this.helperBusy ||
      this.feedBusy ||
      this.busy ||
      !Number.isInteger(n) ||
      n < b.min ||
      n > b.max ||
      n + delta < b.min ||
      n + delta > b.max
    )
      return;
    if (!this.config.portions_entity) {
      this.feedPortions = n + delta;
      return;
    }
    this.helperBusy = true;
    try {
      await this.hass.callService(
        "input_number",
        delta > 0 ? "increment" : "decrement",
        {
          entity_id: this.config.portions_entity,
        },
      );
    } catch (e) {
      console.error("Tuya feeder portions selection failed", e);
      this.message = "Couldn’t change portions. Try again.";
    } finally {
      this.helperBusy = false;
    }
  }
  private async confirmFeed() {
    if (!this.feedReady || this.view !== "list") return;
    this.feedDose = this.selectedPortions;
    this.view = "feed";
    this.message = "";
    try {
      await nativeComponents();
      showMealDialog(this);
    } catch (e) {
      this.view = "list";
      this.message = "Couldn’t open confirmation. Refresh Home Assistant.";
      console.error(e);
    }
  }
  private async feed() {
    if (
      !this.feedReady ||
      !Number.isInteger(this.feedDose) ||
      this.feedDose! < 1 ||
      this.feedDose! > 60
    )
      return;
    this.feedBusy = true;
    this.view = "list";
    this.message = "Feeding…";
    try {
      const r = await this.hass.callService("tuya_feeder", "feed", {
        entity_id: this.config.entity,
        portions: this.feedDose,
      });
      if (r?.error) throw new Error(String(r.error));
      this.message = "Feed requested";
    } catch (e) {
      console.error("Tuya feeder manual feed failed", e);
      this.message = "Couldn’t feed. Try again.";
    } finally {
      this.feedBusy = false;
      this.feedDose = undefined;
    }
  }
  static getConfigElement() {
    return document.createElement("tuya-feeder-card-editor");
  }
  static getStubConfig() {
    return { entity: "", title: "Feeder", icon: "mdi:food-drumstick" };
  }
  getCardSize() {
    return 2 + this.baseline.length;
  }
  getGridOptions() {
    return { columns: 12, min_columns: 6 };
  }
  private mealIcon(time: string) {
    if (this.config.meal_icon_mode === "fixed")
      return this.config.meal_icon ?? this.config.icon ?? "mdi:food-drumstick";
    // Schedule times are already local HH:MM; never reinterpret as UTC.
    const hour = Number(time.slice(0, 2));
    return hour >= 5 && hour < 11
      ? "mdi:weather-sunset-up"
      : hour >= 11 && hour < 16
        ? "mdi:white-balance-sunny"
        : hour >= 16 && hour < 21
          ? "mdi:weather-sunset-down"
          : "mdi:weather-night";
  }
  private lastFeedLabel() {
    const value = this.attrs.last_feed_at;
    if (typeof value !== "string" || !/(Z|[+-]\d{2}:\d{2})$/.test(value))
      return "No recent feeding";
    const fed = new Date(value),
      now = new Date();
    if (!Number.isFinite(fed.getTime()) || fed > now)
      return "No recent feeding";
    const zone = this.hass?.config?.time_zone;
    const day = (d: Date) =>
      new Intl.DateTimeFormat("en-CA", {
        timeZone: zone,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d);
    const parts = new Intl.DateTimeFormat("en-CA", {
      timeZone: zone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).formatToParts(now);
    const get = (k: string) => Number(parts.find((p) => p.type === k)?.value);
    const yesterday = new Date(
      Date.UTC(get("year"), get("month") - 1, get("day") - 1, 12),
    );
    const yesterdayDay = new Intl.DateTimeFormat("en-CA", {
      timeZone: "UTC",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(yesterday);
    const time = new Intl.DateTimeFormat("en-GB", {
      timeZone: zone,
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    }).format(fed);
    return day(fed) === day(now)
      ? `Last fed ${time}`
      : day(fed) === yesterdayDay
        ? `Last fed yesterday · ${time}`
        : `Last fed ${new Intl.DateTimeFormat("en-US", { timeZone: zone, month: "short", day: "numeric" }).format(fed)} · ${time}`;
  }
  render() {
    if (!this.config) return nothing;
    return html`<ha-card
      part="card outer"
      data-active=${String(this.scheduleActive)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "Escape" && this.view !== "list") {
          e.preventDefault();
          this.cancel();
        }
      }}
    >
      ${html`<header
          part=${this.config.manual_feed ? "header feed-container manual-feed row" : "header feed-container"}
          data-active=${String(this.scheduleActive)}
          class=${this.config.manual_feed ? "manual" : ""}
        >
          <button
            class="identity-add"
            part="add control"
            aria-label="Add meal"
            title="Add meal"
            ?disabled=${this.locked || this.failed || this.baseline.length >= Math.min(10, this.attrs.max_meals)}
            @click=${this.add}
          >
            <ha-icon
              part="header-icon"
              .icon=${this.config.icon ?? this.config.feed_icon ?? "mdi:food-drumstick"}
            ></ha-icon>
          </button>
          <div class="identity">
            <h2 part="title">
              ${this.config.title ?? this.config.feed_title ?? "Feeder"}
            </h2>
            <div class="last-feed" part="subtitle">${this.lastFeedLabel()}</div>
          </div>
          ${this.config.manual_feed ? html`<button part="control" aria-label="Decrease feeding portions" ?disabled=${!this.feedBounds || !Number.isInteger(this.selectedPortions) || this.selectedPortions <= this.feedBounds.min || this.helperBusy || this.feedBusy || this.busy} @click=${() => this.selectFeed(-1)}>−</button><output aria-label="Feeding portions">${Number.isInteger(this.selectedPortions) && this.feedBounds && this.selectedPortions >= this.feedBounds.min && this.selectedPortions <= this.feedBounds.max ? this.selectedPortions : "—"}</output><button part="control" aria-label="Increase feeding portions" ?disabled=${!this.feedBounds || !Number.isInteger(this.selectedPortions) || this.selectedPortions >= this.feedBounds.max || this.helperBusy || this.feedBusy || this.busy} @click=${() => this.selectFeed(1)}>+</button><button class="accent feed" ?disabled=${!this.feedReady} @click=${this.confirmFeed}>Feed</button>` : nothing}
        </header>
        ${this.message && !["Saved", "Feed requested"].includes(this.message) ? html`<div part="status" class="status" role="status">${this.message}</div>` : nothing}
        <section
          aria-label="Meal schedule"
          ?inert=${this.busy || this.feedBusy}
        >
          ${
            this.writable || this.busy || this.failed || this.conflict
              ? this.baseline.map(
                  (meal, n) =>
                    html`<div
                      class="meal"
                      part="meal row"
                      data-enabled=${String(meal.enabled)}
                    >
                      <button
                        class="meal-toggle"
                        part="enabled control"
                        role="switch"
                        aria-label=${`Enabled ${n + 1}`}
                        aria-description=${`Meal ${n + 1} at ${meal.time}; tap to ${meal.enabled ? "disable" : "enable"}`}
                        aria-checked=${String(meal.enabled)}
                        aria-busy=${String(this.busy && this.toggling === n)}
                        ?disabled=${this.locked || this.failed}
                        @click=${(e: Event) => {
                          e.stopPropagation();
                          this.toggle(n, {
                            target: e.currentTarget,
                          } as unknown as Event);
                        }}
                      >
                        <ha-icon .icon=${this.mealIcon(meal.time)}></ha-icon>
                      </button>
                      <button
                        part="meal-button"
                        class="open"
                        data-meal=${n}
                        aria-label=${`Edit meal ${n + 1}`}
                        ?disabled=${this.locked || this.failed}
                        @click=${() => this.openEditor(n)}
                      >
                        <span class="time" part="meal-time">${meal.time}</span
                        ><span class="detail"
                          >Every day ·
                          <span aria-label=${`Portions ${n + 1}`}
                            >${meal.portions}</span
                          >
                          portion${meal.portions === 1 ? "" : "s"}</span
                        >
                      </button>
                    </div>`,
                )
              : html`<div class="unavailable">Schedule unavailable</div>`
          }
          ${!this.writable && !this.busy && !this.failed && !this.conflict ? html`<button @click=${this.reset}>Retry</button>` : nothing}
        </section>`}
      ${this.conflict ? html`<button @click=${this.reset}>Reload</button>` : this.failed ? html`<div class="actions"><button @click=${this.reset}>Cancel</button><button ?disabled=${!this.writable} @click=${this.retry}>Try again</button></div>` : nothing}
    </ha-card>`;
  }
  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      color: var(--primary-text-color, #222);
      font-family: var(
        --feeder-font-family,
        var(--ha-font-family-body, system-ui)
      );
      font-size: 15px;
      --accent: var(
        --feeder-accent-color,
        var(--accent-color, var(--primary-color, #03a9f4))
      );
      --icon-palette: var(
        --feeder-icon-color,
        var(--color-teal, var(--accent))
      );
      --control: max(44px, var(--feeder-control-size, 44px));
    }
    * {
      box-sizing: border-box;
    }
    ha-card {
      display: block;
      padding: 10px;
      background: var(
        --feeder-card-background,
        var(--ha-card-background, var(--card-background-color, #fff))
      );
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      border: var(--ha-card-border-width, 1px) solid
        var(--ha-card-border-color, var(--divider-color, #ddd));
      box-shadow: var(--ha-card-box-shadow, none);
    }
    header[data-active="true"] {
      background: var(--feeder-active-card-background, white);
      color: var(--feeder-active-text-color, black);
      --primary-text-color: var(--feeder-active-text-color, black);
      --secondary-text-color: var(--feeder-active-muted-color, gray);
      --feeder-header-icon-background: var(
        --feeder-active-icon-background,
        var(--icon-palette)
      );
      --feeder-header-icon-color: var(--feeder-active-icon-color, white);
    }
    section > .add {
      display: block;
      margin: 8px 0 0 auto;
    }
    header {
      display: flex;
      align-items: center;
      gap: 14px;
      min-height: 68px;
      margin-bottom: 12px;
    }
    h2 {
      margin: 0;
      font-size: var(--feeder-header-font-size, 18px);
      font-weight: 500;
      color: var(--primary-text-color, #222);
      line-height: 1.3;
    }
    ha-icon {
      --mdc-icon-size: 20px;
      width: 20px;
      height: 20px;
      flex-shrink: 0;
      color: var(--secondary-text-color, #777);
    }
    header .identity-add ha-icon {
      --mdc-icon-size: 25px;
      width: 45px;
      height: 45px;
      padding: 10px;
      border-radius: 50%;
      background: var(--feeder-header-icon-background, transparent);
      color: var(--feeder-header-icon-color, #9da0a2);
    }
    header:not(.edit-header):has(> .identity-add) {
      display: grid;
      grid-template-columns: 64px minmax(0, 1fr);
      gap: 0;
      margin-left: -10px;
      margin-right: -10px;
    }
    header .identity-add ha-icon {
      margin-left: 11.5px;
    }
    .meal {
      display: flex;
      align-items: center;
      gap: 8px;
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      background: var(
        --feeder-row-background,
        color-mix(in srgb, var(--primary-text-color, #222) 4.5%, transparent)
      );
      margin: 8px 0;
      overflow: hidden;
    }
    .open {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 1;
      min-width: 0;
      text-align: left;
      padding: 16px 12px;
      border-radius: 0;
    }
    .time {
      display: block;
      flex-shrink: 0;
      font-size: var(--feeder-meal-time-font-size, 32px);
      font-weight: 500;
      letter-spacing: -1.5px;
      line-height: 1.15;
      font-variant-numeric: tabular-nums;
    }
    .detail,
    .status,
    .unavailable {
      color: var(--secondary-text-color, #777);
    }
    .detail {
      font-size: 13px;
    }
    .open .detail {
      display: block;
      margin: 0;
      line-height: 1.3;
      text-wrap: pretty;
    }
    button {
      min-height: var(--control);
      min-width: 44px;
      border: 0;
      border-radius: 12px;
      background: transparent;
      color: inherit;
      font: inherit;
      font-weight: 500;
      padding: 10px 14px;
      cursor: pointer;
      touch-action: manipulation;
    }
    button:disabled,
    input:disabled {
      opacity: 0.28;
      cursor: default;
    }
    button:focus-visible,
    input:focus-visible {
      outline: 2px solid var(--accent);
      outline-offset: 2px;
    }
    .accent {
      background: var(--accent);
      color: var(--text-primary-color, #fff);
    }
    .add {
      width: var(--control);
      height: var(--control);
      padding: 0;
      margin-left: auto;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--accent);
    }
    .add ha-icon {
      color: inherit;
    }
    .status {
      font-size: 13px;
      line-height: 1.5;
      margin-top: 12px;
    }
    .switch {
      appearance: none;
      width: 49px;
      height: var(--control);
      flex: 0 0 49px;
      margin: 0 14px 0 0;
      background: linear-gradient(
          var(--disabled-text-color, #aaa),
          var(--disabled-text-color, #aaa)
        )
        center/49px 30px no-repeat;
      position: relative;
      cursor: pointer;
      border: 0;
      border-radius: 22px;
    }
    .switch:after {
      content: "";
      position: absolute;
      left: 3px;
      top: calc(50% - 12px);
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: #fff;
    }
    .switch:checked {
      background: linear-gradient(var(--accent), var(--accent)) center/49px 30px
        no-repeat;
    }
    .switch:checked:after {
      left: 22px;
    }
    .field {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 16px 0;
      border-bottom: 1px solid var(--divider-color, #ddd);
      gap: 12px;
    }
    .field .switch {
      margin: 0;
    }
    input[type="time"] {
      color: inherit;
      background: transparent;
      border: 1px solid var(--divider-color, #ddd);
      border-radius: 12px;
      padding: 8px;
      font: inherit;
      min-height: var(--control);
      max-width: 155px;
    }
    input[type="checkbox"]:not(.switch) {
      width: 44px;
      height: 44px;
      margin: 0;
      accent-color: var(--accent);
    }
    .stepper {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stepper button,
    .manual > button:not(.feed):not(.identity-add) {
      width: var(--control);
      height: var(--control);
      padding: 0;
      font-size: 22px;
      background: var(
        --feeder-row-background,
        color-mix(in srgb, var(--primary-text-color, #222) 4.5%, transparent)
      );
    }
    output {
      min-width: 28px;
      text-align: center;
      font-size: 24px;
      font-weight: 500;
      font-variant-numeric: tabular-nums;
    }
    .danger {
      color: var(--error-color, #db4437);
    }
    .delete {
      width: 100%;
      text-align: left;
      margin-top: 12px;
    }
    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 16px;
    }
    .edit-header {
      justify-content: space-between;
      gap: 6px;
    }
    .edit-header [data-back] {
      display: flex;
      align-items: center;
      padding-left: 0;
      gap: 2px;
    }
    .edit-header [data-back] ha-icon {
      color: inherit;
    }
    header.manual:not(.edit-header):has(> .identity-add) {
      display: grid;
      grid-template-columns:
        64px minmax(33px, 1fr) var(--control) 32px var(--control)
        minmax(64px, 1fr);
      column-gap: 0;
      align-items: center;
      min-height: 68px;
      margin: 0 -10px 12px;
      padding: 0 6px 0 0;
    }
    .manual h2 {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .manual output {
      font-size: 32px;
      letter-spacing: -2px;
    }
    .manual .feed {
      margin-left: 8px;
      padding: 8px;
    }
    .unavailable {
      padding: 16px 0;
    }
    @container (max-width: 360px) {
      .meal {
        gap: 4px;
      }
      .open {
        gap: 8px;
        padding: 16px 8px;
      }
      .open .time {
        font-size: var(--feeder-meal-time-font-size, 26px);
      }
      .open .detail {
        font-size: 12px;
      }
      .meal .switch {
        margin-right: 8px;
      }
    }
    ha-card {
      padding: 0;
      background: var(--feeder-outer-background, transparent);
      border: 0;
      box-shadow: none;
    }
    header:not(.edit-header):has(> .identity-add),
    header.manual:not(.edit-header):has(> .identity-add) {
      margin: 0 0 8px;
      min-height: 68px;
      border-radius: var(
        --feeder-border-radius,
        var(--ha-card-border-radius, 20px)
      );
      background: var(
        --feeder-feed-background,
        var(--feeder-card-background, rgba(0, 0, 0, 0.3))
      );
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 6px 10px rgba(0, 0, 0, 0.08);
    }
    header[data-active="true"]:not(.edit-header):has(> .identity-add) {
      background: var(--feeder-active-card-background, white);
    }
    header .identity-add ha-icon {
      margin-left: 11.5px;
      background: var(--feeder-header-icon-background, transparent);
      color: var(--feeder-header-icon-color, var(--icon-palette));
    }
    .identity-add {
      width: 64px;
      min-height: 68px;
      padding: 0;
      display: flex;
      align-items: center;
      border-radius: inherit;
    }
    .identity {
      min-width: 0;
    }
    .last-feed {
      font-size: 15px;
      line-height: 1.3;
      color: var(--secondary-text-color, #777);
      white-space: normal;
    }
    header.manual:not(.edit-header):has(> .identity-add) {
      grid-template-columns:
        64px minmax(80px, 1fr) var(--control) 32px var(--control)
        minmax(64px, 1fr);
    }
    .meal {
      display: grid;
      grid-template-columns: 66px minmax(0, 1fr);
      gap: 0;
      min-height: 69px;
      margin: 8px 0;
      background: var(
        --feeder-meal-background,
        var(--feeder-row-background, rgba(0, 0, 0, 0.3))
      );
      color: white;
      box-shadow:
        0 2px 4px rgba(0, 0, 0, 0.1),
        0 6px 10px rgba(0, 0, 0, 0.08);
    }
    .meal[data-enabled="true"] {
      background: var(
        --feeder-meal-active-background,
        var(--feeder-active-card-background, white)
      );
      color: var(--feeder-active-text-color, black);
    }
    .meal-toggle {
      width: 66px;
      height: 69px;
      padding: 0;
      display: grid;
      place-items: center;
      border-radius: 0;
    }
    .meal-toggle ha-icon {
      width: 45px;
      height: 45px;
      padding: 10px;
      --mdc-icon-size: 25px;
      border-radius: 24px;
      color: var(--icon-palette);
      background: transparent;
    }
    .meal[data-enabled="true"] .meal-toggle ha-icon {
      background: var(--feeder-active-icon-background, var(--icon-palette));
      color: var(--feeder-active-icon-color, white);
    }
    .open {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
      gap: 0;
      min-height: 69px;
      padding: 0 10px 0 0;
    }
    .open .time {
      font-size: var(--feeder-meal-time-font-size, 17px);
      letter-spacing: normal;
      font-weight: 500;
      line-height: 1.3;
    }
    .open .detail {
      font-size: 15px;
      line-height: 1.3;
      color: rgba(255, 255, 255, 0.5);
    }
    .meal[data-enabled="true"] .detail {
      color: var(--feeder-active-muted-color, rgba(0, 0, 0, 0.5));
    }
    .status {
      margin: 0 0 8px;
      font-size: 15px;
    }
    @container (max-width:360px) {
      header.manual:not(.edit-header):has(> .identity-add) {
        grid-template-columns:
          64px minmax(0, 1fr) var(--control) 28px var(--control)
          55px;
        padding-right: 0;
      }
      .manual .feed {
        min-width: 50px;
        margin-left: 5px;
      }
      .manual output {
        min-width: 28px;
      }
      .last-feed {
        font-size: 12px;
      }
      .meal {
        gap: 0;
      }
      .open {
        gap: 0;
        padding: 0 10px 0 0;
      }
      .open .time {
        font-size: var(--feeder-meal-time-font-size, 17px);
      }
      .open .detail {
        font-size: 15px;
      }
    }
    [inert] {
      pointer-events: none;
    }
    p {
      color: var(--secondary-text-color, #777);
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
    const labels: Record<string, string> = {
      entity: "Schedule sensor",
      title: "Title",
      icon: "Identity icon (Add meal)",
      meal_icon_mode: "Meal icons",
      meal_icon: "Fixed meal icon",
      manual_feed: "Show manual feeding",
      feed_title: "Feeding title",
      feed_icon: "Feeding icon",
      portions_entity: "Portions helper (optional)",
      appearance: "Appearance",
      accent_color: "Accent color",
      icon_color: "Icon color",
      border_radius: "Corner radius",
      font_family: "Font family",
      header_font_size: "Header size",
      meal_time_font_size: "Meal time size",
      row_background: "Row color",
      card_background: "Card color",
      control_size: "Control size (minimum 44px)",
    };
    return html`<ha-form
      .hass=${this.hass}
      .data=${this.config}
      .schema=${[
        {
          name: "entity",
          required: true,
          selector: {
            entity: { domain: "sensor", integration: "tuya_feeder" },
          },
        },
        { name: "title", selector: { text: {} } },
        { name: "icon", selector: { icon: {} } },
        {
          name: "meal_icon_mode",
          selector: {
            select: {
              options: [
                { value: "time_of_day", label: "Time of day" },
                { value: "fixed", label: "Fixed icon" },
              ],
            },
          },
        },
        { name: "meal_icon", selector: { icon: {} } },
        { name: "manual_feed", selector: { boolean: {} } },
        { name: "feed_title", selector: { text: {} } },
        { name: "feed_icon", selector: { icon: {} } },
        {
          name: "portions_entity",
          selector: { entity: { domain: "input_number" } },
        },
        {
          name: "appearance",
          type: "expandable",
          schema: APPEARANCE.map((name) => ({ name, selector: { text: {} } })),
        },
      ]}
      .computeLabel=${(s: { name: string }) => labels[s.name] ?? s.name}
      @value-changed=${(e: CustomEvent) => {
        const c = { ...this.config, ...e.detail.value };
        safeAppearance(c.appearance);
        this.config = c;
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
  name: "Tuya Feeder",
  description: "Daily meals with in-card editing and optional manual feeding.",
  documentationURL: "https://github.com/myevit/tuya-feeder-card",
});
