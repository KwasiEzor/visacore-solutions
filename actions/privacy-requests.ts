"use server"

import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { notifyPrivacyRequestCreated } from "@/lib/business-notifications"
import { prisma } from "@/lib/prisma"
import {
  buildRedactedEmail,
  formatDataPrivacyRequestType,
  redactedNamePlaceholder,
  redactedPhonePlaceholder,
  redactedTextPlaceholder,
} from "@/lib/privacy-requests.shared"
import { hasPermission } from "@/lib/rbac"
import {
  duplicateSubmissionWindowMs,
  evaluateSubmissionGuard,
  logSubmissionGuardEvent,
  normalizeOptionalSubmissionText,
  normalizeSubmissionEmail,
  normalizeSubmissionPhone,
  rateLimitWindowMs,
} from "@/lib/submission-guards.shared"
import {
  dataPrivacyRequestAdminUpdateSchema,
  dataPrivacyRequestSubmissionSchema,
} from "@/lib/validations/privacy"
import {
  logCaptchaFailureEvent,
  verifyCaptchaTokenForRequest,
} from "@/lib/captcha.server"

const adminPrivacyPath = "/admin/privacy-requests"

function buildLookupConditions(email: string, phone?: string | null) {
  return phone
    ? {
        OR: [{ email }, { phone }],
      }
    : { email }
}

function buildResolutionNote(existing: string | null, addition: string) {
  return [normalizeOptionalSubmissionText(existing), addition]
    .filter((value): value is string => Boolean(value))
    .join("\n\n")
}

async function requirePrivacyManager() {
  const session = await auth()

  if (!session || !hasPermission(session.user.role, "manage_settings")) {
    return { error: "Non autorise" as const }
  }

  return { session }
}

export async function createDataPrivacyRequest(data: unknown) {
  try {
    const parsed = dataPrivacyRequestSubmissionSchema.safeParse(data)
    if (!parsed.success) {
      return {
        success: false,
        error: "Donnees de formulaire invalides",
        details: parsed.error.flatten().fieldErrors,
      }
    }

    const normalizedEmail = normalizeSubmissionEmail(parsed.data.email)
    const normalizedPhone = normalizeSubmissionPhone(parsed.data.phone)

    const filteredGuard = evaluateSubmissionGuard({
      honeypotValue: parsed.data.website,
      duplicateCount: 0,
      rateLimitCount: 0,
      duplicateMessage:
        "Une demande recente du meme type est deja en cours de traitement. Notre equipe protection des donnees vous repondra sans qu'il soit necessaire de renvoyer le formulaire.",
      rateLimitedMessage:
        "Trop de demandes recentes ont ete detectees. Merci de patienter avant de reessayer.",
      filteredMessage:
        "Votre demande relative a vos donnees a bien ete recue.",
    })

    if (filteredGuard.status === "filtered") {
      logSubmissionGuardEvent({
        channel: "privacy_request",
        status: filteredGuard.status,
        email: normalizedEmail,
        phone: normalizedPhone,
        subject: parsed.data.requestType,
        duplicateCount: 0,
        rateLimitCount: 0,
      })

      return {
        success: true,
        status: filteredGuard.status,
        message: filteredGuard.message,
      }
    }

    const captchaVerification = await verifyCaptchaTokenForRequest({
      token: parsed.data.captchaToken,
      expectedAction: "privacy_request_form",
    })

    if (!captchaVerification.success) {
      logCaptchaFailureEvent({
        channel: "privacy_request",
        errorCodes: captchaVerification.errorCodes,
      })

      return {
        success: false,
        status: "captcha_failed" as const,
        error:
          "Veuillez confirmer la verification anti-spam avant de reessayer.",
      }
    }

    const now = Date.now()
    const duplicateWindowStart = new Date(now - duplicateSubmissionWindowMs)
    const rateLimitWindowStart = new Date(now - rateLimitWindowMs)

    const [recentDuplicateCount, recentSubmissionCount] = await Promise.all([
      prisma.dataPrivacyRequest.count({
        where: {
          email: normalizedEmail,
          requestType: parsed.data.requestType,
          createdAt: { gte: duplicateWindowStart },
        },
      }),
      prisma.dataPrivacyRequest.count({
        where: {
          email: normalizedEmail,
          createdAt: { gte: rateLimitWindowStart },
        },
      }),
    ])

    const guard = evaluateSubmissionGuard({
      honeypotValue: "",
      duplicateCount: recentDuplicateCount,
      rateLimitCount: recentSubmissionCount,
      duplicateMessage:
        "Une demande recente du meme type est deja en cours de traitement. Notre equipe protection des donnees vous repondra sans qu'il soit necessaire de renvoyer le formulaire.",
      rateLimitedMessage:
        "Trop de demandes recentes ont ete detectees. Merci de patienter avant de reessayer.",
      filteredMessage:
        "Votre demande relative a vos donnees a bien ete recue.",
    })

    if (!guard.shouldPersist) {
      logSubmissionGuardEvent({
        channel: "privacy_request",
        status: guard.status,
        email: normalizedEmail,
        phone: normalizedPhone,
        subject: parsed.data.requestType,
        duplicateCount: recentDuplicateCount,
        rateLimitCount: recentSubmissionCount,
      })

      if (guard.success) {
        return {
          success: true,
          status: guard.status,
          message: guard.message,
        }
      }

      return {
        success: false,
        status: guard.status,
        error: guard.message,
      }
    }

    const request = await prisma.dataPrivacyRequest.create({
      data: {
        fullName: parsed.data.fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        requestType: parsed.data.requestType,
        message: normalizeOptionalSubmissionText(parsed.data.message),
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

    return {
      success: true,
      status: "accepted" as const,
      message:
        "Votre demande RGPD est bien enregistree. Nous accusons reception sans retard injustifie et reviendrons vers vous dans un delai maximum d'un mois, sous reserve d'une verification d'identite si necessaire.",
    }
  } catch (error) {
    console.error("[CREATE_PRIVACY_REQUEST_ERROR]", error)
    return {
      success: false,
      error:
        "Une erreur est survenue lors de l'envoi de votre demande RGPD",
    }
  }
}

export async function updateDataPrivacyRequest(
  id: string,
  data: unknown
) {
  try {
    const permission = await requirePrivacyManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const parsed = dataPrivacyRequestAdminUpdateSchema.safeParse(data)
    if (!parsed.success) {
      return { success: false, error: "Mise a jour invalide" }
    }

    await prisma.dataPrivacyRequest.update({
      where: { id },
      data: {
        status: parsed.data.status,
        resolutionNotes: normalizeOptionalSubmissionText(
          parsed.data.resolutionNotes
        ),
        processedAt:
          parsed.data.status === "FULFILLED" ||
          parsed.data.status === "REJECTED"
            ? new Date()
            : null,
        processedById:
          parsed.data.status === "FULFILLED" ||
          parsed.data.status === "REJECTED"
            ? permission.session.user.id
            : null,
      },
    })

    revalidatePath(adminPrivacyPath)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_PRIVACY_REQUEST_ERROR]", error)
    return {
      success: false,
      error: "Impossible de mettre a jour la demande RGPD",
    }
  }
}

export async function exportDataPrivacyRequestData(id: string) {
  try {
    const permission = await requirePrivacyManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const request = await prisma.dataPrivacyRequest.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        requestType: true,
        status: true,
        message: true,
        createdAt: true,
      },
    })

    if (!request) {
      return { success: false, error: "Demande introuvable" }
    }

    const lookup = buildLookupConditions(request.email, request.phone)

    const [users, leads, contacts, appointments, privacyRequests] =
      await Promise.all([
        prisma.user.findMany({
          where: { email: request.email },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true,
            updatedAt: true,
            emailVerified: true,
          },
        }),
        prisma.lead.findMany({
          where: lookup,
          orderBy: { createdAt: "desc" },
        }),
        prisma.contactRequest.findMany({
          where: lookup,
          orderBy: { createdAt: "desc" },
        }),
        prisma.appointmentRequest.findMany({
          where: lookup,
          orderBy: { createdAt: "desc" },
        }),
        prisma.dataPrivacyRequest.findMany({
          where: { email: request.email },
          orderBy: { createdAt: "desc" },
        }),
      ])

    const exportedAt = new Date().toISOString()
    const payload = {
      exportedAt,
      request: {
        ...request,
        requestTypeLabel: formatDataPrivacyRequestType(request.requestType),
        createdAt: request.createdAt.toISOString(),
      },
      dataSubjects: {
        email: request.email,
        phone: request.phone ?? null,
      },
      userAccounts: users.map((user) => ({
        ...user,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString(),
        emailVerified: user.emailVerified?.toISOString() ?? null,
      })),
      leads: leads.map((lead) => ({
        ...lead,
        createdAt: lead.createdAt.toISOString(),
        updatedAt: lead.updatedAt.toISOString(),
      })),
      contactRequests: contacts.map((contact) => ({
        ...contact,
        createdAt: contact.createdAt.toISOString(),
        updatedAt: contact.updatedAt.toISOString(),
      })),
      appointmentRequests: appointments.map((appointment) => ({
        ...appointment,
        preferredDate: appointment.preferredDate?.toISOString() ?? null,
        createdAt: appointment.createdAt.toISOString(),
        updatedAt: appointment.updatedAt.toISOString(),
      })),
      privacyRequests: privacyRequests.map((privacyRequest) => ({
        ...privacyRequest,
        createdAt: privacyRequest.createdAt.toISOString(),
        updatedAt: privacyRequest.updatedAt.toISOString(),
        processedAt: privacyRequest.processedAt?.toISOString() ?? null,
      })),
      summary: {
        users: users.length,
        leads: leads.length,
        contacts: contacts.length,
        appointments: appointments.length,
        privacyRequests: privacyRequests.length,
      },
    }

    const safeName = request.fullName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")

    return {
      success: true,
      fileName: `rgpd-export-${safeName || request.id}-${request.id}.json`,
      data: payload,
    }
  } catch (error) {
    console.error("[EXPORT_PRIVACY_REQUEST_ERROR]", error)
    return {
      success: false,
      error: "Impossible d'exporter les donnees de cette demande",
    }
  }
}

export async function anonymizeDataPrivacyRequestData(id: string) {
  try {
    const permission = await requirePrivacyManager()
    if ("error" in permission) {
      return { success: false, error: permission.error }
    }

    const request = await prisma.dataPrivacyRequest.findUnique({
      where: { id },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        requestType: true,
        resolutionNotes: true,
      },
    })

    if (!request) {
      return { success: false, error: "Demande introuvable" }
    }

    if (request.requestType !== "ERASURE") {
      return {
        success: false,
        error:
          "L'anonymisation automatique est reservee aux demandes d'effacement.",
      }
    }

    const lookup = buildLookupConditions(request.email, request.phone)
    const processedAt = new Date()
    const processedAtLabel = processedAt.toLocaleString("fr-FR")

    const summary = await prisma.$transaction(async (tx) => {
      const [leads, contacts, appointments] = await Promise.all([
        tx.lead.findMany({
          where: lookup,
          select: { id: true },
        }),
        tx.contactRequest.findMany({
          where: lookup,
          select: { id: true },
        }),
        tx.appointmentRequest.findMany({
          where: lookup,
          select: { id: true },
        }),
      ])

      for (const lead of leads) {
        await tx.lead.update({
          where: { id: lead.id },
          data: {
            fullName: redactedNamePlaceholder,
            email: buildRedactedEmail("lead", lead.id),
            phone: redactedPhonePlaceholder,
            situation: null,
            serviceNeeded: null,
            message: redactedTextPlaceholder,
            notes: redactedTextPlaceholder,
          },
        })
      }

      for (const contact of contacts) {
        await tx.contactRequest.update({
          where: { id: contact.id },
          data: {
            fullName: redactedNamePlaceholder,
            email: buildRedactedEmail("contact", contact.id),
            phone: null,
            subject: redactedTextPlaceholder,
            message: redactedTextPlaceholder,
            notes: redactedTextPlaceholder,
          },
        })
      }

      for (const appointment of appointments) {
        await tx.appointmentRequest.update({
          where: { id: appointment.id },
          data: {
            fullName: redactedNamePlaceholder,
            email: buildRedactedEmail("appointment", appointment.id),
            phone: redactedPhonePlaceholder,
            message: redactedTextPlaceholder,
            notes: redactedTextPlaceholder,
          },
        })
      }

      await tx.dataPrivacyRequest.update({
        where: { id: request.id },
        data: {
          status: "FULFILLED",
          processedAt,
          processedById: permission.session.user.id,
          resolutionNotes: buildResolutionNote(
            request.resolutionNotes,
            `Anonymisation technique executee le ${processedAtLabel}. Leads: ${leads.length}. Contacts: ${contacts.length}. Rendez-vous: ${appointments.length}.`
          ),
        },
      })

      return {
        leads: leads.length,
        contacts: contacts.length,
        appointments: appointments.length,
      }
    })

    revalidatePath(adminPrivacyPath)

    return {
      success: true,
      message: `Anonymisation terminee pour ${request.fullName}. ${summary.leads} lead(s), ${summary.contacts} contact(s) et ${summary.appointments} rendez-vous ont ete redactes.`,
      summary,
    }
  } catch (error) {
    console.error("[ANONYMIZE_PRIVACY_REQUEST_ERROR]", error)
    return {
      success: false,
      error:
        "Impossible d'anonymiser les donnees de cette demande d'effacement",
    }
  }
}
