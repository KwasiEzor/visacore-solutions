import type { ContactSubmissionData } from "@/lib/validations/contact"
import type { LeadSubmissionData } from "@/lib/validations/lead"
import {
  normalizeOptionalSubmissionText,
  normalizeSubmissionEmail,
  normalizeSubmissionPhone,
} from "@/lib/submission-guards.shared"

export function buildLeadCreateData(data: LeadSubmissionData) {
  const normalizedPhone = normalizeSubmissionPhone(data.phone)

  return {
    fullName: data.fullName.trim(),
    email: normalizeSubmissionEmail(data.email),
    phone: normalizedPhone ?? data.phone.trim(),
    country: data.country.trim(),
    destination: data.destination.trim(),
    situation: normalizeOptionalSubmissionText(data.situation),
    serviceNeeded: normalizeOptionalSubmissionText(data.serviceNeeded),
    message: normalizeOptionalSubmissionText(data.message),
    consent: data.consent,
    source: "public-evaluation-form",
  }
}

export function buildContactRequestCreateData(data: ContactSubmissionData) {
  return {
    fullName: data.fullName.trim(),
    email: normalizeSubmissionEmail(data.email),
    phone: normalizeSubmissionPhone(data.phone),
    subject: data.subject.trim(),
    message: data.message.trim(),
  }
}
