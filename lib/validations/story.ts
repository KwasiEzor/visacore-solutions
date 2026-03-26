import { z } from "zod"

export const storySchema = z.object({
  title: z.string().min(3, "Le titre est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  clientName: z.string().min(2, "Le nom est requis"),
  destination: z.string().min(1, "La destination est requise"),
  summary: z.string().optional(),
  content: z.string().optional(),
  images: z.any().optional(),
  published: z.boolean(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export type StoryFormData = z.infer<typeof storySchema>
