"use server"

import { signIn, signOut } from "@/lib/auth"
import { AuthError } from "next-auth"

export async function loginAction(formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      redirectTo: "/admin",
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

export async function logoutAction() {
  await signOut({ redirectTo: "/login" })
}
