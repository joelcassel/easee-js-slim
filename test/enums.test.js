import t from 'tap'
import reasonForNoCurrent from '../src/integration/reasonForNoCurrent.js'
import chargerOpMode from '../src/integration/chargerOpMode.js'

t.test('reasonForNoCurrent holds the codes the library branches on', async (t) => {
  t.equal(reasonForNoCurrent.OK, 0)
  t.equal(reasonForNoCurrent.WaitingInFully, 6)
  t.equal(reasonForNoCurrent.SecondaryUnitNotRequestingCurrent, 50)
  t.equal(reasonForNoCurrent.MaxDynamicChargerCurrentTooLow, 52)
  t.equal(reasonForNoCurrent.PendingScheduledCharging, 54)
  t.equal(reasonForNoCurrent.Undefined, 100)
})

t.test('reasonForNoCurrent has no duplicate values', async (t) => {
  const values = Object.values(reasonForNoCurrent)
  t.equal(new Set(values).size, values.length)
})

t.test('chargerOpMode covers 0..6', async (t) => {
  t.strictSame(chargerOpMode, {
    Offline: 0,
    Disconnected: 1,
    AwaitingStart: 2,
    Charging: 3,
    Completed: 4,
    Error: 5,
    ReadyToCharge: 6,
  })
})

t.test('chargerOpMode has no duplicate values', async (t) => {
  const values = Object.values(chargerOpMode)
  t.equal(new Set(values).size, values.length)
})
