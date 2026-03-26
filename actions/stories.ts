"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { z } from "zod"

const storySchema = z.object({
  title: z.string().min(3, "Le titre est requis"),
  slug: z.string().min(2, "Le slug est requis"),
  clientName: z.string().min(2, "Le nom est requis"),
  destination: z.string().min(1, "La destination est requise"),
  summary: z.string().optional(),
  content: z.string().optional(),
  images: z.any().optional(),
  published: z.boolean().default(false),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
})

export async function createStory(data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = storySchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.successStory.create({ data: parsed.data })
  revalidatePath("/admin/stories")
  revalidatePath("/temoignages")
  return { success: true }
}

export async function updateStory(id: string, data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = storySchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.successStory.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/stories")
  revalidatePath("/temoignages")
  return { success: true }
}

export async function deleteStory(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.successStory.delete({ where: { id } })
  revalidatePath("/admin/stories")
  revalidatePath("/temoignages")
  return { success: true }
}
