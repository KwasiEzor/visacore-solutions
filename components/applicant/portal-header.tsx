"use client"

import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { LogOut, ShieldCheck } from "lucide-react"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PortalHeaderProps {
  name: string | null | undefined
  email: string | null | undefined
}

export function PortalHeader({ name, email }: PortalHeaderProps) {
  const [isPending, startTransition] = useTransition()
  const logoutLabel = isPending ? "Deconnexion..." : "Se deconnecter"

  return (
    <header className="sticky top-0 z-30 border-b border-visacore-navy/8 bg-white/92 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-3 py-3 sm:px-6 sm:py-4 lg:px-8">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="rounded-[16px] border border-visacore-navy/10 bg-white p-1.5 shadow-[0_18px_45px_-34px_rgba(10,37,64,0.28)] sm:rounded-[18px] sm:p-2">
            <Image
              src="/images/visacore_solution_logo.png"
              alt="VisaCore Solutions"
              width={1094}
              height={315}
              className="h-7 w-auto sm:h-9"
            />
          </div>
          <div className="min-w-0 leading-tight">
            <p className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.18em] text-visacore-gold sm:text-[11px] sm:tracking-[0.22em]">
              <ShieldCheck className="size-3 sm:size-3.5" />
              Espace client
            </p>
            <p className="truncate pt-1 text-base font-semibold text-foreground sm:text-base">
              {name ?? email ?? "Portail demandeur"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <Link href="/" className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground md:inline-flex">
            Retour au site
          </Link>
          <Button
            variant="outline"
            className="size-10 rounded-full px-0 sm:size-auto sm:px-4"
            disabled={isPending}
            aria-label={logoutLabel}
            onClick={() =>
              startTransition(async () => {
                await logoutAction("/espace-client/connexion")
              })
            }
          >
            <LogOut className={cn("size-4 sm:mr-2")} />
            <span className="hidden sm:inline">{logoutLabel}</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
