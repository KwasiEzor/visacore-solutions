"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function updateSetting(
  key: string, 
  value: string, 
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN" = "TEXT"
) {
  try {
    const session = await auth()
    if (!session || session.user.role === "EDITOR") {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.siteSetting.upsert({
      where: { key },
      update: { value, type },
      create: { key, value, type },
    })
    revalidatePath("/admin/settings")
    revalidatePath("/")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_SETTING_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le paramètre" }
  }
}

export async function getSettings() {
  try {
    const settings = await prisma.siteSetting.findMany()
    return Object.fromEntries(settings.map((s) => [s.key, s.value]))
  } catch (error) {
    console.error("[GET_SETTINGS_ERROR]", error)
    return {}
  }
}
