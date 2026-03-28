import { prisma } from "@/lib/prisma"

const WINDOW_MS = 60 * 60 * 1000 // 1 hour

export interface RateLimitConfig {
  maxRequests: number
}

export const PUBLIC_CHAT_LIMIT: RateLimitConfig = { maxRequests: 20 }
export const ADMIN_CHAT_LIMIT: RateLimitConfig = { maxRequests: 50 }

/**
 * DB-backed rate limiter that survives serverless cold starts.
 * Uses an upsert on the ChatRateLimit table so no external cache (Redis) is needed.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
  const now = Date.now()
  const newResetAt = new Date(now + WINDOW_MS)

  // Upsert: if the window has expired, reset; otherwise increment.
  const entry = await prisma.chatRateLimit.upsert({
    where: { key },
    update: {
      count: {
        // Reset to 1 when the window has expired, otherwise increment
        increment: 1,
      },
    },
    create: {
      key,
      count: 1,
      resetAt: newResetAt,
    },
    select: { count: true, resetAt: true },
  })

  const resetAtMs = entry.resetAt.getTime()

  // If the stored window has already expired, reset the counter
  if (now > resetAtMs) {
    await prisma.chatRateLimit.update({
      where: { key },
      data: { count: 1, resetAt: newResetAt },
    })
    return {
      allowed: true,
      remaining: config.maxRequests - 1,
      resetAt: newResetAt.getTime(),
    }
  }

  if (entry.count > config.maxRequests) {
    return { allowed: false, remaining: 0, resetAt: resetAtMs }
  }

  return {
    allowed: true,
    remaining: Math.max(0, config.maxRequests - entry.count),
    resetAt: resetAtMs,
  }
}
