"use server"

import { prisma } from "@/lib/prisma"
import {
  appointmentStatusSchema,
  appointmentSubmissionSchema,
} from "@/lib/validations/appointment"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { hasPermission } from "@/lib/rbac"
import {
  notifyAppointmentCreated,
  notifyAppointmentStatusChanged,
} from "@/lib/business-notifications"
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
  logCaptchaFailureEvent,
  verifyCaptchaTokenForRequest,
} from "@/lib/captcha.server"

export async function createAppointment(data: unknown) {
  try {
    const parsed = appointmentSubmissionSchema.safeParse(data)
    if (!parsed.success) {
      return { 
        success: false, 
        error: "Données de formulaire invalides", 
        details: parsed.error.flatten().fieldErrors 
      }
    }

    const normalizedEmail = normalizeSubmissionEmail(parsed.data.email)
    const normalizedPhone = normalizeSubmissionPhone(parsed.data.phone)
    const filteredGuard = evaluateSubmissionGuard({
      honeypotValue: parsed.data.website,
      duplicateCount: 0,
      rateLimitCount: 0,
      duplicateMessage:
        "Une demande recente avec ces coordonnees est deja en cours. Notre equipe revient vers vous rapidement.",
      rateLimitedMessage:
        "Trop de demandes recentes ont ete detectees. Merci de patienter avant de reessayer.",
      filteredMessage:
        "Votre demande est bien recue. Notre equipe vous recontactera rapidement.",
    })

    if (filteredGuard.status === "filtered") {
      logSubmissionGuardEvent({
        channel: "appointment",
        status: filteredGuard.status,
        email: normalizedEmail,
        phone: normalizedPhone,
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
      expectedAction: "appointment_form",
    })

    if (!captchaVerification.success) {
      logCaptchaFailureEvent({
        channel: "appointment",
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

    const [recentEmailDuplicateCount, recentPhoneDuplicateCount, recentEmailCount, recentPhoneCount] =
      await Promise.all([
        prisma.appointmentRequest.count({
          where: {
            email: normalizedEmail,
            createdAt: { gte: duplicateWindowStart },
          },
        }),
        normalizedPhone
          ? prisma.appointmentRequest.count({
              where: {
                phone: normalizedPhone,
                createdAt: { gte: duplicateWindowStart },
              },
            })
          : Promise.resolve(0),
        prisma.appointmentRequest.count({
          where: {
            email: normalizedEmail,
            createdAt: { gte: rateLimitWindowStart },
          },
        }),
        normalizedPhone
          ? prisma.appointmentRequest.count({
              where: {
                phone: normalizedPhone,
                createdAt: { gte: rateLimitWindowStart },
              },
            })
          : Promise.resolve(0),
      ])

    const guard = evaluateSubmissionGuard({
      honeypotValue: "",
      duplicateCount: Math.max(
        recentEmailDuplicateCount,
        recentPhoneDuplicateCount
      ),
      rateLimitCount: Math.max(recentEmailCount, recentPhoneCount),
      duplicateMessage:
        "Une demande recente avec ces coordonnees est deja en cours. Notre equipe revient vers vous rapidement.",
      rateLimitedMessage:
        "Trop de demandes recentes ont ete detectees. Merci de patienter avant de reessayer.",
      filteredMessage:
        "Votre demande est bien recue. Notre equipe vous recontactera rapidement.",
    })

    if (!guard.shouldPersist) {
      logSubmissionGuardEvent({
        channel: "appointment",
        status: guard.status,
        email: normalizedEmail,
        phone: normalizedPhone,
        duplicateCount: Math.max(
          recentEmailDuplicateCount,
          recentPhoneDuplicateCount
        ),
        rateLimitCount: Math.max(recentEmailCount, recentPhoneCount),
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

    const preferredDate = parsed.data.preferredDate
    const rest = {
      fullName: parsed.data.fullName,
      email: parsed.data.email,
      phone: parsed.data.phone,
      preferredTime: parsed.data.preferredTime,
      serviceType: parsed.data.serviceType,
      destinationType: parsed.data.destinationType,
      message: parsed.data.message,
    }
    const appointment = await prisma.appointmentRequest.create({
      data: {
        ...rest,
        email: normalizedEmail,
        phone: normalizedPhone ?? parsed.data.phone,
        serviceType: normalizeOptionalSubmissionText(rest.serviceType),
        destinationType: normalizeOptionalSubmissionText(rest.destinationType),
        message: normalizeOptionalSubmissionText(rest.message),
        preferredDate: preferredDate ? new Date(preferredDate) : null,
      },
      select: {
        id: true,
        fullName: true,
        email: true,
        phone: true,
        preferredDate: true,
        preferredTime: true,
        serviceType: true,
        destinationType: true,
      },
    })

    await notifyAppointmentCreated(appointment)
    return {
      success: true,
      status: "accepted" as const,
      message:
        "Votre demande de rendez-vous est bien recue. Notre equipe vous confirmera rapidement la meilleure disponibilite.",
    }
  } catch (error) {
    console.error("[CREATE_APPOINTMENT_ERROR]", error)
    return { success: false, error: "Une erreur est survenue lors de la demande de rendez-vous" }
  }
}

export async function updateAppointmentStatus(id: string, status: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    const parsedStatus = appointmentStatusSchema.safeParse(status)
    if (!parsedStatus.success) {
      return { success: false, error: "Statut invalide" }
    }

    const appointment = await prisma.appointmentRequest.update({
      where: { id },
      data: { status: parsedStatus.data },
      select: {
        id: true,
        fullName: true,
        email: true,
        preferredDate: true,
        preferredTime: true,
        assignedToId: true,
        status: true,
      },
    })
    revalidatePath("/admin/appointments")

    await notifyAppointmentStatusChanged(appointment)
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPOINTMENT_STATUS_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour le statut" }
  }
}

export async function updateAppointmentNotes(id: string, notes: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "edit")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.appointmentRequest.update({
      where: { id },
      data: { notes },
    })
    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("[UPDATE_APPOINTMENT_NOTES_ERROR]", error)
    return { success: false, error: "Impossible de mettre à jour les notes" }
  }
}

export async function deleteAppointment(id: string) {
  try {
    const session = await auth()
    if (!session || !hasPermission(session.user.role, "delete")) {
      return { success: false, error: "Non autorisé" }
    }

    await prisma.appointmentRequest.delete({ where: { id } })
    revalidatePath("/admin/appointments")
    return { success: true }
  } catch (error) {
    console.error("[DELETE_APPOINTMENT_ERROR]", error)
    return { success: false, error: "Impossible de supprimer le rendez-vous" }
  }
}
