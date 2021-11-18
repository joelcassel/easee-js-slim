import axios from 'axios'

// API Details for Easee : https://developer.easee.cloud/docs/get-started
const apiUrl = 'https://api.easee.cloud'

export class Easee {
  constructor(username, password, customData = {}) {
    this.accessToken = null
    this.username = username
    this.password = password
    this.onlyOneChargerId = customData.onlyOneChargerId
  }

  async initAccessToken() {
    if (this.accessToken) {
      console.log('Reusing access token..')
      resolve(this.accessToken)
    }
    console.log('Query new access token..')
    const response = await axios
      .post(apiUrl + '/api/accounts/token', {
        userName: this.username,
        password: this.password,
      })
      .catch(function (error) {
        console.error(
          'Could not get access Token from login, verify your login and credentials..',
        )
        console.log(error.response.data)
        process.exit(1)
      })
    this.accessToken = response.data.accessToken
    if (!this.accessToken) {
      console.error(
        'Could not get access Token from login, verify your login and credentials',
      )
      console.error(JSON.stringify(response.data, null, 2))
      process.exit(1);
    }

    //Set global token
    console.log('Token retrieved..')
    axios.defaults.headers.common['Authorization'] = `Bearer ${this.accessToken}`
    return this.accessToken
  }

  async easeeGetCall(endpoint) {
    console.log(`Calling GET ${endpoint} ...`)
    const { data } = await axios.get(apiUrl + endpoint).catch(function (error) {
      console.log(error)
    })
    //console.log(data);
    return data
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

  async getConfig(chargerId = this.onlyOneChargerId) {
    const response = await this.easeeGetCall(
      `/api/chargers/${chargerId}/config`,
    )
    return response
  }
}
