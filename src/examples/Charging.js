import { Easee } from '../integration/easee.js'

export class Charger {
  constructor() {
    this.easee = new Easee()
    this.init()
  }

  async init() {
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
