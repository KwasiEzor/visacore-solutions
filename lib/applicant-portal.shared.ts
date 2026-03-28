export const applicantRole = "APPLICANT" as const

export const procedureStatuses = [
  "INTAKE",
  "DOCUMENTS_PENDING",
  "IN_REVIEW",
  "SUBMITTED",
  "INTERVIEW_SCHEDULED",
  "DECISION_PENDING",
  "APPROVED",
  "REFUSED",
  "COMPLETED",
  "ON_HOLD",
] as const

export const milestoneStatuses = [
  "PENDING",
  "IN_PROGRESS",
  "DONE",
] as const

export const checklistItemStatuses = [
  "PENDING",
  "REQUESTED",
  "UPLOADED",
  "UNDER_REVIEW",
  "ACCEPTED",
  "NEEDS_REVISION",
  "WAIVED",
] as const

export const applicantDocumentStatuses = [
  "UPLOADED",
  "UNDER_REVIEW",
  "ACCEPTED",
  "NEEDS_REVISION",
  "ARCHIVED",
] as const

export type ProcedureStatusValue = (typeof procedureStatuses)[number]
export type MilestoneStatusValue = (typeof milestoneStatuses)[number]
export type ChecklistItemStatusValue = (typeof checklistItemStatuses)[number]
export type ApplicantDocumentStatusValue =
  (typeof applicantDocumentStatuses)[number]

export const procedureStatusLabels: Record<ProcedureStatusValue, string> = {
  INTAKE: "Ouverture du dossier",
  DOCUMENTS_PENDING: "Documents attendus",
  IN_REVIEW: "Analyse en cours",
  SUBMITTED: "Dossier soumis",
  INTERVIEW_SCHEDULED: "Entretien planifie",
  DECISION_PENDING: "Decision en attente",
  APPROVED: "Approuve",
  REFUSED: "Refuse",
  COMPLETED: "Procedure terminee",
  ON_HOLD: "En pause",
}

export const milestoneStatusLabels: Record<MilestoneStatusValue, string> = {
  PENDING: "A venir",
  IN_PROGRESS: "En cours",
  DONE: "Termine",
}

export const checklistItemStatusLabels: Record<ChecklistItemStatusValue, string> =
  {
    PENDING: "A preparer",
    REQUESTED: "Demande",
    UPLOADED: "Transmis",
    UNDER_REVIEW: "Verification en cours",
    ACCEPTED: "Valide",
    NEEDS_REVISION: "Correction demandee",
    WAIVED: "Non requis",
  }

export const applicantDocumentStatusLabels: Record<
  ApplicantDocumentStatusValue,
  string
> = {
  UPLOADED: "Depose",
  UNDER_REVIEW: "En verification",
  ACCEPTED: "Valide",
  NEEDS_REVISION: "A corriger",
  ARCHIVED: "Archive",
}

const procedureOrder: ProcedureStatusValue[] = [
  "INTAKE",
  "DOCUMENTS_PENDING",
  "IN_REVIEW",
  "SUBMITTED",
  "INTERVIEW_SCHEDULED",
  "DECISION_PENDING",
  "APPROVED",
  "COMPLETED",
]

export function isApplicantRole(role: string | undefined | null) {
  return role === applicantRole
}

export function isStaffRole(role: string | undefined | null) {
  return Boolean(role) && role !== applicantRole
}

export function getProcedureProgress(status: string | undefined | null) {
  if (!status) {
    return { stepIndex: 0, totalSteps: procedureOrder.length, percent: 0 }
  }

  if (status === "REFUSED") {
    return {
      stepIndex: procedureOrder.length - 2,
      totalSteps: procedureOrder.length,
      percent: 88,
    }
  }

  if (status === "ON_HOLD") {
    return {
      stepIndex: 1,
      totalSteps: procedureOrder.length,
      percent: 18,
    }
  }

  const stepIndex = Math.max(procedureOrder.indexOf(status as ProcedureStatusValue), 0)
  const percent =
    procedureOrder.length > 1
      ? Math.round((stepIndex / (procedureOrder.length - 1)) * 100)
      : 0

  return {
    stepIndex,
    totalSteps: procedureOrder.length,
    percent,
  }
}

export const portalQuickFacts = [
  "Votre espace centralise les prochaines etapes, pieces attendues et mises a jour importantes.",
  "Les donnees sensibles peuvent etre corrigees depuis votre profil ou completees par depot de documents.",
  "Toute demande de suppression globale passe par un workflow RGPD trace pour proteger votre dossier.",
]
