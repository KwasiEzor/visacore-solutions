import { z } from "zod"

export const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
})

export type LoginFormData = z.infer<typeof loginSchema>

export const createUserSchema = z.object({
  name: z.string().min(2, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  role: z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR"]).default("EDITOR"),
})

export type CreateUserFormData = z.infer<typeof createUserSchema>
