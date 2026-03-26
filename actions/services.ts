"use server"

import { prisma } from "@/lib/prisma"
import { serviceSchema } from "@/lib/validations/service"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createService(data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  const service = await prisma.service.create({ data: parsed.data })
  revalidatePath("/admin/services")
  revalidatePath("/services")
  return { success: true, id: service.id }
}

export async function updateService(id: string, data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = serviceSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.service.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/services")
  revalidatePath("/services")
  return { success: true }
}

export async function deleteService(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.service.delete({ where: { id } })
  revalidatePath("/admin/services")
  revalidatePath("/services")
  return { success: true }
}
