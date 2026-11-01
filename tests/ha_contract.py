"""Paired native LocalTuya HA + bundled Chromium contract, no network/devices.

PYTHONPATH=<backend> python -m pytest --import-mode=importlib tests/ha_contract.py
Uses the sibling backend's isolated Python 3.14 / HA 2026.10 environment.
"""
import asyncio
import json
import os
from pathlib import Path
from types import MappingProxyType
from unittest.mock import AsyncMock

import pytest
from homeassistant.core import HomeAssistant
from homeassistant.config_entries import ConfigEntries, ConfigEntry
from homeassistant.helpers import device_registry as dr, entity_registry as er
from homeassistant import loader
from custom_components.localtuya.coordinator import TuyaDevice
from custom_components.localtuya.discovery import TuyaDiscovery
from custom_components.localtuya.core import pytuya
from custom_components.localtuya.core.ha_entities.pet_feeders import encode
from feeder_tests.test_device import device_config
from feeder_tests.test_profile import meal
from feeder_tests.test_protocol import incoming, Transport

CARD = Path(__file__).parents[1]

@pytest.mark.asyncio
@pytest.mark.parametrize("operation", ["save", "add", "delete", "feed"])
async def test_native_card_real_ha_service(tmp_path, monkeypatch, operation):
    backend = Path(os.environ["NATIVE_BACKEND_DIR"])
    (tmp_path / "custom_components").symlink_to(backend / "custom_components", target_is_directory=True)
    hass = HomeAssistant(str(tmp_path))
    hass.config_entries = ConfigEntries(hass, {})
    loader.async_setup(hass)
    await hass.config_entries.async_initialize()
    dr.async_setup(hass)
    await dr.async_load(hass)
    await er.async_load(hass)
    monkeypatch.setattr(TuyaDiscovery, "start", AsyncMock())
    monkeypatch.setattr(TuyaDevice, "async_connect", AsyncMock())
    conf = device_config()
    conf["entities"].append({"id": "1", "platform": "sensor", "friendly_name": "Meal plan"})
    entry = ConfigEntry(domain="localtuya", title="Synthetic", data={"devices": {conf["device_id"]: conf}, "region": "eu", "client_id": "", "client_secret": "", "user_id": "", "no_cloud": True}, options={}, version=4, minor_version=1, source="user", unique_id="synthetic-entry", discovery_keys=MappingProxyType({}), subentries_data=None)
    await hass.config_entries.async_add(entry)
    await hass.async_block_till_done()
    plan = next(r for r in er.async_entries_for_config_entry(er.async_get(hass), entry.entry_id) if r.unique_id.endswith("_1"))
    dev = hass.data["localtuya"][entry.entry_id].devices[conf["host"]]
    proto = pytuya.TuyaProtocol(dev.id, dev.local_key, 3.5, False, dev)
    proto.connection_made(Transport())
    proto.local_key = proto.dispatcher.local_key = b"fedcba9876543210"
    dev._interface = proto
    baseline = [meal(), meal("22:00")]
    proto.data_received(incoming(proto, {"1": encode(baseline), "4": "standby", "13": 0, "101": "strong_power"}))
    dev.feeder.cooldown = 0
    dev.feeder.confirm_timeout = dev.feeder.feed_timeout = 5
    await hass.async_block_till_done()
    p = await asyncio.create_subprocess_exec("node", str(CARD / "tests/integration_bridge.mjs"), stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE)
    async def command(action, **kw):
        p.stdin.write((json.dumps({"action": action, **kw}) + "\n").encode())
        await p.stdin.drain()
        result = json.loads(await asyncio.wait_for(p.stdout.readline(), 20))
        assert result["ok"], result
        return result["calls"]
    def state():
        s = hass.states.get(plan.entity_id)
        return {"entity_id": s.entity_id, "state": s.state, "attributes": dict(s.attributes)}
    try:
        await command("init", state=state(), manual=operation == "feed")
        calls = await command(operation)
        assert len(calls) == 1
        domain, service, data, target, notify, response = calls[0]
        assert domain == "localtuya" and response is True
        assert data["entity_id"] == plan.entity_id
        if operation == "feed":
            assert service == "feed" and data["confirmed"] is True and data["portions"] == 1
            wanted = {"3": 1}
        else:
            assert service == {"save": "update_feeder_meal", "add": "add_feeder_meal", "delete": "delete_feeder_meal"}[operation]
            assert data["expected_revision"] == 1
            merged = [data["meal"], baseline[1]] if operation == "save" else [*baseline, data["meal"]] if operation == "add" else baseline[1:]
            wanted = {"1": encode(merged)}
        task = asyncio.create_task(hass.services.async_call(domain, service, data, blocking=True, return_response=True))
        for _ in range(2000):
            if proto.transport.writes or task.done(): break
            await asyncio.sleep(0.001)
        if task.done():
            assert not task.exception(), task.exception()
        assert len(proto.transport.writes) == 1
        if operation == "feed":
            proto.data_received(incoming(proto, {"4": "feeding"}))
            proto.data_received(incoming(proto, {"14": 1}))
        else:
            proto.data_received(incoming(proto, wanted))
        result = await task
        assert result["reported" if operation == "feed" else "confirmed"] is True
        await hass.async_block_till_done()
        await command("state", state=state())
        await command("service_result", result={"response": result})
        if operation != "feed": await command("confirmed")
        frame = pytuya.parser.unpack_message(proto.transport.writes[0], hmac_key=proto.local_key, no_retcode=True)
        assert json.loads(frame.payload[15:])["data"]["dps"] == wanted
        assert len(proto.transport.writes) == 1
    finally:
        p.stdin.write(b'{"action":"close"}\n')
        await p.stdin.drain()
        await asyncio.wait_for(p.wait(), 20)
        await hass.config_entries.async_unload(entry.entry_id)
        await hass.async_stop()
