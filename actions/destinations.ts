"use server"

import { prisma } from "@/lib/prisma"
import { destinationSchema } from "@/lib/validations/destination"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createDestination(data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = destinationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const destination = await prisma.destination.create({ data: parsed.data })
    revalidatePath("/admin/destinations")
    revalidatePath("/destinations")
    return { success: true, id: destination.id }
  } catch (error) {
    console.error("[CREATE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de créer la destination" }
  }
}

export async function updateDestination(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = destinationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.destination.update({ where: { id }, data: parsed.data })
    revalidatePath("/admin/destinations")
    revalidatePath("/destinations")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour la destination" }
  }
}

export async function deleteDestination(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.destination.delete({ where: { id } })
    revalidatePath("/admin/destinations")
    revalidatePath("/destinations")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la destination" }
  }
}
