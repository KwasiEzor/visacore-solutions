import assert from "node:assert/strict"
import test from "node:test"

import { destinationMutationSchema } from "../lib/validations/destination"
import { serviceMutationSchema } from "../lib/validations/service"
import { hasPermission } from "../lib/rbac"
import {
  getTelHref,
  getWhatsAppHref,
  mapPublicSiteConfig,
} from "../lib/site-config.shared"

test("destination mutation schema normalizes legacy arrays into structured objects", () => {
  const parsed = destinationMutationSchema.parse({
    name: "Canada",
    slug: "canada",
    heroTitle: "Immigrer au Canada",
    heroDescription: "Description",
    heroImage: "",
    opportunities: ["Entrée Express"],
    visaCategories: ["Permis d'études"],
    whyChoose: ["Qualité de vie"],
    ctaText: "Évaluer mon profil",
    published: true,
    order: 1,
    seoTitle: "SEO title",
    seoDescription: "SEO description",
  })

  assert.deepEqual(parsed.opportunities, [
    { title: "Entrée Express", description: "" },
  ])
  assert.deepEqual(parsed.visaCategories, [
    { name: "Permis d'études", description: "" },
  ])
  assert.deepEqual(parsed.whyChoose, [
    { title: "Qualité de vie", description: "" },
  ])
})

test("service mutation schema normalizes benefits and rejects empty structured titles", () => {
  const parsed = serviceMutationSchema.parse({
    name: "Permis de travail",
    slug: "permis-travail",
    icon: "Briefcase",
    description: "Description",
    whoIsItFor: "Professionnels",
    requiredSupport: "CV",
    benefits: ["Analyse du profil"],
    ctaText: "Commencer",
    published: true,
    order: 2,
    seoTitle: "SEO",
    seoDescription: "SEO description",
  })

  assert.deepEqual(parsed.benefits, [
    { title: "Analyse du profil", description: "" },
  ])

  const invalid = serviceMutationSchema.safeParse({
    ...parsed,
    benefits: [{ title: "   ", description: "Vide" }],
  })

  assert.equal(invalid.success, false)
})

test("public site config mapping uses canonical keys and safe fallbacks", () => {
  const config = mapPublicSiteConfig([
    { key: "contact_email", value: "hello@example.com" },
    { key: "contact_phone", value: "+228 91 11 22 33" },
    { key: "facebook_url", value: "https://facebook.com/example" },
  ])

  assert.equal(config.contactEmail, "hello@example.com")
  assert.equal(config.contactPhone, "+228 91 11 22 33")
  assert.equal(config.facebookUrl, "https://facebook.com/example")
  assert.equal(config.instagramUrl, "")
  assert.equal(getTelHref(config.contactPhone), "tel:+22891112233")
  assert.equal(getWhatsAppHref(config.contactPhone), "https://wa.me/22891112233")
})

test("settings permissions remain super-admin only", () => {
  assert.equal(hasPermission("SUPER_ADMIN", "manage_settings"), true)
  assert.equal(hasPermission("ADMIN", "manage_settings"), false)
  assert.equal(hasPermission("EDITOR", "manage_settings"), false)
})
