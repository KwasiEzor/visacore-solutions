"use server"

import { prisma } from "@/lib/prisma"
import { testimonialSchema } from "@/lib/validations/testimonial"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createTestimonial(data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = testimonialSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.testimonial.create({ data: parsed.data })
    revalidatePath("/admin/testimonials")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[CREATE_TESTIMONIAL_ERROR]", error)
    return { success: false, error: "Impossible de créer le témoignage" }
  }
}

export async function updateTestimonial(id: string, data: unknown) {
  try {
    const session = await auth()
    if (!session) return { success: false, error: "Non autorisé" }

    const parsed = testimonialSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    await prisma.testimonial.update({ where: { id }, data: parsed.data })
    revalidatePath("/admin/testimonials")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_TESTIMONIAL_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le témoignage" }
  }
}

export async function deleteTestimonial(id: string) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.testimonial.delete({ where: { id } })
    revalidatePath("/admin/testimonials")
    revalidatePath("/temoignages")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_TESTIMONIAL_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le témoignage" }
  }
}
