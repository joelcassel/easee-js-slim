import t from 'tap'
import { Easee } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

function datesFrom(url) {
  const [from, to] = url.split('/usage/hourly/')[1].split('/').map(decodeURIComponent)
  return { from: new Date(from), to: new Date(to) }
}

t.test('the default window is the last 24 hours', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client })
  await easee.getPowerUsage('EH000001')
  const { from, to } = datesFrom(client.calls.get[0])
  t.equal(to - from, 24 * 60 * 60 * 1000)
})

t.test('explicit dates are passed through url-encoded', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client })
  await easee.getPowerUsage('EH000001', '2023-08-29T00:00:00.000Z', '2023-08-30T00:00:00.000Z')
  t.match(client.calls.get[0], /%3A/)
  const { from, to } = datesFrom(client.calls.get[0])
  t.equal(from.toISOString(), '2023-08-29T00:00:00.000Z')
  t.equal(to.toISOString(), '2023-08-30T00:00:00.000Z')
})

t.test('the charger id defaults to the configured one', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client, onlyOneChargerId: 'EHDEFAULT' })
  await easee.getPowerUsage()
  t.match(client.calls.get[0], /^\/api\/chargers\/EHDEFAULT\/usage\/hourly\//)
})
