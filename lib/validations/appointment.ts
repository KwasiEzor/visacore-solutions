import { z } from "zod"

export const appointmentSchema = z.object({
  fullName: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(8, "Numéro de téléphone invalide"),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  serviceType: z.string().optional(),
  destinationType: z.string().optional(),
  message: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>

export const appointmentStatusSchema = z.enum([
  "PENDING",
  "APPROVED",
  "CANCELLED",
  "COMPLETED",
])
