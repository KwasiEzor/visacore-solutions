export const dataPrivacyRequestTypes = [
  "ACCESS",
  "RECTIFICATION",
  "ERASURE",
  "PORTABILITY",
  "OBJECTION",
  "WITHDRAW_CONSENT",
] as const

export const dataPrivacyRequestStatuses = [
  "RECEIVED",
  "IDENTITY_PENDING",
  "IN_REVIEW",
  "FULFILLED",
  "REJECTED",
] as const

export type DataPrivacyRequestTypeValue =
  (typeof dataPrivacyRequestTypes)[number]
export type DataPrivacyRequestStatusValue =
  (typeof dataPrivacyRequestStatuses)[number]

export const dataPrivacyRequestTypeLabels: Record<
  DataPrivacyRequestTypeValue,
  string
> = {
  ACCESS: "Acces",
  RECTIFICATION: "Rectification",
  ERASURE: "Effacement",
  PORTABILITY: "Portabilite",
  OBJECTION: "Opposition",
  WITHDRAW_CONSENT: "Retrait du consentement",
}

export const dataPrivacyRequestStatusLabels: Record<
  DataPrivacyRequestStatusValue,
  string
> = {
  RECEIVED: "Recue",
  IDENTITY_PENDING: "Verification d'identite",
  IN_REVIEW: "En cours d'analyse",
  FULFILLED: "Traitee",
  REJECTED: "Refusee",
}

export const redactedNamePlaceholder = "Donnees anonymisees"
export const redactedTextPlaceholder = "[Donnees anonymisees sur demande RGPD]"
export const redactedPhonePlaceholder = "00000000"

export function formatDataPrivacyRequestType(type: string) {
  return (
    dataPrivacyRequestTypeLabels[
      type as DataPrivacyRequestTypeValue
    ] ?? type
  )
}

export function formatDataPrivacyRequestStatus(status: string) {
  return (
    dataPrivacyRequestStatusLabels[
      status as DataPrivacyRequestStatusValue
    ] ?? status
  )
}

export function buildRedactedEmail(
  model: "lead" | "contact" | "appointment",
  id: string
) {
  return `erased+${model}.${id}@redacted.local`
}
