import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function SettingsAdminPage() {
  const settings = await prisma.siteSetting.findMany({
    orderBy: { key: "asc" },
  })

  const settingLabels: Record<string, string> = {
    site_name: "Nom du site",
    site_description: "Description du site",
    contact_email: "Email de contact",
    contact_phone: "Téléphone",
    whatsapp_number: "Numéro WhatsApp",
    office_address: "Adresse du bureau",
    business_hours: "Horaires d'ouverture",
    facebook_url: "Facebook",
    linkedin_url: "LinkedIn",
    instagram_url: "Instagram",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Paramètres du site</h1>

      <Card>
        <CardHeader>
          <CardTitle>Configuration générale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {settings.map((setting) => (
              <div key={setting.id} className="flex items-start justify-between rounded-lg border p-4">
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    {settingLabels[setting.key] ?? setting.key}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">{setting.value}</p>
                </div>
                <span className="ml-4 rounded bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                  {setting.type}
                </span>
              </div>
            ))}
          </div>
          {settings.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Aucun paramètre configuré. Exécutez le seed pour initialiser.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
