# Slim API abstraction for Easee EV charging stations

- Handy command abstraction and simple examples for NodeJs and Server implementations
- Uses **Axios** for access.
- You need an account created on Easee Cloud (https://easee.cloud/auth/signup)
- Details on the Easee API is on https://developer.easee.cloud/docs/get-started

# Quickstart

## For single installations for the Easee EV charger

Easee chargers can be installed in very advanced enterprise systems. This is powerful but also makes the API harder to work with.

Most normal home-automation enthusiasts have only one charger, for this case there is a quick-start available. This will query your chain of settings and IDs that are static and unchangeable for you:
`ChargerId` -> `SiteId` -> `CircuitId`

Simplest way:

1. Register your account and charger in the "Easee" app, or at https://easee.cloud/auth/signup.
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
        export EASEE_DEBUG=false
   ```

## Making use of the framework

1. `npm install -save easee-js-slim` to install the package to your project
2. Set the login variables in your `ENV` _(or pass them as parameters, look in the code)_
   Here is some example code to get you started

```javascript
import Easee from 'easee-js-slim'

async function easeeExample() {
  const easee = new Easee()
  //Log in and set access token
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

(Will be updated eventually)

- Look at `src/integration/easee.js` where all functions are easy to read in the code
- Read the official API on https://developer.easee.cloud/docs/get-started for more details

### Quick refference

Here are some of the functions. JSON-setting-functions takes partial objects, see the official API doc on https://developer.easee.cloud/docs/

```javascript
await easee.initAccessToken()
const chargers = await easee.getChargers()
const chargerDetails = await easee.getChargerDetails()
const conf = await easee.getChargerConfig()
const schedule = await getWeeklySchedule()
const sites = await easee.getSites()
const site = await easee.getSite()
const circuit = await easee.getCircuitSettings()
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
```

## General information and known issues

- All Contributions/PRs are happily accepted
- The API-Access-Token is not refreshed based on time, so you need to re-issue it now and then if you have a constant connection.
- Even though this is a proxy-API, NO GUARANTEES are given, and you can probably screw up your Easee box by sending strange manual commands
- Uses modules / async and imports
