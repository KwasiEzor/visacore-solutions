"use server"

import { prisma } from "@/lib/prisma"
import { createUserSchema } from "@/lib/validations/auth"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { z } from "zod"
import { hasPermission } from "@/lib/rbac"
import { notifyUserCreated } from "@/lib/business-notifications"

const userRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"])

export async function createUser(data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "manage_users")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = createUserSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const existingUser = await prisma.user.findUnique({
      where: { email: parsed.data.email },
    })
    if (existingUser) {
      return { success: false, error: "Cet email est déjà utilisé" }
    }

    const createdUser = await prisma.user.create({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        role: parsed.data.role as "SUPER_ADMIN" | "ADMIN" | "EDITOR",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    })

    await notifyUserCreated({
      ...createdUser,
      createdByName: session.user.name ?? session.user.email,
    })

    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[CREATE_USER_ERROR]", error)
    return { success: false, error: "Impossible de créer l'utilisateur" }
  }
}

export async function updateUserRole(id: string, role: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "manage_users")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsedRole = userRoleSchema.safeParse(role)
    if (!parsedRole.success) {
      return { success: false, error: "Rôle invalide" }
    }

    await prisma.user.update({
      where: { id },
      data: { role: parsedRole.data },
    })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_USER_ROLE_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le rôle" }
  }
}

export async function deleteUser(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "manage_users")) {
      return { success: false, error: "Non autorisé" }
    }
    
    if (session.user.id === id) {
      return { success: false, error: "Vous ne pouvez pas vous supprimer" }
    }

    await prisma.user.delete({ where: { id } })
    revalidatePath("/admin/users")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_USER_ERROR]", error)
    return { success: false, error: "Impossible de supprimer l'utilisateur" }
  }
}
