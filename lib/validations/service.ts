import { z } from "zod"

export const serviceSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  icon: z.string().optional(),
  description: z.string().optional(),
  whoIsItFor: z.string().optional(),
  requiredSupport: z.string().optional(),
  benefits: z.any().optional(),
  ctaText: z.string().optional(),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof serviceSchema>
