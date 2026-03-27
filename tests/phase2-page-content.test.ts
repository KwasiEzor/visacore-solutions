import assert from "node:assert/strict"
import test from "node:test"

import {
  buildAboutPageContent,
  buildHomePageContent,
  getPageContentDraft,
  pageContentDefinitions,
  validatePageContentInput,
} from "../lib/page-content.shared"

test("page content map covers the supported public CMS sections", () => {
  const keys = pageContentDefinitions.map(
    (definition) => `${definition.pageKey}.${definition.sectionKey}`
  )

  assert.deepEqual(keys, [
    "home.hero",
    "home.trust",
    "about.story",
    "about.mission",
    "about.vision",
  ])
})

test("page content validation rejects unsupported sections and invalid stats rows", () => {
  const unsupported = validatePageContentInput({
    pageKey: "contact",
    sectionKey: "hero",
    title: "Contact",
    content: { text: "Test" },
    published: true,
    order: 0,
  })

  assert.equal(unsupported.success, false)
  if (!unsupported.success) {
    assert.equal(unsupported.error, "Section non prise en charge")
  }

  const invalidTrust = validatePageContentInput({
    pageKey: "home",
    sectionKey: "trust",
    title: "Confiance",
    subtitle: "Sous-titre",
    content: {
      stats: [{ value: "", label: "Réussite" }],
    },
    published: true,
    order: 1,
  })

  assert.equal(invalidTrust.success, false)
  if (!invalidTrust.success) {
    assert.equal(
      invalidTrust.details["stats.0.value"]?.[0],
      "La valeur du chiffre est requise"
    )
  }
})

test("page content validation normalizes hero defaults for the admin editor", () => {
  const draft = getPageContentDraft("home", "hero", {
    primaryCta: "Commencer",
    secondaryCta: "Nous contacter",
  })

  assert.deepEqual(draft, {
    eyebrow: "Expertise Mondiale • Service Local",
    primaryCta: "Commencer",
    secondaryCta: "Nous contacter",
  })
})

test("home and about public content builders prefer published records and keep fallbacks", () => {
  const home = buildHomePageContent([
    {
      pageKey: "home",
      sectionKey: "hero",
      title: "Titre hero CMS",
      subtitle: "Sous-titre CMS",
      content: {
        eyebrow: "Badge CMS",
        primaryCta: "CTA primaire",
        secondaryCta: "CTA secondaire",
      },
      published: true,
      order: 1,
    },
  ])

  assert.equal(home.hero.title, "Titre hero CMS")
  assert.equal(home.hero.content.eyebrow, "Badge CMS")
  assert.equal(home.trust.title, "Pourquoi nous faire confiance")
  assert.equal(home.trust.content.stats.length, 3)

  const about = buildAboutPageContent([
    {
      pageKey: "about",
      sectionKey: "mission",
      title: "Mission CMS",
      subtitle: null,
      content: { text: "Mission mise à jour" },
      published: true,
      order: 1,
    },
    {
      pageKey: "about",
      sectionKey: "vision",
      title: "Vision désactivée",
      subtitle: null,
      content: { text: "Ne doit pas s'afficher" },
      published: false,
      order: 2,
    },
  ])

  assert.equal(about.mission.title, "Mission CMS")
  assert.equal(about.mission.content.text, "Mission mise à jour")
  assert.equal(about.story.title, "Née d'une Conviction")
  assert.equal(about.vision.title, "Notre Vision")
  assert.match(about.vision.content.text, /partenaire de référence/i)
})
