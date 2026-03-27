import { z } from "zod"
import { structuredCardItemsInputSchema } from "@/lib/content-structures"

export const serviceFormSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  icon: z.string().optional(),
  description: z.string().optional(),
  whoIsItFor: z.string().optional(),
  requiredSupport: z.string().optional(),
  benefits: z.string().optional(),
  ctaText: z.string().optional(),
  published: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export const serviceMutationSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  icon: z.string().optional(),
  description: z.string().optional(),
  whoIsItFor: z.string().optional(),
  requiredSupport: z.string().optional(),
  benefits: structuredCardItemsInputSchema
    .nullable()
    .optional()
    .transform((value) => value ?? null),
  ctaText: z.string().optional(),
  published: z.boolean(),
  order: z.number().int(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type ServiceFormData = z.infer<typeof serviceFormSchema>
export type ServiceMutationData = z.infer<typeof serviceMutationSchema>
