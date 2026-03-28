import { prisma } from "@/lib/prisma"
import { PrivacyRequestsClient } from "@/components/admin/privacy-requests-client"

export default async function PrivacyRequestsPage() {
  const requests = await prisma.dataPrivacyRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data = requests.map((request) => ({
    id: request.id,
    fullName: request.fullName,
    email: request.email,
    phone: request.phone,
    requestType: request.requestType,
    status: request.status,
    resolutionNotes: request.resolutionNotes,
    createdAtLabel: request.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Demandes RGPD
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Centralisez les demandes d&apos;acces, rectification, effacement,
          portabilite, opposition et retrait du consentement. {requests.length}{" "}
          demande{requests.length !== 1 ? "s" : ""} au total.
        </p>
      </div>

      <PrivacyRequestsClient data={data} />
    </div>
  )
}
