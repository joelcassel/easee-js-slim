// Listed on https://developer.easee.com/changelog/ocpp-14

const reasonForNoCurrent = {
  OK: 0, // charger is allocated current
  MaxCircuitCurrentTooLow: 1,
  MaxDynamicCircuitCurrentTooLow: 2,
  MaxDynamicOfflineFallbackCircuitCurrentTooLow: 3,
  CircuitFuseTooLow: 4,
  WaitingInQueue: 5,
  WaitingInFully: 6, // charged queue (charger assumes one of: EV uses delayed charging", EV charging complete)
  IllegalGridType: 7,
  PrimaryUnitHasNotReceivedCurrentRequestFromSecondaryUnit: 8,
  SecondaryUnitNotRequestingCurrent: 50, // no car connected...
  MaxChargerCurrentTooLow: 51,
  MaxDynamicChargerCurrentTooLow: 52,
  ChargerDisabled: 53,
  PendingScheduledCharging: 54, // if stopped by timer/schedule
  PendingAuthorization: 55,
  ChargerInErrorState: 56,
  Undefined: 100,
}
export default reasonForNoCurrent
