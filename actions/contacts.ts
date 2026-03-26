"use server"

import { prisma } from "@/lib/prisma"
import { contactSchema } from "@/lib/validations/contact"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createContactRequest(data: unknown) {
  const parsed = contactSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.contactRequest.create({ data: parsed.data })
  return { success: true }
}

export async function markContactAsRead(id: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.contactRequest.update({
    where: { id },
    data: { isRead: true },
  })
  revalidatePath("/admin/contacts")
  return { success: true }
}

export async function updateContactStatus(id: string, status: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.contactRequest.update({
    where: { id },
    data: { status },
  })
  revalidatePath("/admin/contacts")
  return { success: true }
}

export async function updateContactNotes(id: string, notes: string) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  await prisma.contactRequest.update({
    where: { id },
    data: { notes },
  })
  revalidatePath("/admin/contacts")
  return { success: true }
}

export async function deleteContactRequest(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.contactRequest.delete({ where: { id } })
  revalidatePath("/admin/contacts")
  return { success: true }
}
