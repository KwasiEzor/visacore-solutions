import { z } from "zod"
import {
  dataPrivacyRequestStatuses,
  dataPrivacyRequestTypes,
} from "@/lib/privacy-requests.shared"

export const dataPrivacyRequestSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  requestType: z.enum(dataPrivacyRequestTypes, {
    error: "Veuillez selectionner un type de demande valide",
  }),
  message: z
    .string()
    .max(2000, "Le message ne peut pas depasser 2000 caracteres")
    .optional(),
})

export type DataPrivacyRequestFormData = z.infer<
  typeof dataPrivacyRequestSchema
>

export const dataPrivacyRequestSubmissionSchema =
  dataPrivacyRequestSchema.extend({
    website: z.string().optional(),
    captchaToken: z.string().optional(),
  })

export type DataPrivacyRequestSubmissionData = z.infer<
  typeof dataPrivacyRequestSubmissionSchema
>

export const dataPrivacyRequestStatusSchema = z.enum(
  dataPrivacyRequestStatuses
)

export const dataPrivacyRequestAdminUpdateSchema = z.object({
  status: dataPrivacyRequestStatusSchema,
  resolutionNotes: z
    .string()
    .max(4000, "Les notes internes ne peuvent pas depasser 4000 caracteres")
    .optional(),
})

export type DataPrivacyRequestAdminUpdateData = z.infer<
  typeof dataPrivacyRequestAdminUpdateSchema
>
