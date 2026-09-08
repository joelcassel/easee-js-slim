import t from 'tap'
import { Easee, chargerOpMode } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

function easeeReturning(mode) {
  const client = fakeClient({
    get: (url) => ({
      data: url.includes('/observations/109/') ? [{ timestamp: '2026-01-01T00:00:00.000Z', value: mode }] : [],
    }),
  })
  return new Easee('u', 'p', { client })
}

t.test('offline, disconnected and error mean no cable', async (t) => {
  for (const mode of [chargerOpMode.Offline, chargerOpMode.Disconnected, chargerOpMode.Error]) {
    t.equal(await easeeReturning(mode).isEVCableConnected(), false, `mode ${mode}`)
  }
})

t.test('awaiting start, charging, completed and ready mean cable connected', async (t) => {
  for (const mode of [
    chargerOpMode.AwaitingStart,
    chargerOpMode.Charging,
    chargerOpMode.Completed,
    chargerOpMode.ReadyToCharge,
  ]) {
    t.equal(await easeeReturning(mode).isEVCableConnected(), true, `mode ${mode}`)
  }
})

t.test('an unknown opMode is treated as connected', async (t) => {
  t.equal(await easeeReturning(99).isEVCableConnected(), true)
})

t.test('an unreadable state is not reported as connected', async (t) => {
  const noObservations = new Easee('u', 'p', { client: fakeClient({ get: () => ({ data: [] }) }) })
  t.equal(await noObservations.isEVCableConnected(), false)
})
