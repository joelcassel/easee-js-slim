import t from 'tap'
import { Easee, chargerOpMode } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

function easeeReturning(state) {
  return new Easee('u', 'p', { client: fakeClient({ get: () => ({ data: state }) }) })
}

t.test('offline, disconnected and error mean no cable', async (t) => {
  for (const mode of [chargerOpMode.Offline, chargerOpMode.Disconnected, chargerOpMode.Error]) {
    t.equal(await easeeReturning({ chargerOpMode: mode }).isEVCableConnected(), false, `mode ${mode}`)
  }
})

t.test('awaiting start, charging, completed and ready mean cable connected', async (t) => {
  for (const mode of [
    chargerOpMode.AwaitingStart,
    chargerOpMode.Charging,
    chargerOpMode.Completed,
    chargerOpMode.ReadyToCharge,
  ]) {
    t.equal(await easeeReturning({ chargerOpMode: mode }).isEVCableConnected(), true, `mode ${mode}`)
  }
})

t.test('an unknown opMode is treated as connected', async (t) => {
  t.equal(await easeeReturning({ chargerOpMode: 99 }).isEVCableConnected(), true)
})

t.test('an unreadable state is not reported as connected', async (t) => {
  t.equal(await easeeReturning({}).isEVCableConnected(), false)
  t.equal(await easeeReturning(null).isEVCableConnected(), false)
  t.equal(await easeeReturning({ chargerOpMode: undefined }).isEVCableConnected(), false)
})
