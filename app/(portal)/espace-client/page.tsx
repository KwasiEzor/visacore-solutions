import { redirect } from "next/navigation"
import { auth } from "@/lib/auth"
import { getApplicantPortalRecord } from "@/lib/applicant-portal"
import { ApplicantPortalDashboard } from "@/components/applicant/portal-dashboard"

export default async function ApplicantPortalPage() {
  const session = await auth()

  if (!session?.user?.id) {
    redirect("/espace-client/connexion")
  }

  const applicant = await getApplicantPortalRecord(session.user.id)

  if (!applicant) {
    redirect("/espace-client/connexion")
  }

  return (
    <ApplicantPortalDashboard
      applicant={{
        id: applicant.id,
        name: applicant.name,
        email: applicant.email,
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
          advisorName: caseItem.advisor?.name ?? null,
          advisorEmail: caseItem.advisor?.email ?? null,
          milestones: caseItem.milestones
            .filter((milestone) => milestone.visibleToApplicant)
            .map((milestone) => ({
              id: milestone.id,
              title: milestone.title,
              description: milestone.description ?? null,
              status: milestone.status,
              occurredAt: milestone.occurredAt
                ? milestone.occurredAt.toISOString().slice(0, 10)
                : null,
            })),
          checklistItems: caseItem.checklistItems
            .filter((item) => item.visibleToApplicant)
            .map((item) => ({
              id: item.id,
              title: item.title,
              description: item.description ?? null,
              category: item.category ?? null,
              status: item.status,
              dueDate: item.dueDate ? item.dueDate.toISOString().slice(0, 10) : null,
              documents: item.documents.map((document) => ({
                id: document.id,
                label: document.label,
                originalFilename: document.originalFilename,
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
            size: document.size,
            status: document.status,
            reviewNote: document.reviewNote ?? null,
            createdAt: document.createdAt.toLocaleDateString("fr-FR"),
            checklistItemId: document.checklistItemId ?? null,
          })),
        })),
      }}
    />
  )
}
