export const duplicateSubmissionWindowMs = 10 * 60 * 1000
export const rateLimitWindowMs = 60 * 60 * 1000
export const maxSubmissionsPerRateWindow = 3

export type SubmissionGuardStatus =
  | "accepted"
  | "duplicate"
  | "rate_limited"
  | "filtered"

export type SubmissionGuardAuditedStatus = Exclude<
  SubmissionGuardStatus,
  "accepted"
>

export type SubmissionGuardChannel =
  | "lead"
  | "contact"
  | "appointment"
  | "privacy_request"

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

function maskSubmissionEmail(value?: string | null) {
  const normalized = normalizeOptionalSubmissionText(value)?.toLowerCase()
  if (!normalized) {
    return undefined
  }

  const [localPart, domainPart] = normalized.split("@")
  if (!localPart || !domainPart) {
    return "***"
  }

  const visibleLocalPart = localPart.slice(0, 2)
  return `${visibleLocalPart || "*"}***@${domainPart}`
}

function maskSubmissionPhone(value?: string | null) {
  const normalized = normalizeSubmissionPhone(value)
  if (!normalized) {
    return undefined
  }

  const digitsOnly = normalized.replace(/\D/g, "")
  if (digitsOnly.length <= 4) {
    return "***"
  }

  return `***${digitsOnly.slice(-4)}`
}

interface SubmissionGuardAuditOptions {
  channel: SubmissionGuardChannel
  status: SubmissionGuardStatus
  email?: string | null
  phone?: string | null
  subject?: string | null
  duplicateCount?: number
  rateLimitCount?: number
}

export function buildSubmissionGuardAuditEvent({
  channel,
  status,
  email,
  phone,
  subject,
  duplicateCount,
  rateLimitCount,
}: SubmissionGuardAuditOptions) {
  const trimmedSubject = normalizeOptionalSubmissionText(subject)

  return {
    scope: "submission_guard",
    channel,
    status,
    email: maskSubmissionEmail(email),
    phone: maskSubmissionPhone(phone),
    subject: trimmedSubject?.slice(0, 80),
    duplicateCount,
    rateLimitCount,
    happenedAt: new Date().toISOString(),
  }
}

export function logSubmissionGuardEvent(options: SubmissionGuardAuditOptions) {
  if (options.status === "accepted") {
    return
  }

  console.warn(
    "[SUBMISSION_GUARD]",
    JSON.stringify(buildSubmissionGuardAuditEvent(options))
  )
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
