import assert from "node:assert/strict"
import test from "node:test"

import {
  filterAppointmentRows,
  extractValidationMessages,
  filterConversationRows,
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
        phone: "+22890000000",
        subject: "Visa étudiant",
        message: "Je souhaite échanger",
        notes: "Rappeler demain",
        status: "NEW",
        isRead: false,
        createdAtLabel: "1 janv. 2026",
      },
      {
        id: "2",
        fullName: "Koffi Mensah",
        email: "koffi@example.com",
        phone: null,
        subject: "Suivi dossier",
        message: "Merci pour votre retour",
        notes: null,
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

test("appointment table filters include assignment and notes in search", () => {
  const filtered = filterAppointmentRows(
    [
      {
        id: "1",
        fullName: "Ama Mensah",
        email: "ama@example.com",
        phone: "+22890000001",
        serviceType: "Visa Canada",
        destinationType: "Canada",
        preferredDateLabel: "10 janv. 2026",
        preferredTime: "09:00",
        message: "Je veux étudier",
        notes: "Prévoir appel découverte",
        status: "PENDING",
        assignedToId: "u1",
        assignedToName: "Kossi",
        createdAtLabel: "1 janv. 2026",
      },
      {
        id: "2",
        fullName: "Afi Lawson",
        email: "afi@example.com",
        phone: "+22890000002",
        serviceType: "Visa USA",
        destinationType: "USA",
        preferredDateLabel: "11 janv. 2026",
        preferredTime: null,
        message: null,
        notes: null,
        status: "APPROVED",
        assignedToId: null,
        assignedToName: null,
        createdAtLabel: "2 janv. 2026",
      },
    ],
    {
      query: "découverte",
      status: "PENDING",
    }
  )

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.id, "1")
})

test("conversation filters match title preview and session fragments", () => {
  const filtered = filterConversationRows(
    [
      {
        id: "1",
        title: "Visa études Canada",
        sessionId: "abc12345",
        updatedAtLabel: "1 janv. 10:00",
        latestMessagePreview: "Quels documents faut-il préparer ?",
        messageCount: 4,
      },
      {
        id: "2",
        title: "Regroupement familial",
        sessionId: "xyz78900",
        updatedAtLabel: "1 janv. 11:00",
        latestMessagePreview: "Merci pour votre aide",
        messageCount: 6,
      },
    ],
    "abc12345"
  )

  assert.equal(filtered.length, 1)
  assert.equal(filtered[0]?.id, "1")
})
