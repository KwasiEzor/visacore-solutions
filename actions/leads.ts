"use server"

import { prisma } from "@/lib/prisma"
import {
  leadStatusSchema,
  leadSubmissionSchema,
} from "@/lib/validations/lead"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import {
  duplicateSubmissionWindowMs,
  evaluateSubmissionGuard,
  normalizeSubmissionEmail,
  normalizeSubmissionPhone,
  rateLimitWindowMs,
} from "@/lib/submission-guards.shared"
import { hasPermission } from "@/lib/rbac"
import { buildLeadCreateData } from "@/lib/submission-payloads"

export async function createLead(data: unknown) {
  try {
    const parsed = leadSubmissionSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const normalizedEmail = normalizeSubmissionEmail(parsed.data.email)
    const normalizedPhone = normalizeSubmissionPhone(parsed.data.phone)
    const now = Date.now()
    const duplicateWindowStart = new Date(now - duplicateSubmissionWindowMs)
    const rateLimitWindowStart = new Date(now - rateLimitWindowMs)

    const [
      recentEmailDuplicateCount,
      recentPhoneDuplicateCount,
      recentEmailSubmissionCount,
      recentPhoneSubmissionCount,
    ] = await Promise.all([
      prisma.lead.count({
        where: {
          email: normalizedEmail,
          createdAt: { gte: duplicateWindowStart },
        },
      }),
      normalizedPhone
        ? prisma.lead.count({
            where: {
              phone: normalizedPhone,
              createdAt: { gte: duplicateWindowStart },
            },
          })
        : Promise.resolve(0),
      prisma.lead.count({
        where: {
          email: normalizedEmail,
          createdAt: { gte: rateLimitWindowStart },
        },
      }),
      normalizedPhone
        ? prisma.lead.count({
            where: {
              phone: normalizedPhone,
              createdAt: { gte: rateLimitWindowStart },
            },
          })
        : Promise.resolve(0),
    ])

    const guard = evaluateSubmissionGuard({
      honeypotValue: parsed.data.website,
      duplicateCount: Math.max(
        recentEmailDuplicateCount,
        recentPhoneDuplicateCount
      ),
      rateLimitCount: Math.max(
        recentEmailSubmissionCount,
        recentPhoneSubmissionCount
      ),
      duplicateMessage:
        "Nous avons déjà reçu une demande récente avec ces coordonnées. Notre équipe revient vers vous sous 24 heures ouvrées.",
      rateLimitedMessage:
        "Trop de tentatives récentes ont été détectées. Merci d'attendre quelques minutes avant de réessayer.",
      filteredMessage:
        "Votre demande est bien reçue. Notre équipe revient vers vous sous 24 heures ouvrées.",
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

    await prisma.lead.create({ data: buildLeadCreateData(parsed.data) })

    return {
      success: true,
      status: "accepted" as const,
      message:
        "Votre demande est bien reçue. Nous analysons votre profil et revenons vers vous sous 24 heures ouvrées avec les prochaines étapes.",
    }
  } catch (error) {
    console.error("[CREATE_LEAD_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de la création du lead" }
  }
}

export async function updateLeadStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsedStatus = leadStatusSchema.safeParse(status)
    if (!parsedStatus.success) {
      return { success: false, error: "Statut invalide" }
    }

    await prisma.lead.update({
      where: { id },
      data: { status: parsedStatus.data },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_LEAD_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateLeadNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.lead.update({
      where: { id },
      data: { notes },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_LEAD_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function assignLead(id: string, assignedToId: string | null) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.lead.update({
      where: { id },
      data: { assignedToId },
    })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[ASSIGN_LEAD_ERROR]", error)
    return { success: false, error: "Impossible d'assigner le lead" }
  }
}

export async function deleteLead(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.lead.delete({ where: { id } })
    
    revalidatePath("/admin/leads")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_LEAD_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le lead" }
  }
}
