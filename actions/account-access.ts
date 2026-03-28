"use server"

import bcrypt from "bcryptjs"
import { z } from "zod"
import { prisma } from "@/lib/prisma"
import {
  clearAccountAccessTokens,
  consumeAccountAccessToken,
} from "@/lib/account-access"
import {
  sendApplicantPortalPasswordResetEmail,
  sendPasswordResetEmail,
} from "@/lib/business-notifications"
import { isApplicantRole } from "@/lib/applicant-portal.shared"
import { accountAccessCompletionSchema } from "@/lib/validations/auth"

const emailRequestSchema = z.object({
  email: z.string().email("Email invalide"),
})

export async function requestPasswordResetAction(formData: FormData) {
  const parsed = emailRequestSchema.safeParse({
    email: formData.get("email"),
  })

  if (!parsed.success) {
    return {
      success: false,
      error: "Veuillez saisir une adresse email valide.",
    }
  }

  try {
    const email = parsed.data.email.trim().toLowerCase()
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        email: true,
        name: true,
        role: true,
      },
    })

    if (user) {
      if (isApplicantRole(user.role)) {
        await sendApplicantPortalPasswordResetEmail(user)
      } else {
        await sendPasswordResetEmail(user)
      }
    }

    return {
      success: true,
      message:
        "Si un compte existe avec cette adresse, un lien securise a ete envoye.",
    }
  } catch (error) {
    console.error("[REQUEST_PASSWORD_RESET_ERROR]", error)
    return {
      success: false,
      error:
        "Impossible de traiter la demande pour le moment. Merci de reessayer.",
    }
  }
}

export async function completeAccountAccessAction(formData: FormData) {
  const parsed = accountAccessCompletionSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  const mode = formData.get("mode") === "reset" ? "reset" : "invite"

  if (!parsed.success) {
    return {
      success: false,
      error: "Le formulaire contient des erreurs.",
      details: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const tokenInfo = await consumeAccountAccessToken(parsed.data.token, mode)
    if (!tokenInfo) {
      return {
        success: false,
        error:
          "Ce lien est invalide ou a expire. Demandez un nouveau lien de recuperation d'acces.",
      }
    }

    const user = await prisma.user.findUnique({
      where: { email: tokenInfo.email },
      select: {
        id: true,
      },
    })

    if (!user) {
      return {
        success: false,
        error:
          "Aucun compte associe a ce lien n'a ete trouve. Contactez un administrateur.",
      }
    }

    const hashedPassword = await bcrypt.hash(parsed.data.password, 12)

    await prisma.user.update({
      where: { id: user.id },
      data: {
        hashedPassword,
        emailVerified: new Date(),
      },
    })

    await clearAccountAccessTokens(tokenInfo.email)

    return {
      success: true,
      message:
        mode === "reset"
          ? "Votre mot de passe a ete reinitialise. Vous pouvez maintenant vous connecter."
          : "Votre acces a ete configure. Vous pouvez maintenant vous connecter.",
    }
  } catch (error) {
    console.error("[COMPLETE_ACCOUNT_ACCESS_ERROR]", error)
    return {
      success: false,
      error:
        "Impossible de finaliser votre acces pour le moment. Merci de reessayer.",
    }
  }
}
