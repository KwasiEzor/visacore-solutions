"use server"

import { prisma } from "@/lib/prisma"
import { contactSubmissionSchema } from "@/lib/validations/contact"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  duplicateSubmissionWindowMs,
  evaluateSubmissionGuard,
  logSubmissionGuardEvent,
  normalizeSubmissionEmail,
  rateLimitWindowMs,
} from "@/lib/submission-guards.shared"
import { hasPermission } from "@/lib/rbac"
import { buildContactRequestCreateData } from "@/lib/submission-payloads"
import {
  logCaptchaFailureEvent,
  verifyCaptchaTokenForRequest,
} from "@/lib/captcha.server"

export async function createContactRequest(data: unknown) {
  try {
    const parsed = contactSubmissionSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const normalizedEmail = normalizeSubmissionEmail(parsed.data.email)
    const normalizedSubject = parsed.data.subject.trim()
    const filteredGuard = evaluateSubmissionGuard({
      honeypotValue: parsed.data.website,
      duplicateCount: 0,
      rateLimitCount: 0,
      duplicateMessage:
        "Nous avons déjà reçu un message récent avec ce sujet. Notre équipe vous répondra dès que possible sans qu'il soit nécessaire de renvoyer le formulaire.",
      rateLimitedMessage:
        "Trop de messages récents ont été détectés. Merci d'attendre quelques minutes avant de réessayer.",
      filteredMessage:
        "Votre message est bien reçu. Notre équipe vous répondra dans les plus brefs délais.",
    })

    if (filteredGuard.status === "filtered") {
      logSubmissionGuardEvent({
        channel: "contact",
        status: filteredGuard.status,
        email: normalizedEmail,
        subject: normalizedSubject,
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
      expectedAction: "contact_form",
    })

    if (!captchaVerification.success) {
      logCaptchaFailureEvent({
        channel: "contact",
        errorCodes: captchaVerification.errorCodes,
      })

      return {
        success: false,
        status: "captcha_failed" as const,
        error:
          "Veuillez confirmer la vérification anti-spam avant de réessayer.",
      }
    }

    const now = Date.now()
    const duplicateWindowStart = new Date(now - duplicateSubmissionWindowMs)
    const rateLimitWindowStart = new Date(now - rateLimitWindowMs)

    const [recentDuplicateCount, recentSubmissionCount] = await Promise.all([
      prisma.contactRequest.count({
        where: {
          email: normalizedEmail,
          subject: normalizedSubject,
          createdAt: { gte: duplicateWindowStart },
        },
      }),
      prisma.contactRequest.count({
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
        "Nous avons déjà reçu un message récent avec ce sujet. Notre équipe vous répondra dès que possible sans qu'il soit nécessaire de renvoyer le formulaire.",
      rateLimitedMessage:
        "Trop de messages récents ont été détectés. Merci d'attendre quelques minutes avant de réessayer.",
      filteredMessage:
        "Votre message est bien reçu. Notre équipe vous répondra dans les plus brefs délais.",
    })

    if (!guard.shouldPersist) {
      logSubmissionGuardEvent({
        channel: "contact",
        status: guard.status,
        email: normalizedEmail,
        subject: normalizedSubject,
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

    await prisma.contactRequest.create({
      data: buildContactRequestCreateData(parsed.data),
    })

    return {
      success: true,
      status: "accepted" as const,
      message:
        "Votre message est bien reçu. Un conseiller VisaCore Solutions vous répondra dans les plus brefs délais.",
    }
  } catch (error) {
    console.error("[CREATE_CONTACT_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de l'envoi du message" }
  }
}

export async function markContactAsRead(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.contactRequest.update({
      where: { id },
      data: { isRead: true },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[MARK_CONTACT_AS_READ_ERROR]", error)
    return { success: false, error: "Impossible de marquer comme lu" }
  }
}

export async function updateContactStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.contactRequest.update({
      where: { id },
      data: { status },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CONTACT_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateContactNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.contactRequest.update({
      where: { id },
      data: { notes },
    })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_CONTACT_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function deleteContactRequest(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.contactRequest.delete({ where: { id } })
    revalidatePath("/admin/contacts")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_CONTACT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer la demande" }
  }
}
