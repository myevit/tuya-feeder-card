# Tuya Feeder Card

A compact Lit dashboard card for **device-owned daily meal plans**. This card is not a feeder integration and offers **no Feed action** or Home Assistant recurring-feed automation. Pair it with [Tuya Feeder](https://github.com/myevit/tuya-feeder).

## Synthetic preview

![Synthetic mock feeder schedule card — not a live Home Assistant dashboard](docs/mock-wide.png)

This image renders only invented test data in an isolated browser. It contains no real household schedule, device configuration or live capture.

## Install

In HACS, add `https://github.com/myevit/tuya-feeder-card` as a custom **Dashboard** repository, then download Tuya Feeder Card. This repository is not claimed to be in the default HACS store. Reload the frontend and, if necessary, add `/hacsfiles/tuya-feeder-card/tuya-feeder-card.js` as a JavaScript module resource. Manual installation: download the release asset into `www/tuya-feeder-card.js`, add `/local/tuya-feeder-card.js` as a module resource, and reload the browser. No HA core restart is required for a card resource.

```yaml
type: custom:tuya-feeder-card
entity: sensor.example_feeder_schedule
title: Feeder schedule
icon: mdi:calendar-clock
```

The visual card editor provides a sensor selector, title and icon. All examples and browser test fixtures are synthetic. The card inherits Home Assistant theme variables including `--primary-color` for the Save accent.

## Safety and editing

- Time, portion and enable controls edit only a local draft. Rows are 68px; stepper buttons and switches have 44px touch targets.
- New rows default to **disabled**, every day, **23:59**, **one portion**. Limit: 10 meals and 1–60 integer portions, additionally constrained by the sensor's advertised limits. Each time must be HH:MM in 24-hour format.
- Save opens a real keyboard-accessible modal listing the **entire replacement plan**, including disabled rows. Cancel, Escape, and Reset draft call no services. Untouched rows are preserved in the payload.
- Only Confirm Save calls `tuya_feeder.set_schedule`, exactly once. While awaiting confirmation the whole draft container is inert and duplicate saves are blocked.
- An empty service acknowledgement is **not success**. A matching confirmed incoming snapshot with a changed revision and receive timestamp clears the pending state. A reported error requires explicit reload. If the integration never reports confirmation or error, the card deliberately remains busy; do not infer success or retry a write blindly.
- A changed revision during an unsaved draft blocks Save; explicitly Reload schedule to discard the draft. No silent overwrite.
- Unknown/unavailable, invalid or unconfirmed snapshots, unsupported weekday subsets and missing write capability are read only. Legacy `days: Everyday` strings display read only when write support is absent. First release supports only all seven weekdays, not weekday-specific schedules.

## Integration contract

Attributes: `meals`, `revision` (nonempty string or number), `last_received_at` (nonempty string), `observation_kind: confirmed`, `pending: false`, `error` empty/null, `supports_schedule_write: true`, `supported_days_mode: every_day`, integer `max_meals`, integer `max_portions`. `meals` is an array of objects containing `days`, `time`, integer `portions`, boolean `enabled`; `days` must contain each of `monday, tuesday, wednesday, thursday, friday, saturday, sunday` exactly once. No inferred meals or fabricated current snapshots.

The only service payload is:

```json
{"entity_id":"sensor.example_feeder_schedule","expected_revision":"revision-at-draft-start","meals":[{"days":["monday","tuesday","wednesday","thursday","friday","saturday","sunday"],"time":"23:59","portions":1,"enabled":false}]}
```

The sensor is the confirmation authority. This release intentionally ignores positive service response ACKs and waits for incoming attributes; service errors are displayed. The integration must perform its own revision, validation and transport safety checks. Hardware-dependent schedule support is not guaranteed by installing this frontend.

## Build and test

Node 22+, `npm ci`, `npm run build`, `npx playwright install --with-deps chromium`, `npm test`. Optional `CHROMIUM_PATH` selects an already installed isolated Chromium. Tests exercise the **actual bundled card in Chromium DOM** with a mocked hass object, including confirmation, exact payload, zero-service drafts, cancellation, stale revisions, fail-closed validation, bounds, editor events and 640/320px screenshots. Browser artifacts are explicitly mock UI, not a live HA dashboard. CI validates HACS and builds/tests on the exact pushed commit. Version 0.1.0 uses a self-contained `dist/tuya-feeder-card.js` release asset (Lit bundled; no CDN runtime).

Sources: [HACS plugin requirements](https://www.hacs.xyz/docs/publish/plugin/), [HA custom card API](https://developers.home-assistant.io/docs/frontend/custom-ui/custom-card/), [Lit components](https://lit.dev/docs/components/overview/).

## Privacy / deployment

No household identifiers, real schedules, HA configuration, credentials, device keys, network addresses or private captures belong here. Do not commit exported production snapshots. Installing or publishing this repo does not authorize modifying an existing dashboard, feeder plan, integration or restarting Home Assistant. MIT licensed.
