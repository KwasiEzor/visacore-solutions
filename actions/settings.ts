"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"
import {
  getSiteSettingCatalogEntry,
  validateSiteSettingValue,
} from "@/lib/site-config"
import {
  DEFAULT_AI_MODEL_BY_PROVIDER,
  isAiProviderId,
  isValidAiModelForProvider,
} from "@/lib/ai-settings.shared"
import { encryptSecretSettingValue } from "@/lib/settings-secrets"

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

    const trimmedValue = value.trim()
    const catalogEntry = getSiteSettingCatalogEntry(key)

    if (key === "ai_model") {
      const providerValue =
        (
          await prisma.siteSetting.findUnique({
            where: { key: "ai_provider" },
            select: { value: true },
          })
        )?.value ?? "anthropic"

      if (!isAiProviderId(providerValue)) {
        return { success: false, error: "Le fournisseur IA configure est invalide." }
      }

      if (!isValidAiModelForProvider(providerValue, trimmedValue)) {
        return {
          success: false,
          error: "Veuillez choisir un modele compatible avec le fournisseur actif.",
        }
      }
    }

    let persistedValue = trimmedValue

    if (catalogEntry?.secret) {
      try {
        persistedValue = encryptSecretSettingValue(trimmedValue)
      } catch {
        return {
          success: false,
          error:
            "Le stockage chiffre n'est pas disponible. Configurez SITE_SETTINGS_ENCRYPTION_KEY ou AUTH_SECRET.",
        }
      }
    }

    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: persistedValue, type: validation.type },
      create: { key, value: persistedValue, type: validation.type },
    })

    if (key === "ai_provider" && isAiProviderId(trimmedValue)) {
      const nextModel = DEFAULT_AI_MODEL_BY_PROVIDER[trimmedValue]
      const currentModel =
        (
          await prisma.siteSetting.findUnique({
            where: { key: "ai_model" },
            select: { value: true },
          })
        )?.value ?? nextModel

      if (!isValidAiModelForProvider(trimmedValue, currentModel)) {
        await prisma.siteSetting.upsert({
          where: { key: "ai_model" },
          update: { value: nextModel, type: "TEXT" },
          create: { key: "ai_model", value: nextModel, type: "TEXT" },
        })
      }
    }

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
