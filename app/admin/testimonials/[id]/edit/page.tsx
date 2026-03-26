import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { TestimonialForm } from "@/components/admin/testimonial-form"

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [testimonial, destinations] = await Promise.all([
    prisma.testimonial.findUnique({ where: { id } }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!testimonial) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Modifier le témoignage
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez le témoignage de {testimonial.clientName}.
        </p>
      </div>
      <TestimonialForm
        destinations={destinations}
        initialData={{
          id: testimonial.id,
          clientName: testimonial.clientName,
          clientImage: testimonial.clientImage || "",
          destination: testimonial.destination || "",
          destinationId: testimonial.destinationId || null,
          content: testimonial.content,
          rating: testimonial.rating,
          featured: testimonial.featured,
          published: testimonial.published,
        }}
      />
    </div>
  )
}
