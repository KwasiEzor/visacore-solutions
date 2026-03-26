import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { PublishedBadge } from "@/components/admin/status-badge"
import { FAQRowActions } from "@/components/admin/faq-actions"
import { Button } from "@/components/ui/button"

export default async function FAQsPage() {
  const faqs = await prisma.fAQ.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
    include: {
      destination: {
        select: { name: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            FAQ
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez les questions frequemment posees.{" "}
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

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Question
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Categorie
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Destination
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Ordre
                </th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {faqs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucune FAQ. Commencez par en creer une.
                  </td>
                </tr>
              ) : (
                faqs.map((faq) => (
                  <tr
                    key={faq.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="px-6 py-4">
                      <p className="max-w-md truncate text-sm font-medium text-foreground">
                        {faq.question}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
                        {faq.category}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {faq.destination?.name ?? (
                        <span className="italic text-muted-foreground/60">
                          Generale
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <PublishedBadge published={faq.published} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {faq.order}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <FAQRowActions faqId={faq.id} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
