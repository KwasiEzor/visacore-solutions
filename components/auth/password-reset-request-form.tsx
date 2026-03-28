"use client"

import { useActionState } from "react"
import Link from "next/link"
import { requestPasswordResetAction } from "@/actions/account-access"
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
import { Loader2, MailCheck } from "lucide-react"

export function PasswordResetRequestForm() {
  const [state, formAction, isPending] = useActionState(
    async (
      _prev:
        | { success?: boolean; error?: string; message?: string }
        | undefined,
      formData: FormData
    ) => requestPasswordResetAction(formData),
    undefined
  )

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">
          Recuperer mon acces
        </CardTitle>
        <CardDescription>
          Recevez un lien securise pour definir un nouveau mot de passe ou activer votre compte.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          {state?.error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          {state?.success && (
            <div className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-700">
              <div className="flex items-start gap-2">
                <MailCheck className="mt-0.5 size-4 shrink-0" />
                <span>{state.message}</span>
              </div>
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email professionnel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@visacore.com"
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Envoi...
              </>
            ) : (
              "Envoyer le lien securise"
            )}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            <Link href="/login" className="font-medium text-[#0A2540] underline">
              Retour a la connexion
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
