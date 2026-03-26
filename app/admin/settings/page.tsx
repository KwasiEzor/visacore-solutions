import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SettingEditor } from "@/components/admin/setting-editor"

export default async function SettingsAdminPage() {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  })

  const settingLabels: Record<string, string> = {
    site_name: "Nom du site",
    site_description: "Description du site",
    contact_email: "Email de contact",
    contact_phone: "Telephone",
    whatsapp_number: "Numero WhatsApp",
    office_address: "Adresse du bureau",
    business_hours: "Horaires d'ouverture",
    facebook_url: "Facebook",
    linkedin_url: "LinkedIn",
    instagram_url: "Instagram",
  }

  const typeColors: Record<string, string> = {
    TEXT: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    IMAGE: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    JSON: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    BOOLEAN: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Parametres du site</h1>

      <Card className="rounded-xl">
        <CardHeader>
          <CardTitle>Configuration generale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y">
            {settings.map((setting) => (
              <div key={setting.id} className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-start sm:gap-6">
                <div className="flex shrink-0 flex-col gap-1 sm:w-48">
                  <p className="text-sm font-medium">
                    {settingLabels[setting.key] ?? setting.key}
                  </p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs text-muted-foreground">
                      {setting.key}
                    </code>
                    <span
                      className={`rounded px-1.5 py-0.5 text-[10px] font-semibold ${
                        typeColors[setting.type] ?? typeColors.TEXT
                      }`}
                    >
                      {setting.type}
                    </span>
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <SettingEditor
                    settingKey={setting.key}
                    value={setting.value}
                    type={setting.type as "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"}
                  />
                </div>
              </div>
            ))}
          </div>
          {settings.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Aucun parametre configure. Executez le seed pour initialiser.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
