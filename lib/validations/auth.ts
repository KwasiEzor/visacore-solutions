import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const createUserSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("EDITOR"),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>

export const accountAccessCompletionSchema = z
  .object({
    token: z.string().min(1, "Lien invalide"),
    password: z
      .string()
      .min(10, "Le mot de passe doit contenir au moins 10 caractères"),
    confirmPassword: z.string().min(10, "Confirmation requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  })

export type AccountAccessCompletionData = z.infer<
  typeof accountAccessCompletionSchema
>
