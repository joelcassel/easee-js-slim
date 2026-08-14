import t from 'tap'
import { Easee } from '../src/index.js'
import { fakeClient, httpError } from './fixtures/fake-client.js'

const ACCESS = 'AT-9f3a1c'
const REFRESH = 'RT-7b2c44'
const tokenResponse = { data: { accessToken: ACCESS, refreshToken: REFRESH, expiresIn: 3600 } }

t.test('login posts the credentials to the login endpoint', async (t) => {
  const client = fakeClient({ post: () => tokenResponse })
  const easee = new Easee('joel@example.com', 'hunter2', { client })
  t.teardown(() => easee.close())

  const token = await easee.initAccessToken()

  t.equal(token, ACCESS)
  t.equal(client.calls.post.length, 1)
  t.equal(client.calls.post[0].url, '/api/accounts/login')
  t.strictSame(client.calls.post[0].body, { userName: 'joel@example.com', password: 'hunter2' })
})

t.test('login stores both tokens and sets the bearer on its own client', async (t) => {
  const client = fakeClient({ post: () => tokenResponse })
  const easee = new Easee('u', 'p', { client })
  t.teardown(() => easee.close())

  await easee.initAccessToken()

  t.equal(easee.accessToken, ACCESS)
  t.equal(easee.refreshToken, REFRESH)
  t.equal(client.defaults.headers.common['Authorization'], `Bearer ${ACCESS}`)
})

t.test('a refresh token posts to the refresh endpoint', async (t) => {
  const client = fakeClient({ post: () => tokenResponse })
  const easee = new Easee('u', 'p', { client })
  t.teardown(() => easee.close())
  easee.accessToken = 'old'

  await easee.initAccessToken(REFRESH)

  t.equal(client.calls.post[0].url, '/api/accounts/refresh_token')
  t.strictSame(client.calls.post[0].body, { accessToken: 'old', refreshToken: REFRESH })
})

t.test('missing credentials reject before any request', async (t) => {
  for (const [username, password] of [
    [undefined, 'p'],
    ['u', undefined],
    [undefined, undefined],
  ]) {
    const client = fakeClient({ post: () => tokenResponse })
    const easee = new Easee(username, password, { client })
    await t.rejects(easee.initAccessToken(), /Missing credentials/)
    t.equal(client.calls.post.length, 0)
  }
})

t.test('a login failure rejects', async (t) => {
  const client = fakeClient({
    post: () => {
      throw httpError(401, 'Unauthorized')
    },
  })
  const easee = new Easee('u', 'p', { client })
  await t.rejects(easee.initAccessToken(), /Could not query Easee access Token/)
})

t.test('a refresh failure rejects', async (t) => {
  const client = fakeClient({
    post: () => {
      throw httpError(400, 'Bad Request')
    },
  })
  const easee = new Easee('u', 'p', { client })
  await t.rejects(easee.initAccessToken(REFRESH), /Could not query Easee refresh access Token/)
})

t.test('a response without an access token rejects', async (t) => {
  const client = fakeClient({ post: () => ({ data: {} }) })
  const easee = new Easee('u', 'p', { client })
  await t.rejects(easee.initAccessToken(), /Could not load Easee access Token/)
})

t.test('debug logging never prints the tokens', async (t) => {
  process.env.EASEE_DEBUG = 'true'
  t.teardown(() => delete process.env.EASEE_DEBUG)
  const logs = t.capture(console, 'log')
  const client = fakeClient({ post: () => tokenResponse })
  const easee = new Easee('u', 'p', { client })
  t.teardown(() => easee.close())

  await easee.initAccessToken()

  const printed = logs()
    .map((call) => call.args.map((a) => JSON.stringify(a)).join(' '))
    .join('\n')
  t.notMatch(printed, new RegExp(ACCESS))
  t.notMatch(printed, new RegExp(REFRESH))
})

t.test('a failed login never prints the password', async (t) => {
  process.env.EASEE_DEBUG = 'true'
  t.teardown(() => delete process.env.EASEE_DEBUG)
  const logs = t.capture(console, 'log')
  const errors = t.capture(console, 'error')
  const client = fakeClient({
    post: () => {
      const error = httpError(401, 'Unauthorized')
      error.config = { url: '/api/accounts/login', data: JSON.stringify({ userName: 'u', password: 'hunter2' }) }
      throw error
    },
  })
  const easee = new Easee('u', 'hunter2', { client })

  await t.rejects(easee.initAccessToken())

  const printed = [...logs(), ...errors()].map((call) => call.args.map((a) => JSON.stringify(a)).join(' ')).join('\n')
  t.notMatch(printed, /hunter2/)
  t.notMatch(printed, /userName/)
})
