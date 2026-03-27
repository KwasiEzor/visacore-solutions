import assert from "node:assert/strict"
import test from "node:test"

import {
  extractValidationMessages,
  filterContactRows,
  filterLeadRows,
  parseOptionalJsonField,
} from "../lib/admin-ux.shared"

test("json admin helper accepts empty values and rejects invalid payloads", () => {
  assert.deepEqual(parseOptionalJsonField("Images", ""), {
    success: true,
    value: null,
  })

  const valid = parseOptionalJsonField("Images", '["a", "b"]')
  assert.equal(valid.success, true)
  if (valid.success) {
    assert.deepEqual(valid.value, ["a", "b"])
  }

  const invalid = parseOptionalJsonField("Images", "[invalid")
  assert.equal(invalid.success, false)
})

test("validation summary helper extracts unique nested messages", () => {
  assert.deepEqual(
    extractValidationMessages({
      name: { message: "Le nom est requis" },
      nested: {
        slug: { message: "Le slug est requis" },
      },
      duplicate: [{ message: "Le nom est requis" }],
    }),
    ["Le nom est requis", "Le slug est requis"]
  )
})

test("lead table filters apply both query and status constraints", () => {
  const filtered = filterLeadRows(
    [
      {
        id: "1",
        fullName: "Ama Mensah",
        email: "ama@example.com",
        destination: "Canada",
        status: "NEW",
        assignedToName: "Kossi",
        createdAtLabel: "1 janv. 2026",
      },
      {
        id: "2",
        fullName: "Kossi Doe",
        email: "kossi@example.com",
        destination: "France",
        status: "CONTACTED",
        assignedToName: null,
        createdAtLabel: "2 janv. 2026",
      },
    ],
    {
      query: "ama",
      status: "NEW",
    }
  )

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.id, "1")
})

test("contact table filters support query, status, and read state", () => {
  const filtered = filterContactRows(
    [
      {
        id: "1",
        fullName: "Afi Lawson",
        email: "afi@example.com",
        subject: "Visa étudiant",
        message: "Je souhaite échanger",
        status: "NEW",
        isRead: false,
        createdAtLabel: "1 janv. 2026",
      },
      {
        id: "2",
        fullName: "Koffi Mensah",
        email: "koffi@example.com",
        subject: "Suivi dossier",
        message: "Merci pour votre retour",
        status: "REPLIED",
        isRead: true,
        createdAtLabel: "2 janv. 2026",
      },
    ],
    {
      query: "dossier",
      status: "REPLIED",
      readState: "READ",
    }
  )

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.id, "2")
})
