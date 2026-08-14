import t from 'tap'
import { Easee } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

const ids = { onlyOneChargerId: 'EH1', onlyOneSiteId: 'S1', onlyOneCircuitId: 'C1' }

t.test('getters hit the documented endpoints', async (t) => {
  const cases = [
    ['getChargers', '/api/chargers'],
    ['getChargerDetails', '/api/chargers/EH1/details'],
    ['getWeeklySchedule', '/api/chargers/EH1/weekly_charge_plan'],
    ['getChargerConfig', '/api/chargers/EH1/config'],
    ['getChargerState', '/api/chargers/EH1/state'],
    ['getSites', '/api/sites'],
    ['getSite', '/api/sites/S1'],
    ['getCircuitSettings', '/api/sites/S1/circuits/C1/settings'],
  ]
  for (const [method, endpoint] of cases) {
    const client = fakeClient()
    await new Easee('u', 'p', { client, ...ids })[method]()
    t.strictSame(client.calls.get, [endpoint], method)
  }
})

t.test('charger commands hit the documented endpoints', async (t) => {
  const cases = [
    ['startCharging', 'start_charging'],
    ['stopCharging', 'stop_charging'],
    ['pauseCharging', 'pause_charging'],
    ['resumeCharging', 'resume_charging'],
    ['overrideChargingSchedule', 'override_schedule'],
  ]
  for (const [method, command] of cases) {
    const client = fakeClient()
    await new Easee('u', 'p', { client, ...ids })[method]()
    t.strictSame(
      client.calls.post.map((c) => c.url),
      [`/api/chargers/EH1/commands/${command}`],
      method,
    )
  }
})

t.test('a command result is summarised', async (t) => {
  const client = fakeClient({ post: () => ({ status: 202, statusText: 'Accepted', data: { ok: true } }) })
  const easee = new Easee('u', 'p', { client, ...ids })
  t.strictSame(await easee.startCharging(), { status: 202, statusText: 'Accepted', data: { ok: true } })
})

t.test('a missing command or charger id sends nothing', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client, ...ids })
  t.equal(await easee.easeeChargerCommand('EH1', undefined), undefined)
  t.equal(await easee.easeeChargerCommand(null, 'start_charging'), undefined)
  t.equal(client.calls.post.length, 0)
})

t.test('an undefined charger id falls back to the configured one', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client, ...ids })
  await easee.easeeChargerCommand(undefined, 'start_charging')
  t.strictSame(
    client.calls.post.map((c) => c.url),
    ['/api/chargers/EH1/commands/start_charging'],
  )
})

t.test('update methods post the right path and body', async (t) => {
  const settings = { maxChargerCurrent: 10 }
  const cases = [
    ['updateChargerSettings', '/api/chargers/EH1/settings'],
    ['setCircuitSettings', '/api/sites/S1/circuits/C1/settings'],
    ['updateWeeklySchedule', '/api/chargers/EH1/weekly_charge_plan'],
  ]
  for (const [method, endpoint] of cases) {
    const client = fakeClient()
    await new Easee('u', 'p', { client, ...ids })[method](settings)
    t.equal(client.calls.post[0].url, endpoint, method)
    t.strictSame(client.calls.post[0].body, settings, method)
  }
})

t.test('close is safe on an instance that never logged in', async (t) => {
  const easee = new Easee('u', 'p', { client: fakeClient() })
  t.doesNotThrow(() => easee.close())
  t.equal(easee.tokenRefreshTimer, null)
})
