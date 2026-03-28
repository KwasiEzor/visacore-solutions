"use client"

import { useActionState } from "react"
import Link from "next/link"
import { loginAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return await loginAction(formData)
    },
    undefined
  )

  return (
    <Card className="w-full max-w-md rounded-[28px] border-visacore-navy/8 shadow-none">
      <CardHeader className="space-y-3 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
        <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
          Connexion
        </p>
        <CardTitle className="text-3xl font-black text-visacore-navy">
          Acceder a l&apos;administration
        </CardTitle>
        <CardDescription>
          Connectez-vous a votre espace d&apos;administration pour suivre les demandes et piloter le contenu.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        <form action={formAction} className="space-y-5">
          {state?.error && (
            <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="admin@visacore.com"
              required
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
          </div>
          <Button type="submit" className="mt-2 h-12 w-full rounded-full bg-[#0A2540] text-white hover:bg-[#163C61]" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Se connecter"
            )}
          </Button>
          <div className="space-y-2 rounded-[22px] border border-visacore-navy/8 bg-[#F7F8FB] px-4 py-4 text-center text-sm text-muted-foreground">
            <p>
              Premiere connexion ou mot de passe oublie ?
            </p>
            <Link
              href="/recuperer-acces"
              className="font-semibold text-[#0A2540] underline underline-offset-4"
            >
              Demander un lien securise
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
