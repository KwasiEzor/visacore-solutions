import {
  structuredCardItemsInputSchema,
  visaCategoriesInputSchema,
} from "@/lib/content-structures"
import { publicSiteSettingKeys } from "@/lib/site-config.shared"

interface PublishedServiceRecord {
  slug: string
  benefits: unknown
}

interface PublishedDestinationRecord {
  slug: string
  opportunities: unknown
  visaCategories: unknown
  whyChoose: unknown
}

interface SiteSettingRecord {
  key: string
}

export interface ContentIntegrityIssue {
  scope: "settings" | "service" | "destination"
  identifier: string
  message: string
}

export function collectContentIntegrityIssues(input: {
  services: PublishedServiceRecord[]
  destinations: PublishedDestinationRecord[]
  settings: SiteSettingRecord[]
}) {
  const issues: ContentIntegrityIssue[] = []
  const settingKeys = new Set(input.settings.map((setting) => setting.key))

  for (const key of publicSiteSettingKeys) {
    if (!settingKeys.has(key)) {
      issues.push({
        scope: "settings",
        identifier: key,
        message: "Required public site setting is missing",
      })
    }
  }

  for (const service of input.services) {
    if (
      service.benefits != null &&
      !structuredCardItemsInputSchema.safeParse(service.benefits).success
    ) {
      issues.push({
        scope: "service",
        identifier: service.slug,
        message: "Benefits payload is malformed",
      })
    }
  }

  for (const destination of input.destinations) {
    if (
      destination.opportunities != null &&
      !structuredCardItemsInputSchema.safeParse(destination.opportunities).success
    ) {
      issues.push({
        scope: "destination",
        identifier: `${destination.slug}:opportunities`,
        message: "Opportunities payload is malformed",
      })
    }

    if (
      destination.whyChoose != null &&
      !structuredCardItemsInputSchema.safeParse(destination.whyChoose).success
    ) {
      issues.push({
        scope: "destination",
        identifier: `${destination.slug}:whyChoose`,
        message: "Why choose payload is malformed",
      })
    }

    if (
      destination.visaCategories != null &&
      !visaCategoriesInputSchema.safeParse(destination.visaCategories).success
    ) {
      issues.push({
        scope: "destination",
        identifier: `${destination.slug}:visaCategories`,
        message: "Visa categories payload is malformed",
      })
    }
  }

  return issues
}
