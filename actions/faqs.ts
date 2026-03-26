"use server"

import { prisma } from "@/lib/prisma"
import { faqSchema } from "@/lib/validations/faq"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function createFAQ(data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = faqSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.fAQ.create({ data: parsed.data })
  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}

export async function updateFAQ(id: string, data: unknown) {
  const session = await auth()
  if (!session) return { error: "Non autorisé" }

  const parsed = faqSchema.safeParse(data)
  if (!parsed.success) {
    return { error: "Données invalides", details: parsed.error.flatten() }
  }

  await prisma.fAQ.update({ where: { id }, data: parsed.data })
  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}

export async function deleteFAQ(id: string) {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.fAQ.delete({ where: { id } })
  revalidatePath("/admin/faqs")
  revalidatePath("/faq")
  return { success: true }
}
