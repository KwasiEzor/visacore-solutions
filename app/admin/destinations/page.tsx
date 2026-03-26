import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { PublishedBadge } from "@/components/admin/status-badge"
import { DestinationRowActions } from "@/components/admin/destination-actions"
import { Button } from "@/components/ui/button"

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Destinations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez les destinations d&apos;immigration.{" "}
            {destinations.length} destination
            {destinations.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/destinations/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouvelle destination
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
                  Slug
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ordre
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Derniere modification
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {destinations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucune destination. Commencez par en creer une.
                  </td>
                </tr>
              ) : (
                destinations.map((dest) => (
                  <tr
                    key={dest.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                      {dest.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        /{dest.slug}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <PublishedBadge published={dest.published} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {dest.order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {dest.updatedAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <DestinationRowActions destinationId={dest.id} />
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
