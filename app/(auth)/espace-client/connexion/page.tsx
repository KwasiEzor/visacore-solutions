"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Loader2, ShieldCheck } from "lucide-react"
import { loginApplicantAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApplicantLoginPage() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return loginApplicantAction(formData)
    },
    undefined
  )

  return (
    <Card className="w-full max-w-md rounded-[28px] border-visacore-navy/8 shadow-none">
      <CardHeader className="space-y-3 px-6 pb-2 pt-6 sm:px-8 sm:pt-8">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
          <ShieldCheck className="size-3.5" />
          Espace client
        </div>
        <CardTitle className="text-3xl font-black text-visacore-navy">
          Suivre ma procedure
        </CardTitle>
        <CardDescription>
          Connectez-vous pour consulter vos etapes, vos documents demandes et
          les mises a jour partagees par VisaCore Solutions.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-4 sm:px-8 sm:pb-8">
        <form action={formAction} className="space-y-5">
          {state?.error ? (
            <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="portal-email">Email</Label>
            <Input
              id="portal-email"
              name="email"
              type="email"
              placeholder="vous@exemple.com"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="portal-password">Mot de passe</Label>
            <Input
              id="portal-password"
              name="password"
              type="password"
              placeholder="••••••••"
              required
              disabled={isPending}
            />
          </div>

          <Button
            type="submit"
            className="mt-2 h-12 w-full rounded-full bg-[#0A2540] text-white hover:bg-[#163C61]"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connexion...
              </>
            ) : (
              "Acceder a mon portail"
            )}
          </Button>

          <div className="space-y-2 rounded-[22px] border border-visacore-navy/8 bg-[#F7F8FB] px-4 py-4 text-center text-sm text-muted-foreground">
            <p>Premiere connexion ou acces perdu ?</p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Link
                href="/recuperer-acces"
                className="font-semibold text-[#0A2540] underline underline-offset-4"
              >
                Demander un lien securise
              </Link>
              <Link
                href="/evaluation"
                className="font-semibold text-visacore-gold underline underline-offset-4"
              >
                Ouvrir mon dossier
              </Link>
            </div>
          </div>

          <p className="text-center text-sm text-muted-foreground">
            Vous etes collaborateur VisaCore ?{" "}
            <Link href="/login" className="font-semibold text-[#0A2540] underline">
              Ouvrir l&apos;administration
            </Link>
          </p>
        </form>
      </CardContent>
    </Card>
  )
}
