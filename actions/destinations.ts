"use server"

import { prisma } from "@/lib/prisma"
import { destinationSchema } from "@/lib/validations/destination"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createDestination(data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = destinationSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  const destination = await prisma.destination.create({ data: parsed.data })
  revalidatePath("/admin/destinations")
  revalidatePath("/destinations")
  return { success: true, id: destination.id }
}

export async function updateDestination(id: string, data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = destinationSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.destination.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/destinations")
  revalidatePath("/destinations")
  return { success: true }
}

export async function deleteDestination(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.destination.delete({ where: { id } })
  revalidatePath("/admin/destinations")
  revalidatePath("/destinations")
  return { success: true }
}
