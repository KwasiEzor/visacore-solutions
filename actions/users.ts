"use server"

import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validations/auth"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import bcrypt from "bcryptjs"

export async function createUser(data: unknown) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") return { error: "Non autorisé" }

  const parsed = createUserSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  })
  if (existingUser) return { error: "Cet email est déjà utilisé" }

  const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      hashedPassword,
      role: parsed.data.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR",
    },
  })
  revalidatePath("/admin/users")
  return { success: true }
}

export async function updateUserRole(id: string, role: string) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") return { error: "Non autorisé" }

  await prisma.user.update({
    where: { id },
    data: { role: role as "SUPER_ADMIN" | "ADMIN" | "EDITOR" },
  })
  revalidatePath("/admin/users")
  return { success: true }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session || session.user.role !== "SUPER_ADMIN") return { error: "Non autorisé" }
  if (session.user.id === id) return { error: "Vous ne pouvez pas vous supprimer" }

  await prisma.user.delete({ where: { id } })
  revalidatePath("/admin/users")
  return { success: true }
}
