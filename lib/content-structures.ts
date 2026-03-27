import { z } from "zod"

const nonEmptyStringSchema = z.string().trim().min(1)

const cardItemSchema = z.object({
  title: nonEmptyStringSchema,
  description: z.string().trim().default(""),
})

const legacyCardItemSchema = z.array(nonEmptyStringSchema)

function normalizeCardItems(
  value: string[] | Array<{ title: string; description?: string }>
) {
  return value.map((item) =>
    typeof item === "string"
      ? {
          title: item,
          description: "",
        }
      : {
          title: item.title.trim(),
          description: item.description?.trim() ?? "",
        }
  )
}

const visaCategoryItemSchema = z.object({
  name: nonEmptyStringSchema,
  description: z.string().trim().default(""),
  duration: z.string().trim().optional(),
})

function normalizeVisaCategories(
  value: string[] | Array<{ name: string; description?: string; duration?: string }>
) {
  return value.map((item) =>
    typeof item === "string"
      ? {
          name: item,
          description: "",
        }
      : {
          name: item.name.trim(),
          description: item.description?.trim() ?? "",
          duration: item.duration?.trim() || undefined,
        }
  )
}

export const structuredCardItemsInputSchema = z
  .union([legacyCardItemSchema, z.array(cardItemSchema)])
  .transform(normalizeCardItems)

export const visaCategoriesInputSchema = z
  .union([legacyCardItemSchema, z.array(visaCategoryItemSchema)])
  .transform(normalizeVisaCategories)

export type StructuredCardItem = z.output<typeof structuredCardItemsInputSchema>[number]
export type VisaCategoryItem = z.output<typeof visaCategoriesInputSchema>[number]

export function normalizeStructuredCardItems(value: unknown): StructuredCardItem[] {
  const parsed = structuredCardItemsInputSchema.safeParse(value)
  return parsed.success ? parsed.data : []
}

export function normalizeVisaCategoryItems(value: unknown): VisaCategoryItem[] {
  const parsed = visaCategoriesInputSchema.safeParse(value)
  return parsed.success ? parsed.data : []
}
