"use server"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { serviceMutationSchema } from "@/lib/validations/service"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"

function toNullableJsonValue<T>(value: T | null) {
  return value === null ? Prisma.JsonNull : value
}

export async function createService(data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "create")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = serviceMutationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const service = await prisma.service.create({
      data: {
        ...parsed.data,
        benefits: toNullableJsonValue(parsed.data.benefits),
      },
    })
    revalidatePath("/admin/services")
    revalidatePath("/", "layout")
    revalidatePath("/")
    revalidatePath("/services")
    revalidatePath("/services/[slug]", "page")
    return { success: true, id: service.id }
  } catch (error) {
    console.error("[CREATE_SERVICE_ERROR]", error)
    return { success: false, error: "Impossible de créer le service" }
  }
}

export async function updateService(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = serviceMutationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.service.update({
      where: { id },
      data: {
        ...parsed.data,
        benefits: toNullableJsonValue(parsed.data.benefits),
      },
    })
    revalidatePath("/admin/services")
    revalidatePath("/", "layout")
    revalidatePath("/")
    revalidatePath("/services")
    revalidatePath("/services/[slug]", "page")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_SERVICE_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le service" }
  }
}

export async function deleteService(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.service.delete({ where: { id } })
    revalidatePath("/admin/services")
    revalidatePath("/", "layout")
    revalidatePath("/")
    revalidatePath("/services")
    revalidatePath("/services/[slug]", "page")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_SERVICE_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le service" }
  }
}
