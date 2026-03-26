import { z } from "zod"

export const destinationSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  heroTitle: z.string().min(5, "Le titre est requis"),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  opportunities: z.any().optional(),
  visaCategories: z.any().optional(),
  whyChoose: z.any().optional(),
  ctaText: z.string().optional(),
  published: z.boolean().default(false),
  order: z.number().int().default(0),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type DestinationFormData = z.infer<typeof destinationSchema>
