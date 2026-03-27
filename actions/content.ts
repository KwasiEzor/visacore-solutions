"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { Prisma } from "@/lib/generated/prisma/client"
import {
  getPageContentDefinition,
  validatePageContentInput,
} from "@/lib/page-content.shared"

export async function upsertPageContent(data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = validatePageContentInput(data)
    if (!parsed.success) {
      return {
        success: false,
        error: parsed.error,
        details: parsed.details,
      }
    }

    const definition = getPageContentDefinition(
      parsed.data.pageKey,
      parsed.data.sectionKey
    )

    if (!definition) {
      return {
        success: false,
        error: "Section non prise en charge",
      }
    }

    await prisma.pageContent.upsert({
      where: {
        pageKey_sectionKey: {
          pageKey: parsed.data.pageKey,
          sectionKey: parsed.data.sectionKey,
        },
      },
      update: {
        ...parsed.data,
        content: parsed.data.content as Prisma.InputJsonValue,
      },
      create: {
        ...parsed.data,
        content: parsed.data.content as Prisma.InputJsonValue,
      },
    })
    revalidatePath(definition.route)
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
