const rateMap = new Map<string, { count: number; resetAt: number }>()

const WINDOW_MS = 60 * 60 * 1000 // 1 hour

interface RateLimitConfig {
  maxRequests: number
}

export const PUBLIC_CHAT_LIMIT: RateLimitConfig = { maxRequests: 20 }
export const ADMIN_CHAT_LIMIT: RateLimitConfig = { maxRequests: 50 }

export function checkRateLimit(
  key: string,
  config: RateLimitConfig
): { allowed: boolean; remaining: number; resetAt: number } {
  const now = Date.now()
  const entry = rateMap.get(key)

  if (!entry || now > entry.resetAt) {
    rateMap.set(key, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: config.maxRequests - 1, resetAt: now + WINDOW_MS }
  }

  if (entry.count >= config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt }
  }

  entry.count++
  return { allowed: true, remaining: config.maxRequests - entry.count, resetAt: entry.resetAt }
}
