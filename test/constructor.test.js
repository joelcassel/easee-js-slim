import t from 'tap'
import { Easee } from '../src/index.js'
import { fakeClient } from './fixtures/fake-client.js'

t.test('ids fall back to the not-set sentinels', async (t) => {
  const easee = new Easee('u', 'p')
  t.equal(easee.onlyOneChargerId, '--NOT_SET_CHARGERID--')
  t.equal(easee.onlyOneSiteId, '--NOT_SET_SITEID--')
  t.equal(easee.onlyOneCircuitId, '--NOT_SET_CIRCUITID--')
})

t.test('customData ids win over the sentinels', async (t) => {
  const easee = new Easee('u', 'p', {
    onlyOneChargerId: 'EH000001',
    onlyOneSiteId: '111',
    onlyOneCircuitId: '222',
  })
  t.equal(easee.onlyOneChargerId, 'EH000001')
  t.equal(easee.onlyOneSiteId, '111')
  t.equal(easee.onlyOneCircuitId, '222')
})

t.test('env ids are used when customData omits them', async (t) => {
  process.env.EASEE_CHARGERID = 'EHFROMENV'
  process.env.EASEE_SITEID = '999'
  process.env.EASEE_CIRCUITID = '888'
  t.teardown(() => {
    delete process.env.EASEE_CHARGERID
    delete process.env.EASEE_SITEID
    delete process.env.EASEE_CIRCUITID
  })
  const easee = new Easee('u', 'p')
  t.equal(easee.onlyOneChargerId, 'EHFROMENV')
  t.equal(easee.onlyOneSiteId, '999')
  t.equal(easee.onlyOneCircuitId, '888')
})

t.test('credentials fall back to env', async (t) => {
  process.env.EASEE_USERNAME = 'envuser'
  process.env.EASEE_PASSWORD = 'envpass'
  t.teardown(() => {
    delete process.env.EASEE_USERNAME
    delete process.env.EASEE_PASSWORD
  })
  const easee = new Easee()
  t.equal(easee.username, 'envuser')
  t.equal(easee.password, 'envpass')
})

t.test('default client targets the Easee api', async (t) => {
  const easee = new Easee('u', 'p')
  t.equal(easee.client.defaults.baseURL, 'https://api.easee.com')
  t.type(easee.client.get, 'function')
  t.type(easee.client.post, 'function')
})

t.test('an injected client is used verbatim', async (t) => {
  const client = fakeClient()
  const easee = new Easee('u', 'p', { client })
  t.equal(easee.client, client)
})

t.test('starts with no token and no timer', async (t) => {
  const easee = new Easee('u', 'p')
  t.equal(easee.accessToken, null)
  t.equal(easee.refreshToken, null)
  t.equal(easee.tokenRefreshTimer, null)
})
