import { Easee } from '../integration/easee.js'

//These are mandatory to set
const username = process.env.EASEE_USERNAME || 'username'
const password = process.env.EASEE_PASSWORD || 'password'

//Set as convenience to default to one charger/site(circuit (if you only have one charger)
const onlyOneChargerId = process.env.EASEE_CHARGERID || 'ABBXXXXX'
const onlyOneSiteId = process.env.EASEE_SITEID || '123456'
const onlyOneCircuitId = process.env.EASEE_CIRCUITID || '123456'

/**
 * This is a simplified example file to take examples from.
 *
 * For ease of use run `npm run printEaseeDetails` first to get needed env params
 *
 */
async function printConfigDetails() {
  const easee = new Easee(username, password, {
    onlyOneChargerId: onlyOneChargerId,
    onlyOneSiteId: onlyOneSiteId,
    onlyOneCircuitId: onlyOneCircuitId,
    throwErrorsOnFault: true,
  })
  console.log('Started!')

  //Set the debug flag which will cause all requests to be printed
  // process.env.EASEE_DEBUG='true'

  // Init and log in to the easee cloud API
  await easee.initAccessToken()
  console.log('Logged in')

  //List all chargers
  //const chargers = await easee.getChargers()
  //chargers.forEach((charger) =>
  //  console.log(`--- Charger: ${charger.name} (${charger.id})`),
  //)

  const chargerDetails = await easee.getChargerDetails()
  console.log(JSON.stringify(chargerDetails, null, 2))

  //const schedule = await getWeeklySchedule()
  //console.log(JSON.stringify(schedule, null, 2));

  //const sites = await easee.getSites()
  //console.log(JSON.stringify(sites, null, 2))

  //const site = await easee.getSite()
  //console.log(JSON.stringify(site, null, 2))

  //const circuit = await easee.getCircuitSettings()
  //console.log(JSON.stringify(circuit, null, 2))

  // Change max charging and default Amps to 10A
  // const circuitUpdate = {
  //   maxCircuitCurrentP1: 10,
  //   maxCircuitCurrentP2: 10,
  //   maxCircuitCurrentP3: 10,
  //   offlineMaxCircuitCurrentP1: 10,
  //   offlineMaxCircuitCurrentP2: 10,
  //   offlineMaxCircuitCurrentP3: 10,
  // }
  //const setCircuitResp = await easee.setCircuitSettings(circuitUpdate)
  //console.log(JSON.stringify(setCircuitResp, null, 2))

  //const conf = await easee.getChargerConfig()
  //console.log(JSON.stringify(conf, null, 2))

  //const startResponse = await easee.startCharging()
  //console.log(JSON.stringify(startResponse, null, 2))

  //const startOrResumeResponse = await easee.startOrResumeCharging()
  //console.log(JSON.stringify(startOrResumeResponse, null, 2))

  /*
  const stateResponse = await easee.getChargerState()
  console.log(JSON.stringify(stateResponse, null, 2))
  if (stateResponse.circuitTotalPhaseConductorCurrentL1 > 1) {
    console.log('Currently charging')
  } else {
    console.log('Not charging')
  }
  
  const isConnected =  await easee.isEVCableConnected()
  console.log(`Cable is connected: ${isConnected}`)
  */

  //const chargerDetails = await easee.getLastChargingSession()
  //console.log(JSON.stringify(chargerDetails, null, 2))

  /*
  const profile = await easee.getProfile()
  console.log(JSON.stringify(profile, null, 2)) 

  const update = await easee.updateFirmware()
  console.log(JSON.stringify(update, null, 2)) 
  
  const totalPowerUsage = await easee.getPowerUsage(onlyOneChargerId, '2023-08-29T00:00:00.000Z', '2023-08-30T00:00:00.000Z ')
  console.log(JSON.stringify(totalPowerUsage, null, 2))
  */
  easee.clearTokenRefreshTimer()
}

//Needs an async function to use async
printConfigDetails()
