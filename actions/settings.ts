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
import type { SiteSettingType } from "@/lib/site-config"

export interface SettingUpdatePayload {
  key: string
  value: string
  type: SiteSettingType
  secretAction?: "keep" | "replace" | "clear"
}

async function ensureSettingsAccess() {
  const session = await auth()

  if (!session || !hasPermission(session.user.role, "manage_settings")) {
    return { success: false as const, error: "Non autorisé" }
  }

  return { success: true as const }
}

async function persistSettings(updates: SettingUpdatePayload[]) {
  const access = await ensureSettingsAccess()

  if (!access.success) {
    return access
  }

  const uniqueUpdates = new Map(updates.map((update) => [update.key, update]))
  const keysToLoad = [...new Set([...uniqueUpdates.keys(), "ai_provider", "ai_model"])]
  const existingSettings = await prisma.siteSetting.findMany({
    where: { key: { in: keysToLoad } },
    select: { key: true, value: true },
  })
  const existingMap = new Map(existingSettings.map((setting) => [setting.key, setting.value]))

  const updatesToPersist: Array<{
    key: string
    type: SiteSettingType
    value: string
    secret: boolean
    secretAction: "keep" | "replace" | "clear"
  }> = []

  for (const update of uniqueUpdates.values()) {
    const trimmedValue = update.value.trim()
    const catalogEntry = getSiteSettingCatalogEntry(update.key)
    const secretAction = catalogEntry?.secret
      ? update.secretAction ?? (trimmedValue.length > 0 ? "replace" : "keep")
      : "replace"

    if (catalogEntry?.secret && secretAction === "keep") {
      continue
    }

    const valueForValidation = secretAction === "clear" ? "" : trimmedValue
    const validation = validateSiteSettingValue(update.key, valueForValidation, update.type)

    if (!validation.valid) {
      return { success: false as const, error: validation.message }
    }

    updatesToPersist.push({
      key: update.key,
      type: validation.type,
      value: valueForValidation,
      secret: Boolean(catalogEntry?.secret),
      secretAction,
    })
  }

  const providerValue =
    updatesToPersist.find((update) => update.key === "ai_provider")?.value ??
    existingMap.get("ai_provider") ??
    "anthropic"

  if (!isAiProviderId(providerValue)) {
    return { success: false as const, error: "Le fournisseur IA configure est invalide." }
  }

  const aiModelUpdate = updatesToPersist.find((update) => update.key === "ai_model")
  if (aiModelUpdate && !isValidAiModelForProvider(providerValue, aiModelUpdate.value)) {
    return {
      success: false as const,
      error: "Veuillez choisir un modele compatible avec le fournisseur actif.",
    }
  }

  const currentOrIncomingModel =
    aiModelUpdate?.value ??
    existingMap.get("ai_model") ??
    DEFAULT_AI_MODEL_BY_PROVIDER[providerValue]
  const resolvedAiModel = isValidAiModelForProvider(providerValue, currentOrIncomingModel)
    ? currentOrIncomingModel
    : DEFAULT_AI_MODEL_BY_PROVIDER[providerValue]

  const persistedUpdates: Array<{
    key: string
    type: SiteSettingType
    value: string
  }> = []

  try {
    for (const update of updatesToPersist) {
      let persistedValue = update.value

      if (update.secret) {
        if (update.secretAction === "clear") {
          persistedValue = ""
        } else {
          persistedValue = encryptSecretSettingValue(update.value)
        }
      }

      persistedUpdates.push({
        key: update.key,
        type: update.type,
        value: persistedValue,
      })
    }
  } catch {
    return {
      success: false as const,
      error:
        "Le stockage chiffre n'est pas disponible. Configurez SITE_SETTINGS_ENCRYPTION_KEY ou AUTH_SECRET.",
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      for (const update of persistedUpdates) {
        await tx.siteSetting.upsert({
          where: { key: update.key },
          update: { value: update.value, type: update.type },
          create: { key: update.key, value: update.value, type: update.type },
        })
      }

      const existingModelValue = existingMap.get("ai_model")
      const aiModelWillBePersisted = updatesToPersist.some((update) => update.key === "ai_model")

      if (!aiModelWillBePersisted || existingModelValue !== resolvedAiModel) {
        await tx.siteSetting.upsert({
          where: { key: "ai_model" },
          update: { value: resolvedAiModel, type: "TEXT" },
          create: { key: "ai_model", value: resolvedAiModel, type: "TEXT" },
        })
      }
    })
  } catch (error) {
    console.error("[PERSIST_SETTINGS_ERROR]", error)
    return { success: false as const, error: "Impossible de mettre à jour les paramètres." }
  }

  revalidatePath("/admin/settings")
  revalidatePath("/admin", "layout")
  revalidatePath("/", "layout")

  return { success: true as const, resolvedAiModel }
}

export async function updateSetting(
  key: string,
  value: string,
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN" = "TEXT"
) {
  try {
    return await persistSettings([
      {
        key,
        value,
        type,
        secretAction: value.trim().length === 0 ? "clear" : "replace",
      },
    ])
  } catch (error) {
    console.error("[UPDATE_SETTING_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le paramètre" }
  }
}

export async function updateSettingsSection(updates: SettingUpdatePayload[]) {
  try {
    return await persistSettings(updates)
  } catch (error) {
    console.error("[UPDATE_SETTINGS_SECTION_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour la section" }
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
