import assert from "node:assert/strict"
import test from "node:test"

import {
  normalizeStructuredCardItemDraft,
  normalizeVisaCategoryDraft,
  prepareStructuredCardItemsForSubmit,
  prepareVisaCategoriesForSubmit,
} from "../lib/structured-content-editor"

test("structured editor drafts always expose at least one editable row", () => {
  assert.deepEqual(normalizeStructuredCardItemDraft(null), [
    { title: "", description: "" },
  ])

  assert.deepEqual(normalizeVisaCategoryDraft(undefined), [
    { name: "", description: "", duration: undefined },
  ])
})

test("structured card items submit helper trims rows and rejects missing titles", () => {
  const valid = prepareStructuredCardItemsForSubmit(
    [
      { title: "  Accompagnement ", description: "  Complet " },
      { title: "", description: "" },
    ],
    "Avantages"
  )

  assert.equal(valid.success, true)
  if (valid.success) {
    assert.deepEqual(valid.value, [
      { title: "Accompagnement", description: "Complet" },
    ])
  }

  const invalid = prepareStructuredCardItemsForSubmit(
    [{ title: "", description: "Description seule" }],
    "Avantages"
  )

  assert.equal(invalid.success, false)
})

test("visa category submit helper trims rows and requires a name", () => {
  const valid = prepareVisaCategoriesForSubmit([
    {
      name: "  Permis d'études ",
      description: "  Séjour académique ",
      duration: " 2 à 4 ans ",
    },
  ])

  assert.equal(valid.success, true)
  if (valid.success) {
    assert.deepEqual(valid.value, [
      {
        name: "Permis d'études",
        description: "Séjour académique",
        duration: "2 à 4 ans",
      },
    ])
  }

  const invalid = prepareVisaCategoriesForSubmit([
    {
      name: "",
      description: "Sans nom",
      duration: undefined,
    },
  ])

  assert.equal(invalid.success, false)
})
