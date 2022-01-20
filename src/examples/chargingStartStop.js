import { Charging } from '../helpers/Charging.js'


async function chargingTest() {
  const chargingHelper = new Charging()
  await chargingHelper.init()

  console.log('Get Charging status')
  const state = await chargingHelper.getChargerState()
  console.log(JSON.stringify(state, null, 2))
}

//Needs an async function to use async
chargingTest()
