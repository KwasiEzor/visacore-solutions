"use server"

import { prisma } from "@/lib/prisma"
import { leadSchema, leadStatusSchema } from "@/lib/validations/lead"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createLead(data: unknown) {
  try {
    const parsed = leadSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.lead.create({ data: parsed.data })
    return { success: true }
  } catch (error) {
    console.error("[CREATE_LEAD_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de la création du lead" }
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsedStatus = leadStatusSchema.safeParse(status)
    if (!parsedStatus.success) {
      return { success: false, error: "Statut invalide" }
    }

    await prisma.lead.update({
      where: { id },
      data: { status: parsedStatus.data },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_LEAD_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateLeadNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.lead.update({
      where: { id },
      data: { notes },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_LEAD_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function assignLead(id: string, assignedToId: string | null) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.lead.update({
      where: { id },
      data: { assignedToId },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[ASSIGN_LEAD_ERROR]", error)
    return { success: false, error: "Impossible d'assigner le lead" }
  }
}

export async function deleteLead(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.lead.delete({ where: { id } })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_LEAD_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le lead" }
  }
}
