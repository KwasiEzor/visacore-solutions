import { getAiRuntimeConfig } from "@/lib/ai"
import { prisma } from "@/lib/prisma"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SettingEditor } from "@/components/admin/setting-editor"
import {
  allSiteSettingCatalog,
  mapAiSiteConfig,
  mapAdminAiSiteConfig,
  mapNotificationSiteConfig,
  mapPublicChatbotSiteConfig,
  mapPublicSiteConfig,
  siteSettingSections,
} from "@/lib/site-config"
import type { SiteSettingCatalogEntry } from "@/lib/site-config"
import { AI_PROVIDER_LABELS, getAiModelOptions } from "@/lib/ai-settings.shared"
import {
  hasStoredSecretValue,
  isSecretStorageAvailable,
} from "@/lib/settings-secrets"

type ResolvedSetting = SiteSettingCatalogEntry & {
  id: string
  value: string
  secretConfigured: boolean
}

function getStatusTone(active: boolean) {
  return active
    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
    : "border-amber-200 bg-amber-50 text-amber-700"
}

export default async function SettingsAdminPage() {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  })

  const settingsMap = new Map(settings.map((setting) => [setting.key, setting]))

  const rawSettings: Array<SiteSettingCatalogEntry & { id: string; value: string }> =
    allSiteSettingCatalog.map((catalogEntry) => ({
    ...catalogEntry,
    id: settingsMap.get(catalogEntry.key)?.id ?? catalogEntry.key,
    value: settingsMap.get(catalogEntry.key)?.value ?? catalogEntry.defaultValue,
  }))

  const flatSettings = rawSettings.map((setting) => ({
    key: setting.key,
    value: setting.value,
  }))

  const publicConfig = mapPublicSiteConfig(flatSettings)
  const aiConfig = mapAiSiteConfig(flatSettings)
  const publicChatbotConfig = mapPublicChatbotSiteConfig(flatSettings)
  const adminAiConfig = mapAdminAiSiteConfig(flatSettings)
  const notificationConfig = mapNotificationSiteConfig(flatSettings)
  const aiRuntime = await getAiRuntimeConfig()

  const resolvedSettings: ResolvedSetting[] = rawSettings.map((catalogEntry) => ({
    ...catalogEntry,
    value: catalogEntry.secret ? "" : catalogEntry.value,
    secretConfigured: catalogEntry.secret
      ? hasStoredSecretValue(settingsMap.get(catalogEntry.key)?.value)
      : false,
    options:
      catalogEntry.key === "ai_model"
        ? getAiModelOptions(aiConfig.provider)
        : catalogEntry.options,
  }))

  const sectionedSettings = siteSettingSections.map((section) => ({
    ...section,
    settings: resolvedSettings.filter((setting) => setting.section === section.id),
  }))

  const statusCards = [
    {
      title: "IA active",
      value: AI_PROVIDER_LABELS[aiRuntime.provider],
      detail: `${aiRuntime.model} · source ${aiRuntime.apiKeySource === "dashboard" ? "dashboard" : aiRuntime.apiKeySource === "environment" ? "environnement" : "manquant"}`,
      tone: getStatusTone(aiRuntime.apiKeySource !== "missing"),
    },
    {
      title: "WhatsApp",
      value: publicConfig.whatsappEnabled ? "Actif" : "Inactif",
      detail: publicConfig.whatsappEnabled
        ? publicConfig.whatsappNumber
        : "Bouton masque sur le site public",
      tone: getStatusTone(publicConfig.whatsappEnabled),
    },
    {
      title: "Chatbot public",
      value: publicChatbotConfig.enabled ? "Actif" : "Inactif",
      detail: publicChatbotConfig.enabled
        ? `${publicChatbotConfig.rateLimitPerHour} messages / heure`
        : "Assistant public desactive",
      tone: getStatusTone(publicChatbotConfig.enabled),
    },
    {
      title: "Copilote admin",
      value: adminAiConfig.enabled ? "Actif" : "Inactif",
      detail: adminAiConfig.enabled
        ? `${adminAiConfig.quickActions.length} actions rapides configurees`
        : "Copilote retire du dashboard",
      tone: getStatusTone(adminAiConfig.enabled),
    },
    {
      title: "Emails",
      value: notificationConfig.emailNotificationsEnabled ? "Actifs" : "Inactifs",
      detail: notificationConfig.fromEmail,
      tone: getStatusTone(notificationConfig.emailNotificationsEnabled),
    },
  ]

  const providerCards = [
    {
      title: "Stockage chiffre",
      status: isSecretStorageAvailable() ? "Pret" : "Indisponible",
      detail: isSecretStorageAvailable()
        ? "Les cles saisies ici sont chiffrees cote serveur."
        : "Ajoutez SITE_SETTINGS_ENCRYPTION_KEY ou AUTH_SECRET pour activer le stockage chiffre.",
      tone: getStatusTone(isSecretStorageAvailable()),
    },
    {
      title: "Anthropic",
      status: hasStoredSecretValue(settingsMap.get("ai_anthropic_api_key")?.value)
        ? "Dashboard"
        : process.env.ANTHROPIC_API_KEY
          ? "Environnement"
          : "Manquant",
      detail: "Modele Claude disponible pour les experiences IA.",
      tone: getStatusTone(
        hasStoredSecretValue(settingsMap.get("ai_anthropic_api_key")?.value) ||
          Boolean(process.env.ANTHROPIC_API_KEY)
      ),
    },
    {
      title: "OpenAI",
      status: hasStoredSecretValue(settingsMap.get("ai_openai_api_key")?.value)
        ? "Dashboard"
        : process.env.OPENAI_API_KEY
          ? "Environnement"
          : "Manquant",
      detail: "Modele GPT disponible pour les experiences IA.",
      tone: getStatusTone(
        hasStoredSecretValue(settingsMap.get("ai_openai_api_key")?.value) ||
          Boolean(process.env.OPENAI_API_KEY)
      ),
    },
    {
      title: "Google Gemini",
      status: hasStoredSecretValue(settingsMap.get("ai_google_api_key")?.value)
        ? "Dashboard"
        : process.env.GOOGLE_GENERATIVE_AI_API_KEY
          ? "Environnement"
          : "Manquant",
      detail: "Modele Gemini disponible pour les experiences IA.",
      tone: getStatusTone(
        hasStoredSecretValue(settingsMap.get("ai_google_api_key")?.value) ||
          Boolean(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
      ),
    },
    {
      title: "Resend",
      status: process.env.RESEND_API_KEY ? "Connecte" : "Manquant",
      detail: process.env.RESEND_API_KEY
        ? "Le transport email est pret a envoyer."
        : "Ajoutez RESEND_API_KEY pour activer les envois.",
      tone: getStatusTone(Boolean(process.env.RESEND_API_KEY)),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
            Configuration
          </p>
          <h1 className="text-2xl font-bold text-visacore-navy">
            Parametres communications et IA
          </h1>
          <p className="max-w-3xl text-sm text-muted-foreground">
            Gere les canaux visibles sur le site public, le copilote admin, les
            emails transactionnels et le fournisseur IA actif depuis une seule
            interface. Les cles IA peuvent etre lues depuis l&apos;environnement
            ou stockees de maniere chiffree dans le dashboard.
          </p>
          <p className="text-xs font-medium text-muted-foreground/90">
            Chaque modification affiche maintenant ses propres actions
            d&apos;enregistrement et d&apos;annulation.
          </p>
        </div>
        <Badge variant="outline" className="w-fit border-visacore-gold/30 bg-visacore-gold/10 text-visacore-navy">
          {resolvedSettings.length} parametres surveilles
        </Badge>
      </div>

      <div className="grid gap-4 xl:grid-cols-5">
        {statusCards.map((card) => (
          <Card key={card.title} className="rounded-[24px] border border-visacore-navy/8 bg-white">
            <CardHeader className="gap-2">
              <CardDescription>{card.title}</CardDescription>
              <div className="flex items-center gap-2">
                <CardTitle className="text-xl text-visacore-navy">
                  {card.value}
                </CardTitle>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${card.tone}`}>
                  {card.value}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              {card.detail}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {providerCards.map((provider) => (
          <Card
            key={provider.title}
            className="rounded-[24px] border border-visacore-navy/8 bg-[linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]"
          >
            <CardHeader className="gap-2">
              <CardDescription>{provider.title}</CardDescription>
              <div className="flex items-center gap-2">
                <CardTitle className="text-lg text-visacore-navy">
                  {provider.status}
                </CardTitle>
                <span className={`rounded-full border px-2 py-1 text-[11px] font-semibold ${provider.tone}`}>
                  {provider.status}
                </span>
              </div>
            </CardHeader>
            <CardContent className="pt-0 text-sm text-muted-foreground">
              {provider.detail}
            </CardContent>
          </Card>
        ))}
      </div>

      {sectionedSettings.map((section) => (
        <Card
          key={section.id}
          className="rounded-[28px] border border-visacore-navy/8 bg-white shadow-[0_24px_80px_-56px_rgba(10,37,64,0.25)]"
        >
          <CardHeader className="border-b border-visacore-navy/8 pb-5">
            <CardDescription>{section.title}</CardDescription>
            <CardTitle className="text-xl text-visacore-navy">
              {section.title}
            </CardTitle>
            <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
              {section.description}
            </p>
          </CardHeader>
          <CardContent className="space-y-0 pt-0">
            {section.settings.map((setting) => (
              <div
                key={setting.id}
                className="grid gap-4 border-b border-visacore-navy/8 py-5 last:border-b-0 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8"
              >
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-semibold text-visacore-navy">
                      {setting.label}
                    </p>
                    <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                      {setting.type}
                    </Badge>
                    {setting.secret ? (
                      <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                        Secret
                      </Badge>
                    ) : null}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {setting.description}
                  </p>
                  <code className="block text-xs text-muted-foreground/80">
                    {setting.key}
                  </code>
                </div>
                <div className="min-w-0">
                  <SettingEditor
                    settingKey={setting.key}
                    value={setting.value}
                    type={setting.type}
                    placeholder={setting.placeholder}
                    inputType={setting.inputType}
                    control={setting.control}
                    rows={setting.rows}
                    options={setting.options}
                    secret={setting.secret}
                    secretConfigured={setting.secretConfigured}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
