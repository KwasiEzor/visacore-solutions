"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/admin/status-badge"
import { UserActions } from "@/components/admin/user-actions"
import { UserCreateDialog } from "@/components/admin/user-create-dialog"
import { Download, Plus } from "lucide-react"

interface UserItem {
  id: string
  name: string | null
  email: string
  role: string
  accessState: "ACTIVE" | "PENDING"
  createdAt: string
}

interface UsersClientProps {
  data: UserItem[]
  currentUserId: string
}

const roleLabels: Record<string, string> = {
  SUPER_ADMIN: "Super Admin",
  ADMIN: "Admin",
  EDITOR: "Editeur",
}

const roleVariant: Record<string, "gold" | "blue" | "gray"> = {
  SUPER_ADMIN: "gold",
  ADMIN: "blue",
  EDITOR: "gray",
}

const accessLabels: Record<UserItem["accessState"], string> = {
  ACTIVE: "Actif",
  PENDING: "Invitation en attente",
}

const accessVariant: Record<UserItem["accessState"], "green" | "gold"> = {
  ACTIVE: "green",
  PENDING: "gold",
}

function exportCSV(data: UserItem[]) {
  const header = "Nom,Email,Role,Acces,Date de creation"
  const rows = data.map(
    (u) =>
      `"${u.name ?? ""}","${u.email}","${roleLabels[u.role] ?? u.role}","${accessLabels[u.accessState]}","${u.createdAt}"`
  )
  const csv = [header, ...rows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = "utilisateurs.csv"
  link.click()
  URL.revokeObjectURL(url)
}

export function UsersClient({ data, currentUserId }: UsersClientProps) {
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Utilisateurs</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(data)}>
            <Download className="mr-1.5 size-3.5" />
            Export CSV
          </Button>
          <Button size="sm" onClick={() => setCreateOpen(true)}>
            <Plus className="mr-1.5 size-3.5" />
            Nouvel utilisateur
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les utilisateurs ({data.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Nom</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Email</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Role</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Acces</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Inscrit le</th>
                  <th className="pb-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((u) => {
                  const isSelf = u.id === currentUserId
                  return (
                    <tr key={u.id} className="border-b last:border-0">
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[#0A2540] text-xs font-semibold text-white">
                            {u.name
                              ?.split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2) ?? "?"}
                          </div>
                          <span className="font-medium">{u.name ?? "\u2014"}</span>
                          {isSelf && (
                            <span className="text-xs text-muted-foreground">(vous)</span>
                          )}
                        </div>
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{u.email}</td>
                      <td className="py-3 pr-4">
                        <StatusBadge
                          status={roleLabels[u.role] ?? u.role}
                          variant={roleVariant[u.role] ?? "gray"}
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <StatusBadge
                          status={accessLabels[u.accessState]}
                          variant={accessVariant[u.accessState]}
                        />
                      </td>
                      <td className="py-3 pr-4 text-muted-foreground">{u.createdAt}</td>
                      <td className="py-3">
                        <UserActions
                          userId={u.id}
                          currentRole={u.role}
                          accessState={u.accessState}
                          isSelf={isSelf}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {data.length === 0 && (
            <p className="py-8 text-center text-muted-foreground">
              Aucun utilisateur trouve.
            </p>
          )}
        </CardContent>
      </Card>

      <UserCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}
