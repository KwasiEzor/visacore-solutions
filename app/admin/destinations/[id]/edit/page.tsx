import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { DestinationForm } from "@/components/admin/destination-form"
import {
  normalizeStructuredCardItems,
  normalizeVisaCategoryItems,
} from "@/lib/content-structures"

export default async function EditDestinationPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const destination = await prisma.destination.findUnique({
    where: { id },
  })

  if (!destination) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Modifier la destination
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez les informations de {destination.name}.
        </p>
      </div>
      <DestinationForm
        initialData={{
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          heroTitle: destination.heroTitle,
          heroDescription: destination.heroDescription || "",
          heroImage: destination.heroImage || "",
          opportunities: normalizeStructuredCardItems(destination.opportunities),
          visaCategories: normalizeVisaCategoryItems(destination.visaCategories),
          whyChoose: normalizeStructuredCardItems(destination.whyChoose),
          ctaText: destination.ctaText || "",
          published: destination.published,
          order: destination.order,
          seoTitle: destination.seoTitle || "",
          seoDescription: destination.seoDescription || "",
        }}
      />
    </div>
  )
}
