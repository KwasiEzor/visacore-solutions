export interface CaptchaPublicConfig {
  enabled: boolean
  siteKey: string | null
}

function normalizeEnvValue(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

export function getCaptchaPublicConfig(env = process.env): CaptchaPublicConfig {
  const siteKey = normalizeEnvValue(env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)

  return {
    enabled: Boolean(siteKey),
    siteKey,
  }
}
