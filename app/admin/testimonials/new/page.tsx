import { prisma } from "@/lib/prisma"
import { TestimonialForm } from "@/components/admin/testimonial-form"

export default async function NewTestimonialPage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Nouveau témoignage
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Créez un nouveau témoignage client.
        </p>
      </div>
      <TestimonialForm destinations={destinations} />
    </div>
  )
}
