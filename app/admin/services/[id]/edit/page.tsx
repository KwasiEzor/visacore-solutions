import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { ServiceForm } from "@/components/admin/service-form"
import { normalizeStructuredCardItems } from "@/lib/content-structures"

export default async function EditServicePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const service = await prisma.service.findUnique({
    where: { id },
  })

  if (!service) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Modifier le service
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez les informations de {service.name}.
        </p>
      </div>
      <ServiceForm
        initialData={{
          id: service.id,
          name: service.name,
          slug: service.slug,
          icon: service.icon || "",
          description: service.description || "",
          whoIsItFor: service.whoIsItFor || "",
          requiredSupport: service.requiredSupport || "",
          benefits: normalizeStructuredCardItems(service.benefits),
          ctaText: service.ctaText || "",
          published: service.published,
          order: service.order,
          seoTitle: service.seoTitle || "",
          seoDescription: service.seoDescription || "",
        }}
      />
    </div>
  )
}
