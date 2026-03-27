import { z } from "zod"

export const leadSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  country: z.string().min(2, "Le pays est requis"),
  destination: z.string().min(1, "La destination est requise"),
  situation: z.string().optional(),
  serviceNeeded: z.string().optional(),
  message: z.string().optional(),
  consent: z.boolean().refine((val) => val === true, {
    message: "Vous devez accepter les conditions",
  }),
})

export type LeadFormData = z.infer<typeof leadSchema>

export const leadSubmissionSchema = leadSchema.extend({
  website: z.string().optional(),
  captchaToken: z.string().optional(),
})

export type LeadSubmissionData = z.infer<typeof leadSubmissionSchema>

export const leadStatusSchema = z.enum([
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "IN_PROGRESS",
  "CONVERTED",
  "CLOSED",
])
