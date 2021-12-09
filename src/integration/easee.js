import axios from 'axios'

// API Details for Easee : https://developer.easee.cloud/docs/get-started
const apiUrl = 'https://api.easee.cloud'
export class Easee {
  constructor(username = process.env.EASEE_USERNAME, password = process.env.EASEE_PASSWORD, customData = {}) {
    this.accessToken = null
    this.username = username
    this.password = password
    this.onlyOneChargerId =
      customData.onlyOneChargerId || process.env.EASEE_CHARGERID
    this.onlyOneSiteId = customData.onlyOneSiteId || process.env.EASEE_SITEID
    this.onlyOneCircuitId = customData.onlyOneCircuitId || process.env.EASEE_CIRCUITID
  }

  async initAccessToken() {
    if (this.accessToken) {
      log('Reusing access token..')
      resolve(this.accessToken)
    }
    log('Query new access token..')
    const response = await axios
      .post(apiUrl + '/api/accounts/token', {
        userName: this.username,
        password: this.password,
      })
      .catch(function (error) {
        console.error(
          'Could not get access Token from login, verify your login and credentials..',
        )
        log(error.response.data)
        process.exit(1)
      })
    this.accessToken = response.data.accessToken
    if (!this.accessToken) {
      console.error(
        'Could not get access Token from login, verify your login and credentials',
      )
      console.error(JSON.stringify(response.data, null, 2))
      process.exit(1)
    }

    //Set global token
    log('Token retrieved..')
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.accessToken}`
    return this.accessToken
  }

  async easeeGetCall(endpoint) {
    log(`Calling GET ${endpoint} ...`)
    const { data } = await axios.get(apiUrl + endpoint).catch(function (error) {
      log(error)
    })
    log(`Response:\n`, data)
    return data
  }

  async easeePostCall(endpoint, jsonBodyObject = {}) {
    log(`Calling POST ${endpoint} ...`)
    const response = await axios
      .post(apiUrl + endpoint, jsonBodyObject)
      .catch(function (error) {
        log(error)
      })
    log(`Response:\n`, data)
    return response
  }

  async getChargers() {
    const response = await this.easeeGetCall('/api/chargers')
    return response
  }

  async getChargerDetails(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/details`,
    )
    return response
  }

  async getWeeklySchedule(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/weekly_charge_plan`,
    )
    return response
  }

  async getChargerConfig(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/config`,
    )
    return response
  }

  async getSites() {
    const response = await this.easeeGetCall(`/api/sites`)
    return response
  }

  async getSite(siteId = this.onlyOneSiteId) {
    const response = await this.easeeGetCall(`/api/sites/${siteId}`)
    return response
  }

  async getCircuit(
    siteId = this.onlyOneSiteId,
    circuitId = this.onlyOneCircuitId,
  ) {
    const response = await this.easeeGetCall(
      `/api/sites/${siteId}/circuits/${circuitId}/settings`,
    )
    return response
  }

  async updateChargerSettings(
    settingsJsonObj = {},
    chargerId = this.onlyOneChargerId,
  ) {
    const response = await this.easeePostCall(
      `/api/chargers/${chargerId}/settings`,
      settingsJsonObj,
    )
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    }
  }

  // https://developer.easee.cloud/reference/post_api-sites-siteid-circuits-circuitid-settings
  async updateCircuitSettings(
    settingsJsonObj = {},
    siteId = this.onlyOneSiteId,
    circuitId = this.onlyOneCircuitId,
  ) {
    const response = await this.easeePostCall(
      `/api/sites/${siteId}/circuits/${circuitId}/settings`,
      settingsJsonObj,
    )
    return {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    }
  }
}

function log(...args) {
  if (process.env.EASEE_DEBUG === 'true') {
    console.log(...args)
  }
}
