import { prisma } from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"

export default async function UsersAdminPage() {
  const session = await auth()
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  })

  const roleLabels: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    ADMIN: "Admin",
    EDITOR: "Éditeur",
  }

  const roleVariant: Record<string, "gold" | "blue" | "gray"> = {
    SUPER_ADMIN: "gold",
    ADMIN: "blue",
    EDITOR: "gray",
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs ({users.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Nom</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Rôle</th>
                  <th className="pb-3 font-medium text-muted-foreground">Inscrit le</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b last:border-0">
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <div className="flex size-8 items-center justify-center rounded-full bg-[#0A2540] text-xs font-semibold text-white">
                          {u.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?"}
                        </div>
                        <span className="font-medium">{u.name ?? "—"}</span>
                        {u.id === session?.user?.id && (
                          <span className="text-xs text-muted-foreground">(vous)</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={roleLabels[u.role] ?? u.role} variant={roleVariant[u.role] ?? "gray"} />
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {u.createdAt.toLocaleDateString("fr-FR")}
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
