"use server"

import { prisma } from "@/lib/prisma"
import { appointmentSchema } from "@/lib/validations/appointment"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createAppointment(data: unknown) {
  const parsed = appointmentSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  const { preferredDate, ...rest } = parsed.data
  await prisma.appointmentRequest.create({
    data: {
      ...rest,
      preferredDate: preferredDate ? new Date(preferredDate) : null,
    },
  })
  return { success: true }
}

export async function updateAppointmentStatus(id: string, status: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.appointmentRequest.update({
    where: { id },
    data: { status: status as "PENDING" | "APPROVED" | "CANCELLED" | "COMPLETED" },
  })
  revalidatePath("/admin/appointments")
  return { success: true }
}

export async function updateAppointmentNotes(id: string, notes: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.appointmentRequest.update({
    where: { id },
    data: { notes },
  })
  revalidatePath("/admin/appointments")
  return { success: true }
}

export async function deleteAppointment(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.appointmentRequest.delete({ where: { id } })
  revalidatePath("/admin/appointments")
  return { success: true }
}
