export const publicSiteSettingCatalog = [
  {
    key: "site_name",
    label: "Nom du site",
    type: "TEXT",
    defaultValue: "VisaCore Solutions",
  },
  {
    key: "site_description",
    label: "Description du site",
    type: "TEXT",
    defaultValue: "Experts en immigration internationale depuis Lomé, Togo",
  },
  {
    key: "contact_email",
    label: "Email de contact",
    type: "TEXT",
    defaultValue: "contact@visacore-solutions.com",
  },
  {
    key: "contact_phone",
    label: "Telephone",
    type: "TEXT",
    defaultValue: "+228 90 00 00 00",
  },
  {
    key: "whatsapp_number",
    label: "Numero WhatsApp",
    type: "TEXT",
    defaultValue: "+22890000000",
  },
  {
    key: "office_address",
    label: "Adresse du bureau",
    type: "TEXT",
    defaultValue: "Boulevard du 13 Janvier, Lomé, Togo",
  },
  {
    key: "business_hours",
    label: "Horaires d'ouverture",
    type: "TEXT",
    defaultValue: "Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00",
  },
  {
    key: "facebook_url",
    label: "Facebook",
    type: "TEXT",
    defaultValue: "",
  },
  {
    key: "linkedin_url",
    label: "LinkedIn",
    type: "TEXT",
    defaultValue: "",
  },
  {
    key: "instagram_url",
    label: "Instagram",
    type: "TEXT",
    defaultValue: "",
  },
] as const

export const publicSiteSettingKeys = publicSiteSettingCatalog.map(
  (setting) => setting.key
) as unknown as readonly string[]

export const notificationSiteSettingCatalog = [
  {
    key: "email_notifications_enabled",
    label: "Notifications email actives",
    type: "BOOLEAN",
    defaultValue: "true",
  },
  {
    key: "notification_from_name",
    label: "Nom expediteur email",
    type: "TEXT",
    defaultValue: "VisaCore Solutions",
  },
  {
    key: "notification_from_email",
    label: "Email expediteur",
    type: "TEXT",
    defaultValue: "notifications@visacore-solutions.com",
  },
  {
    key: "notification_reply_to_email",
    label: "Email de reponse",
    type: "TEXT",
    defaultValue: "contact@visacore-solutions.com",
  },
  {
    key: "notification_admin_emails",
    label: "Emails admin a notifier",
    type: "TEXT",
    defaultValue: "",
  },
] as const

export type NotificationSiteSettingKey =
  (typeof notificationSiteSettingCatalog)[number]["key"]

export interface NotificationSiteConfig {
  emailNotificationsEnabled: boolean
  fromName: string
  fromEmail: string
  replyToEmail: string
  adminEmails: string[]
}

export type PublicSiteSettingKey =
  (typeof publicSiteSettingCatalog)[number]["key"]

type SiteSettingRow = {
  key: string
  value: string
}

export interface PublicSiteConfig {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  whatsappNumber: string
  officeAddress: string
  businessHours: string
  facebookUrl: string
  linkedinUrl: string
  instagramUrl: string
}

export interface BusinessHoursRow {
  label: string
  value: string
}

export const defaultPublicSiteConfig: PublicSiteConfig = {
  siteName: "VisaCore Solutions",
  siteDescription: "Experts en immigration internationale depuis Lomé, Togo",
  contactEmail: "contact@visacore-solutions.com",
  contactPhone: "+228 90 00 00 00",
  whatsappNumber: "+22890000000",
  officeAddress: "Boulevard du 13 Janvier, Lomé, Togo",
  businessHours: "Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00",
  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
}

export const defaultNotificationSiteConfig: NotificationSiteConfig = {
  emailNotificationsEnabled: true,
  fromName: "VisaCore Solutions",
  fromEmail: "notifications@visacore-solutions.com",
  replyToEmail: "contact@visacore-solutions.com",
  adminEmails: [],
}

export function mapPublicSiteConfig(settings: SiteSettingRow[]): PublicSiteConfig {
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]))

  return {
    siteName: values.site_name || defaultPublicSiteConfig.siteName,
    siteDescription:
      values.site_description || defaultPublicSiteConfig.siteDescription,
    contactEmail: values.contact_email || defaultPublicSiteConfig.contactEmail,
    contactPhone: values.contact_phone || defaultPublicSiteConfig.contactPhone,
    whatsappNumber:
      values.whatsapp_number || defaultPublicSiteConfig.whatsappNumber,
    officeAddress:
      values.office_address || defaultPublicSiteConfig.officeAddress,
    businessHours:
      values.business_hours || defaultPublicSiteConfig.businessHours,
    facebookUrl: values.facebook_url || defaultPublicSiteConfig.facebookUrl,
    linkedinUrl: values.linkedin_url || defaultPublicSiteConfig.linkedinUrl,
    instagramUrl: values.instagram_url || defaultPublicSiteConfig.instagramUrl,
  }
}

function parseCommaSeparatedEmails(value: string | undefined) {
  if (!value) return []

  return value
    .split(/[,\n;]/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

export function mapNotificationSiteConfig(
  settings: SiteSettingRow[]
): NotificationSiteConfig {
  const values = Object.fromEntries(settings.map((setting) => [setting.key, setting.value]))

  return {
    emailNotificationsEnabled:
      (values.email_notifications_enabled ?? defaultNotificationSiteConfig.emailNotificationsEnabled.toString()) ===
      "true",
    fromName:
      values.notification_from_name || defaultNotificationSiteConfig.fromName,
    fromEmail:
      values.notification_from_email || defaultNotificationSiteConfig.fromEmail,
    replyToEmail:
      values.notification_reply_to_email ||
      defaultNotificationSiteConfig.replyToEmail,
    adminEmails: parseCommaSeparatedEmails(values.notification_admin_emails),
  }
}

export function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "")
}

export function formatDisplayPhoneNumber(value: string) {
  const normalized = normalizePhoneNumber(value)
  const hasInternationalPrefix = value.trim().startsWith("+")

  if (!normalized) {
    return value
  }

  const formatGroupedDigits = (digits: string) =>
    digits.match(/.{1,2}/g)?.join(" ") ?? digits

  if (normalized.length <= 8) {
    return `${hasInternationalPrefix ? "+" : ""}${formatGroupedDigits(normalized)}`
  }

  const countryCode = normalized.slice(0, normalized.length - 8)
  const localNumber = normalized.slice(-8)

  if (!countryCode) {
    return formatGroupedDigits(localNumber)
  }

  return `${hasInternationalPrefix ? "+" : ""}${countryCode} ${formatGroupedDigits(localNumber)}`
}

export function getTelHref(value: string) {
  const normalized = normalizePhoneNumber(value)
  return normalized ? `tel:+${normalized}` : undefined
}

export function getWhatsAppHref(value: string) {
  const normalized = normalizePhoneNumber(value)
  return normalized ? `https://wa.me/${normalized}` : undefined
}

export function getBusinessHoursRows(value: string): BusinessHoursRow[] {
  return value
    .split("|")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [rawLabel, ...rawValue] = entry.split(":")
      const label = rawLabel?.trim()
      const resolvedValue = rawValue.join(":").trim()

      if (!label || !resolvedValue) {
        return {
          label: "Horaires",
          value: entry,
        }
      }

      return {
        label,
        value: resolvedValue,
      }
    })
}
