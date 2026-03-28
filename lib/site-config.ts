import { prisma } from "@/lib/prisma"
import {
  defaultPublicSiteConfig,
  defaultNotificationSiteConfig,
  mapNotificationSiteConfig,
  mapPublicSiteConfig,
  notificationSiteSettingCatalog,
  publicSiteSettingKeys,
} from "@/lib/site-config.shared"
import type {
  NotificationSiteConfig,
  PublicSiteConfig,
} from "@/lib/site-config.shared"

export {
  defaultNotificationSiteConfig,
  defaultPublicSiteConfig,
  formatDisplayPhoneNumber,
  getBusinessHoursRows,
  getTelHref,
  getWhatsAppHref,
  mapNotificationSiteConfig,
  mapPublicSiteConfig,
  normalizePhoneNumber,
  notificationSiteSettingCatalog,
  publicSiteSettingCatalog,
  publicSiteSettingKeys,
} from "@/lib/site-config.shared"
export type {
  NotificationSiteConfig,
  NotificationSiteSettingKey,
  PublicSiteConfig,
  PublicSiteSettingKey,
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
        key: {
          in: notificationSiteSettingCatalog.map((setting) => setting.key),
        },
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
