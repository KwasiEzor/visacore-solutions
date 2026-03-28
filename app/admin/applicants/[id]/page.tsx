import { notFound } from "next/navigation"
import { getApplicantAdminRecord } from "@/lib/applicant-portal"
import { prisma } from "@/lib/prisma"
import { ApplicantWorkspace } from "@/components/admin/applicant-workspace"

export default async function ApplicantDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const [applicant, advisors] = await Promise.all([
    getApplicantAdminRecord(id),
    prisma.user.findMany({
      where: {
        role: {
          in: ["SUPER_ADMIN", "ADMIN", "EDITOR"],
        },
      },
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ])

  if (!applicant) {
    notFound()
  }

  return (
    <ApplicantWorkspace
      applicant={{
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
        accessState: applicant.hashedPassword ? "ACTIVE" : "PENDING",
        createdAt: applicant.createdAt.toLocaleDateString("fr-FR"),
        profile: {
          phone: applicant.applicantProfile?.phone ?? null,
          whatsappNumber: applicant.applicantProfile?.whatsappNumber ?? null,
          countryOfResidence:
            applicant.applicantProfile?.countryOfResidence ?? null,
          nationality: applicant.applicantProfile?.nationality ?? null,
          passportNumber: applicant.applicantProfile?.passportNumber ?? null,
          dateOfBirth: applicant.applicantProfile?.dateOfBirth
            ? applicant.applicantProfile.dateOfBirth.toISOString().slice(0, 10)
            : null,
          addressLine: applicant.applicantProfile?.addressLine ?? null,
          city: applicant.applicantProfile?.city ?? null,
          postalCode: applicant.applicantProfile?.postalCode ?? null,
          preferredDestination:
            applicant.applicantProfile?.preferredDestination ?? null,
          targetService: applicant.applicantProfile?.targetService ?? null,
          currentSituation: applicant.applicantProfile?.currentSituation ?? null,
          emergencyContactName:
            applicant.applicantProfile?.emergencyContactName ?? null,
          emergencyContactPhone:
            applicant.applicantProfile?.emergencyContactPhone ?? null,
          marketingConsent:
            applicant.applicantProfile?.marketingConsent ?? false,
        },
        cases: applicant.applicantCases.map((caseItem) => ({
          id: caseItem.id,
          reference: caseItem.reference,
          title: caseItem.title,
          serviceName: caseItem.serviceName ?? null,
          destinationCountry: caseItem.destinationCountry,
          visaCategory: caseItem.visaCategory,
          status: caseItem.status,
          summary: caseItem.summary ?? null,
          currentStep: caseItem.currentStep ?? null,
          nextActionTitle: caseItem.nextActionTitle ?? null,
          nextActionDescription: caseItem.nextActionDescription ?? null,
          nextActionDueAt: caseItem.nextActionDueAt
            ? caseItem.nextActionDueAt.toISOString().slice(0, 10)
            : null,
          updatedAt: caseItem.updatedAt.toLocaleDateString("fr-FR"),
          advisorId: caseItem.advisorId ?? null,
          advisorName: caseItem.advisor?.name ?? null,
          milestones: caseItem.milestones.map((milestone) => ({
            id: milestone.id,
            title: milestone.title,
            description: milestone.description ?? null,
            status: milestone.status,
            occurredAt: milestone.occurredAt
              ? milestone.occurredAt.toISOString().slice(0, 10)
              : null,
            visibleToApplicant: milestone.visibleToApplicant,
          })),
          checklistItems: caseItem.checklistItems.map((item) => ({
            id: item.id,
            title: item.title,
            description: item.description ?? null,
            category: item.category ?? null,
            status: item.status,
            dueDate: item.dueDate ? item.dueDate.toISOString().slice(0, 10) : null,
            visibleToApplicant: item.visibleToApplicant,
            sortOrder: item.sortOrder,
            documents: item.documents.map((document) => ({
              id: document.id,
              label: document.label,
              originalFilename: document.originalFilename,
              mimeType: document.mimeType,
              size: document.size,
              status: document.status,
              reviewNote: document.reviewNote ?? null,
              createdAt: document.createdAt.toLocaleDateString("fr-FR"),
              checklistItemId: document.checklistItemId ?? null,
            })),
          })),
          documents: caseItem.documents.map((document) => ({
            id: document.id,
            label: document.label,
            originalFilename: document.originalFilename,
            mimeType: document.mimeType,
            size: document.size,
            status: document.status,
            reviewNote: document.reviewNote ?? null,
            createdAt: document.createdAt.toLocaleDateString("fr-FR"),
            checklistItemId: document.checklistItemId ?? null,
          })),
        })),
      }}
      advisors={advisors.map((advisor) => ({
        id: advisor.id,
        name: advisor.name ?? advisor.email,
        email: advisor.email,
      }))}
    />
  )
}
