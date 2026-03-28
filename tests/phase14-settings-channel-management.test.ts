import assert from "node:assert/strict"
import test from "node:test"

import {
  getWhatsAppHref,
  mapAdminAiSiteConfig,
  mapPublicChatbotSiteConfig,
  mapPublicSiteConfig,
  validateSiteSettingValue,
} from "../lib/site-config.shared"

test("public site config maps WhatsApp controls and prefill message", () => {
  const config = mapPublicSiteConfig([
    { key: "whatsapp_enabled", value: "false" },
    { key: "whatsapp_number", value: "+22890000000" },
    { key: "whatsapp_label", value: "Parler sur WhatsApp" },
    { key: "whatsapp_prefill_message", value: "Bonjour equipe VisaCore" },
  ])

  assert.equal(config.whatsappEnabled, false)
  assert.equal(config.whatsappLabel, "Parler sur WhatsApp")
  assert.equal(config.whatsappPrefillMessage, "Bonjour equipe VisaCore")
  assert.equal(
    getWhatsAppHref(config.whatsappNumber, config.whatsappPrefillMessage),
    "https://wa.me/22890000000?text=Bonjour%20equipe%20VisaCore"
  )
})

test("chatbot config parsing keeps custom rate limits and admin quick actions", () => {
  const publicChatbot = mapPublicChatbotSiteConfig([
    { key: "public_chatbot_enabled", value: "true" },
    { key: "public_chatbot_rate_limit_per_hour", value: "32" },
    { key: "public_chatbot_prompt_addendum", value: "Prioriser les rendez-vous." },
  ])

  const adminAi = mapAdminAiSiteConfig([
    { key: "admin_ai_enabled", value: "true" },
    { key: "admin_ai_quick_actions", value: "Analyser un lead\nRediger un email\nRelancer un prospect" },
    { key: "admin_ai_rate_limit_per_hour", value: "70" },
  ])

  assert.equal(publicChatbot.rateLimitPerHour, 32)
  assert.equal(publicChatbot.promptAddendum, "Prioriser les rendez-vous.")
  assert.deepEqual(adminAi.quickActions, [
    "Analyser un lead",
    "Rediger un email",
    "Relancer un prospect",
  ])
  assert.equal(adminAi.rateLimitPerHour, 70)
})

test("setting validation rejects malformed communication inputs", () => {
  assert.equal(
    validateSiteSettingValue(
      "notification_from_email",
      "not-an-email",
      "TEXT"
    ).valid,
    false
  )
  assert.equal(
    validateSiteSettingValue(
      "public_chatbot_rate_limit_per_hour",
      "0",
      "TEXT"
    ).valid,
    false
  )
  assert.equal(
    validateSiteSettingValue(
      "notification_admin_emails",
      "admin@visacore.com,broken-email",
      "TEXT"
    ).valid,
    false
  )
  assert.equal(
    validateSiteSettingValue(
      "whatsapp_number",
      "+22890000000",
      "TEXT"
    ).valid,
    true
  )
})
