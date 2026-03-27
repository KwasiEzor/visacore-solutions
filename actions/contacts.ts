"use server"

import { prisma } from "@/lib/prisma"
import { contactSubmissionSchema } from "@/lib/validations/contact"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  duplicateSubmissionWindowMs,
  evaluateSubmissionGuard,
  normalizeSubmissionEmail,
  normalizeSubmissionPhone,
  rateLimitWindowMs,
} from "@/lib/submission-guards.shared"

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
    const normalizedPhone = normalizeSubmissionPhone(parsed.data.phone)
    const normalizedSubject = parsed.data.subject.trim()
    const normalizedMessage = parsed.data.message.trim()
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
      honeypotValue: parsed.data.website,
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
      data: {
        fullName: parsed.data.fullName.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        subject: normalizedSubject,
        message: normalizedMessage,
      },
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
    if (!session) return { success: false, error: "Non autorisé" }

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
    if (!session) return { success: false, error: "Non autorisé" }

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
    if (!session) return { success: false, error: "Non autorisé" }

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
    if (!session || session.user.role === "EDITOR") {
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
