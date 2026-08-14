import t from 'tap'
import axios from 'axios'
import { Easee } from '../src/index.js'
import { fakeClient, httpError, networkError } from './fixtures/fake-client.js'

t.test('GET returns the response body', async (t) => {
  const client = fakeClient({ get: () => ({ data: { chargerOpMode: 3 } }) })
  const easee = new Easee('u', 'p', { client })
  t.strictSame(await easee.easeeGetCall('/api/chargers'), { chargerOpMode: 3 })
})

t.test('GET records the endpoint as a path, not an absolute url', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client })
  await easee.getChargers()
  t.strictSame(client.calls.get, ['/api/chargers'])
})

t.test('failed GET returns an empty object when not throwing', async (t) => {
  const client = fakeClient({
    get: () => {
      throw httpError(500, 'Internal Server Error')
    },
  })
  const easee = new Easee('u', 'p', { client, throwErrorsOnFault: false })
  const result = await easee.easeeGetCall('/api/chargers')
  t.not(result, undefined)
  t.strictSame(result, {})
})

t.test('failed GET throws with status and statusText when configured to', async (t) => {
  const client = fakeClient({
    get: () => {
      throw httpError(404, 'Not Found')
    },
  })
  const easee = new Easee('u', 'p', { client, throwErrorsOnFault: true })
  await t.rejects(easee.easeeGetCall('/api/chargers'), /404 \(Not Found\)/)
})

t.test('POST returns the whole response', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client })
  const response = await easee.easeePostCall('/api/chargers/x/commands/start_charging')
  t.equal(response.status, 200)
  t.equal(response.statusText, 'OK')
})

t.test('failed POST still yields a usable summary when not throwing', async (t) => {
  const client = fakeClient({
    post: () => {
      throw httpError(403, 'Forbidden')
    },
  })
  const easee = new Easee('u', 'p', { client, throwErrorsOnFault: false })
  const result = await easee.updateChargerSettings({ maxChargerCurrent: 10 })
  t.equal(result.status, 403)
  t.equal(result.statusText, 'Forbidden')
  t.not(result.status, undefined)
})

t.test('POST network error without a response yields nulls, not undefined', async (t) => {
  const client = fakeClient({
    post: () => {
      throw networkError()
    },
  })
  const easee = new Easee('u', 'p', { client, throwErrorsOnFault: false })
  const result = await easee.updateChargerSettings({})
  t.strictSame(result, { status: null, statusText: null, data: {} })
})

t.test('failed POST throws when configured to', async (t) => {
  const client = fakeClient({
    post: () => {
      throw httpError(401, 'Unauthorized')
    },
  })
  const easee = new Easee('u', 'p', { client, throwErrorsOnFault: true })
  await t.rejects(easee.easeePostCall('/api/chargers/x/settings', {}), /401 \(Unauthorized\)/)
})

t.test('the global axios instance is never given an Authorization header', async (t) => {
  const client = fakeClient({
    post: () => ({ data: { accessToken: 'tok', refreshToken: 'ref', expiresIn: 3600 } }),
  })
  const easee = new Easee('u', 'p', { client })
  t.teardown(() => easee.close())
  await easee.initAccessToken()
  t.equal(easee.client.defaults.headers.common['Authorization'], 'Bearer tok')
  t.equal(axios.defaults.headers.common['Authorization'], undefined)
})
