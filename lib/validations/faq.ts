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
  category: faqCategorySchema,
  destinationId: z.string().optional().nullable(),
  published: z.boolean(),
  order: z.number().int(),
})

export type FAQFormData = z.infer<typeof faqSchema>
