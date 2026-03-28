import { prisma } from "@/lib/prisma"
import {
  adminAiSettingKeys,
  defaultAdminAiSiteConfig,
  defaultPublicChatbotSiteConfig,
  defaultPublicSiteConfig,
  defaultNotificationSiteConfig,
  mapAdminAiSiteConfig,
  mapNotificationSiteConfig,
  mapPublicChatbotSiteConfig,
  mapPublicSiteConfig,
  notificationSiteSettingKeys,
  publicChatbotSettingKeys,
  publicSiteSettingKeys,
} from "@/lib/site-config.shared"
import type {
  AdminAiSiteConfig,
  NotificationSiteConfig,
  PublicChatbotSiteConfig,
  PublicSiteConfig,
} from "@/lib/site-config.shared"

export {
  adminAiSettingKeys,
  allSiteSettingCatalog,
  chatbotSiteSettingCatalog,
  defaultAdminAiSiteConfig,
  defaultNotificationSiteConfig,
  defaultPublicChatbotSiteConfig,
  defaultPublicSiteConfig,
  formatDisplayPhoneNumber,
  getBusinessHoursRows,
  getSiteSettingCatalogEntry,
  getTelHref,
  getWhatsAppHref,
  mapAdminAiSiteConfig,
  mapNotificationSiteConfig,
  mapPublicChatbotSiteConfig,
  mapPublicSiteConfig,
  normalizePhoneNumber,
  notificationSiteSettingKeys,
  notificationSiteSettingCatalog,
  publicChatbotSettingKeys,
  publicSiteSettingCatalog,
  publicSiteSettingKeys,
  siteSettingSections,
  validateSiteSettingValue,
} from "@/lib/site-config.shared"
export type {
  AdminAiSiteConfig,
  ChatbotSiteSettingKey,
  NotificationSiteConfig,
  NotificationSiteSettingKey,
  PublicChatbotSiteConfig,
  PublicSiteConfig,
  PublicSiteSettingKey,
  SiteSettingCatalogEntry,
  SiteSettingSectionId,
  SiteSettingType,
} from "@/lib/site-config.shared"

export async function getPublicSiteConfig(): Promise<PublicSiteConfig> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: {
          in: [...publicSiteSettingKeys],
        },
      },
      select: {
        key: true,
        value: true,
      },
    })

    return mapPublicSiteConfig(settings)
  } catch {
    return defaultPublicSiteConfig
  }
}

export async function getNotificationSiteConfig(): Promise<NotificationSiteConfig> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: [...notificationSiteSettingKeys] },
      },
      select: {
        key: true,
        value: true,
      },
    })

    return mapNotificationSiteConfig(settings)
  } catch {
    return defaultNotificationSiteConfig
  }
}

export async function getPublicChatbotSiteConfig(): Promise<PublicChatbotSiteConfig> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: [...publicChatbotSettingKeys] },
      },
      select: {
        key: true,
        value: true,
      },
    })

    return mapPublicChatbotSiteConfig(settings)
  } catch {
    return defaultPublicChatbotSiteConfig
  }
}

export async function getAdminAiSiteConfig(): Promise<AdminAiSiteConfig> {
  try {
    const settings = await prisma.siteSetting.findMany({
      where: {
        key: { in: [...adminAiSettingKeys] },
      },
      select: {
        key: true,
        value: true,
      },
    })

    return mapAdminAiSiteConfig(settings)
  } catch {
    return defaultAdminAiSiteConfig
  }
}
