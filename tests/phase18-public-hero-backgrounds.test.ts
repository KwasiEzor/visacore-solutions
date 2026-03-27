import assert from "node:assert/strict"
import test from "node:test"

import {
  getDestinationHeroBackground,
  getServiceHeroBackground,
  getStaticHeroBackground,
} from "../lib/public-hero-backgrounds"

test("static public hero backgrounds return content-aligned image configs", () => {
  const about = getStaticHeroBackground("about")
  const testimonials = getStaticHeroBackground("testimonials")

  assert.match(about.image, /^https:\/\/images\.unsplash\.com\//)
  assert.equal(about.align, "left")
  assert.equal(testimonials.align, "center")
})

test("service and destination hero backgrounds fall back safely", () => {
  assert.equal(getServiceHeroBackground("permis-travail").align, "center")
  assert.equal(
    getServiceHeroBackground("unknown-service").image,
    getStaticHeroBackground("services").image
  )
  assert.equal(
    getDestinationHeroBackground("unknown-destination").image,
    getStaticHeroBackground("destinations").image
  )
})
