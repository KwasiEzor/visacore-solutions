import { prisma } from "@/lib/prisma"
import {
  defaultPublicSiteConfig,
  mapPublicSiteConfig,
  publicSiteSettingKeys,
} from "@/lib/site-config.shared"
import type { PublicSiteConfig } from "@/lib/site-config.shared"

export {
  defaultPublicSiteConfig,
  formatDisplayPhoneNumber,
  getBusinessHoursRows,
  getTelHref,
  getWhatsAppHref,
  mapPublicSiteConfig,
  normalizePhoneNumber,
  publicSiteSettingKeys,
} from "@/lib/site-config.shared"
export type { PublicSiteConfig, PublicSiteSettingKey } from "@/lib/site-config.shared"

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
