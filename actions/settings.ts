"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateSetting(key: string, value: string, type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN" = "TEXT") {
  const session = await auth()
  if (!session || session.user.role === "EDITOR") return { error: "Non autorisé" }

  await prisma.siteSetting.upsert({
    where: { key },
    update: { value, type },
    create: { key, value, type },
  })
  revalidatePath("/admin/settings")
  revalidatePath("/")
  return { success: true }
}

export async function getSettings() {
  const settings = await prisma.siteSetting.findMany()
  return Object.fromEntries(settings.map((s) => [s.key, s.value]))
}
