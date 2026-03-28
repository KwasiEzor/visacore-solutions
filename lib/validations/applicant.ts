import { z } from "zod"
import {
  applicantDocumentStatuses,
  checklistItemStatuses,
  milestoneStatuses,
  procedureStatuses,
} from "@/lib/applicant-portal.shared"

const optionalText = z
  .string()
  .trim()
  .max(2000, "Le texte est trop long")
  .optional()
  .transform((value) => {
    if (!value) return undefined
    return value
  })

export const createApplicantSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis"),
  email: z.string().trim().email("Email invalide"),
  phone: z.string().trim().max(40).optional(),
  countryOfResidence: z.string().trim().max(80).optional(),
  nationality: z.string().trim().max(80).optional(),
  preferredDestination: z.string().trim().max(80).optional(),
  targetService: z.string().trim().max(120).optional(),
  currentSituation: optionalText,
  initialCaseTitle: z.string().trim().min(3, "Le titre de la procedure est requis"),
  destinationCountry: z.string().trim().min(2, "La destination est requise"),
  visaCategory: z.string().trim().min(2, "La categorie de visa est requise"),
  serviceName: z.string().trim().max(120).optional(),
})

export const applicantProfileSchema = z.object({
  name: z.string().trim().min(2, "Le nom est requis"),
  phone: z.string().trim().max(40).optional(),
  whatsappNumber: z.string().trim().max(40).optional(),
  countryOfResidence: z.string().trim().max(80).optional(),
  nationality: z.string().trim().max(80).optional(),
  passportNumber: z.string().trim().max(60).optional(),
  dateOfBirth: z.string().optional(),
  addressLine: z.string().trim().max(160).optional(),
  city: z.string().trim().max(80).optional(),
  postalCode: z.string().trim().max(20).optional(),
  preferredDestination: z.string().trim().max(80).optional(),
  targetService: z.string().trim().max(120).optional(),
  currentSituation: optionalText,
  emergencyContactName: z.string().trim().max(120).optional(),
  emergencyContactPhone: z.string().trim().max(40).optional(),
  marketingConsent: z.boolean().optional().default(false),
})

export const applicantCaseSchema = z.object({
  title: z.string().trim().min(3, "Le titre est requis"),
  serviceName: z.string().trim().max(120).optional(),
  destinationCountry: z.string().trim().min(2, "La destination est requise"),
  visaCategory: z.string().trim().min(2, "La categorie de visa est requise"),
  status: z.enum(procedureStatuses),
  summary: optionalText,
  currentStep: z.string().trim().max(140).optional(),
  nextActionTitle: z.string().trim().max(140).optional(),
  nextActionDescription: optionalText,
  nextActionDueAt: z.string().optional(),
  advisorId: z.string().trim().optional(),
})

export const applicantCaseCreateSchema = applicantCaseSchema.extend({
  status: z.enum(procedureStatuses).default("INTAKE"),
})

export const applicantMilestoneSchema = z.object({
  title: z.string().trim().min(2, "Le titre est requis"),
  description: optionalText,
  status: z.enum(milestoneStatuses).default("PENDING"),
  occurredAt: z.string().optional(),
  visibleToApplicant: z.boolean().optional().default(true),
})

export const applicantChecklistItemSchema = z.object({
  title: z.string().trim().min(2, "Le titre est requis"),
  description: optionalText,
  category: z.string().trim().max(80).optional(),
  status: z.enum(checklistItemStatuses).default("REQUESTED"),
  dueDate: z.string().optional(),
  visibleToApplicant: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).max(999).optional().default(0),
})

export const applicantChecklistItemUpdateSchema =
  applicantChecklistItemSchema.extend({
    status: z.enum(checklistItemStatuses),
  })

export const applicantDocumentReviewSchema = z.object({
  status: z.enum(applicantDocumentStatuses),
  reviewNote: optionalText,
})

export const applicantDeletionRequestSchema = z.object({
  message: optionalText,
})

export type CreateApplicantData = z.infer<typeof createApplicantSchema>
export type ApplicantProfileData = z.infer<typeof applicantProfileSchema>
export type ApplicantCaseData = z.infer<typeof applicantCaseSchema>
export type ApplicantMilestoneData = z.infer<typeof applicantMilestoneSchema>
export type ApplicantChecklistItemData = z.infer<
  typeof applicantChecklistItemSchema
>
