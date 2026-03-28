"use client"

import Image from "next/image"
import Link from "next/link"
import { useTransition } from "react"
import { LogOut, ShieldCheck } from "lucide-react"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"

interface PortalHeaderProps {
  name: string | null | undefined
  email: string | null | undefined
}

export function PortalHeader({ name, email }: PortalHeaderProps) {
  const [isPending, startTransition] = useTransition()

  return (
    <header className="sticky top-0 z-30 border-b border-visacore-navy/8 bg-white/82 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <div className="rounded-[18px] border border-visacore-navy/10 bg-white p-2 shadow-[0_18px_45px_-34px_rgba(10,37,64,0.28)]">
            <Image
              src="/images/visacore_solution_logo.png"
              alt="VisaCore Solutions"
              width={1094}
              height={315}
              className="h-8 w-auto sm:h-9"
            />
          </div>
          <div className="min-w-0">
            <p className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.22em] text-visacore-gold">
              <ShieldCheck className="size-3.5" />
              Espace client
            </p>
            <p className="truncate text-sm font-semibold text-foreground sm:text-base">
              {name ?? email ?? "Portail demandeur"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link href="/" className="hidden text-sm font-medium text-muted-foreground transition hover:text-foreground sm:inline-flex">
            Retour au site
          </Link>
          <Button
            variant="outline"
            className="rounded-full"
            disabled={isPending}
            onClick={() =>
              startTransition(async () => {
                await logoutAction("/espace-client/connexion")
              })
            }
          >
            <LogOut className="mr-2 size-4" />
            {isPending ? "Deconnexion..." : "Se deconnecter"}
          </Button>
        </div>
      </div>
    </header>
  )
}
