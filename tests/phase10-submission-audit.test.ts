import assert from "node:assert/strict"
import test from "node:test"

import { buildSubmissionGuardAuditEvent } from "../lib/submission-guards.shared"

test("submission guard audit event redacts comparable identifiers", () => {
  const event = buildSubmissionGuardAuditEvent({
    channel: "lead",
    status: "rate_limited",
    email: "Client.Example@VisaCore.com",
    phone: "+228 90 12 34 56",
    duplicateCount: 1,
    rateLimitCount: 3,
  })

  assert.equal(event.scope, "submission_guard")
  assert.equal(event.channel, "lead")
  assert.equal(event.status, "rate_limited")
  assert.equal(event.email, "cl***@visacore.com")
  assert.equal(event.phone, "***3456")
  assert.equal(event.duplicateCount, 1)
  assert.equal(event.rateLimitCount, 3)
  assert.match(event.happenedAt, /^\d{4}-\d{2}-\d{2}T/)
})

test("submission guard audit event trims subjects and omits empty fields", () => {
  const event = buildSubmissionGuardAuditEvent({
    channel: "contact",
    status: "duplicate",
    subject: "  Besoin d'aide pour mon dossier de visa de travail  ",
  })

  assert.equal(event.email, undefined)
  assert.equal(event.phone, undefined)
  assert.equal(event.subject, "Besoin d'aide pour mon dossier de visa de travail")
})
