export const publicSiteSettingKeys = [
  "site_name",
  "site_description",
  "contact_email",
  "contact_phone",
  "whatsapp_number",
  "office_address",
  "business_hours",
  "facebook_url",
  "linkedin_url",
  "instagram_url",
] as const

export type PublicSiteSettingKey = (typeof publicSiteSettingKeys)[number]

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

export function normalizePhoneNumber(value: string) {
  return value.replace(/[^\d]/g, "")
}

export function getTelHref(value: string) {
  const normalized = normalizePhoneNumber(value)
  return normalized ? `tel:+${normalized}` : undefined
}

export function getWhatsAppHref(value: string) {
  const normalized = normalizePhoneNumber(value)
  return normalized ? `https://wa.me/${normalized}` : undefined
}
