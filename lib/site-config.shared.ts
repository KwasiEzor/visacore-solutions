import {
  AI_PROVIDER_OPTIONS,
  DEFAULT_AI_MODEL_BY_PROVIDER,
  DEFAULT_AI_PROVIDER,
  getAiModelOptions,
  isAiProviderId,
  resolveAiModel,
  resolveAiProvider,
  type AiProviderId,
} from "@/lib/ai-settings.shared"

export type SiteSettingType = "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"
export type SiteSettingSectionId =
  | "business"
  | "whatsapp"
  | "ai_provider"
  | "public_chatbot"
  | "admin_ai"
  | "email"
export type SiteSettingValidation =
  | "email"
  | "email-list"
  | "phone"
  | "url"
  | "integer"
export type SiteSettingControl = "input" | "textarea" | "select"
export interface SiteSettingOption {
  value: string
  label: string
}

export interface SiteSettingCatalogEntry {
  key: string
  label: string
  type: SiteSettingType
  defaultValue: string
  section: SiteSettingSectionId
  description: string
  placeholder?: string
  inputType?: "text" | "email" | "tel" | "url" | "number" | "password"
  control?: SiteSettingControl
  rows?: number
  validation?: SiteSettingValidation
  options?: readonly SiteSettingOption[]
  secret?: boolean
}

export const siteSettingSections: ReadonlyArray<{
  id: SiteSettingSectionId
  title: string
  description: string
}> = [
  {
    id: "business",
    title: "Identite et coordonnees",
    description:
      "Informations publiques utilisees dans le header, le footer, les pages legales et les emails.",
  },
  {
    id: "whatsapp",
    title: "Canal WhatsApp",
    description:
      "Controlez le bouton flottant WhatsApp et le message pre-rempli envoye aux visiteurs.",
  },
  {
    id: "ai_provider",
    title: "Fournisseur IA",
    description:
      "Choisissez le fournisseur actif, le modele utilise et stockez les cles API de maniere chiffree.",
  },
  {
    id: "public_chatbot",
    title: "Chatbot public",
    description:
      "Personnalisez l'assistant visible sur le site, son accueil et ses limites d'usage.",
  },
  {
    id: "admin_ai",
    title: "Copilote IA admin",
    description:
      "Reglez le copilote utilise par l'equipe interne dans le dashboard.",
  },
  {
    id: "email",
    title: "Emails transactionnels",
    description:
      "Configurez les expediteurs, les destinataires d'alerte et l'activation des emails Resend.",
  },
] as const

export const publicSiteSettingCatalog = [
  {
    key: "site_name",
    label: "Nom du site",
    type: "TEXT",
    defaultValue: "VisaCore Solutions",
    section: "business",
    description: "Nom affiche dans le site public et les communications client.",
    placeholder: "VisaCore Solutions",
  },
  {
    key: "site_description",
    label: "Description du site",
    type: "TEXT",
    defaultValue:
      "Experts en immigration internationale depuis Lome, Togo",
    section: "business",
    description:
      "Phrase courte utilisee dans les meta informations et certains textes de presentation.",
    placeholder: "Experts en immigration internationale depuis Lome, Togo",
  },
  {
    key: "contact_email",
    label: "Email de contact",
    type: "TEXT",
    defaultValue: "contact@visacore-solutions.com",
    section: "business",
    description:
      "Adresse officielle affichee sur le site et reutilisee dans les emails.",
    placeholder: "contact@visacore-solutions.com",
    inputType: "email",
    validation: "email",
  },
  {
    key: "contact_phone",
    label: "Telephone principal",
    type: "TEXT",
    defaultValue: "+228 90 00 00 00",
    section: "business",
    description:
      "Numero d'appel principal visible dans le header, le footer et les pages de contact.",
    placeholder: "+228 90 00 00 00",
    inputType: "tel",
    validation: "phone",
  },
  {
    key: "office_address",
    label: "Adresse du bureau",
    type: "TEXT",
    defaultValue: "Boulevard du 13 Janvier, Lome, Togo",
    section: "business",
    description:
      "Adresse postale ou commerciale affichee dans les pages de confiance.",
    placeholder: "Boulevard du 13 Janvier, Lome, Togo",
  },
  {
    key: "business_hours",
    label: "Horaires d'ouverture",
    type: "TEXT",
    defaultValue: "Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00",
    section: "business",
    description:
      "Format recommande: Jour: horaire | Jour: horaire pour conserver l'affichage par ligne.",
    placeholder: "Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00",
  },
  {
    key: "facebook_url",
    label: "URL Facebook",
    type: "TEXT",
    defaultValue: "",
    section: "business",
    description: "Lien complet vers la page Facebook officielle.",
    placeholder: "https://facebook.com/visacoresolutions",
    inputType: "url",
    validation: "url",
  },
  {
    key: "linkedin_url",
    label: "URL LinkedIn",
    type: "TEXT",
    defaultValue: "",
    section: "business",
    description: "Lien complet vers la page LinkedIn officielle.",
    placeholder: "https://linkedin.com/company/visacoresolutions",
    inputType: "url",
    validation: "url",
  },
  {
    key: "instagram_url",
    label: "URL Instagram",
    type: "TEXT",
    defaultValue: "",
    section: "business",
    description: "Lien complet vers le compte Instagram officiel.",
    placeholder: "https://instagram.com/visacoresolutions",
    inputType: "url",
    validation: "url",
  },
  {
    key: "whatsapp_enabled",
    label: "Bouton WhatsApp actif",
    type: "BOOLEAN",
    defaultValue: "true",
    section: "whatsapp",
    description:
      "Affiche ou masque le bouton WhatsApp flottant et les liens WhatsApp publics.",
  },
  {
    key: "whatsapp_number",
    label: "Numero WhatsApp",
    type: "TEXT",
    defaultValue: "+22890000000",
    section: "whatsapp",
    description:
      "Numero utilise pour tous les liens wa.me. Indiquez un numero complet avec indicatif pays.",
    placeholder: "+22890000000",
    inputType: "tel",
    validation: "phone",
  },
  {
    key: "whatsapp_label",
    label: "Libelle du canal WhatsApp",
    type: "TEXT",
    defaultValue: "Discuter sur WhatsApp",
    section: "whatsapp",
    description:
      "Texte utilise pour l'accessibilite et les surfaces de contact qui presentent le canal.",
    placeholder: "Discuter sur WhatsApp",
  },
  {
    key: "whatsapp_prefill_message",
    label: "Message WhatsApp pre-rempli",
    type: "TEXT",
    defaultValue:
      "Bonjour VisaCore Solutions, je souhaite obtenir des informations sur votre accompagnement.",
    section: "whatsapp",
    description:
      "Message injecte automatiquement dans l'ouverture de conversation WhatsApp.",
    placeholder:
      "Bonjour VisaCore Solutions, je souhaite obtenir des informations sur votre accompagnement.",
    control: "textarea",
    rows: 3,
  },
] satisfies readonly SiteSettingCatalogEntry[]

export const aiSiteSettingCatalog = [
  {
    key: "ai_provider",
    label: "Fournisseur actif",
    type: "TEXT",
    defaultValue: DEFAULT_AI_PROVIDER,
    section: "ai_provider",
    description:
      "Le fournisseur IA utilise par le chatbot public et le copilote admin.",
    control: "select",
    options: AI_PROVIDER_OPTIONS,
  },
  {
    key: "ai_model",
    label: "Modele actif",
    type: "TEXT",
    defaultValue: DEFAULT_AI_MODEL_BY_PROVIDER[DEFAULT_AI_PROVIDER],
    section: "ai_provider",
    description:
      "Modele texte utilise par defaut pour les experiences IA du site et du dashboard.",
    control: "select",
    options: getAiModelOptions(DEFAULT_AI_PROVIDER),
  },
  {
    key: "ai_anthropic_api_key",
    label: "Cle API Anthropic",
    type: "TEXT",
    defaultValue: "",
    section: "ai_provider",
    description:
      "Cle API chiffree en base. Utilisee si Anthropic est selectionne et qu'aucune variable d'environnement n'est fournie.",
    placeholder: "sk-ant-...",
    inputType: "password",
    secret: true,
  },
  {
    key: "ai_openai_api_key",
    label: "Cle API OpenAI",
    type: "TEXT",
    defaultValue: "",
    section: "ai_provider",
    description:
      "Cle API chiffree en base. Utilisee si OpenAI est selectionne et qu'aucune variable d'environnement n'est fournie.",
    placeholder: "sk-proj-...",
    inputType: "password",
    secret: true,
  },
  {
    key: "ai_google_api_key",
    label: "Cle API Google Gemini",
    type: "TEXT",
    defaultValue: "",
    section: "ai_provider",
    description:
      "Cle API chiffree en base. Utilisee si Google Gemini est selectionne et qu'aucune variable d'environnement n'est fournie.",
    placeholder: "AIza...",
    inputType: "password",
    secret: true,
  },
] satisfies readonly SiteSettingCatalogEntry[]

export const chatbotSiteSettingCatalog = [
  {
    key: "public_chatbot_enabled",
    label: "Chatbot public actif",
    type: "BOOLEAN",
    defaultValue: "true",
    section: "public_chatbot",
    description:
      "Active ou desactive l'assistant public visible sur le site web.",
  },
  {
    key: "public_chatbot_title",
    label: "Nom affiche",
    type: "TEXT",
    defaultValue: "VisaCore Assistant",
    section: "public_chatbot",
    description: "Nom affiche dans l'en-tete du widget public.",
    placeholder: "VisaCore Assistant",
  },
  {
    key: "public_chatbot_launcher_label",
    label: "Libelle du bouton",
    type: "TEXT",
    defaultValue: "Chat",
    section: "public_chatbot",
    description:
      "Texte affiche a cote de l'icone du lanceur de chat sur desktop.",
    placeholder: "Chat",
  },
  {
    key: "public_chatbot_welcome_message",
    label: "Message d'accueil",
    type: "TEXT",
    defaultValue:
      "Bonjour ! Je suis l'assistant virtuel de VisaCore Solutions. Comment puis-je vous aider dans votre projet d'immigration ?",
    section: "public_chatbot",
    description:
      "Premier message affiche au visiteur a l'ouverture du chatbot.",
    placeholder:
      "Bonjour ! Je suis l'assistant virtuel de VisaCore Solutions. Comment puis-je vous aider dans votre projet d'immigration ?",
    control: "textarea",
    rows: 4,
  },
  {
    key: "public_chatbot_input_placeholder",
    label: "Texte du champ de saisie",
    type: "TEXT",
    defaultValue: "Posez votre question...",
    section: "public_chatbot",
    description: "Placeholder visible dans le champ de saisie du widget.",
    placeholder: "Posez votre question...",
  },
  {
    key: "public_chatbot_prompt_addendum",
    label: "Consignes metier additionnelles",
    type: "TEXT",
    defaultValue: "",
    section: "public_chatbot",
    description:
      "Instructions ajoutees au prompt systeme pour orienter les reponses du chatbot public.",
    placeholder:
      "Exemple: prioriser les rendez-vous pour les dossiers urgents et mentionner la preparation documentaire.",
    control: "textarea",
    rows: 6,
  },
  {
    key: "public_chatbot_rate_limit_per_hour",
    label: "Limite de messages par heure",
    type: "TEXT",
    defaultValue: "20",
    section: "public_chatbot",
    description:
      "Nombre maximum de messages par heure et par visiteur pour le chatbot public.",
    placeholder: "20",
    inputType: "number",
    validation: "integer",
  },
  {
    key: "admin_ai_enabled",
    label: "Copilote admin actif",
    type: "BOOLEAN",
    defaultValue: "true",
    section: "admin_ai",
    description:
      "Affiche ou masque le copilote IA dans le topbar du dashboard.",
  },
  {
    key: "admin_ai_welcome_message",
    label: "Message d'accueil du copilote",
    type: "TEXT",
    defaultValue:
      "Bonjour ! Je suis votre copilote IA. Je peux vous aider a analyser des leads, rediger des reponses, ou repondre a vos questions sur les procedures d'immigration. Comment puis-je vous assister ?",
    section: "admin_ai",
    description:
      "Message d'accueil visible lors de l'ouverture du copilote admin.",
    placeholder:
      "Bonjour ! Je suis votre copilote IA. Je peux vous aider a analyser des leads, rediger des reponses, ou repondre a vos questions sur les procedures d'immigration. Comment puis-je vous assister ?",
    control: "textarea",
    rows: 4,
  },
  {
    key: "admin_ai_quick_actions",
    label: "Actions rapides",
    type: "TEXT",
    defaultValue:
      "Analyser un lead\nRediger un email\nProcedure visa Canada\nChecklist documents",
    section: "admin_ai",
    description:
      "Une action par ligne. Ces suggestions apparaissent sous le premier message du copilote.",
    placeholder:
      "Analyser un lead\nRediger un email\nProcedure visa Canada\nChecklist documents",
    control: "textarea",
    rows: 5,
  },
  {
    key: "admin_ai_prompt_addendum",
    label: "Consignes metier additionnelles",
    type: "TEXT",
    defaultValue: "",
    section: "admin_ai",
    description:
      "Instructions ajoutees au prompt systeme du copilote pour l'equipe interne.",
    placeholder:
      "Exemple: inclure systematiquement un niveau de priorite et un plan d'action sur 3 etapes pour les leads.",
    control: "textarea",
    rows: 6,
  },
  {
    key: "admin_ai_rate_limit_per_hour",
    label: "Limite de messages par heure",
    type: "TEXT",
    defaultValue: "50",
    section: "admin_ai",
    description:
      "Nombre maximum de messages par heure et par administrateur pour le copilote IA.",
    placeholder: "50",
    inputType: "number",
    validation: "integer",
  },
] satisfies readonly SiteSettingCatalogEntry[]

export const notificationSiteSettingCatalog = [
  {
    key: "email_notifications_enabled",
    label: "Emails transactionnels actifs",
    type: "BOOLEAN",
    defaultValue: "true",
    section: "email",
    description:
      "Interrupteur principal qui autorise ou bloque l'envoi des emails via Resend.",
  },
  {
    key: "notification_from_name",
    label: "Nom expediteur",
    type: "TEXT",
    defaultValue: "VisaCore Solutions",
    section: "email",
    description:
      "Nom expediteur affiche dans la boite de reception des destinataires.",
    placeholder: "VisaCore Solutions",
  },
  {
    key: "notification_from_email",
    label: "Adresse expediteur",
    type: "TEXT",
    defaultValue: "notifications@visacore-solutions.com",
    section: "email",
    description:
      "Adresse email expediteur. Elle doit correspondre a un domaine verifie dans Resend.",
    placeholder: "notifications@visacore-solutions.com",
    inputType: "email",
    validation: "email",
  },
  {
    key: "notification_reply_to_email",
    label: "Adresse de reponse",
    type: "TEXT",
    defaultValue: "contact@visacore-solutions.com",
    section: "email",
    description:
      "Adresse de reponse appliquee aux emails transactionnels. Laisser vide pour utiliser l'adresse expediteur.",
    placeholder: "contact@visacore-solutions.com",
    inputType: "email",
    validation: "email",
  },
  {
    key: "notification_admin_emails",
    label: "Destinataires d'alerte",
    type: "TEXT",
    defaultValue: "",
    section: "email",
    description:
      "Une adresse par ligne ou separee par des virgules. Si vide, les admins et super admins sont utilises.",
    placeholder: "admin@visacore.com\noperations@visacore.com",
    control: "textarea",
    rows: 4,
    validation: "email-list",
  },
] satisfies readonly SiteSettingCatalogEntry[]

export const allSiteSettingCatalog = [
  ...publicSiteSettingCatalog,
  ...aiSiteSettingCatalog,
  ...chatbotSiteSettingCatalog,
  ...notificationSiteSettingCatalog,
] as const satisfies readonly SiteSettingCatalogEntry[]

export type PublicSiteSettingKey =
  (typeof publicSiteSettingCatalog)[number]["key"]
export type AiSiteSettingKey = (typeof aiSiteSettingCatalog)[number]["key"]
export type ChatbotSiteSettingKey =
  (typeof chatbotSiteSettingCatalog)[number]["key"]
export type NotificationSiteSettingKey =
  (typeof notificationSiteSettingCatalog)[number]["key"]

export const publicSiteSettingKeys = publicSiteSettingCatalog.map(
  (setting) => setting.key
) as unknown as readonly string[]

export const publicChatbotSettingKeys = chatbotSiteSettingCatalog
  .filter((setting) => setting.section === "public_chatbot")
  .map((setting) => setting.key) as unknown as readonly string[]

export const aiSiteSettingKeys = aiSiteSettingCatalog.map(
  (setting) => setting.key
) as unknown as readonly string[]

export const adminAiSettingKeys = chatbotSiteSettingCatalog
  .filter((setting) => setting.section === "admin_ai")
  .map((setting) => setting.key) as unknown as readonly string[]

export const notificationSiteSettingKeys = notificationSiteSettingCatalog.map(
  (setting) => setting.key
) as unknown as readonly string[]

type SiteSettingRow = {
  key: string
  value: string
}

export interface PublicSiteConfig {
  siteName: string
  siteDescription: string
  contactEmail: string
  contactPhone: string
  whatsappEnabled: boolean
  whatsappNumber: string
  whatsappLabel: string
  whatsappPrefillMessage: string
  officeAddress: string
  businessHours: string
  facebookUrl: string
  linkedinUrl: string
  instagramUrl: string
}

export interface PublicChatbotSiteConfig {
  enabled: boolean
  title: string
  launcherLabel: string
  welcomeMessage: string
  inputPlaceholder: string
  promptAddendum: string
  rateLimitPerHour: number
}

export interface AiSiteConfig {
  provider: AiProviderId
  model: string
  anthropicApiKey: string
  openaiApiKey: string
  googleApiKey: string
}

export interface AdminAiSiteConfig {
  enabled: boolean
  welcomeMessage: string
  quickActions: string[]
  promptAddendum: string
  rateLimitPerHour: number
}

export interface NotificationSiteConfig {
  emailNotificationsEnabled: boolean
  fromName: string
  fromEmail: string
  replyToEmail: string
  adminEmails: string[]
}

export interface BusinessHoursRow {
  label: string
  value: string
}

export const defaultPublicSiteConfig: PublicSiteConfig = {
  siteName: "VisaCore Solutions",
  siteDescription: "Experts en immigration internationale depuis Lome, Togo",
  contactEmail: "contact@visacore-solutions.com",
  contactPhone: "+228 90 00 00 00",
  whatsappEnabled: true,
  whatsappNumber: "+22890000000",
  whatsappLabel: "Discuter sur WhatsApp",
  whatsappPrefillMessage:
    "Bonjour VisaCore Solutions, je souhaite obtenir des informations sur votre accompagnement.",
  officeAddress: "Boulevard du 13 Janvier, Lome, Togo",
  businessHours: "Lun - Ven: 8h00 - 18h00 | Sam: 9h00 - 13h00",
  facebookUrl: "",
  linkedinUrl: "",
  instagramUrl: "",
}

export const defaultPublicChatbotSiteConfig: PublicChatbotSiteConfig = {
  enabled: true,
  title: "VisaCore Assistant",
  launcherLabel: "Chat",
  welcomeMessage:
    "Bonjour ! Je suis l'assistant virtuel de VisaCore Solutions. Comment puis-je vous aider dans votre projet d'immigration ?",
  inputPlaceholder: "Posez votre question...",
  promptAddendum: "",
  rateLimitPerHour: 20,
}

export const defaultAiSiteConfig: AiSiteConfig = {
  provider: DEFAULT_AI_PROVIDER,
  model: DEFAULT_AI_MODEL_BY_PROVIDER[DEFAULT_AI_PROVIDER],
  anthropicApiKey: "",
  openaiApiKey: "",
  googleApiKey: "",
}

export const defaultAdminAiSiteConfig: AdminAiSiteConfig = {
  enabled: true,
  welcomeMessage:
    "Bonjour ! Je suis votre copilote IA. Je peux vous aider a analyser des leads, rediger des reponses, ou repondre a vos questions sur les procedures d'immigration. Comment puis-je vous assister ?",
  quickActions: [
    "Analyser un lead",
    "Rediger un email",
    "Procedure visa Canada",
    "Checklist documents",
  ],
  promptAddendum: "",
  rateLimitPerHour: 50,
}

export const defaultNotificationSiteConfig: NotificationSiteConfig = {
  emailNotificationsEnabled: true,
  fromName: "VisaCore Solutions",
  fromEmail: "notifications@visacore-solutions.com",
  replyToEmail: "contact@visacore-solutions.com",
  adminEmails: [],
}

function valuesByKey(settings: SiteSettingRow[]) {
  return Object.fromEntries(settings.map((setting) => [setting.key, setting.value]))
}

function parseBooleanSetting(value: string | undefined, fallback: boolean) {
  if (typeof value !== "string" || value.length === 0) {
    return fallback
  }

  return value === "true"
}

function parseCommaSeparatedEmails(value: string | undefined) {
  if (!value) return []

  return value
    .split(/[,\n;]/)
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
}

function parseLineSeparatedList(value: string | undefined) {
  if (!value) return []

  return value
    .split(/\r?\n/)
    .map((entry) => entry.trim())
    .filter(Boolean)
}

function parsePositiveInteger(
  value: string | undefined,
  fallback: number
) {
  const parsed = Number.parseInt(value ?? "", 10)

  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback
  }

  return parsed
}

export function mapPublicSiteConfig(settings: SiteSettingRow[]): PublicSiteConfig {
  const values = valuesByKey(settings)

  return {
    siteName: values.site_name || defaultPublicSiteConfig.siteName,
    siteDescription:
      values.site_description || defaultPublicSiteConfig.siteDescription,
    contactEmail: values.contact_email || defaultPublicSiteConfig.contactEmail,
    contactPhone: values.contact_phone || defaultPublicSiteConfig.contactPhone,
    whatsappEnabled: parseBooleanSetting(
      values.whatsapp_enabled,
      defaultPublicSiteConfig.whatsappEnabled
    ),
    whatsappNumber:
      values.whatsapp_number || defaultPublicSiteConfig.whatsappNumber,
    whatsappLabel:
      values.whatsapp_label || defaultPublicSiteConfig.whatsappLabel,
    whatsappPrefillMessage:
      values.whatsapp_prefill_message ||
      defaultPublicSiteConfig.whatsappPrefillMessage,
    officeAddress:
      values.office_address || defaultPublicSiteConfig.officeAddress,
    businessHours:
      values.business_hours || defaultPublicSiteConfig.businessHours,
    facebookUrl: values.facebook_url || defaultPublicSiteConfig.facebookUrl,
    linkedinUrl: values.linkedin_url || defaultPublicSiteConfig.linkedinUrl,
    instagramUrl: values.instagram_url || defaultPublicSiteConfig.instagramUrl,
  }
}

export function mapAiSiteConfig(settings: SiteSettingRow[]): AiSiteConfig {
  const values = valuesByKey(settings)
  const provider = resolveAiProvider(values.ai_provider)

  return {
    provider,
    model: resolveAiModel(provider, values.ai_model),
    anthropicApiKey:
      values.ai_anthropic_api_key || defaultAiSiteConfig.anthropicApiKey,
    openaiApiKey: values.ai_openai_api_key || defaultAiSiteConfig.openaiApiKey,
    googleApiKey: values.ai_google_api_key || defaultAiSiteConfig.googleApiKey,
  }
}

export function mapPublicChatbotSiteConfig(
  settings: SiteSettingRow[]
): PublicChatbotSiteConfig {
  const values = valuesByKey(settings)

  return {
    enabled: parseBooleanSetting(
      values.public_chatbot_enabled,
      defaultPublicChatbotSiteConfig.enabled
    ),
    title:
      values.public_chatbot_title || defaultPublicChatbotSiteConfig.title,
    launcherLabel:
      values.public_chatbot_launcher_label ||
      defaultPublicChatbotSiteConfig.launcherLabel,
    welcomeMessage:
      values.public_chatbot_welcome_message ||
      defaultPublicChatbotSiteConfig.welcomeMessage,
    inputPlaceholder:
      values.public_chatbot_input_placeholder ||
      defaultPublicChatbotSiteConfig.inputPlaceholder,
    promptAddendum:
      values.public_chatbot_prompt_addendum ||
      defaultPublicChatbotSiteConfig.promptAddendum,
    rateLimitPerHour: parsePositiveInteger(
      values.public_chatbot_rate_limit_per_hour,
      defaultPublicChatbotSiteConfig.rateLimitPerHour
    ),
  }
}

export function mapAdminAiSiteConfig(
  settings: SiteSettingRow[]
): AdminAiSiteConfig {
  const values = valuesByKey(settings)
  const quickActions = parseLineSeparatedList(values.admin_ai_quick_actions)

  return {
    enabled: parseBooleanSetting(
      values.admin_ai_enabled,
      defaultAdminAiSiteConfig.enabled
    ),
    welcomeMessage:
      values.admin_ai_welcome_message ||
      defaultAdminAiSiteConfig.welcomeMessage,
    quickActions:
      quickActions.length > 0
        ? quickActions
        : defaultAdminAiSiteConfig.quickActions,
    promptAddendum:
      values.admin_ai_prompt_addendum ||
      defaultAdminAiSiteConfig.promptAddendum,
    rateLimitPerHour: parsePositiveInteger(
      values.admin_ai_rate_limit_per_hour,
      defaultAdminAiSiteConfig.rateLimitPerHour
    ),
  }
}

export function mapNotificationSiteConfig(
  settings: SiteSettingRow[]
): NotificationSiteConfig {
  const values = valuesByKey(settings)

  return {
    emailNotificationsEnabled: parseBooleanSetting(
      values.email_notifications_enabled,
      defaultNotificationSiteConfig.emailNotificationsEnabled
    ),
    fromName:
      values.notification_from_name || defaultNotificationSiteConfig.fromName,
    fromEmail:
      values.notification_from_email ||
      defaultNotificationSiteConfig.fromEmail,
    replyToEmail:
      values.notification_reply_to_email ||
      defaultNotificationSiteConfig.replyToEmail,
    adminEmails: parseCommaSeparatedEmails(values.notification_admin_emails),
  }
}

export function getSiteSettingCatalogEntry(
  key: string
): SiteSettingCatalogEntry | undefined {
  return allSiteSettingCatalog.find((setting) => setting.key === key)
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function isValidAbsoluteUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === "http:" || url.protocol === "https:"
  } catch {
    return false
  }
}

export function validateSiteSettingValue(
  key: string,
  value: string,
  fallbackType: SiteSettingType
): { valid: boolean; message?: string; type: SiteSettingType } {
  const catalogEntry = getSiteSettingCatalogEntry(key)
  const type = catalogEntry?.type ?? fallbackType
  const trimmedValue = value.trim()

  if (type === "BOOLEAN" && value !== "true" && value !== "false") {
    return {
      valid: false,
      message: "La valeur booleenne doit etre true ou false.",
      type,
    }
  }

  if (type === "JSON") {
    try {
      JSON.parse(value)
    } catch {
      return {
        valid: false,
        message: "Le JSON fourni est invalide.",
        type,
      }
    }
  }

  if (key === "ai_provider" && trimmedValue && !isAiProviderId(trimmedValue)) {
    return {
      valid: false,
      message: "Veuillez choisir un fournisseur IA pris en charge.",
      type,
    }
  }

  switch (catalogEntry?.validation) {
    case "email":
      if (trimmedValue && !isValidEmail(trimmedValue)) {
        return {
          valid: false,
          message: "Veuillez saisir une adresse email valide.",
          type,
        }
      }
      break
    case "email-list": {
      const emails = parseCommaSeparatedEmails(value)
      const invalidEmail = emails.find((email) => !isValidEmail(email))
      if (invalidEmail) {
        return {
          valid: false,
          message: `Adresse email invalide: ${invalidEmail}`,
          type,
        }
      }
      break
    }
    case "phone": {
      const normalized = normalizePhoneNumber(trimmedValue)
      if (trimmedValue && (normalized.length < 8 || normalized.length > 15)) {
        return {
          valid: false,
          message:
            "Veuillez saisir un numero de telephone complet avec indicatif pays si necessaire.",
          type,
        }
      }
      break
    }
    case "url":
      if (trimmedValue && !isValidAbsoluteUrl(trimmedValue)) {
        return {
          valid: false,
          message: "Veuillez saisir une URL absolue en http(s).",
          type,
        }
      }
      break
    case "integer": {
      const parsed = Number.parseInt(trimmedValue, 10)
      if (!Number.isFinite(parsed) || parsed <= 0) {
        return {
          valid: false,
          message: "Veuillez saisir un entier positif superieur a zero.",
          type,
        }
      }
      break
    }
    default:
      break
  }

  return { valid: true, type }
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

export function getWhatsAppHref(value: string, message?: string) {
  const normalized = normalizePhoneNumber(value)

  if (!normalized) {
    return undefined
  }

  const encodedMessage = message?.trim()
    ? `?text=${encodeURIComponent(message.trim())}`
    : ""

  return `https://wa.me/${normalized}${encodedMessage}`
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
