"use server"

import { prisma } from "@/lib/prisma"
import { testimonialSchema } from "@/lib/validations/testimonial"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createTestimonial(data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.testimonial.create({ data: parsed.data })
  revalidatePath("/admin/testimonials")
  revalidatePath("/temoignages")
  return { success: true }
}

export async function updateTestimonial(id: string, data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = testimonialSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.testimonial.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/testimonials")
  revalidatePath("/temoignages")
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.testimonial.delete({ where: { id } })
  revalidatePath("/admin/testimonials")
  revalidatePath("/temoignages")
  return { success: true }
}
