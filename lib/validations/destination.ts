import { z } from "zod"
import {
  structuredCardItemsInputSchema,
  visaCategoriesInputSchema,
} from "@/lib/content-structures"

export const destinationFormSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  heroTitle: z.string().min(5, "Le titre est requis"),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  opportunities: z.string().optional(),
  visaCategories: z.string().optional(),
  whyChoose: z.string().optional(),
  ctaText: z.string().optional(),
  published: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const destinationMutationSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  heroTitle: z.string().min(5, "Le titre est requis"),
  heroDescription: z.string().optional(),
  heroImage: z.string().optional(),
  opportunities: structuredCardItemsInputSchema
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  visaCategories: visaCategoriesInputSchema
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  whyChoose: structuredCardItemsInputSchema
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  ctaText: z.string().optional(),
  published: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type DestinationFormData = z.infer<typeof destinationFormSchema>
export type DestinationMutationData = z.infer<typeof destinationMutationSchema>
