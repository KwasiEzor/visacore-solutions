"use server"

import { prisma } from "@/lib/prisma"
import { faqSchema } from "@/lib/validations/faq"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"

export async function createFAQ(data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "create")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = faqSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.fAQ.create({ data: parsed.data })
    revalidatePath("/admin/faqs")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("[CREATE_FAQ_ERROR]", error)
    return { success: false, error: "Impossible de créer la FAQ" }
  }
}

export async function updateFAQ(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = faqSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.fAQ.update({ where: { id }, data: parsed.data })
    revalidatePath("/admin/faqs")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_FAQ_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour la FAQ" }
  }
}

export async function deleteFAQ(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.fAQ.delete({ where: { id } })
    revalidatePath("/admin/faqs")
    revalidatePath("/faq")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_FAQ_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la FAQ" }
  }
}
