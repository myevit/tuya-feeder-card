import { LitElement, html, nothing } from "lit";
// HA frontend 20260930.3's internal show-dialog adapter. No more-info patching.
export async function nativeComponents() {
  if (
    !["ha-dialog", "ha-form", "ha-button", "ha-dialog-footer"].every((t) =>
      customElements.get(t),
    )
  ) {
    const helpers = await (window as any).loadCardHelpers?.();
    if (!helpers)
      throw new Error("Home Assistant dialog controls are unavailable");
    const card = await helpers.createCardElement({
      type: "entities",
      entities: [],
    });
    await (card.constructor as any).getConfigElement?.();
  }
  if (
    !["ha-dialog", "ha-form", "ha-button", "ha-dialog-footer"].every((t) =>
      customElements.get(t),
    )
  )
    throw new Error("Home Assistant dialog controls are unavailable");
}
export function showMealDialog(owner: any) {
  owner.dispatchEvent(
    new CustomEvent("show-dialog", {
      bubbles: true,
      composed: true,
      detail: {
        dialogTag: "tuya-feeder-meal-dialog",
        dialogImport: () => Promise.resolve(),
        dialogParams: { owner },
      },
    }),
  );
}
class FeederMealDialog extends LitElement {
  static properties = {
    hass: { attribute: false },
    owner: { state: true },
    open: { state: true },
  };
  hass: any;
  owner: any;
  open = false;
  async showDialog(params: any) {
    this.owner = params.owner;
    this.owner.nativeDialog = this;
    this.open = true;
    await this.updateComplete;
  }
  invalidate() {
    if (!this.open) return;
    this.open = false;
    this.owner.nativeDialog = undefined;
    this.dispatchEvent(
      new CustomEvent("dialog-closed", {
        bubbles: true,
        composed: true,
        detail: { dialog: this.localName },
      }),
    );
  }
  closeDialog() {
    this.dismiss();
    return true;
  }
  private dismiss() {
    if (!this.open) return;
    this.open = false;
    this.owner.nativeDialog = undefined;
    if (this.owner.view === "delete" && !this.owner.busy)
      this.owner.view = "edit";
    this.owner.cancel();
    this.dispatchEvent(
      new CustomEvent("dialog-closed", {
        bubbles: true,
        composed: true,
        detail: { dialog: this.localName },
      }),
    );
  }
  private save() {
    const form = this.renderRoot.querySelector<any>("ha-form");
    if (!form?.reportValidity?.() || !this.owner.saveable) return;
    this.owner.save(); // Synchronously reserves the operation before dialog closes.
    this.dismiss();
  }
  render() {
    const o = this.owner,
      m = o?.draft[o?.editing];
    if (o?.view === "feed")
      return html`<ha-dialog
        .open=${this.open}
        header-title=${`Feed ${o.feedDose} portions?`}
        @closed=${this.dismiss}
        ><p>This dispenses food immediately.</p>
        <ha-dialog-footer slot="footer"
          ><ha-button
            slot="secondaryAction"
            appearance="plain"
            @click=${this.dismiss}
            >Cancel</ha-button
          ><ha-button
            slot="primaryAction"
            ?disabled=${!o.feedReady}
            @click=${() => {
              o.feed();
              this.dismiss();
            }}
            >Feed now</ha-button
          ></ha-dialog-footer
        ></ha-dialog
      >`;
    if (!o || !m) return nothing;
    const deleting = o.view === "delete";
    const schema = [
      { name: "time", required: true, selector: { time: { no_second: true } } },
      {
        name: "portions",
        required: true,
        selector: {
          number: {
            min: 1,
            max: Math.min(60, o.attrs.max_portions ?? 60),
            step: 1,
            mode: "box",
          },
        },
      },
      { name: "enabled", selector: { boolean: {} } },
      ...(o.attrs.snapshot_source === "restored"
        ? [{ name: "acknowledged", selector: { boolean: {} } }]
        : []),
    ];
    return html`<ha-dialog
      .open=${this.open}
      .headerTitle=${deleting ? "Delete meal?" : o.operation === "add_meal" ? "Add meal" : "Edit meal"}
      @closed=${this.dismiss}
    >
      ${
        deleting
          ? html`<p>Delete ${m.time} · ${m.portions} portions?</p>`
          : html`<ha-form
              autofocus
              .hass=${this.hass ?? o.hass}
              .locale=${(this.hass ?? o.hass).locale}
              .data=${{ time: m.time, portions: m.portions, enabled: m.enabled, acknowledged: o.acknowledged }}
              .schema=${schema}
              .computeLabel=${(s: any) => (({ time: "Time", portions: "Portions", enabled: "Enabled", acknowledged: "Use saved plan?" }) as any)[s.name]}
              @value-changed=${(e: any) => {
                const v = e.detail.value;
                o.edit("time", v.time?.slice(0, 5));
                o.edit("portions", v.portions);
                o.edit("enabled", v.enabled);
                o.acknowledged = v.acknowledged === true;
                this.requestUpdate();
              }}
            ></ha-form>`
      }
      <ha-dialog-footer slot="footer">
        ${
          !deleting && o.operation !== "add_meal"
            ? html`<ha-button
                slot="secondaryAction"
                appearance="plain"
                variant="danger"
                @click=${() => {
                  o.view = "delete";
                  this.requestUpdate();
                }}
                >Delete</ha-button
              >`
            : nothing
        }
        <ha-button
          slot="secondaryAction"
          appearance="plain"
          @click=${() => {
            if (deleting) {
              o.view = "edit";
              this.requestUpdate();
            } else this.dismiss();
          }}
          >Cancel</ha-button
        >
        <ha-button
          slot="primaryAction"
          variant=${deleting ? "danger" : "brand"}
          ?disabled=${deleting ? o.locked || (o.attrs.snapshot_source === "restored" && !o.acknowledged) : !o.saveable}
          @click=${() => {
            if (deleting) {
              o.save(true);
              this.dismiss();
            } else this.save();
          }}
          >${deleting ? "Delete" : "Save"}</ha-button
        >
      </ha-dialog-footer>
    </ha-dialog>`;
  }
}
customElements.define("tuya-feeder-meal-dialog", FeederMealDialog);
