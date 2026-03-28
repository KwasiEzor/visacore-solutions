"use server"

import { prisma } from "@/lib/prisma"
import { signIn, signOut } from "@/lib/auth"
import { loginSchema } from "@/lib/validations/auth"
import { isApplicantRole } from "@/lib/applicant-portal.shared"
import { AuthError } from "next-auth"

async function loginForAudience(
  formData: FormData,
  audience: "admin" | "applicant"
) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return { error: "Veuillez saisir un email valide et un mot de passe." }
  }

  const email = parsed.data.email.trim().toLowerCase()

  const user = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  })

  if (!user) {
    return { error: "Email ou mot de passe incorrect." }
  }

  if (audience === "admin" && isApplicantRole(user.role)) {
    return { error: "Utilisez l'espace client pour ce compte." }
  }

  if (audience === "applicant" && !isApplicantRole(user.role)) {
    return { error: "Cet espace est reserve aux demandeurs VisaCore." }
  }

  try {
    await signIn("credentials", {
      email,
      password: parsed.data.password,
      redirectTo: audience === "admin" ? "/admin" : "/espace-client",
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Email ou mot de passe incorrect." }
        default:
          return { error: "Une erreur est survenue." }
      }
    }
    throw error
  }
}

export async function loginAction(formData: FormData) {
  return loginForAudience(formData, "admin")
}

export async function loginApplicantAction(formData: FormData) {
  return loginForAudience(formData, "applicant")
}

export async function logoutAction(redirectTo = "/login") {
  await signOut({ redirectTo })
}
