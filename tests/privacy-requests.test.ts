import assert from "node:assert/strict"
import test from "node:test"

import {
  filterPrivacyRequestRows,
  type PrivacyRequestTableRow,
} from "../lib/admin-ux.shared"
import {
  buildRedactedEmail,
  formatDataPrivacyRequestStatus,
  formatDataPrivacyRequestType,
} from "../lib/privacy-requests.shared"

test("privacy request helpers expose stable labels and redacted emails", () => {
  assert.equal(formatDataPrivacyRequestType("ERASURE"), "Effacement")
  assert.equal(
    formatDataPrivacyRequestStatus("IDENTITY_PENDING"),
    "Verification d'identite"
  )
  assert.equal(
    buildRedactedEmail("lead", "abc123"),
    "erased+lead.abc123@redacted.local"
  )
})

test("privacy request table filters combine query, type, and status", () => {
  const rows: PrivacyRequestTableRow[] = [
    {
      id: "req-1",
      fullName: "Ama Mensah",
      email: "ama@example.com",
      phone: "+228 90 11 22 33",
      requestType: "ACCESS",
      status: "RECEIVED",
      resolutionNotes: null,
      createdAtLabel: "28 mars 2026",
    },
    {
      id: "req-2",
      fullName: "Kossi Doe",
      email: "kossi@example.com",
      phone: null,
      requestType: "ERASURE",
      status: "FULFILLED",
      resolutionNotes: "Anonymisation executee",
      createdAtLabel: "27 mars 2026",
    },
  ]

  assert.deepEqual(
    filterPrivacyRequestRows(rows, {
      query: "kossi",
      requestType: "ERASURE",
      status: "FULFILLED",
    }).map((row) => row.id),
    ["req-2"]
  )

  assert.deepEqual(
    filterPrivacyRequestRows(rows, {
      query: "",
      requestType: "ACCESS",
      status: "ALL",
    }).map((row) => row.id),
    ["req-1"]
  )
})
