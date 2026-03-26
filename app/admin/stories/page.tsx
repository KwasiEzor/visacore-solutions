import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"

export default async function StoriesAdminPage() {
  const stories = await prisma.successStory.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Success Stories</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Toutes les histoires ({stories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Titre</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Destination</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Statut</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {stories.map((s) => (
                  <tr key={s.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{s.title}</td>
                    <td className="py-3 pr-4">{s.clientName}</td>
                    <td className="py-3 pr-4">{s.destination}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={s.published ? "Publié" : "Brouillon"} variant={s.published ? "green" : "gray"} />
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {s.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
