// From https://developer.easee.com/docs/charger-observation-ids
const observationIDs = {
  SelfTestResult: 1, // PASSED or error codes, String
  SelfTestDetails: 2, // JSON with details from self-tes, String, JSON
  WifiEvent: 10, // Wifi event, Integer, Event, Easee Internal usage
  ChargerOfflineReason: 11, // Enum describing why charger is offline, Integer
  LocalPreAuthorizeEnabled: 15, // Preauthorize with whitelist enabled. Readback on setting, Boolean, Event
  LocalAuthorizeOfflineEnabled: 16, // Allow offline charging for whitelisted RFID token. Readback on setting, Boolean, Event
  AllowOfflineTxForUnknownId: 17, // Allow offline charging for all RFID tokens. Readback on setting, Boolean, Event
  ErraticEvmaxToggles: 18, // 0 == erratic checking disabled, otherwise the number of toggles between states Charging and Charging Complate that will trigger an error, Integer
  BackplateType: 19, // erratic checking type of backplate, type =0 corrsponds to comercialcharger, type =1 corrsponds to testing charger, Integer
  SiteStructure: 20, // checking site structure and displaying address,conctac info, installer, owner etc, String, JSON
  DetectedPowerGridType: 21, // Detected power grid type according to PowerGridType table, Integer, Boot
  CircuitMaxCurrentP1: 22, // Circuit max current in Ampers of Phase 1, Integer, Event
  CircuitMaxCurrentP2: 23, // Circuit max current in Ampers of Phase 2, Integer, Event
  CircuitMaxCurrentP3: 24, // Circuit max current in Ampers of Phase 3, Integer, Event
  SiteIdString: 26, // Site ID as a string, String
  SiteIdNumeric: 27, // Site ID as a numeric, Integer
  RfidTimeoutAuth: 28, // Timeout set for authentication for when Authentication == True, Integer
  LockCablePermanently: 30, // Lock type2 cable permanently, Boolean
  IsEnabled: 31, // Set true to enable charger, false disables charger, Boolean
  TemperatureMonitorState: 32, // Retrieves temperature of the charger, Integer
  WifiSsid: 36, // Network name charger/s are connected to, String
  PhaseMode: 38, // erratic showing what phase mode is the charger connected to, phase mode ==1 --> one phase, phase mode==3 --> 3 phase, Integer
  LedStripBrightness: 40, // erratic showing in integer the LED brightness, Integer, Boot
  LocalAuthorizationRequired: 41, // Local RFID authorization is required for charging, Boolean, Event, User Options
  AuthorizationRequired: 42, // Authorization is required for charging, Boolean
  RemoteStartRequired: 43, // Remote start required flag, Boolean, Event
  SmartButtonEnabled: 44, // Smart button is enabled, Boolean
  OfflineChargingMode: 45, // Charger behaviour when offline, Integer
  Ledmode: 46, // Charger LED mode, Integer, Event
  MaxChargerCurrent: 47, // Max current this charger is allowed to offer to car (A). Non volatile., Double
  DynamicChargerCurrent: 48, // Max current this charger is allowed to offer to car (A). Volatile, Double
  MaxCurrentOfflineFallbackP1: 50, // Maximum circuit current P1 when offline, Integer, Event
  MaxCurrentOfflineFallbackP2: 51, // Maximum circuit current P2 when offline, Integer, Event
  MaxCurrentOfflineFallbackP3: 52, // Maximum circuit current P3 when offline, Integer, Event
  ReleaseCableAtPowerOff: 54, // If set to Yes, cable is released when power off. If set to No, cable not released, String, Event
  ChargingSchedule: 62, // Charging schedule, String, Json
  PairedEqualizer: 65, // Paired equalizer details, String
  PairedUserIdtoken: 69, // Observed user token when charger put in RFID pairing mode, String, Event
  CircuitTotalAllocatedPhaseConductorCurrentL1: 70, // Circuit Total Allocated Phase Conductor Current L1, Integer, Boot
  CircuitTotalAllocatedPhaseConductorCurrentL2: 71, // Circuit Total Allocated Phase Conductor Current L2, Integer, Boot
  CircuitTotalAllocatedPhaseConductorCurrentL3: 72, // Circuit Total Allocated Phase Conductor Current L3, Integer, Boot
  CircuitTotalPhaseConductorCurrentL1: 73, // Circuit Total Phase Conductor Current L1, Integer, Boot
  CircuitTotalPhaseConductorCurrentL2: 74, // Circuit Total Phase Conductor Current L2, Integer, Boot
  CircuitTotalPhaseConductorCurrentL3: 75, // Circuit Total Phase Conductor Current L3, Integer, Boot
  NumberOfCarsConnected: 76, // Number of cars connected to this circuit, Integer
  NumberOfCarsCharging: 77, // Number of cars currently charging, Integer
  NumberOfCarsInQueue: 78, // Number of cars currently in queue, waiting to be allocated power, Integer
  NumberOfCarsFullyCharged: 79, // Number of cars that appear to be fully charged, Integer
  SoftwareRelease: 80, // Firmware of charger, Integer, Boot
  Iccid: 81, // ICCID number, Integer, Boot
  MobileNetworkOperator: 84, // Name of mobile network operator, String, Event
  RebootReason: 89, // Reason of reboot. Bitmask of flags., Integer
  ReasonForNoCurrent: 96, // Enum describing why a charger with a car connected is not offering current to the car, Integer
  LoadBalancingNumberOfConnectedChargers: 97, // Number of connected chargers in the load balancing. Including the master. Sent from Master only., Integer
  UdpNumOfConnectedNodes: 98, // Number of chargers connected to master through UDP and WIFI, Integer
  LocalConnection: 99, // Secondarychargers only. Current connection to master, 0 = None, 1= Radio, 2 = WIFI UDP, 3 = Radio and WIFI UDP., String, Boot
  PilotMode: 100, // Pilot Mode Letter (A-F), String, Event
  SmartCharging: 102, // Smart charging state enabled by capacitive touch button, Boolean, Event
  CableLocked: 103, // Cable lock state, Boolean, Event
  CableRating: 104, // Cable rating read (Amperes), Double, Event
  BackplateId: 107, // Backplate id, String, Boot
  UserIdtokenReversed: 108, // User ID token string from RFID reading (NB! Must reverse these strings), String, Event
  ChargerOpMode: 109, // Charger operation mode according to charger mode table, Integer, Event
  OutputPhase: 110, // Active output phase(s) to EV according to output phase type table., Integer, Event
  DynamicCircuitCurrentP1: 111, // Dynamic Circuit current in P1 in Amps, Integer, Event
  DynamicCircuitCurrentP2: 112, // ADynamic Circuit current in P2 in Amps, Integer, Event
  DynamicCircuitCurrentP3: 113, // Dynamic Circuit current in P3 in Amps, Integer, Event
  OutputCurrent: 114, // Available current signaled to car with pilot tone in Amps, Integer, Boot, Easee Internal usage
  DeratedCurrent: 115, // Available current after derating, Double, Event, Easee Internal usage
  DeratingActive: 116, // Available current is limited by the charger due to high temperature, Boolean, Event
  ErrorString: 118, // Descriptive Error String, String, Event, Easee Internal usage
  ErrorCode: 119, // Error code according to error code table [event] [Integer], Integer, Event
  TotalPower: 120, // Total power (kW), Double, Telemetry
  SessionEnergy: 121, // Session accumulated energy (kWh), Double, Telemetry
  EnergyPerHour: 122, // Accumulated energy per hour (kWh), Double, Event
  LegacyEvStatus: 123, // 0 = not legacy ev, 1 = legacy ev detected, 2 = reviving ev, Integer, Event, Easee Internal usage
  LifetimeEnergy: 124, // Accumulated energy in the lifetime of the charger (kWh), Double
  LifetimeRelaySwitches: 125, // Total number of relay switches in the lifetime of the charger (irrespective of the number of phases used), Integer, Easee Internal usage
  LifetimeHours: 126, // Total number of hours in operation, Integer, Easee Internal usage
  UserIdtoken: 128, // User ID token string from RFID reading, String, Event
  ChargingSession: 129, // Charging sessions, String, Event, Json
  CellRssi: 130, // Cellular signal strength (dBm), Integer, Telemetry
  CellRat: 131, // Cellular radio access technology according to RAT table, Integer, Event
  WiFiRssi: 132, // WiFi signal strength (dBm), Integer, Telemetry
  CellAddress: 133, // IP address assigned by cellular network, Sring, Event, Easee Internal usage
  WifiAddress: 134, // IP address assigned by WiFi network, Sring, Event, Easee Internal usage
  LocalRssi: 136, // Local radio signal strength (dBm), Integer, Telemetry
  LocalTxPower: 138, // Local radio transmission power (dBm), Integer, Telemetry
  LocalState: 139, // Local radio state, String, Event
  CurrentConnection: 141, // Radio access technology in use: 0 = cellular, 1 = wifi, Integer, Event
  LocalNodeType: 146, // erratic=0-Unconfigured, 1-Master, 2-Extender, 3-End devicet, Integer, Event
  LocalParentAddrOrNumOfNodes: 149, // If master-Number of secondary connected, If secondary- Address parent, Integer, Event, Easee Internal usage
  TempMax: 150, // Maximum temperature for all sensors, Double, Event
  TempInputT2: 152, // Temperature at input T2, Double, Event
  TempInputT3: 153, // Temperature at input T3, Double, Event
  TempInputT4: 154, // Temperature at input T4, Double, Event
  TempInputT5: 155, // Temperature at input T5, Double, Event
  TempOutputN: 160, // Temperature at type 2 connector plug for N, Double, Event
  TempOutputL1: 161, // Temperature at type 2 connector plug for L1, Double, Event
  TempOutputL2: 162, // Temperature at type 2 connector plug for L2, Double, Event
  TempOutputL3: 163, // Temperature at type 2 connector plug for L3, Double, Event
  TempAmbient: 170, // Ambient temperature [Celsius], Double, Event
  IntRelHumidity: 172, // Internal relative humidity, Double, Event
  BackplateLocked: 173, // Back plate confirmed locked, Double, Event
  IntCurrentT2: 182, // Calculated current RMS for input T2, Double, Event
  IntCurrentT3: 183, // Calculated current RMS for input T3, Double, Event
  IntCurrentT4: 184, // Calculated current RMS for input T4, Double, Event
  IntCurrentT5: 185, // Calculated current RMS for input T5, Double, Event
  InVoltT1t2: 190, // Input voltage RMS between T1 and T2, Double, Event
  InVoltT1t3: 191, // Input voltage RMS between T1 and T3, Double, Event
  InVoltT1t4: 192, // Input voltage RMS between T1 and T4, Double, Event
  InVoltT1t5: 193, // Input voltage RMS between T1 and T5, Double, Event
  InVoltT2t3: 194, // Input voltage RMS between T2 and T3, Double, Event
  InVoltT2t4: 195, // Input voltage RMS between T2 and T4, Double, Event
  InVoltT2t5: 196, // Input voltage RMS between T2 and T5, Double, Event
  InVoltT3t4: 197, // Input voltage RMS between T3 and T4, Double, Event
  InVoltT3t5: 198, // Input voltage RMS between T3 and T5, Double, Event
  InVoltT4t5: 199, // Input voltage RMS between T4 and T5, Double, Event
  OutVoltPin1And2: 202, // Output voltage RMS between type 2 pin 1 and 2, Double, Event
  OutVoltPin1And3: 203, // Output voltage RMS between type 2 pin 1 and 3, Double, Event
  OutVoltPin1And4: 204, // Output voltage RMS between type 2 pin 1 and 4, Double, Event
  OutVoltPin1And5: 205, // Output voltage RMS between type 2 pin 1 and 5, Double, Event
  OutVoltPin2And3: 206, // Output voltage RMS between type 2 pin 2 and 3, Double, Event
  ChargeSessionStart: 223, // Last session details, String, JSON
  EqAvailableCurrentP1: 230, // Available current for charging on P1 according to Equalizer, Double
  EqAvailableCurrentP2: 231, // Available current for charging on P2 according to Equalizer, Double
  EqAvailableCurrentP3: 232, // Available current for charging on P3 according to Equalizer, Double
  ConnectedToCloud: 250, // If charger connected to cloud or not, BOOLEAN, Boot
  CloudDisconnectReason: 251 // Reason why charger disconnected from cloud, String, Boot, Easee Internal usage
}

export default observationIDs;
