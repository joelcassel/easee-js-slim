import { Easee } from '../integration/easee.js'

/**
 * Simplified examples to copy from.
 *
 * Run `npm run test:live` first to get the charger, site and circuit ids.
 */
async function printConfigDetails() {
  const easee = new Easee(process.env.EASEE_USERNAME, process.env.EASEE_PASSWORD, {
    throwErrorsOnFault: true,
  })

  await easee.initAccessToken()
  console.log('Logged in')

  const chargerDetails = await easee.getChargerDetails()
  console.log(JSON.stringify(chargerDetails, null, 2))

  const state = await easee.getChargerState()
  console.log(`Charging: ${state.circuitTotalPhaseConductorCurrentL1 > 1}`)
  console.log(`Cable connected: ${await easee.isEVCableConnected()}`)

  // const schedule = await easee.getWeeklySchedule()
  // schedule.isEnabled = !schedule.isEnabled
  // await easee.updateWeeklySchedule(schedule)

  // await easee.setCircuitSettings({ maxCircuitCurrentP1: 10, maxCircuitCurrentP2: 10, maxCircuitCurrentP3: 10 })

  // await easee.startOrResumeCharging()

  easee.close()
}

printConfigDetails()
