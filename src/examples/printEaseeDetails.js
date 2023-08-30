import { Easee } from '../integration/easee.js'

/**
 * This is a basic helper to read important config information from your existing charger(s)
 * Run this the first time to get started on your site info.
 *
 * It prints some summaries, and then returns EASEE_CHARGERID, EASEE_SITEID and EASEE_CIRCUITID and prints it.
 *
 * if you set the env EASEE_DEBUG="true", all API calls will be printed
 *
 * Note that this operation is only a simple read and can be runned as many times as you like,
 * there are no changes involved.
 *
 */

async function getConfigDetails() {
  //These are mandatory to set
  const username = process.env.EASEE_USERNAME
  const password = process.env.EASEE_PASSWORD
  if (!username || !password) {
    console.warn(
      'Could not find credentials, set the EASEE_USERNAME & EASEE_PASSWORD as env or edit this file directly (src/examples/printEaseeDetails.js)',
    )
    process.exit(1)
  }

  const collectedIdInfo = {
    chargerIds: [],
    siteIds: [],
    circuitIds: [],
  }

  // Init and log in to the easee cloud API
  const easee = new Easee(username, password)
  console.log('\n\n---- Logging in "easee.initAccessToken()" ----')
  await easee.initAccessToken()
  console.log('---- Login success ----')

  // List all chargers
  const chargers = await easee.getChargers()
  console.log('\n\n---- Quick Listing chargers "easee.getChargers()"----')
  chargers.forEach((charger) => {
    console.log(`  - Charger: ${charger.name} (ChargerId: ${charger.id})`)
    collectedIdInfo.chargerId = charger.id
  })
  collectedIdInfo.onlyOneCharger = chargers.length == 1
  console.log('----')

  // List all sites
  const sites = await easee.getSites()
  console.log('\n\n---- Listing sites and details "easee.getSites()" ----')
  for (let site of sites) {
    console.log(
      `   --- Site: ${site.name}, SiteID: ${site.id},  "easee.getSites()[n]" --- `,
    )
    collectedIdInfo.siteId = site.id
    // Get detailed info on the Site
    const siteDetail = await easee.getSite(site.id)
    console.log(
      `     - Owner: ${siteDetail.contactInfo?.ownerName}  Phone: ${siteDetail.contactInfo?.ownerPhoneNumber}`,
    )
    console.log(`     - RatedCurrent: ${siteDetail.ratedCurrent}`)

    // Go through circuits on each Site
    console.log(
      `     --- Circuits[] (collection of chargers sharing same fuse), part of "easee.getSite(site.id)" ---`,
    )
    for (let circuit of siteDetail.circuits) {
      console.log(
        `         - CircuitId: (${circuit.id}), SiteId: (${circuit.siteId})`,
      )
      collectedIdInfo.circuitId = circuit.id
      console.log(
        `         - PanelName: ${circuit.panelName}, ratedCurrent: ${circuit.ratedCurrent}`,
      )
      console.log(`         - UseDynamicMaster: ${circuit.useDynamicMaster}`)

      // Print circuit-current details
      const circuitDetailsResponse = await easee.getCircuitSettings(
        site.id,
        circuit.id,
      )
      console.log(
        `         --- Charging-info for circuit (${circuit.id}) "easee.getCircuitSettings(site.id, circuit.id)" ---- `,
      )
      // simple solution to print all with correct indentation
      for (let circuitDetailKey in circuitDetailsResponse) {
        console.log(
          `           - ${circuitDetailKey}: ${circuitDetailsResponse[circuitDetailKey]}`,
        )
      }

      console.log(
        `     --- Chargers[] details, part of "easee.getSite(site.id)" ---`,
      )
      for (let chargerDetails of circuit.chargers) {
        console.log(
          `       - Charger: ${chargerDetails.name} (ChargerId: ${chargerDetails.id})`,
        )
        console.log(
          `         - CreatedOn: ${chargerDetails.createdOn}, BackplateId: ${chargerDetails.backPlate.id}, `,
        )
        console.log(
          `         - LevelOfAccess: ${chargerDetails.levelOfAccess}, BackplateId: ${chargerDetails.productCode}, `,
        )
      }
      console.log('----')
    }
  }
  return collectedIdInfo
}

const collectedIds = await getConfigDetails()

if (collectedIds.onlyOneCharger) {
  console.log(`\n\n
It seems you have only one charger and setup.
For convenience you can then pre-set all as env-variables and the API will use the default.

---- Linux env:
export EASEE_CHARGERID='${collectedIds.chargerId}'
export EASEE_SITEID='${collectedIds.siteId}'
export EASEE_CIRCUITID='${collectedIds.circuitId}'
export EASEE_DEBUG=true
----
---- Windows env:
set EASEE_CHARGERID=${collectedIds.chargerId}
set EASEE_SITEID=${collectedIds.siteId}
set EASEE_CIRCUITID=${collectedIds.circuitId}
set EASEE_DEBUG=true
----

With EASEE_DEBUG=true all API call-results will be printed. 
`)
} else {
  console.log(collectedIds)
}
//something was not exiting on my machine, lazy man solution...
process.exit(0)
