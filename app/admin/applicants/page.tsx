import { prisma } from "@/lib/prisma"
import { ApplicantsClient } from "@/components/admin/applicants-client"

export default async function ApplicantsAdminPage() {
  const applicants = await prisma.user.findMany({
    where: { role: "APPLICANT" },
    orderBy: { createdAt: "desc" },
    include: {
      applicantProfile: true,
      _count: {
        select: {
          applicantCases: true,
        },
      },
      applicantCases: {
        orderBy: { updatedAt: "desc" },
        take: 1,
      },
    },
  })

  const serialized = applicants.map((applicant) => {
    const latestCase = applicant.applicantCases[0]

    return {
      id: applicant.id,
      name: applicant.name,
      email: applicant.email,
      accessState: (applicant.hashedPassword ? "ACTIVE" : "PENDING") as
        | "ACTIVE"
        | "PENDING",
      createdAt: applicant.createdAt.toLocaleDateString("fr-FR"),
      phone: applicant.applicantProfile?.phone ?? null,
      destination:
        latestCase?.destinationCountry ??
        applicant.applicantProfile?.preferredDestination ??
        null,
      caseCount: applicant._count.applicantCases,
      latestCaseReference: latestCase?.reference ?? null,
      latestCaseStatus: latestCase?.status ?? null,
    }
  })

  return <ApplicantsClient data={serialized} />
}
