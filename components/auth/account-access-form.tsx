"use client"

import { useActionState } from "react"
import Link from "next/link"
import { completeAccountAccessAction } from "@/actions/account-access"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Loader2, ShieldCheck } from "lucide-react"

interface AccountAccessFormProps {
  token: string
  mode: "invite" | "reset"
}

export function AccountAccessForm({
  token,
  mode,
}: AccountAccessFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (
      _prev:
        | {
            success?: boolean
            error?: string
            message?: string
            details?: Record<string, string[] | undefined>
          }
        | undefined,
      formData: FormData
    ) => completeAccountAccessAction(formData),
    undefined
  )

  const title =
    mode === "reset" ? "Reinitialiser le mot de passe" : "Configurer votre acces"
  const description =
    mode === "reset"
      ? "Definissez un nouveau mot de passe pour retrouver l'acces a votre espace securise."
      : "Choisissez votre mot de passe pour activer votre espace securise."

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="token" value={token} />
          <input type="hidden" name="mode" value={mode} />

          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          {state?.success ? (
            <div className="space-y-4">
              <div className="rounded-md bg-emerald-50 p-4 text-sm text-emerald-700">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0" />
                  <span>{state.message}</span>
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <Link href="/espace-client/connexion" className="block">
                  <Button variant="outline" className="w-full">
                    Connexion client
                  </Button>
                </Link>
                <Link href="/login" className="block">
                  <Button className="w-full">Connexion admin</Button>
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <Label htmlFor="password">Nouveau mot de passe</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Minimum 10 caracteres"
                  required
                  minLength={10}
                  disabled={isPending}
                />
                {state?.details?.password?.[0] && (
                  <p className="text-sm text-destructive">
                    {state.details.password[0]}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirmez votre mot de passe"
                  required
                  minLength={10}
                  disabled={isPending}
                />
                {state?.details?.confirmPassword?.[0] && (
                  <p className="text-sm text-destructive">
                    {state.details.confirmPassword[0]}
                  </p>
                )}
              </div>
              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Validation...
                  </>
                ) : mode === "reset" ? (
                  "Mettre a jour le mot de passe"
                ) : (
                  "Activer mon acces"
                )}
              </Button>
            </>
          )}
        </form>
      </CardContent>
    </Card>
  )
}
