# Native migration candidate: 0.3.0

Prepared for paired review only. No release, HACS installation, resource activation,
registry reassignment, real feeding or production schedule change is authorized.

## Backend baseline

- Repository: `myevit/hass-localtuya`
- CI pins published audit-remediated backend `f81c333a0a0e3b1d035651d96747a204dbfef70d`.
  This exact candidate includes profile-edit preservation, fail-closed invalid selection,
  per-device restore ownership, public five-device lifecycle coverage, packet integrity
  and fragmented-frame fixes, including recovery of a valid frame embedded in a
  corrupt-length candidate after integrity rejection. Native 65 + raw protocol 60
  pass together; legacy 21 pass separately, with TCP/UDP sockets disabled.
  Incomplete plausible candidates still wait for their full declared length (cap 2000);
  valid packets are consumed whole only after integrity validation, not scanned inside.
- Independent review of this combined candidate is pending; earlier runtime reviews
  do not constitute approval of these audit-remediation changes.
- Authoritative documents: `PUBLICNATIVEFEEDER.md` and `NATIVEFEEDER.md` in that repository.
- Backend candidate PR: https://github.com/myevit/hass-localtuya/pull/1
  Requalify the exact published pair before merge; no activation is implied.

## Caller migration

Keep `type: custom:tuya-feeder-card`, all appearance options and the existing
`portions_entity` helper. Keep the configured sensor entity ID if the separately
reviewed registry migration preserves it; do not rename the card or force a new
custom element. The target must now be a LocalTuya sensor with
`native_feeder_profile: ft11w`. Its state is the parsed valid meal count, not a
raw Base64 plan. Selectors restrict integration/domain/profile; unrelated sensors
cannot enable controls just by containing encoded data.

The HACS repository, `hacs.json`, module filename and committed distribution remain
unchanged. Prepared version is **0.3.0** (breaking API, previous release **v0.2.8**).
For a separately approved manual resource update, use the same module URL with
`?v=0.3.0`; this is version tracking, not a cache workaround or a new card type.
Do not add a duplicate resource. No resource has been installed or changed here.

All schedule callers use `localtuya` services:

| Operation | Service | Payload beyond one sensor `entity_id` |
|---|---|---|
| Whole plan (not used by card) | `set_feeder_schedule` | `expected_revision`, complete `meals` |
| Add | `add_feeder_meal` | `expected_revision`, complete `meal` |
| Edit/toggle | `update_feeder_meal` | `expected_revision`, zero-based `meal_index`, complete `meal` |
| Delete | `delete_feeder_meal` | `expected_revision`, zero-based `meal_index` |
| Feed | `feed` | immutable captured integer `portions`, literal `confirmed: true` |

The card requests service responses. Native confirmation and backend confirmation
validation both remain. It never calls raw DP services, feed-number entities,
feed switches or old-domain facades. Meal shape stays all seven lowercase weekdays,
strict `HH:MM` feeder-local time, integer 1..60 portions and boolean `enabled`.
The backend owns the five-byte RAW codec and preserves untouched sibling bytes.
Deleting the final meal is prohibited: disable it instead.

`expected_revision` is the strict integer captured when editing began. Only genuine
DP1 reports advance it; a service ACK, cached or restored snapshot is not receipt
confirmation. The card requires a later matching received snapshot and completion
of the handler before declaring success. Restored meals remain visible; per-action
acknowledgement is not persisted in configuration. An unknown/malformed snapshot
stays fail-closed. `received` does not protect against unreported app edits, and
feeder clock/timezone ownership remains unknown. There is no clock-setting UI.

Feeding uses `feeding_pending`, `feeding_state`, `feeding_error` and conservative
`supports_manual_feed` readiness. Last-feeding display uses observed `last_feed_at`,
not ACK/DP14/helper timestamps. An unknown or lost response latches this card closed;
no tap, retry timer, helper change, or editor Save/Cancel resends the dose. Native
backend uncertainty survives restart; recovery requires separate operator/hardware
qualification. A reported result is protocol evidence, never proof of physical food.
Service error details are neither logged nor reflected into the UI.

## Qualification

`npm run build`, `npm test`, and `python3 scripts/check_public.py` are offline gates.
Browser controls are explicitly labelled doubles; Chromium runs the actual bundle
and intercepts card calls. The paired `tests/ha_contract.py` additionally uses real
HA 2026.10.4 registration, native LocalTuya services and synthetic encrypted frames;
network sockets are blocked and no device connection is made. Run with the backend's
Python 3.14 test environment and `NATIVE_BACKEND_DIR` / `PYTHONPATH` pointing to it.
This is not installed-frontend, physical delivery, live HA or HACS activation proof.

Implementation is AI-assisted and is not an endorsement by upstream LocalTuya.
