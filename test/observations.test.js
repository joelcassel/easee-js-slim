import t from 'tap'
import { Easee, observationIDs } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

function easeeWith(get) {
  return new Easee('u', 'p', { client: fakeClient({ get }) })
}

t.test('observationIDs maps charger op mode and reason for no current', async (t) => {
  t.equal(observationIDs.ChargerOpMode, 109)
  t.equal(observationIDs.ReasonForNoCurrent, 96)
  t.equal(Easee.observationIDs, observationIDs)
})

t.test('getObservations returns the latest value keyed by name', async (t) => {
  const easee = easeeWith((url) => ({
    data: url.includes('/observations/120/')
      ? [
          { timestamp: '2026-01-01T00:00:00.000Z', value: 1.2 },
          { timestamp: '2026-01-02T00:00:00.000Z', value: 2.5 },
        ]
      : [],
  }))
  t.strictSame(await easee.getObservations([observationIDs.TotalPower], 'EH1'), { TotalPower: 2.5 })
})

t.test('getObservations yields an undefined value when nothing was reported', async (t) => {
  const easee = easeeWith(() => ({ data: [] }))
  t.strictSame(await easee.getObservations([observationIDs.ChargerOpMode], 'EH1'), { ChargerOpMode: undefined })
})

t.test('getChargerState reads op mode and reason from the observations endpoint', async (t) => {
  const easee = easeeWith((url) => ({
    data: url.includes('/observations/109/')
      ? [{ timestamp: '2026-01-01T00:00:00.000Z', value: 3 }]
      : url.includes('/observations/96/')
        ? [{ timestamp: '2026-01-01T00:00:00.000Z', value: 0 }]
        : [],
  }))
  t.strictSame(await easee.getChargerState('EH1'), { chargerOpMode: 3, reasonForNoCurrent: 0 })
})

t.test('getChargerState without recent observations returns undefineds', async (t) => {
  const easee = easeeWith(() => ({ data: [] }))
  t.strictSame(await easee.getChargerState('EH1'), { chargerOpMode: undefined, reasonForNoCurrent: undefined })
})

t.test('getObservations defaults from/to and the charger id', async (t) => {
  const client = fakeClient({ get: () => ({ data: [] }) })
  const easee = new Easee('u', 'p', { client, onlyOneChargerId: 'EHDEFAULT' })
  await easee.getObservations([observationIDs.WifiSsid])
  t.match(client.calls.get[0], /^\/api\/chargers\/EHDEFAULT\/observations\/36\//)
})
