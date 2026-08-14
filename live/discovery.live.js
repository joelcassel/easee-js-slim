import t from 'tap'
import { Easee } from '../src/index.js'

const skip = process.env.CI
  ? 'live tests never run in CI'
  : !process.env.EASEE_USERNAME || !process.env.EASEE_PASSWORD
    ? 'set EASEE_USERNAME and EASEE_PASSWORD in .env'
    : false

t.test('easee live read-only discovery', { skip }, async (t) => {
  const easee = new Easee(undefined, undefined, { throwErrorsOnFault: true })
  t.teardown(() => easee.close())

  const token = await easee.initAccessToken()
  t.ok(token?.length > 0, 'login returned an access token')

  const chargers = await easee.getChargers()
  t.ok(Array.isArray(chargers), 'getChargers returned a list')
  t.ok(chargers.length > 0, 'account has at least one charger')
  for (const charger of chargers) {
    t.comment(`Charger: ${charger.name} (ChargerId: ${charger.id})`)
  }

  const sites = await easee.getSites()
  t.ok(Array.isArray(sites), 'getSites returned a list')
  for (const site of sites) {
    t.comment(`Site: ${site.name} (SiteId: ${site.id})`)
    const siteDetail = await easee.getSite(site.id)
    t.ok(Array.isArray(siteDetail.circuits), `site ${site.id} has circuits[]`)
    for (const circuit of siteDetail.circuits) {
      t.comment(`  CircuitId: ${circuit.id}, panel: ${circuit.panelName}, ratedCurrent: ${circuit.ratedCurrent}`)
      const settings = await easee.getCircuitSettings(site.id, circuit.id)
      t.type(settings, 'object', `circuit ${circuit.id} has settings`)
      for (const charger of circuit.chargers) {
        t.comment(`    Charger: ${charger.name} (${charger.id}) levelOfAccess: ${charger.levelOfAccess}`)
      }
    }
  }

  const first = chargers[0]
  const state = await easee.getChargerState(first.id)
  t.type(state.chargerOpMode, 'number', 'charger state has a numeric chargerOpMode')
  t.type(await easee.isEVCableConnected(first.id), 'boolean')
  t.type(await easee.getChargerDetails(first.id), 'object')
  t.type(await easee.getChargerConfig(first.id), 'object')
  t.type(await easee.getWeeklySchedule(first.id), 'object')
  t.not(await easee.getPowerUsage(first.id), undefined)

  const site = sites[0]
  const circuit = (await easee.getSite(site.id)).circuits[0]
  t.comment('')
  t.comment('Set these to let the API use them as defaults:')
  t.comment(`export EASEE_CHARGERID='${first.id}'`)
  t.comment(`export EASEE_SITEID='${site.id}'`)
  t.comment(`export EASEE_CIRCUITID='${circuit.id}'`)
})
