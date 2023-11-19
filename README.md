# Slim API abstraction for Easee EV charging stations

- Handy command abstraction and simple examples for NodeJs and Server implementations
- Uses **Axios** for access.
- You need an account created on Easee Cloud (https://easee.com/auth/signup)
- Details on the Easee API is on https://developer.easee.com/docs/get-started

# Quickstart

## For single installations for the Easee EV charger

Easee chargers can be installed in very advanced enterprise systems. This is powerful but also makes the API harder to work with.

Most normal home-automation enthusiasts have only one charger, for this case there is a quick-start available. This will query your chain of settings and IDs that are static and unchangeable for you:
`ChargerId` -> `SiteId` -> `CircuitId`

Simplest way:

1. Register your account and charger in the "Easee" app, or at https://easee.com/auth/signup.
1. Set the your Easee account `username` and `password` as environment variables:
   ```bash
   Linux:
       export EASEE_USERNAME=youremal@domain.com
       export EASEE_PASSWORD=Password123
   Windows:
       set EASEE_USERNAME=youremal@domain.com
       set EASEE_PASSWORD=Password123
   ```
1. As a one-time thing, run `node node_modules/easee-js-slim/src/examples/printEaseeDetails.js`
   ... This will log in and print the complicated nested details. It will print a lot of details and summarize with your IDs example:

   ```
        ..
        ....
        It seems you have only one charger and setup.
        For convenience you can then pre-set all as env-variables and the API will use the default.

        export EASEE_CHARGERID='EH2AABCD'
        export EASEE_SITEID='1234567'
        export EASEE_CIRCUITID='123456'
        export EASEE_DEBUG=true
   ```

## Making use of the framework

1. `npm install -save easee-js-slim` to install the package to your project
2. Set the login variables in your `ENV` _(or pass them as parameters, look in the code)_
   Here is some example code to get you started

```javascript
import Easee from 'easee-js-slim'

async function easeeExample() {
  const easee = new Easee()
  //Log in and set access token to global
  await easee.initAccessToken()

  //Print the charger-state info
  const state = await easee.getChargerState()
  console.log(state)

  //Stop Charging (if started)
  const response = await easee.stopCharging()
  console.log(response)
}
easeeExample()
```

## API and Documentation

- Look at `src/integration/easee.js` where all functions are easy to read in the code
- Read the official API on https://developer.easee.com/docs/get-started for more details

### Quick reference

Here are some of the functions. JSON-setting-functions takes partial objects, see the official API doc on https://developer.easee.com/docs/

```javascript
await easee.initAccessToken()
const chargers = await easee.getChargers()
const chargerDetails = await easee.getChargerDetails()
const conf = await easee.getChargerConfig()
const schedule = await getWeeklySchedule()
const sites = await easee.getSites()
const site = await easee.getSite()
const circuit = await easee.getCircuitSettings()
const cableConnected = await easee.isEVCableConnected()
const totalPowerUsage = await easee.getPowerUsage() //last 24h
const totalPowerUsage = await easee.getPowerUsage(
  null,
  '2023-08-29T00:00:00.000Z',
  '2023-08-30T00:00:00.000Z ',
)
easee.pauseCharging()
easee.resumeCharging()
easee.stopCharging()
easee.startCharging()
//Go-Charging helper-function to Start, resume or overrideSchedule (just make it happen..)
easee.startOrResumeCharging()

//Example: Change max charging and default Amps to 10A
const circuitUpdate = {
  maxCircuitCurrentP1: 10,
  maxCircuitCurrentP2: 10,
  maxCircuitCurrentP3: 10,
  offlineMaxCircuitCurrentP1: 10,
  offlineMaxCircuitCurrentP2: 10,
  offlineMaxCircuitCurrentP3: 10,
}
easee.setCircuitSettings(circuitUpdate)

//Example: turn schedule on/off
const weeklySchedule = await easee.getWeeklySchedule()
weeklySchedule.isEnabled = !weeklySchedule.isEnabled
easee.updateWeeklySchedule(weeklySchedule)

//Stop the timer to refresh the token (will allow the class to close gracefully)
easee.close()
```

### Schedule life-hack (inverted schedule)

Instead of starting, stopping pausing and handling all things manually you can set the schedule to something super-low. Example: enable schedule only for **1 minute at 3am on sunday** in your easee-app. You can then toggle the schedule OFF to start charging, and toggle it ON to stop charging using your external automation scheduler. Example to turn ON charging using the disabled Schedule is:

```javascript
const weeklySchedule = await easee.getWeeklySchedule()
weeklySchedule.isEnabled = false
easee.updateWeeklySchedule(weeklySchedule)
```

**_Note: i managed to crash my schedule when sending partial json to this endpoint, so an emergency copy is added to `src/examples/weeklySchedule.json`_**

### Access token (updated)

The `initAccessToken()` is now needed to run first to log in and load the first token. The returned time interval for the token is now taken into account, so it will be refreshed automatically ~1 minute before it expires.

### Debug logging and Errors handling

Make sure to set the `export EASEE_DEBUG=true` when doing integration. It will log most calls and results in a nice way.

By default only the init-functions will throw errors directly. All other functions returns an empty result on error. This was not optimal behavior, so now you can set the env-variable `EASEE_THROW_ERRORS_ON_FAULT=true` or the `customData.throwErrorsOnFault:true` to make all functions throw errors on fault. Unless set to true it will not change the old behavior.

## General information and known issues

- All Contributions/PRs are happily accepted
- Even though this is a proxy-API, NO GUARANTEES are given, and you can probably screw up your Easee box by sending strange manual commands

## Version history (summary from 1.0)

- 1.0.0 Started on v1.0, good enough.
- 1.0.3 Updated `initAccessToken` to use login since API changed
- 1.1.0 Removed all `process.exit`, all things now throws an error instead. Added `updateWeeklySchedule`. Described inverted schedule.
- 1.2.0 Updated Easee API endpoint addresses to api.easee.com (and updated documentation links). Added getPowerUsage()
- 1.3.0 Updated token refresh timer, Added `close()` to stop the timer to refresh the token (will allow the class to close gracefully). Added throwErrorsOnFault (env: EASEE_THROW_ERRORS_ON_FAULT) that will cause the methods to throw errors instead of returning empty response. Will not change old behavior unless set to `true`.
- 1.3.1 Updated readme and renamed env throwing flag to EASEE_THROW_ERRORS_ON_FAULT
