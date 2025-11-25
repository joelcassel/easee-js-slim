import { Easee } from '../integration/easee.js'

export class Wifi {
  constructor() {
    this.easee = new Easee()
  }

  async init() {
    await this.easee.initAccessToken()
    console.log('Logged in')
  }

  async queryStatus() {
    return await this.easee.getObservations([
      Easee.observationIDs.WifiSsid,
      Easee.observationIDs.WiFiRssi,
      Easee.observationIDs.WifiAddress,
      Easee.observationIDs.CurrentConnection,
      Easee.observationIDs.ConnectedToCloud
    ]);
  }

  async close() {
    await this.easee.close();
  }
}

const wifi = new Wifi()

await wifi.init()
const status = await wifi.queryStatus()

console.log("Connected to Easee cloud: ", status.ConnectedToCloud);
if (status.ConnectedToCloud) {
  console.log("SSID:", status.WifiSsid);
  console.log("RSSI is", status.WiFiRssi);
  console.log("IP address is", status.WifiAddress);
  console.log("Current connection is", status.CurrentConnection);
}

await wifi.close()
