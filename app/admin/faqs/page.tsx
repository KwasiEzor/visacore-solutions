import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FAQsClient } from "@/components/admin/faqs-client"

export default async function FAQsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: { order: "asc" },
  })

  const data = faqs.map((faq) => ({
    id: faq.id,
    question: faq.question,
    category: faq.category,
    published: faq.published,
    order: faq.order,
    updatedAt: faq.updatedAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            FAQ
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les questions fréquemment posées.{" "}
            {faqs.length} question{faqs.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/faqs/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouvelle FAQ
          </Button>
        </Link>
      </div>

      <FAQsClient data={data} />
    </div>
  )
}
