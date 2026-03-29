"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowUpRight, Eye, EyeOff, FileSearch, KeyRound, Loader2, ShieldCheck } from "lucide-react"
import { loginApplicantAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApplicantLoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [state, formAction, isPending] = useActionState(
    async (_prev: { error?: string } | undefined, formData: FormData) => {
      return loginApplicantAction(formData)
    },
    undefined
  )

  return (
    <Card className="w-full max-w-full rounded-[30px] border-visacore-navy/8 bg-white shadow-none">
      <CardHeader className="space-y-4 px-6 pb-3 pt-6 sm:px-8 sm:pt-8">
        <div className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
          <ShieldCheck className="size-3.5" />
          Espace client
        </div>
        <CardTitle className="max-w-lg text-3xl font-black text-visacore-navy sm:text-[2.2rem]">
          Suivre ma procedure en toute clarte
        </CardTitle>
        <CardDescription className="max-w-xl text-[0.96rem] leading-7">
          Connectez-vous pour consulter vos etapes, vos documents a transmettre,
          les validations recues et les mises a jour partagees par VisaCore Solutions.
        </CardDescription>
        <div className="rounded-[24px] border border-[#E6E9F2] bg-[#FBFCFE] px-4 py-3 text-sm leading-6 text-muted-foreground">
          Acces securise, documents proteges et suivi partage par votre conseiller tout au long du dossier.
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6 pt-3 sm:px-8 sm:pb-8">
        <form action={formAction} className="space-y-6">
          {state?.error ? (
            <div className="rounded-2xl bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {state.error}
            </div>
          ) : null}

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="portal-email">Email</Label>
              <Input
                id="portal-email"
                name="email"
                type="email"
                placeholder="vous@exemple.com"
                required
                disabled={isPending}
                className="h-12 rounded-2xl border-[#D7DCE8] bg-white px-4"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="portal-password">Mot de passe</Label>
                <Link
                  href="/recuperer-acces"
                  className="text-xs font-semibold text-visacore-gold underline underline-offset-4"
                >
                  Acces perdu ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="portal-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  required
                  disabled={isPending}
                  className="h-12 rounded-2xl border-[#D7DCE8] bg-white px-4 pr-12"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  className="absolute right-2 top-1/2 size-8 -translate-y-1/2 rounded-full text-muted-foreground hover:bg-[#EEF2F8] hover:text-visacore-navy"
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((value) => !value)}
                  disabled={isPending}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="mt-2 h-13 w-full rounded-full bg-[#0A2540] text-base font-semibold text-white hover:bg-[#163C61]"
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
          </div>

          <div className="rounded-[26px] border border-[#E5E8F1] bg-[linear-gradient(180deg,#FAFBFE_0%,#F4F6FB_100%)] p-4 sm:p-5">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
                  Besoin d&apos;aide pour entrer ?
                </p>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  Si votre acces n&apos;est pas encore actif ou si vous avez perdu votre lien, choisissez le bon parcours.
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-3 lg:grid-cols-2">
              <div className="rounded-[22px] border border-white bg-white/80 p-4 shadow-[0_12px_24px_-20px_rgba(10,37,64,0.24)]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#0A2540]/8 text-visacore-navy">
                    <KeyRound className="size-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-visacore-navy">Premiere connexion ou acces perdu</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Demandez un lien securise pour activer votre acces ou retrouver votre portail.
                    </p>
                    <Link
                      href="/recuperer-acces"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-visacore-navy underline underline-offset-4"
                    >
                      Demander un lien securise
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>

              <div className="rounded-[22px] border border-white bg-white/80 p-4 shadow-[0_12px_24px_-20px_rgba(10,37,64,0.24)]">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/12 text-visacore-gold">
                    <FileSearch className="size-4" />
                  </div>
                  <div className="space-y-2">
                    <p className="font-semibold text-visacore-navy">Pas encore de portail client ?</p>
                    <p className="text-sm leading-6 text-muted-foreground">
                      Lancez votre demande pour ouvrir un dossier et recevoir votre acces lorsqu&apos;il est prepare.
                    </p>
                    <Link
                      href="/evaluation"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-visacore-gold underline underline-offset-4"
                    >
                      Ouvrir mon dossier
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 rounded-[24px] border border-[#ECEFF5] bg-[#FCFCFD] px-4 py-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="leading-6">
              Vous etes collaborateur VisaCore ? Utilisez l&apos;espace d&apos;administration dedie.
            </p>
            <Link
              href="/login"
              className="inline-flex shrink-0 items-center gap-1 font-semibold text-[#0A2540] underline underline-offset-4"
            >
              Ouvrir l&apos;administration
              <ArrowUpRight className="size-3.5" />
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
