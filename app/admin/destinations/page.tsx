import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, Download } from "lucide-react"
import { PublishedBadge } from "@/components/admin/status-badge"
import { DestinationRowActions } from "@/components/admin/destination-actions"
import { Button } from "@/components/ui/button"
import { DestinationsClient } from "@/components/admin/destinations-client"

export default async function DestinationsPage() {
  const destinations = await prisma.destination.findMany({
    orderBy: { order: "asc" },
  })

  const data = destinations.map((d) => ({
    id: d.id,
    name: d.name,
    slug: d.slug,
    published: d.published,
    order: d.order,
    updatedAt: d.updatedAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Destinations
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les destinations d&apos;immigration.{" "}
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

      <DestinationsClient data={data} />
    </div>
  )
}
