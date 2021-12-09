import { Easee } from '../integration/easee.js'

//These are mandatory to set
const username = process.env.EASEE_USERNAME
const password = process.env.EASEE_PASSWORD

async function getConfigDetails() {
  if (!username || !password) {
    console.warn(
      'Could not find credentials, set the EASEE_USERNAME & EASEE_PASSWORD as env or edit the file',
    )
    process.exit(1)
  }

  const collectedIdInfo = {}

  const easee = new Easee(username, password)

  // Init and log in to the easee cloud API
  console.log('\n\n---- Logging in ----')
  await easee.initAccessToken()
  console.log('---- Login success ----')

  // List all chargers
  const chargers = await easee.getChargers()
  console.log('\n\n---- Quick Listing chargers ----')
  chargers.forEach((charger) => {
    console.log(`  - Charger: ${charger.name} (ChargerId: ${charger.id})`)
    collectedIdInfo.chargerId = charger.id
  })
  console.log('----  ----')

  // List all sites
  const sites = await easee.getSites()
  console.log('\n\n---- Listing sites and details ----')
  for (let site of sites) {
    console.log(`  --- Site: ${site.name} (id: ${site.id}) --- `)
    collectedIdInfo.siteId = site.id
    // Get detailed info on the Site
    const siteDetail = await easee.getSite(site.id)
    console.log(
      `   - Owner: ${siteDetail.contactInfo?.ownerName}  Phone: ${siteDetail.contactInfo?.ownerPhoneNumber}`,
    )
    console.log(`   - RatedCurrent: ${siteDetail.ratedCurrent}`)

    // Go through circuits on each Site
    console.log(
      `     --- Circuits (collection of chargers sharing same fuse)  ---`,
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
      const circuitDetailsResponse = await easee.getCircuit(site.id, circuit.id)
      console.log(
        `         --- Charging-info for circuit (${circuit.id}) ---- `,
      )
      // simple solution to print all with correct indentation
      for (let circuitDetailKey in circuitDetailsResponse) {
        console.log(
          `           - ${circuitDetailKey}: ${circuitDetailsResponse[circuitDetailKey]}`,
        )
      }

      console.log(`     --- Charger(s) details  ---`)
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

      //console.log(JSON.stringify(circuitDetailsResponse, null, 2))
      //console.log(JSON.stringify(circuit, null, 2))

      console.log('----  ----')
    }
  }
  return collectedIdInfo
}

const collectedIds = await getConfigDetails()

console.log(collectedIds)
