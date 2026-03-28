"use client"

import {
  useTransition,
  type ComponentType,
  type FormEvent,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  Mail,
  MapPinned,
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
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export function ApplicantPortalDashboard({
  applicant,
}: ApplicantPortalProps) {
  const primaryCase = applicant.cases[0] ?? null

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[36px] border border-visacore-navy/10 bg-[linear-gradient(135deg,#0A2540_0%,#173E63_100%)] px-5 py-6 text-white shadow-[0_36px_90px_-58px_rgba(10,37,64,0.62)] sm:px-7 sm:py-8">
        <div className="absolute -right-20 -top-10 size-48 rounded-full bg-visacore-gold/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-28 w-full bg-gradient-to-t from-black/14 to-transparent" />
        <div className="relative z-10 grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
          <div className="space-y-5">
            <div className="inline-flex rounded-full border border-white/10 bg-white/8 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">
              Espace client securise
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight sm:text-4xl">
                Bonjour {applicant.name ?? "et bienvenue"}.
              </h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-white/74 sm:text-lg">
                Retrouvez ici les informations utiles sur votre procedure, les
                prochaines actions demandees et les pieces a transmettre a
                l&apos;equipe VisaCore Solutions.
              </p>
            </div>

            {primaryCase ? (
              <div className="grid gap-3 sm:grid-cols-3">
                <SummaryPill
                  icon={MapPinned}
                  label="Destination"
                  value={primaryCase.destinationCountry}
                />
                <SummaryPill
                  icon={CalendarClock}
                  label="Etape actuelle"
                  value={primaryCase.currentStep ?? "En preparation"}
                />
                <SummaryPill
                  icon={UserRound}
                  label="Conseiller"
                  value={primaryCase.advisorName ?? "Equipe VisaCore"}
                />
              </div>
            ) : (
              <div className="rounded-[24px] border border-white/10 bg-white/8 px-4 py-4 text-sm text-white/78">
                Votre espace est cree. Votre premiere procedure sera affichee ici
                des qu&apos;elle aura ete preparee par l&apos;equipe.
              </div>
            )}
          </div>

          <div className="relative rounded-[28px] border border-white/10 bg-white/8 p-5 backdrop-blur-sm">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">
              Repere rapide
            </p>
            <div className="mt-4 space-y-3">
              {portalQuickFacts.map((fact) => (
                <div
                  key={fact}
                  className="rounded-[20px] border border-white/10 bg-black/10 px-4 py-3 text-sm text-white/74"
                >
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(20rem,0.8fr)]">
        <div className="space-y-6">
          {applicant.cases.length === 0 ? (
            <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
              <CardContent className="px-6 py-10 text-center text-sm text-muted-foreground">
                Aucune procedure n&apos;est encore partagee dans votre portail.
              </CardContent>
            </Card>
          ) : (
            applicant.cases.map((item) => (
              <PortalCaseCard key={item.id} caseItem={item} />
            ))
          )}
        </div>

        <div className="space-y-6">
          <ApplicantProfileCard applicant={applicant} />
          <DeletionRequestCard />
        </div>
      </div>
    </div>
  )
}

function PortalCaseCard({ caseItem }: { caseItem: PortalCase }) {
  const progress = getProcedureProgress(caseItem.status)
  const needsRevisionCount = caseItem.checklistItems.filter(
    (item) => item.status === "NEEDS_REVISION"
  ).length
  const pendingCount = caseItem.checklistItems.filter(
    (item) => item.status === "REQUESTED" || item.status === "PENDING"
  ).length

  return (
    <Card className="overflow-hidden rounded-[30px] border-visacore-navy/8 shadow-none">
      <CardHeader className="border-b border-border/70 bg-[#FBFCFD]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">
              {caseItem.reference}
            </p>
            <CardTitle className="text-2xl">{caseItem.title}</CardTitle>
            <p className="text-sm text-muted-foreground">
              {caseItem.serviceName ?? caseItem.visaCategory} · {caseItem.destinationCountry}
            </p>
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
            {needsRevisionCount > 0 ? (
              <StatusPill tone="amber" label={`${needsRevisionCount} correction${needsRevisionCount > 1 ? "s" : ""}`} />
            ) : null}
            {pendingCount > 0 ? (
              <StatusPill tone="slate" label={`${pendingCount} piece${pendingCount > 1 ? "s" : ""} attendue${pendingCount > 1 ? "s" : ""}`} />
            ) : null}
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progression de la procedure</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="h-2 rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-visacore-gold"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-5 py-6 sm:px-6">
        <div className="grid gap-4 md:grid-cols-2">
          <InfoCard
            icon={AlertCircle}
            title={caseItem.nextActionTitle ?? "Aucune action immediate"}
            body={
              caseItem.nextActionDescription ??
              "Nous vous informerons ici des qu'une prochaine action sera requise."
            }
            meta={caseItem.nextActionDueAt ? `Avant le ${caseItem.nextActionDueAt}` : "Sans echeance"}
          />
          <InfoCard
            icon={Mail}
            title={caseItem.advisorName ?? "Equipe VisaCore Solutions"}
            body={
              caseItem.summary ??
              "Votre procedure est suivie par notre equipe. Utilisez ce tableau pour garder une vision claire des etapes."
            }
            meta={caseItem.advisorEmail ?? "Support humain disponible"}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <ChecklistSection caseItem={caseItem} />
          <TimelineSection caseItem={caseItem} />
        </div>
      </CardContent>
    </Card>
  )
}

function ChecklistSection({ caseItem }: { caseItem: PortalCase }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CheckCircle2 className="size-4 text-visacore-gold" />
        <h3 className="text-lg font-semibold text-foreground">Checklist & documents</h3>
      </div>

      {caseItem.checklistItems.length === 0 ? (
        <SectionEmpty text="Aucune piece n'est demandee pour le moment." />
      ) : (
        caseItem.checklistItems.map((item) => (
          <ChecklistItemCard key={item.id} caseId={caseItem.id} item={item} />
        ))
      )}
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
    <div className="rounded-[24px] border border-border bg-white px-4 py-4 shadow-[0_20px_55px_-46px_rgba(10,37,64,0.22)]">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="font-semibold text-foreground">{item.title}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {item.description ?? "Consultez cette piece et deposez-la si elle est requise."}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
            {item.category ?? "Document"} ·{" "}
            {checklistItemStatusLabels[
              item.status as keyof typeof checklistItemStatusLabels
            ] ?? item.status}
            {item.dueDate ? ` · echeance ${item.dueDate}` : ""}
          </p>
        </div>
        <StatusPill
          tone={
            item.status === "NEEDS_REVISION"
              ? "amber"
              : item.status === "ACCEPTED"
                ? "green"
                : "slate"
          }
          label={
            checklistItemStatusLabels[
              item.status as keyof typeof checklistItemStatusLabels
            ] ?? item.status
          }
        />
      </div>

      <div className="mt-4 space-y-3">
        {item.documents.map((document) => (
          <div
            key={document.id}
            className="rounded-[18px] border border-border/80 bg-[#F7F8FB] px-3.5 py-3"
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
                  tone={
                    document.status === "ACCEPTED"
                      ? "green"
                      : document.status === "NEEDS_REVISION"
                        ? "amber"
                        : "slate"
                  }
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

        <form onSubmit={handleUpload} className="space-y-3 rounded-[18px] border border-dashed border-border px-4 py-4">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,0.8fr)]">
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
    </div>
  )
}

function TimelineSection({ caseItem }: { caseItem: PortalCase }) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarClock className="size-4 text-visacore-gold" />
        <h3 className="text-lg font-semibold text-foreground">Timeline de procedure</h3>
      </div>

      {caseItem.milestones.length === 0 ? (
        <SectionEmpty text="Les jalons valides de votre procedure apparaitront ici." />
      ) : (
        <div className="space-y-3">
          {caseItem.milestones.map((item) => (
            <div
              key={item.id}
              className="rounded-[24px] border border-border bg-white px-4 py-4 shadow-[0_20px_55px_-46px_rgba(10,37,64,0.22)]"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{item.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description ?? "Mise a jour de procedure"}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                    {item.occurredAt ?? "Date non communiquee"}
                  </p>
                </div>
                <StatusPill
                  tone={item.status === "DONE" ? "green" : item.status === "IN_PROGRESS" ? "navy" : "slate"}
                  label={
                    milestoneStatusLabels[
                      item.status as keyof typeof milestoneStatusLabels
                    ] ?? item.status
                  }
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function ApplicantProfileCard({
  applicant,
}: {
  applicant: ApplicantPortalProps["applicant"]
}) {
  const [isPending, startTransition] = useTransition()
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
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour vos informations")
      }
    })
  }

  return (
    <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
      <CardHeader>
        <CardTitle>Mes informations</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <PortalField label="Nom complet" htmlFor="portal-name">
              <Input id="portal-name" name="name" defaultValue={applicant.name ?? ""} required />
            </PortalField>
            <PortalField label="Telephone" htmlFor="portal-phone">
              <Input id="portal-phone" name="phone" defaultValue={applicant.profile.phone ?? ""} />
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
              <Input id="portal-city" name="city" defaultValue={applicant.profile.city ?? ""} />
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
            <PortalField label="Contact d'urgence" htmlFor="portal-emergency-name">
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
            J&apos;accepte de recevoir des rappels d&apos;accompagnement VisaCore.
          </label>
          <Button type="submit" disabled={isPending} className="w-full rounded-full">
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Mise a jour...
              </>
            ) : (
              "Mettre a jour mes informations"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function DeletionRequestCard() {
  const [isPending, startTransition] = useTransition()
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
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'envoyer votre demande")
      }
    })
  }

  return (
    <Card className="rounded-[28px] border-amber-200 bg-amber-50/70 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-amber-950">
          <ShieldAlert className="size-5" />
          Donnees et suppression
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm text-amber-950/86">
        <p>
          Pour proteger l&apos;integrite de votre dossier et respecter le RGPD, la
          suppression globale passe par une demande tracee. Les documents deposes
          individuellement peuvent en revanche etre retires depuis la checklist.
        </p>
        <form onSubmit={handleSubmit} className="space-y-3">
          <PortalField label="Message complementaire" htmlFor="portal-erasure-message">
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
              "Demander la suppression de mes donnees"
            )}
          </Button>
        </form>
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
    <div className="rounded-[22px] border border-white/10 bg-white/8 px-4 py-3 backdrop-blur-sm">
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

function InfoCard({
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
    <div className="rounded-[24px] border border-border bg-[#FBFCFD] px-4 py-4">
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
    navy: "bg-[#0A2540]/8 text-[#0A2540] border-[#0A2540]/12",
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    green: "bg-emerald-100 text-emerald-700 border-emerald-200",
    amber: "bg-amber-100 text-amber-700 border-amber-200",
  }

  return (
    <span className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold ${tones[tone]}`}>
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

function SectionEmpty({ text }: { text: string }) {
  return (
    <div className="rounded-[24px] border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}
