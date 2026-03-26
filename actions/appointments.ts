"use server"

import { prisma } from "@/lib/prisma"
import { appointmentSchema, appointmentStatusSchema } from "@/lib/validations/appointment"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createAppointment(data: unknown) {
  try {
    const parsed = appointmentSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const { preferredDate, ...rest } = parsed.data
    await prisma.appointmentRequest.create({
      data: {
        ...rest,
        preferredDate: preferredDate ? new Date(preferredDate) : null,
      },
    })
    return { success: true }
  } catch (error) {
    console.error("[CREATE_APPOINTMENT_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de la demande de rendez-vous" }
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsedStatus = appointmentStatusSchema.safeParse(status)
    if (!parsedStatus.success) {
      return { success: false, error: "Statut invalide" }
    }

    await prisma.appointmentRequest.update({
      where: { id },
      data: { status: parsedStatus.data },
    })
    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPOINTMENT_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateAppointmentNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    await prisma.appointmentRequest.update({
      where: { id },
      data: { notes },
    })
    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPOINTMENT_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function deleteAppointment(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.appointmentRequest.delete({ where: { id } })
    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPOINTMENT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le rendez-vous" }
  }
}
