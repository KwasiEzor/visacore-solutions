import { z } from "zod"

export const faqCategorySchema = z.enum([
  "GENERAL",
  "CANADA",
  "USA",
  "EUROPE",
  "DOCUMENTATION",
  "PROCESS",
])

export const faqSchema = z.object({
  question: z.string().min(5, "La question est requise"),
  answer: z.string().min(10, "La réponse est requise"),
  category: faqCategorySchema.default("GENERAL"),
  destinationId: z.string().optional().nullable(),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
})

export type FAQFormData = z.infer<typeof faqSchema>
