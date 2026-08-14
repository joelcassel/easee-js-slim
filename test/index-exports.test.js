import t from 'tap'
import Easee, { Easee as NamedEasee, reasonForNoCurrent, chargerOpMode } from '../src/index.js'

t.test('default and named Easee are the same class', async (t) => {
  t.type(Easee, 'function')
  t.equal(Easee, NamedEasee)
})

t.test('enums are re-exported from the package root', async (t) => {
  t.equal(reasonForNoCurrent.OK, 0)
  t.equal(chargerOpMode.Charging, 3)
})
