import t from 'tap'
import { Easee } from '../src/index.js'
import { fakeClient, httpError } from './fixtures/fake-client.js'

const tokenResponse = { data: { accessToken: 'tok', refreshToken: 'ref', expiresIn: 3600 } }

t.test('the refresh timer is unref-ed so it never holds the process open', async (t) => {
  const easee = new Easee('u', 'p', { client: fakeClient({ post: () => tokenResponse }) })
  t.teardown(() => easee.close())
  await easee.initAccessToken()
  t.equal(easee.tokenRefreshTimer.hasRef(), false)
})

t.test('unrefTimer false keeps the timer referenced', async (t) => {
  const easee = new Easee('u', 'p', {
    client: fakeClient({ post: () => tokenResponse }),
    unrefTimer: false,
  })
  t.teardown(() => easee.close())
  await easee.initAccessToken()
  t.equal(easee.tokenRefreshTimer.hasRef(), true)
})

t.test('the refresh delay is clamped to a sane minimum', async (t) => {
  const easee = new Easee('u', 'p', { client: fakeClient() })
  t.teardown(() => easee.close())
  t.equal(easee.scheduleTokenRefresh(-5000), 60000)
  t.equal(easee.scheduleTokenRefresh(NaN), 60000)
  t.equal(easee.scheduleTokenRefresh(undefined), 60000)
  t.equal(easee.scheduleTokenRefresh(0), 60000)
  t.equal(easee.scheduleTokenRefresh(3540000), 3540000)
})

t.test('a missing expiresIn does not produce a one-millisecond retry loop', async (t) => {
  const easee = new Easee('u', 'p', {
    client: fakeClient({ post: () => ({ data: { accessToken: 'tok', refreshToken: 'ref' } }) }),
  })
  t.teardown(() => easee.close())
  await easee.initAccessToken()
  t.equal(easee.tokenRefreshTimer._idleTimeout, 60000)
})

t.test('re-authenticating replaces the timer rather than stacking them', async (t) => {
  const easee = new Easee('u', 'p', { client: fakeClient({ post: () => tokenResponse }) })
  t.teardown(() => easee.close())

  await easee.initAccessToken()
  const first = easee.tokenRefreshTimer
  await easee.initAccessToken()
  const second = easee.tokenRefreshTimer

  t.not(first, second)
  t.equal(first._destroyed, true)
  t.equal(second._destroyed, false)
})

t.test('close clears the timer and is idempotent', async (t) => {
  const easee = new Easee('u', 'p', { client: fakeClient({ post: () => tokenResponse }) })
  await easee.initAccessToken()

  easee.close()
  t.equal(easee.tokenRefreshTimer, null)
  easee.close()
  t.equal(easee.tokenRefreshTimer, null)
})

t.test('a refresh that fails every way still re-arms the timer instead of dying', async (t) => {
  const client = fakeClient({
    post: () => {
      throw httpError(503, 'Service Unavailable')
    },
  })
  const easee = new Easee('u', 'p', { client })
  t.teardown(() => easee.close())
  easee.refreshToken = 'ref'
  t.capture(console, 'error')

  await t.resolves(easee.refreshAccessToken())
  t.not(easee.tokenRefreshTimer, null)
  t.equal(easee.tokenRefreshTimer._idleTimeout, 60000)
})
