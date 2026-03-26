import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ServicesClient } from "@/components/admin/services-client"

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    orderBy: { order: "asc" },
  })

  const data = services.map((s) => ({
    id: s.id,
    name: s.name,
    slug: s.slug,
    icon: s.icon || "",
    published: s.published,
    order: s.order,
    updatedAt: s.updatedAt.toLocaleDateString("fr-FR", {
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
            Services
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les services proposés. {services.length} service{services.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/services/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouveau service
          </Button>
        </Link>
      </div>
      <ServicesClient data={data} />
    </div>
  )
}
