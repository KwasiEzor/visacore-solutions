import { prisma } from "@/lib/prisma"
import { FAQForm } from "@/components/admin/faq-form"

export default async function NewFAQPage() {
  const destinations = await prisma.destination.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  })

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Nouvelle FAQ</h2>
        <p className="mt-1 text-sm text-muted-foreground">Créez une nouvelle question fréquente.</p>
      </div>
      <FAQForm destinations={destinations} />
    </div>
  )
}
