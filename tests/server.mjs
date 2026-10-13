import http from "node:http";
import fs from "node:fs";
import {
  mdiCalendarClock,
  mdiFoodDrumstick,
  mdiPlus,
  mdiChevronLeft,
} from "@mdi/js";
const icons = {
  "mdi:calendar-clock": mdiCalendarClock,
  "mdi:food-drumstick": mdiFoodDrumstick,
  "mdi:plus": mdiPlus,
  "mdi:chevron-left": mdiChevronLeft,
};
// SVG paths are fixed imported MDI constants, never config/HTML from the card.
const mockIcon = `<script>const paths=${JSON.stringify(icons)};customElements.define('ha-icon',class extends HTMLElement{static get observedAttributes(){return ['icon'];}set icon(v){this._icon=v;this.draw();}connectedCallback(){this.draw();}attributeChangedCallback(){this.draw();}draw(){if(!this.shadowRoot)this.attachShadow({mode:'open'});this.shadowRoot.innerHTML='<style>:host{display:inline-flex;width:var(--mdc-icon-size,24px);height:var(--mdc-icon-size,24px)}svg{width:100%;height:100%;fill:currentColor}</style><svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(paths[this._icon||this.getAttribute('icon')]||'')+'"></path></svg>';}});</script>`;
http
  .createServer((req, res) => {
    if (req.url === "/dist/tuya-feeder-card.js") {
      res.setHeader("Content-Type", "text/javascript");
      res.end(fs.readFileSync("dist/tuya-feeder-card.js"));
    } else
      res.end(
        `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><style>body{font-family:system-ui;margin:16px;background:#f2f2f7;--primary-color:#007aff;--card-background-color:#fff;--primary-text-color:#202124;--secondary-text-color:#666}tuya-feeder-card{display:block;max-width:480px}</style></head><body><p>MOCK · synthetic data · not live Home Assistant</p>${mockIcon}<script type="module" src="/dist/tuya-feeder-card.js"></script></body></html>`,
      );
  })
  .listen(4173, "127.0.0.1");
