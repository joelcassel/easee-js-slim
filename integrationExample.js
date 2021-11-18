import { Easee } from './src/easee.js'

const onlyOneChargerId = process.env.EASEE_CHARGERID || 'ABBXXXXX'
const username = process.env.EASEE_USERNAME || 'username'
const password = process.env.EASEE_PASSWORD || 'password'



async function printConfigDetails() {
  const easee = new Easee(username, password, {
    onlyOneChargerId: onlyOneChargerId,
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

  // Get config using global env var as charger ID
  if(onlyOneChargerId){
    const conf = await easee.getConfig()
    console.log(JSON.stringify(conf, null, 2))
  }
}

//Needs an async function to use async
printConfigDetails();