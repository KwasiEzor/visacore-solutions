import assert from "node:assert/strict"
import test from "node:test"

import { getBusinessHoursRows } from "../lib/site-config.shared"

test("business hours helper splits pipe-delimited schedule rows", () => {
  assert.deepEqual(
    getBusinessHoursRows("Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00"),
    [
      { label: "Lun - Ven", value: "8h00 - 18h00" },
      { label: "Sam", value: "9h00 - 13h00" },
    ]
  )
})

test("business hours helper falls back for free-form schedule text", () => {
  assert.deepEqual(getBusinessHoursRows("Sur rendez-vous uniquement"), [
    { label: "Horaires", value: "Sur rendez-vous uniquement" },
  ])
})
