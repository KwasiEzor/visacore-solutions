import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { PublishedBadge } from "@/components/admin/status-badge"
import { ServiceRowActions } from "@/components/admin/service-actions"
import { Button } from "@/components/ui/button"

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Services
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez les services proposes.{" "}
            {services.length} service{services.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouveau service
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
                  Icone
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
              {services.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucun service. Commencez par en creer un.
                  </td>
                </tr>
              ) : (
                services.map((service) => (
                  <tr
                    key={service.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                      {service.name}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        /{service.slug}
                      </code>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {service.icon ?? (
                        <span className="italic text-muted-foreground/60">
                          Aucune
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <PublishedBadge published={service.published} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {service.order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {service.updatedAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <ServiceRowActions serviceId={service.id} />
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
