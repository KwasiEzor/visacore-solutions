"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { z } from "zod"

const pageContentSchema = z.object({
  pageKey: z.string().min(1),
  sectionKey: z.string().min(1),
  title: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.any().optional(),
  published: z.boolean().default(true),
  order: z.number().int().default(0),
})

export async function upsertPageContent(data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = pageContentSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.pageContent.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: parsed.data.pageKey,
          sectionKey: parsed.data.sectionKey,
        },
      },
      update: parsed.data,
      create: parsed.data,
    })
    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error) {
    console.error("[UPSERT_CONTENT_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le contenu" }
  }
}

export async function deletePageContent(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.pageContent.delete({ where: { id } })
    revalidatePath("/")
    revalidatePath("/admin/content")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_CONTENT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le contenu" }
  }
}
