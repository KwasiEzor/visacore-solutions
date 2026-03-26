"use server"

import { prisma } from "@/lib/prisma"
import { leadSchema } from "@/lib/validations/lead"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createLead(data: unknown) {
  const parsed = leadSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.lead.create({ data: parsed.data })
  return { success: true }
}

export async function updateLeadStatus(id: string, status: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.lead.update({
    where: { id },
    data: { status: status as "NEW" | "CONTACTED" | "QUALIFIED" | "IN_PROGRESS" | "CONVERTED" | "CLOSED" },
  })
  revalidatePath("/admin/leads")
  return { success: true }
}

export async function updateLeadNotes(id: string, notes: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.lead.update({
    where: { id },
    data: { notes },
  })
  revalidatePath("/admin/leads")
  return { success: true }
}

export async function assignLead(id: string, assignedToId: string | null) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.lead.update({
    where: { id },
    data: { assignedToId },
  })
  revalidatePath("/admin/leads")
  return { success: true }
}

export async function deleteLead(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.lead.delete({ where: { id } })
  revalidatePath("/admin/leads")
  return { success: true }
}
