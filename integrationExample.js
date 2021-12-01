import { Easee } from './src/easee.js'

//These are mandatory to set
const username = process.env.EASEE_USERNAME || 'username'
const password = process.env.EASEE_PASSWORD || 'password'

//Set as convenience to default to one charger/site(circuit (if you only have one charger)
const onlyOneChargerId = process.env.EASEE_CHARGERID || 'ABBXXXXX'
const onlyOneSiteId = process.env.EASEE_SITEID || '123456'
const onlyOneCircuitId = process.env.EASEE_CIRCUITID || '123456'


async function printConfigDetails() {
  const easee = new Easee(username, password, {
    onlyOneChargerId: onlyOneChargerId,
    onlyOneSiteId: onlyOneSiteId,
    onlyOneCircuitId: onlyOneCircuitId
  })

  // Init and log in to the easee cloud API
  console.log('Started!')
  await easee.initAccessToken()
  console.log('Logged in')

  // List all chargers
  const chargers = await easee.getChargers()
  chargers.forEach((charger) =>
    console.log(`--- Charger: ${charger.name} (${charger.id})`),
  )

  //Get details for first [0] charger
  console.log(`Getting details for charger [0]....`)
  console.log(`If this is your only charger you can set env by "export EASEE_CHARGERID=${chargers[0].id}" and it will default Id on all coming operations.`)
  const chargerDetails = await easee.getChargerDetails(chargers[0].id)
  console.log(chargerDetails)

  /*
    const schedule = await getWeeklySchedule()
    console.log(JSON.stringify(schedule, null, 2));
    */

  //const sites = await easee.getSites()
  //console.log(JSON.stringify(sites, null, 2))

  //const site = await easee.getSite()
  //console.log(JSON.stringify(site, null, 2))

  //const circuit = await easee.getCircuit()
  //console.log(JSON.stringify(circuit, null, 2))
  
  const circuitUpdate = { 
    maxCircuitCurrentP1: 10, 
    maxCircuitCurrentP2: 10, 
    maxCircuitCurrentP3: 10,
    offlineMaxCircuitCurrentP1: 10,
    offlineMaxCircuitCurrentP2: 10,
    offlineMaxCircuitCurrentP3: 10,
  }
  //const setCircuitResp = await easee.updateCircuitSettings(circuitUpdate)
  //console.log(JSON.stringify(setCircuitResp, null, 2))


  // Get config using global env var as charger ID
  if(onlyOneChargerId){
    const conf = await easee.getChargerConfig()
    console.log(JSON.stringify(conf, null, 2))
  }
 

  const circuit = await easee.getCircuit()
  console.log(JSON.stringify(circuit, null, 2))
  
}

//Needs an async function to use async
printConfigDetails();