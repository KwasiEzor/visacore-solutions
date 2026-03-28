import assert from "node:assert/strict"
import test from "node:test"

import {
  applicantDocumentStatusLabels,
  checklistItemStatusLabels,
  getProcedureProgress,
  isApplicantRole,
  procedureStatusLabels,
} from "../lib/applicant-portal.shared"

test("applicant portal shared labels cover core procedure states", () => {
  assert.equal(procedureStatusLabels.INTAKE, "Ouverture du dossier")
  assert.equal(checklistItemStatusLabels.NEEDS_REVISION, "Correction demandee")
  assert.equal(applicantDocumentStatusLabels.ACCEPTED, "Valide")
})

test("procedure progress returns stable progress metadata", () => {
  assert.deepEqual(getProcedureProgress("INTAKE"), {
    stepIndex: 0,
    totalSteps: 8,
    percent: 0,
  })

  const submitted = getProcedureProgress("SUBMITTED")
  assert.equal(submitted.stepIndex, 3)
  assert.equal(submitted.totalSteps, 8)
  assert.equal(submitted.percent > 40, true)

  const refused = getProcedureProgress("REFUSED")
  assert.equal(refused.percent, 88)
})

test("applicant role helper isolates portal-only users", () => {
  assert.equal(isApplicantRole("APPLICANT"), true)
  assert.equal(isApplicantRole("ADMIN"), false)
  assert.equal(isApplicantRole(undefined), false)
})
