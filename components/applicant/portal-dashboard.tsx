"use client"

import {
  useState,
  useTransition,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  CircleDot,
  Clock3,
  FileCheck2,
  FileClock,
  FileText,
  FileWarning,
  Loader2,
  MapPinned,
  PencilLine,
  ShieldAlert,
  UploadCloud,
  UserRound,
} from "lucide-react"
import { toast } from "sonner"
import {
  deleteOwnApplicantDocument,
  requestApplicantDataDeletion,
  updateOwnApplicantProfile,
  uploadApplicantDocument,
} from "@/actions/applicants"
import {
  applicantDocumentStatusLabels,
  checklistItemStatusLabels,
  getProcedureProgress,
  milestoneStatusLabels,
  portalQuickFacts,
  procedureStatusLabels,
} from "@/lib/applicant-portal.shared"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface PortalDocument {
  id: string
  label: string
  originalFilename: string
  size: number
  status: string
  reviewNote: string | null
  createdAt: string
  checklistItemId: string | null
}

interface PortalChecklistItem {
  id: string
  title: string
  description: string | null
  category: string | null
  status: string
  dueDate: string | null
  documents: PortalDocument[]
}

interface PortalMilestone {
  id: string
  title: string
  description: string | null
  status: string
  occurredAt: string | null
}

interface PortalCase {
  id: string
  reference: string
  title: string
  serviceName: string | null
  destinationCountry: string
  visaCategory: string
  status: string
  summary: string | null
  currentStep: string | null
  nextActionTitle: string | null
  nextActionDescription: string | null
  nextActionDueAt: string | null
  lastSharedUpdateAt: string | null
  advisorName: string | null
  advisorEmail: string | null
  milestones: PortalMilestone[]
  checklistItems: PortalChecklistItem[]
  documents: PortalDocument[]
}

interface ApplicantPortalProps {
  applicant: {
    id: string
    name: string | null
    email: string
    profile: {
      phone: string | null
      whatsappNumber: string | null
      countryOfResidence: string | null
      nationality: string | null
      passportNumber: string | null
      dateOfBirth: string | null
      addressLine: string | null
      city: string | null
      postalCode: string | null
      preferredDestination: string | null
      targetService: string | null
      currentSituation: string | null
      emergencyContactName: string | null
      emergencyContactPhone: string | null
      marketingConsent: boolean
    }
    cases: PortalCase[]
  }
}

interface ChecklistGroup {
  id: "required" | "review" | "validated"
  title: string
  description: string
  tone: "gold" | "navy" | "green"
  items: PortalChecklistItem[]
}

export function ApplicantPortalDashboard({
  applicant,
}: ApplicantPortalProps) {
  const initialCaseId = applicant.cases[0]?.id ?? null
  const [selectedCaseId, setSelectedCaseId] = useState<string | null>(initialCaseId)
  const selectedCase =
    applicant.cases.find((caseItem) => caseItem.id === selectedCaseId) ??
    applicant.cases[0] ??
    null

  if (!selectedCase) {
    return (
      <div className="space-y-6">
        <PortalHero applicant={applicant} caseItem={null} />
        <Card className="rounded-[30px] border-visacore-navy/8 bg-white/90 shadow-[0_30px_100px_-70px_rgba(10,37,64,0.35)]">
          <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
            Votre espace est pret. Votre premiere procedure apparaitra ici des
            qu&apos;elle sera partagee par l&apos;equipe VisaCore Solutions.
          </CardContent>
        </Card>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_22rem]">
          <div />
          <div className="space-y-6">
            <ApplicantProfilePanel applicant={applicant} />
            <PrivacyPanel />
          </div>
        </div>
      </div>
    )
  }

  const progress = getProcedureProgress(selectedCase.status)
  const requiredCount = selectedCase.checklistItems.filter((item) =>
    ["PENDING", "REQUESTED", "NEEDS_REVISION"].includes(item.status)
  ).length
  const reviewCount = selectedCase.checklistItems.filter((item) =>
    ["UPLOADED", "UNDER_REVIEW"].includes(item.status)
  ).length
  const validatedCount = selectedCase.checklistItems.filter((item) =>
    ["ACCEPTED", "WAIVED"].includes(item.status)
  ).length

  return (
    <div className="space-y-6 lg:space-y-7">
      <PortalHero applicant={applicant} caseItem={selectedCase} />

      <PortalOverviewGrid
        caseItem={selectedCase}
        progress={progress.percent}
        requiredCount={requiredCount}
        reviewCount={reviewCount}
      />

      {applicant.cases.length > 1 ? (
        <CaseSwitcher
          cases={applicant.cases}
          selectedCaseId={selectedCase.id}
          onSelect={setSelectedCaseId}
        />
      ) : null}

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(21rem,0.85fr)]">
        <div className="space-y-6">
          <NextActionPanel caseItem={selectedCase} />
          <CaseWorkspace
            caseItem={selectedCase}
            validatedCount={validatedCount}
          />
        </div>

        <div className="space-y-6">
          <AssistancePanel caseItem={selectedCase} />
          <ApplicantProfilePanel applicant={applicant} />
          <PrivacyPanel />
        </div>
      </div>
    </div>
  )
}

function PortalHero({
  applicant,
  caseItem,
}: {
  applicant: ApplicantPortalProps["applicant"]
  caseItem: PortalCase | null
}) {
  return (
    <section className="relative overflow-hidden rounded-[36px] border border-visacore-navy/10 bg-[radial-gradient(circle_at_top_left,rgba(213,173,24,0.16),transparent_26%),linear-gradient(135deg,#0A2540_0%,#12385B_58%,#1E507A_100%)] px-5 py-6 text-white shadow-[0_40px_110px_-70px_rgba(10,37,64,0.72)] sm:px-7 sm:py-8">
      <div className="absolute -right-12 top-0 size-44 rounded-full bg-visacore-gold/16 blur-3xl" />
      <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/16 to-transparent" />
      <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.18fr)_minmax(18rem,0.82fr)]">
        <div className="space-y-5">
          <div className="inline-flex rounded-full border border-white/10 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-visacore-gold">
            Espace client securise
          </div>
          <div className="space-y-3">
            <h1 className="max-w-3xl text-3xl font-black tracking-tight sm:text-4xl">
              Bonjour {applicant.name ?? "et bienvenue"}.
            </h1>
            <p className="max-w-3xl text-base leading-7 text-white/78 sm:text-lg">
              Suivez votre procedure, priorisez vos prochaines actions et
              gardez une vision claire de votre dossier sans naviguer entre
              plusieurs formulaires.
            </p>
          </div>

          {caseItem ? (
            <div className="grid gap-3 sm:grid-cols-3">
              <SummaryPill
                icon={MapPinned}
                label="Destination"
                value={caseItem.destinationCountry}
              />
              <SummaryPill
                icon={CalendarClock}
                label="Etape en cours"
                value={caseItem.currentStep ?? "Preparation du dossier"}
              />
              <SummaryPill
                icon={UserRound}
                label="Votre conseiller"
                value={caseItem.advisorName ?? "Equipe VisaCore"}
              />
            </div>
          ) : null}
        </div>

        <div className="rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
          <p className="text-[11px] font-black uppercase tracking-[0.22em] text-visacore-gold">
            Ce que vous retrouvez ici
          </p>
          <div className="mt-4 space-y-3">
            {portalQuickFacts.map((fact) => (
              <div
                key={fact}
                className="rounded-[20px] border border-white/10 bg-black/10 px-4 py-3 text-sm leading-6 text-white/76"
              >
                {fact}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function PortalOverviewGrid({
  caseItem,
  progress,
  requiredCount,
  reviewCount,
}: {
  caseItem: PortalCase
  progress: number
  requiredCount: number
  reviewCount: number
}) {
  const overviewItems = [
    {
      label: "Statut du dossier",
      value:
        procedureStatusLabels[
          caseItem.status as keyof typeof procedureStatusLabels
        ] ?? caseItem.status,
      meta: caseItem.reference,
      icon: BadgeCheck,
    },
    {
      label: "Progression",
      value: `${progress}%`,
      meta: caseItem.currentStep ?? "Etape communiquee bientot",
      icon: Clock3,
    },
    {
      label: "Documents a traiter",
      value: `${requiredCount}`,
      meta:
        requiredCount > 0
          ? "Action requise"
          : reviewCount > 0
            ? "En verification"
            : "Rien d'urgent",
      icon: FileWarning,
    },
    {
      label: "Derniere mise a jour",
      value: caseItem.lastSharedUpdateAt ?? "Aujourd'hui",
      meta: caseItem.advisorName ?? "Equipe VisaCore",
      icon: CalendarClock,
    },
  ]

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {overviewItems.map((item) => (
        <Card
          key={item.label}
          className="rounded-[26px] border-visacore-navy/8 bg-white/92 shadow-[0_26px_70px_-52px_rgba(10,37,64,0.26)]"
        >
          <CardContent className="px-5 py-5">
            <div className="flex items-center gap-2 text-visacore-gold">
              <item.icon className="size-4" />
              <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                {item.label}
              </span>
            </div>
            <p className="mt-4 text-2xl font-black tracking-tight text-foreground">
              {item.value}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">{item.meta}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  )
}

function CaseSwitcher({
  cases,
  selectedCaseId,
  onSelect,
}: {
  cases: PortalCase[]
  selectedCaseId: string
  onSelect: (id: string) => void
}) {
  return (
    <Card className="rounded-[28px] border-visacore-navy/8 bg-white/88 shadow-none">
      <CardHeader className="pb-0">
        <CardTitle>Dossiers suivis</CardTitle>
        <CardDescription>
          Basculer entre vos procedures sans perdre le contexte principal.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-4">
        <div className="flex gap-3 overflow-x-auto pb-1">
          {cases.map((caseItem) => {
            const isActive = caseItem.id === selectedCaseId
            return (
              <button
                key={caseItem.id}
                type="button"
                onClick={() => onSelect(caseItem.id)}
                className={cn(
                  "min-w-[15rem] rounded-[24px] border px-4 py-3 text-left transition",
                  isActive
                    ? "border-visacore-gold/50 bg-visacore-gold/10 shadow-[0_18px_50px_-38px_rgba(213,173,24,0.5)]"
                    : "border-border bg-white hover:border-visacore-navy/20 hover:bg-[#FBFCFE]"
                )}
              >
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-visacore-gold">
                  {caseItem.reference}
                </p>
                <p className="mt-2 line-clamp-2 text-sm font-semibold text-foreground">
                  {caseItem.title}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {caseItem.destinationCountry} ·{" "}
                  {procedureStatusLabels[
                    caseItem.status as keyof typeof procedureStatusLabels
                  ] ?? caseItem.status}
                </p>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

function NextActionPanel({ caseItem }: { caseItem: PortalCase }) {
  const hasUrgentAction = Boolean(
    caseItem.nextActionTitle ||
      caseItem.nextActionDescription ||
      caseItem.nextActionDueAt
  )

  return (
    <Card className="rounded-[32px] border-visacore-gold/18 bg-[linear-gradient(180deg,#fff9ea_0%,#ffffff_100%)] shadow-[0_34px_90px_-62px_rgba(213,173,24,0.45)]">
      <CardContent className="px-5 py-5 sm:px-6 sm:py-6">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-visacore-gold/25 bg-white/70 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.2em] text-visacore-gold">
              <AlertCircle className="size-3.5" />
              Prochaine action
            </div>
            <div>
              <h2 className="text-2xl font-black tracking-tight text-foreground">
                {caseItem.nextActionTitle ?? "Aucune action immediate"}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                {caseItem.nextActionDescription ??
                  "Votre dossier est a jour. Nous utiliserons cette zone pour vous indiquer la prochaine piece a fournir ou la prochaine etape a valider."}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill
                tone={hasUrgentAction ? "amber" : "green"}
                label={
                  caseItem.nextActionDueAt
                    ? `A traiter avant le ${formatDisplayDate(caseItem.nextActionDueAt)}`
                    : hasUrgentAction
                      ? "Action en attente"
                      : "Aucune urgence"
                }
              />
              <StatusPill
                tone="navy"
                label={
                  caseItem.currentStep ?? "Etape communiquee prochainement"
                }
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <a
              href="#documents-a-fournir"
              className="inline-flex items-center justify-center rounded-full bg-visacore-navy px-5 py-3 text-sm font-semibold text-white transition hover:bg-visacore-navy/92"
            >
              Voir mes documents
              <ArrowRight className="ml-2 size-4" />
            </a>
            <a
              href="#mon-compte"
              className="inline-flex items-center justify-center rounded-full border border-visacore-navy/12 bg-white px-5 py-3 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              Verifier mes informations
            </a>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function CaseWorkspace({
  caseItem,
  validatedCount,
}: {
  caseItem: PortalCase
  validatedCount: number
}) {
  return (
    <Card className="rounded-[32px] border-visacore-navy/8 bg-white/94 shadow-[0_36px_100px_-74px_rgba(10,37,64,0.3)]">
      <CardHeader className="border-b border-border/70 bg-[#FCFDFE]">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-2">
            <p className="text-[11px] font-black uppercase tracking-[0.22em] text-visacore-gold">
              Mon dossier
            </p>
            <CardTitle className="text-2xl">{caseItem.title}</CardTitle>
            <CardDescription className="max-w-3xl text-sm leading-6">
              {caseItem.summary ??
                "Retrouvez ici les pieces a transmettre, les etapes deja accomplies et les validations partagees par votre conseiller."}
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusPill
              tone="navy"
              label={
                procedureStatusLabels[
                  caseItem.status as keyof typeof procedureStatusLabels
                ] ?? caseItem.status
              }
            />
            <StatusPill
              tone="green"
              label={`${validatedCount} element${validatedCount > 1 ? "s" : ""} conforme${validatedCount > 1 ? "s" : ""}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-7 px-5 py-6 sm:px-6">
        <div className="grid gap-4 lg:grid-cols-2">
          <CaseDetailTile
            icon={MapPinned}
            label="Destination et service"
            title={`${caseItem.destinationCountry} · ${caseItem.serviceName ?? caseItem.visaCategory}`}
            body={caseItem.reference}
          />
          <CaseDetailTile
            icon={CalendarClock}
            label="Suivi de procedure"
            title={caseItem.currentStep ?? "Preparation du dossier"}
            body={
              caseItem.lastSharedUpdateAt
                ? `Derniere mise a jour partagee le ${caseItem.lastSharedUpdateAt}`
                : "Mises a jour visibles dans la timeline ci-dessous"
            }
          />
        </div>

        <div className="grid gap-7 xl:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)]">
          <ChecklistWorkspace caseItem={caseItem} />
          <TimelineSection caseItem={caseItem} />
        </div>
      </CardContent>
    </Card>
  )
}

function ChecklistWorkspace({ caseItem }: { caseItem: PortalCase }) {
  const groups = groupChecklistItems(caseItem.checklistItems)

  return (
    <section id="documents-a-fournir" className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="size-4 text-visacore-gold" />
          <h3 className="text-lg font-semibold text-foreground">
            Documents et pieces a transmettre
          </h3>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Commencez par les pieces urgentes, puis suivez les validations deja
          engagees par votre conseiller.
        </p>
      </div>

      <div className="space-y-5">
        {groups.map((group) => (
          <ChecklistGroupSection key={group.id} group={group} caseId={caseItem.id} />
        ))}
      </div>
    </section>
  )
}

function ChecklistGroupSection({
  group,
  caseId,
}: {
  group: ChecklistGroup
  caseId: string
}) {
  if (group.items.length === 0) {
    return (
      <div className="rounded-[26px] border border-dashed border-border bg-[#FBFCFD] px-4 py-5">
        <div className="flex items-center gap-2">
          <SectionMarker tone={group.tone} />
          <p className="text-sm font-semibold text-foreground">{group.title}</p>
        </div>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {group.description}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <SectionMarker tone={group.tone} />
        <div>
          <p className="text-sm font-semibold text-foreground">{group.title}</p>
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {group.items.length} element{group.items.length > 1 ? "s" : ""} ·{" "}
            {group.description}
          </p>
        </div>
      </div>
      <div className="space-y-3">
        {group.items.map((item) => (
          <ChecklistItemCard key={item.id} caseId={caseId} item={item} />
        ))}
      </div>
    </div>
  )
}

function ChecklistItemCard({
  caseId,
  item,
}: {
  caseId: string
  item: PortalChecklistItem
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    formData.set("caseId", caseId)
    formData.set("checklistItemId", item.id)

    startTransition(async () => {
      const result = await uploadApplicantDocument(formData)
      if (result.success) {
        toast.success("Document depose")
        event.currentTarget.reset()
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'envoyer le document")
      }
    })
  }

  function handleDeleteDocument(id: string) {
    startTransition(async () => {
      const result = await deleteOwnApplicantDocument(id)
      if (result.success) {
        toast.success("Document supprime")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de supprimer le document")
      }
    })
  }

  return (
    <div className="rounded-[26px] border border-border bg-white px-4 py-4 shadow-[0_18px_55px_-46px_rgba(10,37,64,0.24)]">
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-base font-semibold text-foreground">{item.title}</p>
            <StatusPill
              tone={getChecklistTone(item.status)}
              label={
                checklistItemStatusLabels[
                  item.status as keyof typeof checklistItemStatusLabels
                ] ?? item.status
              }
            />
          </div>
          <p className="text-sm leading-6 text-muted-foreground">
            {item.description ??
              "Consultez cette demande et transmettez le document correspondant si necessaire."}
          </p>
          <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            <span>{item.category ?? "Document"}</span>
            {item.dueDate ? <span>Echeance {formatDisplayDate(item.dueDate)}</span> : null}
            {item.documents.length > 0 ? (
              <span>{item.documents.length} fichier{item.documents.length > 1 ? "s" : ""}</span>
            ) : null}
          </div>
        </div>
      </div>

      {item.documents.length > 0 ? (
        <div className="mt-4 space-y-3">
          {item.documents.map((document) => (
            <div
              key={document.id}
              className="rounded-[20px] border border-border/80 bg-[#F8FAFC] px-3.5 py-3"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {document.label}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {document.originalFilename} · {formatFileSize(document.size)} ·{" "}
                    {document.createdAt}
                  </p>
                  {document.reviewNote ? (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Note VisaCore: {document.reviewNote}
                    </p>
                  ) : null}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusPill
                    tone={getDocumentTone(document.status)}
                    label={
                      applicantDocumentStatusLabels[
                        document.status as keyof typeof applicantDocumentStatusLabels
                      ] ?? document.status
                    }
                  />
                  <a
                    href={`/api/espace-client/documents/${document.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-border px-3 py-2 text-xs font-semibold text-foreground transition hover:bg-muted"
                  >
                    <FileText className="mr-2 size-3.5" />
                    Ouvrir
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteDocument(document.id)}
                    disabled={isPending}
                  >
                    Supprimer
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <form
        onSubmit={handleUpload}
        className="mt-4 space-y-3 rounded-[20px] border border-dashed border-border px-4 py-4"
      >
        <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.85fr)]">
          <div className="space-y-1.5">
            <Label htmlFor={`label-${item.id}`}>Libelle du document</Label>
            <Input
              id={`label-${item.id}`}
              name="label"
              placeholder="Ex: Passeport, releves bancaires..."
              defaultValue={item.title}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`file-${item.id}`}>Fichier</Label>
            <Input id={`file-${item.id}`} name="file" type="file" required />
          </div>
        </div>
        <Button type="submit" disabled={isPending} className="rounded-full">
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Envoi...
            </>
          ) : (
            <>
              <UploadCloud className="mr-2 size-4" />
              Envoyer ce document
            </>
          )}
        </Button>
      </form>
    </div>
  )
}

function TimelineSection({ caseItem }: { caseItem: PortalCase }) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <CalendarClock className="size-4 text-visacore-gold" />
          <h3 className="text-lg font-semibold text-foreground">
            Timeline de la procedure
          </h3>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">
          Cette frise met en avant les etapes majeures de votre dossier et la
          phase actuellement active.
        </p>
      </div>

      {caseItem.milestones.length === 0 ? (
        <SectionEmpty text="Les prochains jalons valides apparaitront ici des qu'ils seront partages." />
      ) : (
        <div className="space-y-3">
          {caseItem.milestones.map((item) => {
            const isCurrent = item.status === "IN_PROGRESS"
            return (
              <div
                key={item.id}
                className={cn(
                  "rounded-[24px] border px-4 py-4 transition",
                  isCurrent
                    ? "border-visacore-navy/18 bg-[#F6F9FD] shadow-[0_26px_70px_-54px_rgba(10,37,64,0.3)]"
                    : "border-border bg-white"
                )}
              >
                <div className="flex gap-3">
                  <div className="pt-0.5">
                    <div
                      className={cn(
                        "flex size-8 items-center justify-center rounded-full border",
                        isCurrent
                          ? "border-visacore-navy/18 bg-visacore-navy text-white"
                          : item.status === "DONE"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-border bg-white text-muted-foreground"
                      )}
                    >
                      {item.status === "DONE" ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <CircleDot className="size-4" />
                      )}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-base font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="mt-1 text-sm leading-6 text-muted-foreground">
                          {item.description ?? "Mise a jour de procedure"}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <StatusPill
                          tone={
                            item.status === "DONE"
                              ? "green"
                              : item.status === "IN_PROGRESS"
                                ? "navy"
                                : "slate"
                          }
                          label={
                            milestoneStatusLabels[
                              item.status as keyof typeof milestoneStatusLabels
                            ] ?? item.status
                          }
                        />
                        <StatusPill
                          tone="slate"
                          label={item.occurredAt ? formatDisplayDate(item.occurredAt) : "Date a confirmer"}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </section>
  )
}

function AssistancePanel({ caseItem }: { caseItem: PortalCase }) {
  return (
    <Card className="rounded-[30px] border-visacore-navy/8 bg-[linear-gradient(180deg,#f6f9fc_0%,#ffffff_100%)] shadow-none">
      <CardHeader>
        <CardTitle>Suivi et assistance</CardTitle>
        <CardDescription>
          Une vue rapide pour savoir qui suit votre dossier et quand agir.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <InfoPanel
          icon={UserRound}
          title={caseItem.advisorName ?? "Equipe VisaCore"}
          body="Votre conseiller centralise les validations et partage ici les prochaines demandes utiles."
          meta={caseItem.advisorEmail ?? "Support humain disponible"}
        />
        <InfoPanel
          icon={FileClock}
          title={caseItem.nextActionTitle ?? "Dossier en observation"}
          body={
            caseItem.nextActionDescription ??
            "Aucune piece supplementaire n'est necessaire pour le moment."
          }
          meta={
            caseItem.nextActionDueAt
              ? `A traiter avant le ${formatDisplayDate(caseItem.nextActionDueAt)}`
              : "Les nouvelles actions apparaitront ici"
          }
        />
      </CardContent>
    </Card>
  )
}

function ApplicantProfilePanel({
  applicant,
}: {
  applicant: ApplicantPortalProps["applicant"]
}) {
  const [isPending, startTransition] = useTransition()
  const [isEditing, setIsEditing] = useState(false)
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateOwnApplicantProfile({
        name: String(formData.get("name") ?? ""),
        phone: String(formData.get("phone") ?? ""),
        whatsappNumber: String(formData.get("whatsappNumber") ?? ""),
        countryOfResidence: String(formData.get("countryOfResidence") ?? ""),
        nationality: String(formData.get("nationality") ?? ""),
        passportNumber: String(formData.get("passportNumber") ?? ""),
        dateOfBirth: String(formData.get("dateOfBirth") ?? ""),
        addressLine: String(formData.get("addressLine") ?? ""),
        city: String(formData.get("city") ?? ""),
        postalCode: String(formData.get("postalCode") ?? ""),
        preferredDestination: String(formData.get("preferredDestination") ?? ""),
        targetService: String(formData.get("targetService") ?? ""),
        currentSituation: String(formData.get("currentSituation") ?? ""),
        emergencyContactName: String(formData.get("emergencyContactName") ?? ""),
        emergencyContactPhone: String(
          formData.get("emergencyContactPhone") ?? ""
        ),
        marketingConsent: formData.get("marketingConsent") === "on",
      })

      if (result.success) {
        toast.success("Vos informations ont ete mises a jour")
        setIsEditing(false)
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour vos informations")
      }
    })
  }

  const profileSummary = [
    { label: "Email", value: applicant.email },
    { label: "Telephone", value: applicant.profile.phone },
    { label: "WhatsApp", value: applicant.profile.whatsappNumber },
    { label: "Nationalite", value: applicant.profile.nationality },
    { label: "Pays de residence", value: applicant.profile.countryOfResidence },
    { label: "Passeport", value: applicant.profile.passportNumber },
    {
      label: "Destination cible",
      value: applicant.profile.preferredDestination,
    },
    { label: "Service souhaite", value: applicant.profile.targetService },
  ]

  return (
    <Card
      id="mon-compte"
      className="rounded-[30px] border-visacore-navy/8 bg-white shadow-[0_30px_80px_-64px_rgba(10,37,64,0.24)]"
    >
      <CardHeader className="border-b border-border/70">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Mon compte</CardTitle>
            <CardDescription className="mt-1">
              Verifiez vos coordonnees avant chaque nouvelle etape du dossier.
            </CardDescription>
          </div>
          <Button
            type="button"
            variant={isEditing ? "outline" : "default"}
            className="rounded-full"
            onClick={() => setIsEditing((current) => !current)}
          >
            <PencilLine className="mr-2 size-4" />
            {isEditing ? "Fermer l'edition" : "Modifier mes informations"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5 px-5 py-5">
        <div className="rounded-[24px] border border-border bg-[#FBFCFD] px-4 py-4">
          <div className="flex items-center gap-2 text-visacore-gold">
            <BadgeCheck className="size-4" />
            <span className="text-[11px] font-black uppercase tracking-[0.18em]">
              Resume du profil
            </span>
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {profileSummary.map((item) => (
              <ProfileSummaryItem
                key={item.label}
                label={item.label}
                value={item.value}
              />
            ))}
          </div>
        </div>

        {applicant.profile.currentSituation ? (
          <div className="rounded-[24px] border border-border bg-white px-4 py-4">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-visacore-gold">
              Informations utiles partagees
            </p>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">
              {applicant.profile.currentSituation}
            </p>
          </div>
        ) : null}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-4 rounded-[24px] border border-border bg-white px-4 py-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Nom complet" htmlFor="portal-name">
                <Input
                  id="portal-name"
                  name="name"
                  defaultValue={applicant.name ?? ""}
                  required
                />
              </PortalField>
              <PortalField label="Telephone" htmlFor="portal-phone">
                <Input
                  id="portal-phone"
                  name="phone"
                  defaultValue={applicant.profile.phone ?? ""}
                />
              </PortalField>
              <PortalField label="WhatsApp" htmlFor="portal-whatsapp">
                <Input
                  id="portal-whatsapp"
                  name="whatsappNumber"
                  defaultValue={applicant.profile.whatsappNumber ?? ""}
                />
              </PortalField>
              <PortalField label="Pays de residence" htmlFor="portal-country">
                <Input
                  id="portal-country"
                  name="countryOfResidence"
                  defaultValue={applicant.profile.countryOfResidence ?? ""}
                />
              </PortalField>
              <PortalField label="Nationalite" htmlFor="portal-nationality">
                <Input
                  id="portal-nationality"
                  name="nationality"
                  defaultValue={applicant.profile.nationality ?? ""}
                />
              </PortalField>
              <PortalField label="Passeport" htmlFor="portal-passport">
                <Input
                  id="portal-passport"
                  name="passportNumber"
                  defaultValue={applicant.profile.passportNumber ?? ""}
                />
              </PortalField>
              <PortalField label="Date de naissance" htmlFor="portal-birth">
                <Input
                  id="portal-birth"
                  name="dateOfBirth"
                  type="date"
                  defaultValue={applicant.profile.dateOfBirth ?? ""}
                />
              </PortalField>
              <PortalField label="Destination cible" htmlFor="portal-target">
                <Input
                  id="portal-target"
                  name="preferredDestination"
                  defaultValue={applicant.profile.preferredDestination ?? ""}
                />
              </PortalField>
            </div>
            <PortalField label="Adresse" htmlFor="portal-address">
              <Input
                id="portal-address"
                name="addressLine"
                defaultValue={applicant.profile.addressLine ?? ""}
              />
            </PortalField>
            <div className="grid gap-4 sm:grid-cols-2">
              <PortalField label="Ville" htmlFor="portal-city">
                <Input
                  id="portal-city"
                  name="city"
                  defaultValue={applicant.profile.city ?? ""}
                />
              </PortalField>
              <PortalField label="Code postal" htmlFor="portal-postal">
                <Input
                  id="portal-postal"
                  name="postalCode"
                  defaultValue={applicant.profile.postalCode ?? ""}
                />
              </PortalField>
              <PortalField label="Service souhaite" htmlFor="portal-service">
                <Input
                  id="portal-service"
                  name="targetService"
                  defaultValue={applicant.profile.targetService ?? ""}
                />
              </PortalField>
              <PortalField
                label="Contact d'urgence"
                htmlFor="portal-emergency-name"
              >
                <Input
                  id="portal-emergency-name"
                  name="emergencyContactName"
                  defaultValue={applicant.profile.emergencyContactName ?? ""}
                />
              </PortalField>
              <PortalField
                label="Telephone d'urgence"
                htmlFor="portal-emergency-phone"
              >
                <Input
                  id="portal-emergency-phone"
                  name="emergencyContactPhone"
                  defaultValue={applicant.profile.emergencyContactPhone ?? ""}
                />
              </PortalField>
            </div>
            <PortalField label="Precisions utiles" htmlFor="portal-situation">
              <Textarea
                id="portal-situation"
                name="currentSituation"
                defaultValue={applicant.profile.currentSituation ?? ""}
                rows={4}
              />
            </PortalField>
            <label className="flex items-center gap-2 rounded-[18px] border border-border px-4 py-3 text-sm text-muted-foreground">
              <input
                type="checkbox"
                name="marketingConsent"
                defaultChecked={applicant.profile.marketingConsent}
              />
              J&apos;accepte de recevoir des rappels d&apos;accompagnement
              VisaCore.
            </label>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="submit" disabled={isPending} className="rounded-full">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Mise a jour...
                  </>
                ) : (
                  "Enregistrer mes informations"
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={() => setIsEditing(false)}
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border px-4 py-4 text-sm leading-6 text-muted-foreground">
            Passez en mode edition uniquement lorsque vous devez corriger une
            information, ajouter un numero de contact ou signaler un changement
            important pour votre procedure.
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function PrivacyPanel() {
  const [isPending, startTransition] = useTransition()
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await requestApplicantDataDeletion({
        message: String(formData.get("message") ?? ""),
      })

      if (result.success) {
        toast.success(result.message ?? "Demande transmise")
        event.currentTarget.reset()
        setIsOpen(false)
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'envoyer votre demande")
      }
    })
  }

  return (
    <Card className="rounded-[30px] border-amber-200 bg-amber-50/72 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-950">
          <ShieldAlert className="size-5" />
          Confidentialite et donnees
        </CardTitle>
        <CardDescription className="text-amber-950/76">
          Les demandes sensibles restent possibles, mais elles ne prennent pas
          le dessus sur le suivi du dossier.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-amber-950/86">
        <p>
          La suppression globale passe par une demande tracee afin de proteger
          l&apos;integrite de votre dossier et respecter le cadre RGPD. Les
          fichiers deposes individuellement peuvent toujours etre retires depuis
          la checklist.
        </p>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-full border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
          onClick={() => setIsOpen((current) => !current)}
        >
          {isOpen
            ? "Fermer la demande RGPD"
            : "Demander la suppression de mes donnees"}
        </Button>

        {isOpen ? (
          <form onSubmit={handleSubmit} className="space-y-3 rounded-[22px] border border-amber-200 bg-white/85 px-4 py-4">
            <PortalField
              label="Message complementaire"
              htmlFor="portal-erasure-message"
            >
              <Textarea
                id="portal-erasure-message"
                name="message"
                rows={4}
                placeholder="Precisez le contexte si votre demande concerne une procedure precise."
              />
            </PortalField>
            <Button
              type="submit"
              disabled={isPending}
              variant="outline"
              className="w-full rounded-full border-amber-300 bg-white text-amber-950 hover:bg-amber-100"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Transmission...
                </>
              ) : (
                "Envoyer ma demande"
              )}
            </Button>
          </form>
        ) : null}
      </CardContent>
    </Card>
  )
}

function SummaryPill({
  icon: Icon,
  label,
  value,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  value: string
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/10 px-4 py-3 backdrop-blur-sm">
      <div className="flex items-center gap-2 text-visacore-gold">
        <Icon className="size-4" />
        <span className="text-[11px] font-black uppercase tracking-[0.2em]">
          {label}
        </span>
      </div>
      <p className="mt-2 text-sm font-semibold text-white">{value}</p>
    </div>
  )
}

function CaseDetailTile({
  icon: Icon,
  label,
  title,
  body,
}: {
  icon: ComponentType<{ className?: string }>
  label: string
  title: string
  body: string
}) {
  return (
    <div className="rounded-[24px] border border-border bg-[#FBFCFD] px-4 py-4">
      <div className="flex items-center gap-2 text-visacore-gold">
        <Icon className="size-4" />
        <span className="text-[11px] font-black uppercase tracking-[0.18em]">
          {label}
        </span>
      </div>
      <p className="mt-3 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
    </div>
  )
}

function InfoPanel({
  icon: Icon,
  title,
  body,
  meta,
}: {
  icon: ComponentType<{ className?: string }>
  title: string
  body: string
  meta: string
}) {
  return (
    <div className="rounded-[24px] border border-border bg-white px-4 py-4">
      <div className="flex items-center gap-2 text-visacore-gold">
        <Icon className="size-4" />
        <span className="text-[11px] font-black uppercase tracking-[0.18em]">
          Repere
        </span>
      </div>
      <p className="mt-3 text-base font-semibold text-foreground">{title}</p>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{body}</p>
      <p className="mt-3 text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {meta}
      </p>
    </div>
  )
}

function StatusPill({
  label,
  tone,
}: {
  label: string
  tone: "navy" | "slate" | "green" | "amber"
}) {
  const tones: Record<typeof tone, string> = {
    navy: "border-[#0A2540]/12 bg-[#0A2540]/8 text-[#0A2540]",
    slate: "border-slate-200 bg-slate-100 text-slate-700",
    green: "border-emerald-200 bg-emerald-100 text-emerald-700",
    amber: "border-amber-200 bg-amber-100 text-amber-700",
  }

  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {label}
    </span>
  )
}

function PortalField({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: ReactNode
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function ProfileSummaryItem({
  label,
  value,
}: {
  label: string
  value: string | null
}) {
  return (
    <div className="rounded-[18px] border border-border bg-white px-3 py-3">
      <p className="text-[11px] font-black uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <p className="mt-2 text-sm font-medium text-foreground">
        {value && value.trim() ? value : "A completer"}
      </p>
    </div>
  )
}

function SectionMarker({ tone }: { tone: ChecklistGroup["tone"] }) {
  const tones: Record<ChecklistGroup["tone"], string> = {
    gold: "bg-visacore-gold/20 border-visacore-gold/30 text-visacore-gold",
    navy: "bg-visacore-navy/10 border-visacore-navy/20 text-visacore-navy",
    green: "bg-emerald-100 border-emerald-200 text-emerald-700",
  }

  return (
    <span
      className={cn(
        "inline-flex size-8 items-center justify-center rounded-full border",
        tones[tone]
      )}
    >
      {tone === "green" ? (
        <FileCheck2 className="size-4" />
      ) : tone === "navy" ? (
        <FileClock className="size-4" />
      ) : (
        <FileWarning className="size-4" />
      )}
    </span>
  )
}

function SectionEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function groupChecklistItems(items: PortalChecklistItem[]): ChecklistGroup[] {
  return [
    {
      id: "required",
      title: "A fournir maintenant",
      description: "Les pieces a transmettre ou corriger en priorite.",
      tone: "gold",
      items: items.filter((item) =>
        ["PENDING", "REQUESTED", "NEEDS_REVISION"].includes(item.status)
      ),
    },
    {
      id: "review",
      title: "En verification",
      description: "Les documents deja recus et actuellement analyses.",
      tone: "navy",
      items: items.filter((item) =>
        ["UPLOADED", "UNDER_REVIEW"].includes(item.status)
      ),
    },
    {
      id: "validated",
      title: "Conformes ou non requis",
      description: "Les elements deja valides ou marques comme non requis.",
      tone: "green",
      items: items.filter((item) =>
        ["ACCEPTED", "WAIVED"].includes(item.status)
      ),
    },
  ]
}

function getChecklistTone(status: string): "navy" | "slate" | "green" | "amber" {
  if (status === "NEEDS_REVISION") return "amber"
  if (status === "ACCEPTED" || status === "WAIVED") return "green"
  if (status === "UPLOADED" || status === "UNDER_REVIEW") return "navy"
  return "slate"
}

function getDocumentTone(status: string): "navy" | "slate" | "green" | "amber" {
  if (status === "ACCEPTED") return "green"
  if (status === "NEEDS_REVISION") return "amber"
  if (status === "UNDER_REVIEW") return "navy"
  return "slate"
}

function formatDisplayDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) {
    return value
  }

  return parsed.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}
