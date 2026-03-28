"use client"

import Link from "next/link"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { KeyRound, Loader2, Mail, Plus, Send, UserRound } from "lucide-react"
import { toast } from "sonner"
import { sendApplicantAccessLink } from "@/actions/applicants"
import { procedureStatusLabels } from "@/lib/applicant-portal.shared"
import { ApplicantCreateDialog } from "@/components/admin/applicant-create-dialog"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ApplicantItem {
  id: string
  name: string | null
  email: string
  accessState: "ACTIVE" | "PENDING"
  createdAt: string
  phone: string | null
  destination: string | null
  caseCount: number
  latestCaseReference: string | null
  latestCaseStatus: string | null
}

interface ApplicantsClientProps {
  data: ApplicantItem[]
}

const accessLabels: Record<ApplicantItem["accessState"], string> = {
  ACTIVE: "Espace actif",
  PENDING: "Invitation en attente",
}

const accessVariant: Record<ApplicantItem["accessState"], "green" | "gold"> = {
  ACTIVE: "green",
  PENDING: "gold",
}

export function ApplicantsClient({ data }: ApplicantsClientProps) {
  const [createOpen, setCreateOpen] = useState(false)
  const [pendingId, setPendingId] = useState<string | null>(null)
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleAccessLink(applicantId: string) {
    setPendingId(applicantId)
    startTransition(async () => {
      const result = await sendApplicantAccessLink(applicantId)
      setPendingId(null)

      if (result.success) {
        toast.success(result.message ?? "Lien d'acces envoye")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'envoyer le lien")
      }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Applicants
          </h1>
          <p className="text-sm text-muted-foreground">
            Onboardez les demandeurs, activez leur portail et pilotez leurs procedures.
          </p>
        </div>

        <Button onClick={() => setCreateOpen(true)} className="rounded-full">
          <Plus className="mr-2 size-4" />
          Nouvel applicant
        </Button>
      </div>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.65fr)]">
        <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
          <CardHeader>
            <CardTitle>Portails clients ({data.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-border px-6 py-10 text-center text-sm text-muted-foreground">
                Aucun applicant n&apos;est encore cree.
              </div>
            ) : (
              data.map((applicant) => {
                const statusLabel =
                  applicant.latestCaseStatus &&
                  procedureStatusLabels[
                    applicant.latestCaseStatus as keyof typeof procedureStatusLabels
                  ]

                return (
                  <div
                    key={applicant.id}
                    className="rounded-[24px] border border-visacore-navy/8 bg-white p-4 shadow-[0_20px_60px_-48px_rgba(10,37,64,0.28)]"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                      <div className="min-w-0 space-y-3">
                        <div className="flex flex-wrap items-center gap-2">
                          <div className="flex size-11 items-center justify-center rounded-full bg-[#0A2540] text-sm font-semibold text-white">
                            {applicant.name
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)
                              .toUpperCase() ?? "?"}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-foreground">
                              {applicant.name ?? "Sans nom"}
                            </p>
                            <p className="truncate text-sm text-muted-foreground">
                              {applicant.email}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge
                            status={accessLabels[applicant.accessState]}
                            variant={accessVariant[applicant.accessState]}
                          />
                          {statusLabel ? (
                            <StatusBadge status={statusLabel} variant="blue" />
                          ) : null}
                          <span className="rounded-full border border-border px-3 py-1 text-xs font-semibold text-muted-foreground">
                            {applicant.caseCount} procedure
                            {applicant.caseCount > 1 ? "s" : ""}
                          </span>
                        </div>

                        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
                          <DataPoint label="Destination" value={applicant.destination ?? "A definir"} />
                          <DataPoint label="Telephone" value={applicant.phone ?? "Non renseigne"} />
                          <DataPoint label="Reference" value={applicant.latestCaseReference ?? "Aucune"} />
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <Link href={`/admin/applicants/${applicant.id}`}>
                          <Button variant="outline" className="rounded-full">
                            <UserRound className="mr-2 size-4" />
                            Ouvrir le dossier
                          </Button>
                        </Link>
                        <Button
                          variant="outline"
                          className="rounded-full"
                          onClick={() => handleAccessLink(applicant.id)}
                          disabled={isPending && pendingId === applicant.id}
                        >
                          {isPending && pendingId === applicant.id ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : applicant.accessState === "PENDING" ? (
                            <Mail className="mr-2 size-4" />
                          ) : (
                            <KeyRound className="mr-2 size-4" />
                          )}
                          {applicant.accessState === "PENDING"
                            ? "Renvoyer l'invitation"
                            : "Reinitialiser l'acces"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
          <CardHeader>
            <CardTitle>Cadre operationnel</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Chaque applicant dispose d&apos;un espace securise pour suivre les etapes,
              deposer les pieces demandees et corriger ses informations.
            </p>
            <div className="rounded-[24px] bg-[#0A2540] p-5 text-white">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold/85">
                Parcours recommande
              </p>
              <ul className="mt-4 space-y-3 text-sm text-white/76">
                <li className="flex items-start gap-2">
                  <Send className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
                  Creer l&apos;applicant avec une premiere procedure.
                </li>
                <li className="flex items-start gap-2">
                  <Send className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
                  Ajouter les jalons et la checklist au fur et a mesure.
                </li>
                <li className="flex items-start gap-2">
                  <Send className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
                  Valider ou corriger les documents envoyes depuis le portail.
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      <ApplicantCreateDialog open={createOpen} onOpenChange={setCreateOpen} />
    </>
  )
}

function DataPoint({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1 rounded-[18px] border border-border/80 bg-[#F7F8FB] px-3 py-2.5">
      <p className="text-[11px] font-black uppercase tracking-[0.18em] text-visacore-gold">
        {label}
      </p>
      <p className="line-clamp-2 text-sm font-medium text-foreground">{value}</p>
    </div>
  )
}
