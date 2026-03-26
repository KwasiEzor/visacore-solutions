import { z } from "zod"

export const testimonialSchema = z.object({
  clientName: z.string().min(2, "Le nom est requis"),
  clientImage: z.string().optional(),
  destination: z.string().optional(),
  destinationId: z.string().optional().nullable(),
  content: z.string().min(10, "Le contenu est requis"),
  rating: z.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
})

export type TestimonialFormData = z.infer<typeof testimonialSchema>
