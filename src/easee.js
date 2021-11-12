const axios = require('axios').default

// API Details for Easee : https://developer.easee.cloud/docs/get-started

let accessToken = null
const apiUrl = 'https://api.easee.cloud'
const onlyOneChargerIdDefault = process.env.EASEE_CHARGERID || 'ABBXXXXX'
const username = process.env.EASEE_USERNAME || 'username'
const password = process.env.EASEE_PASSWORD || 'password'

async function initAccessToken() {
  if (accessToken) {
    console.log('Reusing access token..')
    resolve(accessToken)
  }
  console.log('Query new access token..')
  const response = await axios
    .post(apiUrl + '/api/accounts/token', {
      userName: username,
      password: password,
    })
    .catch(function (error) {
      console.log(error)
    })
  accessToken = response.data.accessToken
  //Set global token
  console.log('Token retrieved..')
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  return accessToken
}

async function easeeGetCall(endpoint) {
  console.log(`Calling endpoint ${endpoint} with token...`)
  const { data } = await axios.get(apiUrl + endpoint).catch(function (error) {
    console.log(error)
  })
  //console.log(data);
  return data
}

async function getChargers() {
  const response = await easeeGetCall('/api/chargers')
  return response
}

async function getChargerDetails(chargerId = onlyOneChargerIdDefault) {
  const response = await easeeGetCall(`/api/chargers/${chargerId}/details`)
  return response
}

async function getWeeklySchedule(chargerId = onlyOneChargerIdDefault) {
  const response = await easeeGetCall(
    `/api/chargers/${chargerId}/weekly_charge_plan`,
  )
  return response
}

async function getConfig(chargerId = onlyOneChargerIdDefault) {
  const response = await easeeGetCall(
    `/api/chargers/${chargerId}/config`,
  )
  return response
}

async function start() {
  console.log('Started!')
  await initAccessToken()

  /*
  const chargers = await getChargers()
  chargers.forEach((charger) => console.log(`--- Charger: ${charger.name} (${charger.id})`))
  
  const chargerDetails = await getChargerDetails(chargers[0].id)
  console.log(chargerDetails);
  
  const schedule = await getWeeklySchedule()
  console.log(JSON.stringify(schedule, null, 2));
  */

  const conf = await getConfig()
  console.log(JSON.stringify(conf, null, 2));

}

start()
