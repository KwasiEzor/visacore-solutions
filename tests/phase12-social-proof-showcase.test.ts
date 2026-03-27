import assert from "node:assert/strict"
import test from "node:test"

import {
  buildStoryExcerpt,
  buildStoryReadTime,
  buildTestimonialExcerpt,
  wrapCarouselIndex,
} from "../lib/social-proof-showcase.shared"

test("carousel index helper wraps both forward and backward positions", () => {
  assert.equal(wrapCarouselIndex(0, 5), 0)
  assert.equal(wrapCarouselIndex(6, 5), 1)
  assert.equal(wrapCarouselIndex(-1, 5), 4)
  assert.equal(wrapCarouselIndex(10, 0), 0)
})

test("story excerpt helper prefers summary and truncates long copy", () => {
  assert.equal(
    buildStoryExcerpt("Résumé court", "Contenu long"),
    "Résumé court"
  )

  const excerpt = buildStoryExcerpt(
    null,
    "A".repeat(220),
    60
  )

  assert.equal(excerpt.length, 61)
  assert.ok(excerpt.endsWith("…"))
})

test("story read time helper never drops below one minute", () => {
  assert.equal(buildStoryReadTime("Texte bref"), "1 min")
  assert.equal(buildStoryReadTime("mot ".repeat(480)), "3 min")
})

test("testimonial excerpt helper trims long quotes without breaking short ones", () => {
  assert.equal(buildTestimonialExcerpt("Parcours clair"), "Parcours clair")

  const excerpt = buildTestimonialExcerpt("B".repeat(320), 90)

  assert.equal(excerpt.length, 91)
  assert.ok(excerpt.endsWith("…"))
})
