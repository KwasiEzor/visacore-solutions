"use server"

import fs from "node:fs/promises"
import path from "node:path"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { hasPermission } from "@/lib/rbac"
import { isApplicantRole } from "@/lib/applicant-portal.shared"
import {
  buildApplicantCaseReference,
  normalizeOptionalDateInput,
} from "@/lib/applicant-portal"
import {
  applicantCaseCreateSchema,
  applicantCaseSchema,
  applicantChecklistItemSchema,
  applicantChecklistItemUpdateSchema,
  applicantDeletionRequestSchema,
  applicantDocumentReviewSchema,
  applicantMilestoneSchema,
  applicantProfileSchema,
  createApplicantSchema,
} from "@/lib/validations/applicant"
import { validateUploadFileMetadata } from "@/lib/upload-policy.shared"
import {
  notifyPrivacyRequestCreated,
  sendApplicantPortalInvitationEmail,
  sendApplicantPortalPasswordResetEmail,
} from "@/lib/business-notifications"

const applicantsAdminPath = "/admin/applicants"

function getApplicantAdminDetailPath(applicantId: string) {
  return `/admin/applicants/${applicantId}`
}

async function requireApplicantManager() {
  const session = await auth()
  if (!session || !hasPermission(session.user.role, "manage_applicants")) {
    return { error: "Non autorise" as const }
  }

  return { session }
}

async function requireApplicantUser() {
  const session = await auth()
  if (!session?.user?.id || !isApplicantRole(session.user.role)) {
    return { error: "Non autorise" as const }
  }

  return { session }
}

function toProfileUpsertInput(data: ReturnType<typeof applicantProfileSchema.parse>) {
  return {
    phone: data.phone || null,
    whatsappNumber: data.whatsappNumber || null,
    countryOfResidence: data.countryOfResidence || null,
    nationality: data.nationality || null,
    passportNumber: data.passportNumber || null,
    dateOfBirth: normalizeOptionalDateInput(data.dateOfBirth),
    addressLine: data.addressLine || null,
    city: data.city || null,
    postalCode: data.postalCode || null,
    preferredDestination: data.preferredDestination || null,
    targetService: data.targetService || null,
    currentSituation: data.currentSituation || null,
    emergencyContactName: data.emergencyContactName || null,
    emergencyContactPhone: data.emergencyContactPhone || null,
    marketingConsent: data.marketingConsent ?? false,
  }
}

function toCaseInput(data: ReturnType<typeof applicantCaseSchema.parse>) {
  return {
    title: data.title,
    serviceName: data.serviceName || null,
    destinationCountry: data.destinationCountry,
    visaCategory: data.visaCategory,
    status: data.status,
    summary: data.summary || null,
    currentStep: data.currentStep || null,
    nextActionTitle: data.nextActionTitle || null,
    nextActionDescription: data.nextActionDescription || null,
    nextActionDueAt: normalizeOptionalDateInput(data.nextActionDueAt),
    advisorId: data.advisorId || null,
    lastSharedUpdateAt: new Date(),
  }
}

function buildStoragePath(applicantId: string, caseId: string, filename: string) {
  return path.join(
    process.cwd(),
    "storage",
    "applicant-documents",
    applicantId,
    caseId,
    filename
  )
}

async function deleteFileQuietly(storagePath: string) {
  try {
    await fs.unlink(storagePath)
  } catch {
    // Ignore already-removed files.
  }
}

function revalidateApplicantSurface(applicantId: string) {
  revalidatePath(applicantsAdminPath)
  revalidatePath(getApplicantAdminDetailPath(applicantId))
  revalidatePath("/espace-client")
}

export async function createApplicant(data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = createApplicantSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Donnees invalides",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const email = parsed.data.email.trim().toLowerCase()
    const existing = await prisma.user.findUnique({ where: { email } })
    if (existing) {
      return { success: false, error: "Cet email est deja utilise" }
    }

    const createdApplicant = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: parsed.data.name,
          email,
          role: "APPLICANT",
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      await tx.applicantProfile.create({
        data: {
          userId: user.id,
          phone: parsed.data.phone || null,
          countryOfResidence: parsed.data.countryOfResidence || null,
          nationality: parsed.data.nationality || null,
          preferredDestination: parsed.data.preferredDestination || null,
          targetService: parsed.data.targetService || null,
          currentSituation: parsed.data.currentSituation || null,
        },
      })

      await tx.applicantCase.create({
        data: {
          applicantId: user.id,
          reference: buildApplicantCaseReference(),
          title: parsed.data.initialCaseTitle,
          serviceName: parsed.data.serviceName || parsed.data.targetService || null,
          destinationCountry: parsed.data.destinationCountry,
          visaCategory: parsed.data.visaCategory,
          status: "INTAKE",
          currentStep: "Profil initial a completer",
          nextActionTitle: "Verifier vos informations",
          nextActionDescription:
            "Connectez-vous a votre espace client pour valider vos coordonnees et commencer le depot des pieces demandees.",
          lastSharedUpdateAt: new Date(),
        },
      })

      return user
    })

    await sendApplicantPortalInvitationEmail({
      name: createdApplicant.name,
      email: createdApplicant.email,
      createdByName:
        permission.session.user.name ?? permission.session.user.email ?? undefined,
    })

    revalidateApplicantSurface(createdApplicant.id)

    return { success: true, applicantId: createdApplicant.id }
  } catch (error) {
    console.error("[CREATE_APPLICANT_ERROR]", error)
    return { success: false, error: "Impossible de creer le demandeur" }
  }
}

export async function updateApplicantProfileByAdmin(
  applicantId: string,
  data: unknown
) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantProfileSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Profil invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: applicantId },
        data: { name: parsed.data.name },
      }),
      prisma.applicantProfile.upsert({
        where: { userId: applicantId },
        update: toProfileUpsertInput(parsed.data),
        create: {
          userId: applicantId,
          ...toProfileUpsertInput(parsed.data),
        },
      }),
    ])

    revalidateApplicantSurface(applicantId)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPLICANT_PROFILE_ADMIN_ERROR]", error)
    return { success: false, error: "Impossible de mettre a jour le profil" }
  }
}

export async function updateOwnApplicantProfile(data: unknown) {
  try {
    const permission = await requireApplicantUser()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantProfileSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Profil invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    await prisma.$transaction([
      prisma.user.update({
        where: { id: permission.session.user.id },
        data: { name: parsed.data.name },
      }),
      prisma.applicantProfile.upsert({
        where: { userId: permission.session.user.id },
        update: toProfileUpsertInput(parsed.data),
        create: {
          userId: permission.session.user.id,
          ...toProfileUpsertInput(parsed.data),
        },
      }),
    ])

    revalidateApplicantSurface(permission.session.user.id)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_OWN_APPLICANT_PROFILE_ERROR]", error)
    return {
      success: false,
      error: "Impossible de mettre a jour vos informations",
    }
  }
}

export async function createApplicantCase(applicantId: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantCaseCreateSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Procedure invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    await prisma.applicantCase.create({
      data: {
        applicantId,
        reference: buildApplicantCaseReference(),
        ...toCaseInput(parsed.data),
      },
    })

    revalidateApplicantSurface(applicantId)
    return { success: true }
  } catch (error) {
    console.error("[CREATE_APPLICANT_CASE_ERROR]", error)
    return { success: false, error: "Impossible de creer la procedure" }
  }
}

export async function updateApplicantCase(caseId: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantCaseSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Procedure invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const current = await prisma.applicantCase.findUnique({
      where: { id: caseId },
      select: { applicantId: true },
    })

    if (!current) {
      return { success: false, error: "Procedure introuvable" }
    }

    await prisma.applicantCase.update({
      where: { id: caseId },
      data: toCaseInput(parsed.data),
    })

    revalidateApplicantSurface(current.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPLICANT_CASE_ERROR]", error)
    return { success: false, error: "Impossible de mettre a jour la procedure" }
  }
}

export async function deleteApplicantCase(caseId: string) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const current = await prisma.applicantCase.findUnique({
      where: { id: caseId },
      select: { applicantId: true, documents: { select: { storagePath: true } } },
    })

    if (!current) {
      return { success: false, error: "Procedure introuvable" }
    }

    await prisma.applicantCase.delete({ where: { id: caseId } })
    await Promise.all(current.documents.map((doc) => deleteFileQuietly(doc.storagePath)))

    revalidateApplicantSurface(current.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPLICANT_CASE_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la procedure" }
  }
}

export async function addApplicantMilestone(caseId: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantMilestoneSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Jalon invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const parent = await prisma.applicantCase.findUnique({
      where: { id: caseId },
      select: { applicantId: true },
    })
    if (!parent) {
      return { success: false, error: "Procedure introuvable" }
    }

    await prisma.applicantCaseMilestone.create({
      data: {
        caseId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        status: parsed.data.status,
        occurredAt: normalizeOptionalDateInput(parsed.data.occurredAt),
        visibleToApplicant: parsed.data.visibleToApplicant ?? true,
      },
    })

    await prisma.applicantCase.update({
      where: { id: caseId },
      data: { lastSharedUpdateAt: new Date() },
    })

    revalidateApplicantSurface(parent.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[ADD_APPLICANT_MILESTONE_ERROR]", error)
    return { success: false, error: "Impossible d'ajouter le jalon" }
  }
}

export async function deleteApplicantMilestone(id: string) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const milestone = await prisma.applicantCaseMilestone.findUnique({
      where: { id },
      select: { case: { select: { applicantId: true } } },
    })

    if (!milestone) {
      return { success: false, error: "Jalon introuvable" }
    }

    await prisma.applicantCaseMilestone.delete({ where: { id } })
    revalidateApplicantSurface(milestone.case.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPLICANT_MILESTONE_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le jalon" }
  }
}

export async function createApplicantChecklistItem(caseId: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantChecklistItemSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Element invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const parent = await prisma.applicantCase.findUnique({
      where: { id: caseId },
      select: { applicantId: true },
    })

    if (!parent) {
      return { success: false, error: "Procedure introuvable" }
    }

    await prisma.applicantChecklistItem.create({
      data: {
        caseId,
        title: parsed.data.title,
        description: parsed.data.description || null,
        category: parsed.data.category || null,
        status: parsed.data.status,
        dueDate: normalizeOptionalDateInput(parsed.data.dueDate),
        visibleToApplicant: parsed.data.visibleToApplicant ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    })

    revalidateApplicantSurface(parent.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[CREATE_APPLICANT_CHECKLIST_ITEM_ERROR]", error)
    return {
      success: false,
      error: "Impossible d'ajouter l'element de checklist",
    }
  }
}

export async function updateApplicantChecklistItem(id: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantChecklistItemUpdateSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Element invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const item = await prisma.applicantChecklistItem.findUnique({
      where: { id },
      select: { case: { select: { applicantId: true } } },
    })

    if (!item) {
      return { success: false, error: "Element introuvable" }
    }

    await prisma.applicantChecklistItem.update({
      where: { id },
      data: {
        title: parsed.data.title,
        description: parsed.data.description || null,
        category: parsed.data.category || null,
        status: parsed.data.status,
        dueDate: normalizeOptionalDateInput(parsed.data.dueDate),
        visibleToApplicant: parsed.data.visibleToApplicant ?? true,
        sortOrder: parsed.data.sortOrder ?? 0,
      },
    })

    revalidateApplicantSurface(item.case.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPLICANT_CHECKLIST_ITEM_ERROR]", error)
    return {
      success: false,
      error: "Impossible de mettre a jour l'element de checklist",
    }
  }
}

export async function deleteApplicantChecklistItem(id: string) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const item = await prisma.applicantChecklistItem.findUnique({
      where: { id },
      select: {
        case: { select: { applicantId: true } },
        documents: { select: { storagePath: true } },
      },
    })

    if (!item) {
      return { success: false, error: "Element introuvable" }
    }

    await prisma.applicantChecklistItem.delete({ where: { id } })
    await Promise.all(item.documents.map((doc) => deleteFileQuietly(doc.storagePath)))

    revalidateApplicantSurface(item.case.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPLICANT_CHECKLIST_ITEM_ERROR]", error)
    return {
      success: false,
      error: "Impossible de supprimer l'element de checklist",
    }
  }
}

export async function reviewApplicantDocument(id: string, data: unknown) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantDocumentReviewSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Revision invalide",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const document = await prisma.applicantDocument.findUnique({
      where: { id },
      select: {
        case: { select: { applicantId: true } },
        checklistItemId: true,
      },
    })

    if (!document) {
      return { success: false, error: "Document introuvable" }
    }

    await prisma.$transaction(async (tx) => {
      await tx.applicantDocument.update({
        where: { id },
        data: {
          status: parsed.data.status,
          reviewNote: parsed.data.reviewNote || null,
        },
      })

      if (document.checklistItemId) {
        await tx.applicantChecklistItem.update({
          where: { id: document.checklistItemId },
          data: {
            status:
              parsed.data.status === "ACCEPTED"
                ? "ACCEPTED"
                : parsed.data.status === "NEEDS_REVISION"
                  ? "NEEDS_REVISION"
                  : "UNDER_REVIEW",
          },
        })
      }
    })

    revalidateApplicantSurface(document.case.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[REVIEW_APPLICANT_DOCUMENT_ERROR]", error)
    return { success: false, error: "Impossible de mettre a jour le document" }
  }
}

export async function deleteApplicantDocumentByAdmin(id: string) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const document = await prisma.applicantDocument.findUnique({
      where: { id },
      select: {
        storagePath: true,
        checklistItemId: true,
        case: { select: { applicantId: true } },
      },
    })

    if (!document) {
      return { success: false, error: "Document introuvable" }
    }

    await prisma.applicantDocument.delete({ where: { id } })
    await deleteFileQuietly(document.storagePath)

    if (document.checklistItemId) {
      const remaining = await prisma.applicantDocument.count({
        where: { checklistItemId: document.checklistItemId },
      })

      if (remaining === 0) {
        await prisma.applicantChecklistItem.update({
          where: { id: document.checklistItemId },
          data: { status: "REQUESTED" },
        })
      }
    }

    revalidateApplicantSurface(document.case.applicantId)
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPLICANT_DOCUMENT_ADMIN_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le document" }
  }
}

export async function uploadApplicantDocument(formData: FormData) {
  try {
    const permission = await requireApplicantUser()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const caseId = String(formData.get("caseId") ?? "").trim()
    const checklistItemId = String(formData.get("checklistItemId") ?? "").trim()
    const label = String(formData.get("label") ?? "").trim()
    const file = formData.get("file")

    if (!caseId || !file || !(file instanceof File)) {
      return { success: false, error: "Le document est incomplet." }
    }

    const applicantCase = await prisma.applicantCase.findFirst({
      where: {
        id: caseId,
        applicantId: permission.session.user.id,
      },
      select: { applicantId: true },
    })

    if (!applicantCase) {
      return { success: false, error: "Procedure introuvable." }
    }

    const validation = validateUploadFileMetadata({
      name: file.name,
      type: file.type,
      size: file.size,
    })

    if (!validation.success) {
      return { success: false, error: validation.error }
    }

    if (checklistItemId) {
      const checklistItem = await prisma.applicantChecklistItem.findFirst({
        where: {
          id: checklistItemId,
          caseId,
        },
        select: { id: true },
      })

      if (!checklistItem) {
        return { success: false, error: "Element de checklist introuvable." }
      }
    }

    const storedFilename = `${Date.now()}-${crypto.randomUUID()}-${validation.sanitizedBase}${validation.extension}`
    const storagePath = buildStoragePath(
      permission.session.user.id,
      caseId,
      storedFilename
    )

    await fs.mkdir(path.dirname(storagePath), { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(storagePath, buffer)

    await prisma.$transaction(async (tx) => {
      await tx.applicantDocument.create({
        data: {
          caseId,
          applicantId: permission.session.user.id,
          checklistItemId: checklistItemId || null,
          label: label || file.name,
          originalFilename: file.name,
          storagePath,
          mimeType: file.type,
          size: file.size,
          uploadedByApplicant: true,
          status: "UPLOADED",
        },
      })

      if (checklistItemId) {
        await tx.applicantChecklistItem.update({
          where: { id: checklistItemId },
          data: { status: "UPLOADED" },
        })
      }
    })

    revalidateApplicantSurface(permission.session.user.id)
    return { success: true }
  } catch (error) {
    console.error("[UPLOAD_APPLICANT_DOCUMENT_ERROR]", error)
    return { success: false, error: "Impossible d'envoyer le document" }
  }
}

export async function deleteOwnApplicantDocument(id: string) {
  try {
    const permission = await requireApplicantUser()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const document = await prisma.applicantDocument.findFirst({
      where: {
        id,
        applicantId: permission.session.user.id,
      },
      select: {
        storagePath: true,
        checklistItemId: true,
      },
    })

    if (!document) {
      return { success: false, error: "Document introuvable" }
    }

    await prisma.applicantDocument.delete({ where: { id } })
    await deleteFileQuietly(document.storagePath)

    if (document.checklistItemId) {
      const remaining = await prisma.applicantDocument.count({
        where: { checklistItemId: document.checklistItemId },
      })

      if (remaining === 0) {
        await prisma.applicantChecklistItem.update({
          where: { id: document.checklistItemId },
          data: { status: "REQUESTED" },
        })
      }
    }

    revalidateApplicantSurface(permission.session.user.id)
    return { success: true }
  } catch (error) {
    console.error("[DELETE_OWN_APPLICANT_DOCUMENT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le document" }
  }
}

export async function requestApplicantDataDeletion(data: unknown) {
  try {
    const permission = await requireApplicantUser()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = applicantDeletionRequestSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Demande invalide" }
    }

    const user = await prisma.user.findUnique({
      where: { id: permission.session.user.id },
      select: {
        name: true,
        email: true,
        applicantProfile: {
          select: {
            phone: true,
          },
        },
      },
    })

    if (!user) {
      return { success: false, error: "Compte introuvable" }
    }

    const existing = await prisma.dataPrivacyRequest.findFirst({
      where: {
        email: user.email,
        requestType: "ERASURE",
        status: {
          in: ["RECEIVED", "IDENTITY_PENDING", "IN_REVIEW"],
        },
      },
      orderBy: { createdAt: "desc" },
    })

    if (existing) {
      return {
        success: true,
        message:
          "Une demande de suppression est deja en cours. Notre equipe reviendra vers vous si une verification supplementaire est necessaire.",
      }
    }

    const request = await prisma.dataPrivacyRequest.create({
      data: {
        fullName: user.name ?? user.email,
        email: user.email,
        phone: user.applicantProfile?.phone || null,
        requestType: "ERASURE",
        message:
          parsed.data.message ||
          "Demande initiee depuis l'espace client pour suppression des donnees du dossier.",
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        requestType: true,
      },
    })

    await notifyPrivacyRequestCreated(request)
    revalidateApplicantSurface(permission.session.user.id)

    return {
      success: true,
      message:
        "Votre demande a ete transmise a l'equipe conformite. Nous la traiterons selon le workflow RGPD en vigueur.",
    }
  } catch (error) {
    console.error("[REQUEST_APPLICANT_DATA_DELETION_ERROR]", error)
    return {
      success: false,
      error: "Impossible d'enregistrer votre demande pour le moment",
    }
  }
}

export async function sendApplicantAccessLink(
  applicantId: string,
  mode: "invite" | "reset" | "smart" = "smart"
) {
  try {
    const permission = await requireApplicantManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const applicant = await prisma.user.findFirst({
      where: { id: applicantId, role: "APPLICANT" },
      select: {
        name: true,
        email: true,
        hashedPassword: true,
      },
    })

    if (!applicant) {
      return { success: false, error: "Demandeur introuvable" }
    }

    const resolvedMode =
      mode === "smart"
        ? applicant.hashedPassword
          ? "reset"
          : "invite"
        : mode

    if (resolvedMode === "invite") {
      await sendApplicantPortalInvitationEmail({
        name: applicant.name,
        email: applicant.email,
        createdByName:
          permission.session.user.name ?? permission.session.user.email ?? undefined,
      })
    } else {
      await sendApplicantPortalPasswordResetEmail({
        name: applicant.name,
        email: applicant.email,
      })
    }

    revalidateApplicantSurface(applicantId)

    return {
      success: true,
      message:
        resolvedMode === "invite"
          ? "Invitation client renvoyee"
          : "Lien de reinitialisation client envoye",
    }
  } catch (error) {
    console.error("[SEND_APPLICANT_ACCESS_LINK_ERROR]", error)
    return {
      success: false,
      error: "Impossible d'envoyer le lien d'acces",
    }
  }
}
