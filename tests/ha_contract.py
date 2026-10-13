"""Actual HA-generated states and service schemas; all transport is intercepted.

Run from the sibling integration checkout using its HA pytest environment.
No device writes, network access or household fixture is used.
"""
# ruff: noqa: F811
import asyncio
import json
import os
from pathlib import Path

import pytest
from test_integration import BASE, DEVICE, custom, feeder, report  # noqa: F401
from custom_components.tuya_feeder.plan import encode

CARD = Path(os.environ['TUYA_FEEDER_CARD_DIR'])

@pytest.fixture
async def bridge():
    p = await asyncio.create_subprocess_exec('node', str(CARD / 'tests/integration_bridge.mjs'), stdin=asyncio.subprocess.PIPE, stdout=asyncio.subprocess.PIPE)
    async def command(action, **kwargs):
        p.stdin.write((json.dumps({'action': action, **kwargs})+'\n').encode())
        await p.stdin.drain()
        result = json.loads(await asyncio.wait_for(p.stdout.readline(), 20))
        assert result['ok'], result
        return result['calls']
    yield command
    p.stdin.write(b'{"action":"close"}\n'); await p.stdin.drain()
    await asyncio.wait_for(p.wait(), 20)
    assert p.returncode == 0

def state(hass, sensor):
    s=hass.states.get(sensor.entity_id)
    return {'entity_id':s.entity_id, 'state':s.state, 'attributes':dict(s.attributes)}

async def test_actual_confirmed_activity_is_presentation_only(hass, feeder, bridge):
    sensor, entry, transport, _ = feeder
    await bridge('init', state=state(hass, sensor))
    await bridge('active', expected=False)
    from test_snapshot_import import import_saved
    await import_saved(hass, sensor, entry)
    restored = state(hass, sensor)
    await bridge('state', state=restored)
    await bridge('active', expected=any(m['enabled'] for m in restored['attributes']['meals']))
    for meals in [[], [{**BASE[0], 'enabled': False}], BASE,
                  [*BASE, {**BASE[0], 'time': '22:48', 'enabled': True}]]:
        await report(hass, meals)
        await bridge('state', state=state(hass, sensor))
        await bridge('active', expected=any(m['enabled'] for m in meals))
    await report(hass, raw='AA==')
    await bridge('state', state=state(hass, sensor))
    await bridge('active', expected=False)
    transport.assert_not_called()

@pytest.mark.parametrize('operation', ['update_meal','delete_meal','add_meal'])
async def test_actual_per_meal_schema_merge_and_handler_gate(hass, feeder, bridge, operation):
    sensor, _, transport, _ = feeder
    sensor.confirm_timeout=10
    baseline=[*BASE,{**BASE[0],'time':'22:48','portions':4,'enabled':True}]
    await report(hass,baseline)
    first=state(hass,sensor)
    await bridge('init',state=first)
    await bridge('draft_actions',count=2)
    action={'update_meal':'save','delete_meal':'delete','add_meal':'add'}[operation]
    calls=await bridge(action)
    expected={'entity_id':sensor.entity_id,'expected_revision':1}
    if operation!='add_meal':expected['meal_index']=0
    if operation=='update_meal':expected['meal']={**baseline[0],'portions':3}
    if operation=='add_meal':expected['meal']={**baseline[0],'time':'23:59','portions':1,'enabled':False}
    assert calls==[['tuya_feeder',operation,expected]]
    merged=[expected['meal'],baseline[1]] if operation=='update_meal' else baseline[1:] if operation=='delete_meal' else [*baseline,expected['meal']]
    async def receive(call):
        assert call.data=={'device_id':DEVICE,'dp':1,'value':encode(merged)}
        await bridge('state',state=state(hass,sensor));await bridge('busy')
        await report(hass,merged)
        await bridge('state',state=state(hass,sensor));await bridge('busy')
    transport.side_effect=receive
    result=await hass.services.async_call(*calls[0][:2],calls[0][2],blocking=True,return_response=True)
    assert result['confirmed'] and result['revision']==2 and not result['error']
    final=state(hass,sensor)
    assert final['attributes']['meals']==merged
    assert final['attributes']['last_received_at']!=first['attributes']['last_received_at']
    await bridge('state',state=final)
    await bridge('busy') # Even terminal matching report is not handler completion.
    await bridge('service_result',result=result)
    await bridge('confirmed')
    assert len(await bridge('editable'))==1
    transport.assert_called_once()

async def test_actual_timeout_no_automatic_retry(hass, feeder, bridge):
    sensor,_,transport,_=feeder
    await report(hass)
    await bridge('init',state=state(hass,sensor))
    calls=await bridge('save')
    result=await hass.services.async_call(*calls[0][:2],calls[0][2],blocking=True,return_response=True)
    assert result['error']=='unconfirmed_timeout'
    await bridge('state',state=state(hass,sensor))
    await bridge('service_result',result=result)
    await bridge('error')
    transport.assert_called_once()

async def test_restored_checkbox_actual_service_and_preserved_timestamp(hass, feeder, bridge):
    from test_snapshot_import import STAMP, import_saved
    sensor,entry,transport,_=feeder
    sensor.confirm_timeout=10
    await import_saved(hass,sensor,entry)
    initial=state(hass,sensor)
    assert initial['attributes']['snapshot_source']=='restored'
    assert initial['attributes']['last_received_at']==STAMP
    await bridge('init',state=initial)
    calls=await bridge('save')
    assert calls[0][1]=='update_meal' and calls[0][2]['acknowledge_restored_snapshot'] is True
    merged=[calls[0][2]['meal']]
    async def receive(call):
        assert call.data['value']==encode(merged)
        await report(hass,merged)
    transport.side_effect=receive
    result=await hass.services.async_call(*calls[0][:2],calls[0][2],blocking=True,return_response=True)
    assert result['confirmed']
    await bridge('state',state=state(hass,sensor));await bridge('service_result',result=result);await bridge('confirmed')
    assert sensor.last_received_at!=STAMP
    transport.assert_called_once()

@pytest.mark.parametrize('case',['unknown','corrupt','unsupported','conflict'])
async def test_backend_generated_fail_closed(hass,feeder,bridge,case):
    sensor,_,transport,device=feeder
    if case!='unknown':await report(hass)
    if case=='corrupt':await report(hass,raw='AA==')
    if case=='unsupported':device.connected=False;sensor._publish()
    await bridge('init',state=state(hass,sensor))
    if case=='conflict':
        await bridge('edit');await report(hass,[{**BASE[0],'portions':4}]);await bridge('state',state=state(hass,sensor));await bridge('conflict')
    else:await bridge('readonly')
    transport.assert_not_called()

async def test_manual_actual_card_payload_only_one_dp3_no_dp1_or_dp2(hass,feeder,bridge):
    from test_feed import capable, received
    sensor,_,transport,device=feeder
    wire=capable(hass,sensor,device)
    sensor.feed_confirm_timeout=10
    await report(hass)
    initial=state(hass,sensor)
    assert initial['attributes']['supports_manual_feed'] is True
    await bridge('init',state=initial,manual=True)
    calls=await bridge('feed')
    assert calls==[['tuya_feeder','feed',{'entity_id':sensor.entity_id,'portions':1}]]
    async def send(payload,recv_retries):
        assert payload==(7,{'3':1}) and recv_retries==0
        received(hass,4,'feeding');received(hass,14,1)
    wire.exchange_quick.side_effect=send
    result=await hass.services.async_call(*calls[0][:2],calls[0][2],blocking=True,return_response=True)
    assert result['reported'] is True
    await bridge('state',state=state(hass,sensor));await bridge('service_result',result=result)
    transport.assert_not_called();wire.exchange_quick.assert_awaited_once()

@pytest.mark.parametrize('source', ['received', 'restored'])
@pytest.mark.parametrize('order', ['report_first', 'handler_first'])
async def test_direct_toggle_actual_atomic_merge_and_completion(hass, feeder, bridge, source, order):
    sensor, entry, transport, _ = feeder
    sensor.confirm_timeout = 10
    if source == 'restored':
        from test_snapshot_import import import_saved
        await import_saved(hass, sensor, entry)
    else:
        await report(hass, [*BASE, {**BASE[0], 'time': '22:48', 'enabled': False}])
    initial = state(hass, sensor)
    baseline = initial['attributes']['meals']
    await bridge('init', state=initial)
    calls = await bridge('toggle')
    expected = {'entity_id': sensor.entity_id, 'expected_revision': sensor.revision,
                'meal_index': 0, 'meal': {**baseline[0], 'enabled': not baseline[0]['enabled']}}
    if source == 'restored':
        expected['acknowledge_restored_snapshot'] = True
    assert calls == [['tuya_feeder', 'update_meal', expected]]
    merged = [expected['meal'], *baseline[1:]]
    async def receive(call):
        assert call.data == {'device_id': DEVICE, 'dp': 1, 'value': encode(merged)}
        await bridge('state', state=state(hass, sensor))
        await bridge('busy')
        await report(hass, merged)
        if order == 'report_first':
            await bridge('state', state=state(hass, sensor))
            await bridge('busy')
    transport.side_effect = receive
    result = await hass.services.async_call(*calls[0][:2], calls[0][2], blocking=True, return_response=True)
    assert result['confirmed'] is True
    if order == 'handler_first':
        await bridge('service_result', result=result)
        await bridge('busy')
        await bridge('state', state=state(hass, sensor))
    else:
        await bridge('state', state=state(hass, sensor))
        await bridge('busy')
        await bridge('service_result', result=result)
    await bridge('confirmed')
    assert sensor.meals[1:] == baseline[1:]
    transport.assert_called_once()

@pytest.mark.parametrize('outcome', ['stale', 'busy', 'timeout'])
async def test_direct_toggle_actual_denial_never_retries(hass, feeder, bridge, outcome):
    from homeassistant.exceptions import ServiceValidationError
    sensor, _, transport, _ = feeder
    await report(hass)
    await bridge('init', state=state(hass, sensor))
    calls = await bridge('toggle')
    if outcome == 'stale':
        await report(hass, [{**BASE[0], 'portions': 4}])
    if outcome == 'busy':
        await sensor._action_lock.acquire()
    try:
        if outcome == 'timeout':
            result = await hass.services.async_call(*calls[0][:2], calls[0][2], blocking=True, return_response=True)
            assert result['error'] == 'unconfirmed_timeout'
            await bridge('state', state=state(hass, sensor))
            await bridge('service_result', result=result)
            transport.assert_called_once()
        else:
            with pytest.raises(ServiceValidationError):
                await hass.services.async_call(*calls[0][:2], calls[0][2], blocking=True, return_response=True)
            await bridge('service_result', error=outcome)
            transport.assert_not_called()
        await bridge('toggle_error')
        assert len(await bridge('readonly' if outcome == 'timeout' else 'editable')) == 1
    finally:
        if outcome == 'busy':
            sensor._action_lock.release()
