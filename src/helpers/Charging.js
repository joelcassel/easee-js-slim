import { Easee } from '../integration/easee.js'

export class Charging {
  constructor(
    username = process.env.EASEE_USERNAME,
    password = process.env.EASEE_PASSWORD,
    customData = {},
  ) {
    this.easee = new Easee(
      process.env.EASEE_USERNAME,
      process.env.EASEE_PASSWORD,
    )
  } 

  async init(){
    // Init and log in to the easee cloud API
    console.log('Started!')
    await this.easee.initAccessToken()
    console.log('Logged in')
  }

  async startCharging() {
    const startResponse = await this.easee.startCharging()
    console.log(startResponse)
  }

  async getChargerState() {
    const stateResponse = await this.easee.getChargerState()
    return stateResponse
  }
}

