"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"
import { validateSiteSettingValue } from "@/lib/site-config"

export async function updateSetting(
  key: string,
  value: string,
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN" = "TEXT"
) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "manage_settings")) {
      return { success: false, error: "Non autorisé" }
    }

    const validation = validateSiteSettingValue(key, value, type)

    if (!validation.valid) {
      return { success: false, error: validation.message }
    }

    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: value.trim(), type: validation.type },
      create: { key, value: value.trim(), type: validation.type },
    })

    revalidatePath("/admin/settings")
    revalidatePath("/admin", "layout")
    revalidatePath("/", "layout")

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
