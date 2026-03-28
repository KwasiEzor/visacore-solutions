import assert from "node:assert/strict"
import test from "node:test"

import { collectContentIntegrityIssues } from "../lib/content-integrity"
import {
  buildContactRequestCreateData,
  buildLeadCreateData,
} from "../lib/submission-payloads"

test("lead payload builder normalizes comparable fields before persistence", () => {
  assert.deepEqual(
    buildLeadCreateData({
      fullName: "  Ama Mensah  ",
      email: " AMA@example.com ",
      phone: " +228 90 11 22 33 ",
      country: "  Togo ",
      destination: " Canada ",
      situation: "  En activité ",
      serviceNeeded: "  Études  ",
      message: "  Besoin d'un accompagnement  ",
      consent: true,
      website: "",
    }),
    {
      fullName: "Ama Mensah",
      email: "ama@example.com",
      phone: "+228 90 11 22 33",
      country: "Togo",
      destination: "Canada",
      situation: "En activité",
      serviceNeeded: "Études",
      message: "Besoin d'un accompagnement",
      consent: true,
      source: "public-evaluation-form",
    }
  )
})

test("contact payload builder trims message fields and keeps optional phone nullable", () => {
  assert.deepEqual(
    buildContactRequestCreateData({
      fullName: "  Kossi Doe ",
      email: " KOSSI@example.com ",
      phone: "   ",
      subject: "  Demande de rendez-vous ",
      message: "  Bonjour, je souhaite échanger sur mon dossier.  ",
      website: "",
    }),
    {
      fullName: "Kossi Doe",
      email: "kossi@example.com",
      phone: undefined,
      subject: "Demande de rendez-vous",
      message: "Bonjour, je souhaite échanger sur mon dossier.",
    }
  )
})

test("content integrity report flags malformed published content and missing settings", () => {
  const issues = collectContentIntegrityIssues({
    services: [{ slug: "visa-etudes", benefits: [{ title: "" }] }],
    destinations: [
      {
        slug: "canada",
        opportunities: [{ title: "Opportunité", description: "" }],
        visaCategories: [{ name: "" }],
        whyChoose: "not-an-array",
      },
    ],
    settings: [{ key: "site_name" }, { key: "contact_email" }],
  })

  assert.equal(issues.some((issue) => issue.scope === "service"), true)
  assert.equal(
    issues.some((issue) => issue.identifier === "canada:visaCategories"),
    true
  )
  assert.equal(
    issues.some((issue) => issue.identifier === "whatsapp_number"),
    true
  )
})

test("content integrity report passes when structured content and settings are complete", () => {
  const issues = collectContentIntegrityIssues({
    services: [
      {
        slug: "etudes-etranger",
        benefits: [{ title: "Orientation", description: "Analyse du projet" }],
      },
    ],
    destinations: [
      {
        slug: "canada",
        opportunities: [{ title: "Études", description: "Accès aux universités" }],
        visaCategories: [
          { name: "Permis d'études", description: "Séjour académique" },
        ],
        whyChoose: [{ title: "Suivi", description: "Accompagnement continu" }],
      },
    ],
    settings: [
      { key: "site_name" },
      { key: "site_description" },
      { key: "contact_email" },
      { key: "contact_phone" },
      { key: "whatsapp_enabled" },
      { key: "whatsapp_number" },
      { key: "whatsapp_label" },
      { key: "whatsapp_prefill_message" },
      { key: "office_address" },
      { key: "business_hours" },
      { key: "facebook_url" },
      { key: "linkedin_url" },
      { key: "instagram_url" },
    ],
  })

  assert.deepEqual(issues, [])
})
