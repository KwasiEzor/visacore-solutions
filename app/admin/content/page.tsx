import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ContentAdminPage() {
  const contents = await prisma.pageContent.findMany({
    orderBy: [{ pageKey: "asc" }, { order: "asc" }],
  })

  const grouped = contents.reduce<Record<string, typeof contents>>((acc, c) => {
    if (!acc[c.pageKey]) acc[c.pageKey] = []
    acc[c.pageKey].push(c)
    return acc
  }, {})

  const pageLabels: Record<string, string> = {
    home: "Page d'accueil",
    about: "À propos",
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion du contenu</h1>

      {Object.entries(grouped).map(([pageKey, sections]) => (
        <Card key={pageKey}>
          <CardHeader>
            <CardTitle>{pageLabels[pageKey] ?? pageKey}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {sections.map((section) => (
                <div key={section.id} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        Section: {section.sectionKey}
                      </p>
                      <p className="mt-1 font-semibold">{section.title ?? "Sans titre"}</p>
                      {section.subtitle && (
                        <p className="text-sm text-muted-foreground">{section.subtitle}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {contents.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun contenu de page configuré.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
