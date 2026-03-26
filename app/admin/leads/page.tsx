import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Eye, Plus } from "lucide-react"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: { name: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Leads
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez et suivez tous vos leads. {leads.length} lead
            {leads.length !== 1 ? "s" : ""} au total.
          </p>
        </div>
        <Link href="/admin/leads/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouveau lead
          </Button>
        </Link>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nom
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Destination
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Assigne a
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucun lead pour le moment.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr
                    key={lead.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                      <Link
                        href={`/admin/leads/${lead.id}`}
                        className="hover:underline"
                      >
                        {lead.fullName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {lead.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {lead.destination}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {lead.assignedTo?.name ?? (
                        <span className="italic text-muted-foreground/60">
                          Non assigne
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {lead.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <Link href={`/admin/leads/${lead.id}`}>
                        <Button variant="ghost" size="icon-sm">
                          <Eye className="size-4" />
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
