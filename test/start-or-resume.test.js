import t from 'tap'
import { Easee, reasonForNoCurrent } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

function easeeSeeing(reason) {
  const client = fakeClient({ get: () => ({ data: { reasonForNoCurrent: reason } }) })
  return { client, easee: new Easee('u', 'p', { client, resumeWaitMs: 0 }) }
}

t.test('already charging issues no command', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.OK)
  t.strictSame(await easee.startOrResumeCharging('EH1'), {
    status: 'No action',
    message: 'Charging already started',
  })
  t.equal(client.calls.post.length, 0)
})

t.test('a fully charged EV issues no command', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.WaitingInFully)
  const result = await easee.startOrResumeCharging('EH1')
  t.equal(result.status, 'No action')
  t.match(result.message, /fully charged/)
  t.equal(client.calls.post.length, 0)
})

t.test('a disconnected EV issues no command', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.SecondaryUnitNotRequestingCurrent)
  t.strictSame(await easee.startOrResumeCharging('EH1'), {
    status: 'No action',
    message: 'EV is Not connected',
  })
  t.equal(client.calls.post.length, 0)
})

t.test('a blocking schedule is overridden exactly once', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.PendingScheduledCharging)
  await easee.startOrResumeCharging('EH1')
  t.equal(client.calls.post.length, 1)
  t.equal(client.calls.post[0].url, '/api/chargers/EH1/commands/override_schedule')
})

t.test('any other reason starts charging', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.MaxCircuitCurrentTooLow)
  await easee.startOrResumeCharging('EH1')
  t.equal(client.calls.post.length, 1)
  t.equal(client.calls.post[0].url, '/api/chargers/EH1/commands/start_charging')
})

t.test('a charger stuck paused retries twice and then gives up', async (t) => {
  const { client, easee } = easeeSeeing(reasonForNoCurrent.MaxDynamicChargerCurrentTooLow)
  await easee.startOrResumeCharging('EH1')
  t.equal(client.calls.get.length, 2)
  t.equal(client.calls.post.length, 2)
  t.strictSame(
    client.calls.post.map((c) => c.url),
    ['/api/chargers/EH1/commands/resume_charging', '/api/chargers/EH1/commands/resume_charging'],
  )
})

t.test('an unreadable state never commands the charger', async (t) => {
  const client = fakeClient({ get: () => ({ data: {} }) })
  const easee = new Easee('u', 'p', { client, resumeWaitMs: 0 })
  t.strictSame(await easee.startOrResumeCharging('EH1'), {
    status: 'No action',
    message: 'Could not read charger state',
  })
  t.equal(client.calls.post.length, 0)
})

t.test('nothing is printed unless EASEE_DEBUG is set', async (t) => {
  const logs = t.capture(console, 'log')
  const { easee } = easeeSeeing(reasonForNoCurrent.OK)
  await easee.startOrResumeCharging('EH1')
  t.equal(logs().length, 0)
})
