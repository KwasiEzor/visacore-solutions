export const duplicateSubmissionWindowMs = 10 * 60 * 1000
export const rateLimitWindowMs = 60 * 60 * 1000
export const maxSubmissionsPerRateWindow = 3

export type SubmissionGuardStatus =
  | "accepted"
  | "duplicate"
  | "rate_limited"
  | "filtered"

interface SubmissionGuardOptions {
  honeypotValue?: string | null
  duplicateCount: number
  rateLimitCount: number
  duplicateMessage: string
  rateLimitedMessage: string
  filteredMessage: string
}

export function normalizeSubmissionEmail(value: string) {
  return value.trim().toLowerCase()
}

export function normalizeSubmissionPhone(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed.replace(/\s+/g, " ") : undefined
}

export function normalizeOptionalSubmissionText(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

export function evaluateSubmissionGuard({
  honeypotValue,
  duplicateCount,
  rateLimitCount,
  duplicateMessage,
  rateLimitedMessage,
  filteredMessage,
}: SubmissionGuardOptions) {
  if (honeypotValue?.trim()) {
    return {
      status: "filtered" as const,
      success: true,
      shouldPersist: false,
      message: filteredMessage,
    }
  }

  if (duplicateCount > 0) {
    return {
      status: "duplicate" as const,
      success: true,
      shouldPersist: false,
      message: duplicateMessage,
    }
  }

  if (rateLimitCount >= maxSubmissionsPerRateWindow) {
    return {
      status: "rate_limited" as const,
      success: false,
      shouldPersist: false,
      message: rateLimitedMessage,
    }
  }

  return {
    status: "accepted" as const,
    success: true,
    shouldPersist: true,
    message: "",
  }
}
