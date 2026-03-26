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
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = storySchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.successStory.create({ data: parsed.data })
    revalidatePath("/admin/stories")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[CREATE_STORY_ERROR]", error)
    return { success: false, error: "Impossible de créer la story" }
  }
}

export async function updateStory(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = storySchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.successStory.update({ where: { id }, data: parsed.data })
    revalidatePath("/admin/stories")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_STORY_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour la story" }
  }
}

export async function deleteStory(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.successStory.delete({ where: { id } })
    revalidatePath("/admin/stories")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_STORY_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la story" }
  }
}
