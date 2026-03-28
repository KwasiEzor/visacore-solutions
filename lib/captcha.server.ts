import { randomUUID } from "node:crypto"
import { headers } from "next/headers"

export interface CaptchaVerificationResult {
  success: boolean
  bypassed: boolean
  errorCodes: string[]
}

interface CaptchaServerConfig {
  enabled: boolean
  secretKey: string | null
  siteKey: string | null
}

interface VerifyCaptchaTokenOptions {
  token?: string | null
  remoteIp?: string | null
  expectedAction?: string
  env?: NodeJS.ProcessEnv
  fetchImpl?: typeof fetch
}

interface CaptchaFailureAuditOptions {
  channel: "lead" | "contact" | "appointment"
  errorCodes: string[]
}

function normalizeEnvValue(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function getCaptchaServerConfig(
  env = process.env
): CaptchaServerConfig {
  const siteKey = normalizeEnvValue(
    env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? env.TURNSTILE_SITE_KEY
  )
  const secretKey = normalizeEnvValue(env.TURNSTILE_SECRET_KEY)

  return {
    enabled: Boolean(siteKey && secretKey),
    siteKey,
    secretKey,
  }
}

export function getRemoteIpFromHeaders(headersLike: Pick<Headers, "get">) {
  const xForwardedFor = headersLike.get("x-forwarded-for")
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0]?.trim() || null
  }

  return (
    headersLike.get("cf-connecting-ip") ??
    headersLike.get("x-real-ip") ??
    null
  )
}

export async function verifyCaptchaToken({
  token,
  remoteIp,
  expectedAction,
  env = process.env,
  fetchImpl = fetch,
}: VerifyCaptchaTokenOptions): Promise<CaptchaVerificationResult> {
  const config = getCaptchaServerConfig(env)
  if (!config.enabled || !config.secretKey) {
    return {
      success: true,
      bypassed: true,
      errorCodes: [],
    }
  }

  if (!token?.trim()) {
    return {
      success: false,
      bypassed: false,
      errorCodes: ["missing-input-response"],
    }
  }

  const formData = new FormData()
  formData.append("secret", config.secretKey)
  formData.append("response", token.trim())
  formData.append("idempotency_key", randomUUID())

  if (remoteIp) {
    formData.append("remoteip", remoteIp)
  }

  try {
    const response = await fetchImpl(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        body: formData,
      }
    )

    if (!response.ok) {
      return {
        success: false,
        bypassed: false,
        errorCodes: ["turnstile-unreachable"],
      }
    }

    const result = (await response.json()) as {
      success?: boolean
      action?: string
      "error-codes"?: string[]
    }

    if (!result.success) {
      return {
        success: false,
        bypassed: false,
        errorCodes: result["error-codes"] ?? ["turnstile-rejected"],
      }
    }

    if (expectedAction && result.action !== expectedAction) {
      return {
        success: false,
        bypassed: false,
        errorCodes: ["action-mismatch"],
      }
    }

    return {
      success: true,
      bypassed: false,
      errorCodes: [],
    }
  } catch {
    return {
      success: false,
      bypassed: false,
      errorCodes: ["turnstile-unreachable"],
    }
  }
}

export async function verifyCaptchaTokenForRequest(
  options: Omit<VerifyCaptchaTokenOptions, "remoteIp">
) {
  try {
    const requestHeaders = await headers()

    return verifyCaptchaToken({
      ...options,
      remoteIp: getRemoteIpFromHeaders(requestHeaders),
    })
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes("outside a request scope")
    ) {
      return {
        success: true,
        bypassed: true,
        errorCodes: [],
      }
    }

    throw error
  }
}

export function logCaptchaFailureEvent({
  channel,
  errorCodes,
}: CaptchaFailureAuditOptions) {
  console.warn(
    "[CAPTCHA_VERIFY_FAILED]",
    JSON.stringify({
      scope: "captcha",
      channel,
      errorCodes,
      happenedAt: new Date().toISOString(),
    })
  )
}
