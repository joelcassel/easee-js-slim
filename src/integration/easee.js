import axios from 'axios'

// API Details for Easee : https://developer.easee.cloud/docs/get-started
const apiUrl = 'https://api.easee.cloud'
export class Easee {
  constructor(
    username = process.env.EASEE_USERNAME,
    password = process.env.EASEE_PASSWORD,
    customData = {},
  ) {
    this.accessToken = null
    this.username = username
    this.password = password
    this.onlyOneChargerId =
      customData.onlyOneChargerId ||
      process.env.EASEE_CHARGERID ||
      '--NOT_SET_CHARGERID--'
    this.onlyOneSiteId =
      customData.onlyOneSiteId ||
      process.env.EASEE_SITEID ||
      '--NOT_SET_SITEID--'
    this.onlyOneCircuitId =
      customData.onlyOneCircuitId ||
      process.env.EASEE_CIRCUITID ||
      '--NOT_SET_CIRCUITID--'
  }

  async initAccessToken() {
    if (!this.username || !this.password) {
      console.warn(
        'Could not find credentials, set the EASEE_USERNAME & EASEE_PASSWORD as env or edit the file directly (src/easee.js)',
      )
      process.exit(1)
    }
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
        logRequestError(error)
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

    //Set global token for next calls
    log('Token retrieved..')
    axios.defaults.headers.common[
      'Authorization'
    ] = `Bearer ${this.accessToken}`
    return this.accessToken
  }

  async easeeGetCall(endpoint) {
    log(`Calling GET ${endpoint} ...`)
    const { data } = await axios.get(apiUrl + endpoint).catch(function (error) {
      logRequestError(error)
      return {}
    })
    log(`Response:\n`, data)
    return data
  }

  async easeePostCall(endpoint, jsonBodyObject = {}) {
    log(`Calling POST ${endpoint} ...`)
    const response = await axios
      .post(apiUrl + endpoint, jsonBodyObject)
      .catch(function (error) {
        logRequestError(error)
        return {}
      })
    log(`Response:\n`, response)
    return response
  }

  // Helper to send the "command" to a charger
  async easeeChargerCommand(chargerId = this.onlyOneChargerId, command) {
    if (!command || !chargerId) {
      log('ChargerId or command is not present, skipping..')
      return
    }
    const response = await this.easeePostCall(
      `/api/chargers/${chargerId}/commands/${command}`,
    )
    return summarizeUpdateResult(response)
  }

  // https://developer.easee.cloud/reference/get_api-chargers
  async getChargers() {
    const response = await this.easeeGetCall('/api/chargers')
    return response
  }

  // https://developer.easee.cloud/reference/get_api-chargers-id-details
  async getChargerDetails(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/details`,
    )
    return response
  }

  // https://developer.easee.cloud/reference/get_api-chargers-id-weekly-charge-plan
  async getWeeklySchedule(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/weekly_charge_plan`,
    )
    return response
  }

  // https://developer.easee.cloud/reference/get_api-chargers-id-config
  async getChargerConfig(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/config`,
    )
    return response
  }

  // https://developer.easee.cloud/reference/get_api-chargers-id-state
  async getChargerState(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(`/api/chargers/${chargerId}/state`)
    return response
  }

  // https://developer.easee.cloud/reference/get_api-sites
  async getSites() {
    const response = await this.easeeGetCall(`/api/sites`)
    return response
  }

  // https://developer.easee.cloud/reference/get_api-chargers-id-site
  async getSite(siteId = this.onlyOneSiteId) {
    const response = await this.easeeGetCall(`/api/sites/${siteId}`)
    return response
  }

  // https://developer.easee.cloud/reference/get_api-sites-siteid-circuits-circuitid-settings
  async getCircuitSettings(
    siteId = this.onlyOneSiteId,
    circuitId = this.onlyOneCircuitId,
  ) {
    const response = await this.easeeGetCall(
      `/api/sites/${siteId}/circuits/${circuitId}/settings`,
    )
    return response
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-commands-start-charging
  async startCharging(chargerId = this.onlyOneChargerId) {
    return this.easeeChargerCommand(chargerId, 'start_charging')
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-commands-stop-charging
  async stopCharging(chargerId = this.onlyOneChargerId) {
    return this.easeeChargerCommand(chargerId, 'stop_charging')
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-commands-pause-charging
  async pauseCharging(chargerId = this.onlyOneChargerId) {
    return this.easeeChargerCommand(chargerId, 'pause_charging')
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-commands-resume-charging
  async resumeCharging(chargerId = this.onlyOneChargerId) {
    return this.easeeChargerCommand(chargerId, 'resume_charging')
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-commands-override-schedule
  async overrideChargingSchedule(chargerId = this.onlyOneChargerId) {
    return this.easeeChargerCommand(chargerId, 'override_schedule')
  }

  // https://developer.easee.cloud/reference/post_api-chargers-id-settings
  async updateChargerSettings(
    settingsJsonObjToUpdate = {},
    chargerId = this.onlyOneChargerId,
  ) {
    const response = await this.easeePostCall(
      `/api/chargers/${chargerId}/settings`,
      settingsJsonObjToUpdate,
    )
    return summarizeUpdateResult(response)
  }

  // https://developer.easee.cloud/reference/post_api-sites-siteid-circuits-circuitid-settings
  async setCircuitSettings(
    settingsJsonObjToUpdate = {},
    siteId = this.onlyOneSiteId,
    circuitId = this.onlyOneCircuitId,
  ) {
    const response = await this.easeePostCall(
      `/api/sites/${siteId}/circuits/${circuitId}/settings`,
      settingsJsonObjToUpdate,
    )
    return summarizeUpdateResult(response)
  }
}

function log(...args) {
  if (process.env.EASEE_DEBUG === 'true') {
    console.log(...args)
  }
}

function logRequestError(error) {
  console.log('---------API ERROR----------')
  console.log(`URL: (${error?.request?.method}) ${error?.config?.url}`)
  console.log(`Request body: ${error?.config?.data}`)
  console.log(
    `Response status: ${error?.response?.status} (${error?.response?.statusText})`,
  )
  console.log('-------------------')
}

function summarizeUpdateResult(response) {
  return {
    status: response.status,
    statusText: response.statusText,
    data: response.data,
  }
}
