import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { FAQForm } from "@/components/admin/faq-form"

export default async function EditFAQPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const [faq, destinations] = await Promise.all([
    prisma.fAQ.findUnique({ where: { id } }),
    prisma.destination.findMany({
      select: { id: true, name: true },
      orderBy: { name: "asc" },
    }),
  ])

  if (!faq) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Modifier la FAQ
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez cette question fréquente.
        </p>
      </div>
      <FAQForm
        destinations={destinations}
        initialData={{
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category,
          destinationId: faq.destinationId ?? null,
          published: faq.published,
          order: faq.order,
        }}
      />
    </div>
  )
}
