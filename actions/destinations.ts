"use server"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"
import { destinationMutationSchema } from "@/lib/validations/destination"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"

function toNullableJsonValue<T>(value: T | null) {
  return value === null ? Prisma.JsonNull : value
}

export async function createDestination(data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "create")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = destinationMutationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const destination = await prisma.destination.create({
      data: {
        ...parsed.data,
        opportunities: toNullableJsonValue(parsed.data.opportunities),
        visaCategories: toNullableJsonValue(parsed.data.visaCategories),
        whyChoose: toNullableJsonValue(parsed.data.whyChoose),
      },
    })
    revalidatePath("/admin/destinations")
    revalidatePath("/")
    revalidatePath("/destinations")
    revalidatePath("/destinations/[slug]", "page")
    return { success: true, id: destination.id }
  } catch (error) {
    console.error("[CREATE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de créer la destination" }
  }
}

export async function updateDestination(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsed = destinationMutationSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.destination.update({
      where: { id },
      data: {
        ...parsed.data,
        opportunities: toNullableJsonValue(parsed.data.opportunities),
        visaCategories: toNullableJsonValue(parsed.data.visaCategories),
        whyChoose: toNullableJsonValue(parsed.data.whyChoose),
      },
    })
    revalidatePath("/admin/destinations")
    revalidatePath("/")
    revalidatePath("/destinations")
    revalidatePath("/destinations/[slug]", "page")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour la destination" }
  }
}

export async function deleteDestination(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.destination.delete({ where: { id } })
    revalidatePath("/admin/destinations")
    revalidatePath("/")
    revalidatePath("/destinations")
    revalidatePath("/destinations/[slug]", "page")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_DESTINATION_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la destination" }
  }
}
