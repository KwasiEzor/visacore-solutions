import { z } from "zod"

export const contactSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  subject: z.string().min(3, "Le sujet est requis"),
  message: z.string().min(10, "Le message doit contenir au moins 10 caractères"),
})

export type ContactFormData = z.infer<typeof contactSchema>

export const contactSubmissionSchema = contactSchema.extend({
  website: z.string().optional(),
})

export type ContactSubmissionData = z.infer<typeof contactSubmissionSchema>
