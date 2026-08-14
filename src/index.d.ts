import type { AxiosInstance } from 'axios'

export interface EaseeOptions {
  onlyOneChargerId?: string
  onlyOneSiteId?: string
  onlyOneCircuitId?: string
  throwErrorsOnFault?: boolean
  unrefTimer?: boolean
  resumeWaitMs?: number
  client?: AxiosInstance
}

export interface UpdateResult {
  status: number | null
  statusText: string | null
  data: any
}

export interface NoActionResult {
  status: 'No action'
  message: string
}

export declare class Easee {
  constructor(username?: string, password?: string, customData?: EaseeOptions)

  accessToken: string | null
  refreshToken: string | null
  username: string | undefined
  password: string | undefined
  onlyOneChargerId: string
  onlyOneSiteId: string
  onlyOneCircuitId: string
  throwErrorsOnFault: boolean
  unrefTimer: boolean
  resumeWaitMs: number
  client: AxiosInstance
  tokenRefreshTimer: NodeJS.Timeout | null

  initAccessToken(refreshToken?: string | null): Promise<string>
  refreshAccessToken(): Promise<void>
  scheduleTokenRefresh(delayMs: number): number
  clearTokenRefreshTimer(): void
  close(): void

  easeeGetCall(endpoint: string): Promise<any>
  easeePostCall(endpoint: string, jsonBodyObject?: object): Promise<UpdateResult>
  easeeChargerCommand(chargerId: string | undefined, command: string): Promise<UpdateResult | undefined>

  getChargers(): Promise<any>
  getChargerDetails(chargerId?: string): Promise<any>
  getWeeklySchedule(chargerId?: string): Promise<any>
  getChargerConfig(chargerId?: string): Promise<any>
  getChargerState(chargerId?: string): Promise<any>
  getSites(): Promise<any>
  getSite(siteId?: string): Promise<any>
  getCircuitSettings(siteId?: string, circuitId?: string): Promise<any>
  getPowerUsage(
    chargerId?: string,
    fromDateTimeISOString?: string | null,
    toDateTimeISOString?: string | null,
  ): Promise<any>

  startCharging(chargerId?: string): Promise<UpdateResult | undefined>
  stopCharging(chargerId?: string): Promise<UpdateResult | undefined>
  pauseCharging(chargerId?: string): Promise<UpdateResult | undefined>
  resumeCharging(chargerId?: string): Promise<UpdateResult | undefined>
  overrideChargingSchedule(chargerId?: string): Promise<UpdateResult | undefined>
  startOrResumeCharging(chargerId?: string, recursive?: number): Promise<UpdateResult | NoActionResult | undefined>

  updateChargerSettings(settingsJsonObjToUpdate?: object, chargerId?: string): Promise<UpdateResult>
  setCircuitSettings(settingsJsonObjToUpdate?: object, siteId?: string, circuitId?: string): Promise<UpdateResult>
  updateWeeklySchedule(settingsJsonObjToUpdate?: object, chargerId?: string): Promise<UpdateResult>

  isEVCableConnected(chargerId?: string): Promise<boolean>
}

export declare const reasonForNoCurrent: {
  OK: 0
  MaxCircuitCurrentTooLow: 1
  MaxDynamicCircuitCurrentTooLow: 2
  MaxDynamicOfflineFallbackCircuitCurrentTooLow: 3
  CircuitFuseTooLow: 4
  WaitingInQueue: 5
  WaitingInFully: 6
  IllegalGridType: 7
  PrimaryUnitHasNotReceivedCurrentRequestFromSecondaryUnit: 8
  SecondaryUnitNotRequestingCurrent: 50
  MaxChargerCurrentTooLow: 51
  MaxDynamicChargerCurrentTooLow: 52
  ChargerDisabled: 53
  PendingScheduledCharging: 54
  PendingAuthorization: 55
  ChargerInErrorState: 56
  Undefined: 100
}

export declare const chargerOpMode: {
  Offline: 0
  Disconnected: 1
  AwaitingStart: 2
  Charging: 3
  Completed: 4
  Error: 5
  ReadyToCharge: 6
}

export default Easee
