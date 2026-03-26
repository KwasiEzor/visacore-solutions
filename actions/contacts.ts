"use server"

import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations/contact"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createContactRequest(data: unknown) {
  try {
    const parsed = contactSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.contactRequest.create({ data: parsed.data })
    return { success: true }
  } catch (error) {
    console.error("[CREATE_CONTACT_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de l'envoi du message" }
  }
}

export async function markContactAsRead(id: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.contactRequest.update({
      where: { id },
      data: { isRead: true },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[MARK_CONTACT_AS_READ_ERROR]", error)
    return { success: false, error: "Impossible de marquer comme lu" }
  }
}

export async function updateContactStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.contactRequest.update({
      where: { id },
      data: { status },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CONTACT_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateContactNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.contactRequest.update({
      where: { id },
      data: { notes },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CONTACT_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function deleteContactRequest(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.contactRequest.delete({ where: { id } })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_CONTACT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la demande" }
  }
}
