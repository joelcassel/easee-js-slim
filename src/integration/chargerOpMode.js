// Could not find this on the official docs, copied from https://www.npmjs.com/package/iobroker.easee
 
const chargerOpMode = {
  Offline: 0,
  Disconnected: 1, 
  AwaitingStart: 2, 
  Charging: 3, 
  Completed: 4, 
  Error: 5, 
  ReadyToCharge: 6
}
export default chargerOpMode
