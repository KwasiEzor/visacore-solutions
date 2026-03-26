import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Star } from "lucide-react"

export default async function TestimonialsAdminPage() {
  const testimonials = await prisma.testimonial.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Témoignages</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tous les témoignages ({testimonials.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Client</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Destination</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Note</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Vedette</th>
                  <th className="pb-3 pr-4 font-medium text-muted-foreground">Statut</th>
                  <th className="pb-3 font-medium text-muted-foreground">Date</th>
                </tr>
              </thead>
              <tbody>
                {testimonials.map((t) => (
                  <tr key={t.id} className="border-b last:border-0">
                    <td className="py-3 pr-4 font-medium">{t.clientName}</td>
                    <td className="py-3 pr-4">{t.destination ?? "—"}</td>
                    <td className="py-3 pr-4">
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`size-3.5 ${i < t.rating ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-200"}`} />
                        ))}
                      </div>
                    </td>
                    <td className="py-3 pr-4">
                      {t.featured && <StatusBadge status="Vedette" variant="gold" />}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={t.published ? "Publié" : "Brouillon"} variant={t.published ? "green" : "gray"} />
                    </td>
                    <td className="py-3 text-muted-foreground">
                      {t.createdAt.toLocaleDateString("fr-FR")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
