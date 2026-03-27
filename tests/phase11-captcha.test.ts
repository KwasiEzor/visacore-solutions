import assert from "node:assert/strict"
import test from "node:test"

import { getCaptchaPublicConfig } from "../lib/captcha.shared"
import {
  getCaptchaServerConfig,
  getRemoteIpFromHeaders,
  verifyCaptchaToken,
} from "../lib/captcha.server"

test("captcha config stays disabled until both public and secret keys exist", () => {
  assert.deepEqual(
    getCaptchaPublicConfig({ NEXT_PUBLIC_TURNSTILE_SITE_KEY: "" }),
    {
      enabled: false,
      siteKey: null,
    }
  )

  assert.deepEqual(
    getCaptchaServerConfig({
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "",
    }),
    {
      enabled: false,
      siteKey: "site-key",
      secretKey: null,
    }
  )

  assert.deepEqual(
    getCaptchaServerConfig({
      TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "secret-key",
    }),
    {
      enabled: true,
      siteKey: "site-key",
      secretKey: "secret-key",
    }
  )
})

test("captcha helper extracts the first forwarded IP address", () => {
  const headers = new Headers({
    "x-forwarded-for": "203.0.113.10, 198.51.100.7",
  })

  assert.equal(getRemoteIpFromHeaders(headers), "203.0.113.10")
  assert.equal(getRemoteIpFromHeaders(new Headers()), null)
})

test("captcha verification bypasses when Turnstile is not configured", async () => {
  const result = await verifyCaptchaToken({
    token: "",
    env: {},
  })

  assert.equal(result.success, true)
  assert.equal(result.bypassed, true)
  assert.deepEqual(result.errorCodes, [])
})

test("captcha verification posts to Turnstile and validates the expected action", async () => {
  let requestBody: FormData | null = null
  const fetchImpl: typeof fetch = async (_url, init) => {
    requestBody = init?.body as FormData

    return new Response(
      JSON.stringify({
        success: true,
        action: "contact_form",
      }),
      {
        status: 200,
        headers: { "content-type": "application/json" },
      }
    )
  }

  const result = await verifyCaptchaToken({
    token: "captcha-token",
    remoteIp: "203.0.113.10",
    expectedAction: "contact_form",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "secret-key",
    },
    fetchImpl,
  })

  assert.equal(result.success, true)
  assert.equal(result.bypassed, false)
  assert.equal(requestBody?.get("secret"), "secret-key")
  assert.equal(requestBody?.get("response"), "captcha-token")
  assert.equal(requestBody?.get("remoteip"), "203.0.113.10")
  assert.ok(requestBody?.get("idempotency_key"))
})

test("captcha verification rejects missing tokens and action mismatches", async () => {
  const missingTokenResult = await verifyCaptchaToken({
    token: "",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "secret-key",
    },
  })

  assert.equal(missingTokenResult.success, false)
  assert.deepEqual(missingTokenResult.errorCodes, ["missing-input-response"])

  const actionMismatchResult = await verifyCaptchaToken({
    token: "captcha-token",
    expectedAction: "lead_form",
    env: {
      NEXT_PUBLIC_TURNSTILE_SITE_KEY: "site-key",
      TURNSTILE_SECRET_KEY: "secret-key",
    },
    fetchImpl: async () =>
      new Response(
        JSON.stringify({
          success: true,
          action: "contact_form",
        }),
        {
          status: 200,
          headers: { "content-type": "application/json" },
        }
      ),
  })

  assert.equal(actionMismatchResult.success, false)
  assert.deepEqual(actionMismatchResult.errorCodes, ["action-mismatch"])
})
