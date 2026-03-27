import { prisma } from "@/lib/prisma"
import { LeadsClient } from "@/components/admin/leads-client"

export default async function LeadsPage() {
  const leads = await prisma.lead.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: { name: true },
      },
    },
  })

  const data = leads.map((lead) => ({
    id: lead.id,
    fullName: lead.fullName,
    email: lead.email,
    destination: lead.destination,
    status: lead.status,
    assignedToName: lead.assignedTo?.name ?? null,
    createdAtLabel: lead.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div>
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Leads
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerez et suivez tous vos leads. {leads.length} lead
            {leads.length !== 1 ? "s" : ""} au total.
          </p>
        </div>
      </div>

      <LeadsClient data={data} />
    </div>
  )
}
