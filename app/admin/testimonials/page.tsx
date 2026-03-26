import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { TestimonialsClient } from "@/components/admin/testimonials-client"

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data = testimonials.map((t) => ({
    id: t.id,
    clientName: t.clientName,
    destination: t.destination ?? "",
    rating: t.rating,
    featured: t.featured,
    published: t.published,
    updatedAt: t.updatedAt.toLocaleDateString("fr-FR", {
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
            Témoignages
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les témoignages clients.{" "}
            {testimonials.length} témoignage
            {testimonials.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/testimonials/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouveau témoignage
          </Button>
        </Link>
      </div>

      <TestimonialsClient data={data} />
    </div>
  )
}
