import assert from "node:assert/strict"
import test from "node:test"

import { formatDisplayPhoneNumber } from "../lib/site-config.shared"

test("display phone formatter keeps Togolese numbers readable", () => {
  assert.equal(formatDisplayPhoneNumber("+22890000000"), "+228 90 00 00 00")
  assert.equal(formatDisplayPhoneNumber("22890000000"), "228 90 00 00 00")
})

test("display phone formatter preserves shorter local numbers in pairs", () => {
  assert.equal(formatDisplayPhoneNumber("90000000"), "90 00 00 00")
  assert.equal(formatDisplayPhoneNumber("+12"), "+12")
})
