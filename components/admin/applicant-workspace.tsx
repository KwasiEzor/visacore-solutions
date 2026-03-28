"use client"

import {
  useTransition,
  type FormEvent,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react"
import { useRouter } from "next/navigation"
import {
  CalendarClock,
  CheckCheck,
  FileArchive,
  KeyRound,
  Loader2,
  Mail,
  Milestone,
  Plus,
  Trash2,
  UploadCloud,
} from "lucide-react"
import { toast } from "sonner"
import {
  addApplicantMilestone,
  createApplicantCase,
  createApplicantChecklistItem,
  deleteApplicantCase,
  deleteApplicantChecklistItem,
  deleteApplicantDocumentByAdmin,
  deleteApplicantMilestone,
  reviewApplicantDocument,
  sendApplicantAccessLink,
  updateApplicantCase,
  updateApplicantChecklistItem,
  updateApplicantProfileByAdmin,
} from "@/actions/applicants"
import {
  applicantDocumentStatuses,
  applicantDocumentStatusLabels,
  checklistItemStatuses,
  checklistItemStatusLabels,
  getProcedureProgress,
  milestoneStatuses,
  milestoneStatusLabels,
  procedureStatuses,
  procedureStatusLabels,
} from "@/lib/applicant-portal.shared"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/admin/status-badge"

interface AdvisorOption {
  id: string
  name: string
  email: string
}

interface ApplicantDocumentItem {
  id: string
  label: string
  originalFilename: string
  mimeType: string
  size: number
  status: string
  reviewNote: string | null
  createdAt: string
  checklistItemId: string | null
}

interface ApplicantChecklistItem {
  id: string
  title: string
  description: string | null
  category: string | null
  status: string
  dueDate: string | null
  visibleToApplicant: boolean
  sortOrder: number
  documents: ApplicantDocumentItem[]
}

interface ApplicantMilestoneItem {
  id: string
  title: string
  description: string | null
  status: string
  occurredAt: string | null
  visibleToApplicant: boolean
}

interface ApplicantCaseItem {
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
  updatedAt: string
  advisorId: string | null
  advisorName: string | null
  milestones: ApplicantMilestoneItem[]
  checklistItems: ApplicantChecklistItem[]
  documents: ApplicantDocumentItem[]
}

interface ApplicantProfileRecord {
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

interface ApplicantWorkspaceProps {
  applicant: {
    id: string
    name: string | null
    email: string
    accessState: "ACTIVE" | "PENDING"
    createdAt: string
    profile: ApplicantProfileRecord
    cases: ApplicantCaseItem[]
  }
  advisors: AdvisorOption[]
}

export function ApplicantWorkspace({
  applicant,
  advisors,
}: ApplicantWorkspaceProps) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleAccessLink() {
    startTransition(async () => {
      const result = await sendApplicantAccessLink(applicant.id)

      if (result.success) {
        toast.success(result.message ?? "Lien d'acces envoye")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'envoyer le lien")
      }
    })
  }

  return (
    <div className="space-y-6">
      <section className="rounded-[32px] border border-visacore-navy/8 bg-[linear-gradient(135deg,#0A2540_0%,#163C61_100%)] px-5 py-6 text-white shadow-[0_36px_90px_-56px_rgba(10,37,64,0.55)] sm:px-7">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4">
            <div className="inline-flex rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">
              Workspace applicant
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                {applicant.name ?? "Applicant sans nom"}
              </h1>
              <p className="mt-2 text-sm text-white/72">{applicant.email}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge
                status={
                  applicant.accessState === "ACTIVE"
                    ? "Portail actif"
                    : "Invitation en attente"
                }
                variant={applicant.accessState === "ACTIVE" ? "green" : "gold"}
              />
              <StatusBadge
                status={`${applicant.cases.length} procedure${applicant.cases.length > 1 ? "s" : ""}`}
                variant="blue"
              />
              <StatusBadge
                status={`Cree le ${applicant.createdAt}`}
                variant="gray"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="rounded-full border-white/20 bg-white/6 text-white hover:bg-white/10"
              onClick={handleAccessLink}
              disabled={isPending}
            >
              {isPending ? (
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
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(22rem,0.84fr)]">
        <ApplicantProfileCard applicant={applicant} />
        <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
          <CardHeader>
            <CardTitle>Vision portail</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Ce dossier pilote ce que le demandeur voit dans son espace: etapes,
              documents attendus, corrections et prochaines actions.
            </p>
            <div className="grid gap-3">
              {applicant.cases.slice(0, 3).map((item) => {
                const progress = getProcedureProgress(item.status)
                return (
                  <div
                    key={item.id}
                    className="rounded-[22px] border border-border bg-[#F7F8FB] px-4 py-3"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
                          {item.reference}
                        </p>
                      </div>
                      <StatusBadge
                        status={
                          procedureStatusLabels[
                            item.status as keyof typeof procedureStatusLabels
                          ] ?? item.status
                        }
                        variant="blue"
                      />
                    </div>
                    <div className="mt-3 h-2 rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-visacore-gold"
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      <CreateCaseCard applicantId={applicant.id} advisors={advisors} />

      <div className="space-y-6">
        {applicant.cases.map((caseItem) => (
          <ApplicantCaseCard
            key={caseItem.id}
            caseItem={caseItem}
            advisors={advisors}
          />
        ))}
      </div>
    </div>
  )
}

function ApplicantProfileCard({
  applicant,
}: {
  applicant: ApplicantWorkspaceProps["applicant"]
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateApplicantProfileByAdmin(applicant.id, {
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
        toast.success("Profil mis a jour")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour le profil")
      }
    })
  }

  return (
    <Card className="rounded-[28px] border-visacore-navy/8 shadow-none">
      <CardHeader>
        <CardTitle>Profil partage avec le client</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom complet" htmlFor="profile-name">
              <Input id="profile-name" name="name" defaultValue={applicant.name ?? ""} required />
            </Field>
            <Field label="Telephone" htmlFor="profile-phone">
              <Input id="profile-phone" name="phone" defaultValue={applicant.profile.phone ?? ""} />
            </Field>
            <Field label="WhatsApp" htmlFor="profile-whatsapp">
              <Input
                id="profile-whatsapp"
                name="whatsappNumber"
                defaultValue={applicant.profile.whatsappNumber ?? ""}
              />
            </Field>
            <Field label="Pays de residence" htmlFor="profile-country">
              <Input
                id="profile-country"
                name="countryOfResidence"
                defaultValue={applicant.profile.countryOfResidence ?? ""}
              />
            </Field>
            <Field label="Nationalite" htmlFor="profile-nationality">
              <Input
                id="profile-nationality"
                name="nationality"
                defaultValue={applicant.profile.nationality ?? ""}
              />
            </Field>
            <Field label="Numero de passeport" htmlFor="profile-passport">
              <Input
                id="profile-passport"
                name="passportNumber"
                defaultValue={applicant.profile.passportNumber ?? ""}
              />
            </Field>
            <Field label="Date de naissance" htmlFor="profile-birth">
              <Input
                id="profile-birth"
                name="dateOfBirth"
                type="date"
                defaultValue={applicant.profile.dateOfBirth ?? ""}
              />
            </Field>
            <Field label="Destination cible" htmlFor="profile-destination">
              <Input
                id="profile-destination"
                name="preferredDestination"
                defaultValue={applicant.profile.preferredDestination ?? ""}
              />
            </Field>
          </div>

          <Field label="Adresse" htmlFor="profile-address">
            <Input
              id="profile-address"
              name="addressLine"
              defaultValue={applicant.profile.addressLine ?? ""}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Ville" htmlFor="profile-city">
              <Input id="profile-city" name="city" defaultValue={applicant.profile.city ?? ""} />
            </Field>
            <Field label="Code postal" htmlFor="profile-postal">
              <Input
                id="profile-postal"
                name="postalCode"
                defaultValue={applicant.profile.postalCode ?? ""}
              />
            </Field>
            <Field label="Service cible" htmlFor="profile-service">
              <Input
                id="profile-service"
                name="targetService"
                defaultValue={applicant.profile.targetService ?? ""}
              />
            </Field>
            <Field label="Contact d'urgence" htmlFor="profile-emergency-name">
              <Input
                id="profile-emergency-name"
                name="emergencyContactName"
                defaultValue={applicant.profile.emergencyContactName ?? ""}
              />
            </Field>
            <Field
              label="Telephone d'urgence"
              htmlFor="profile-emergency-phone"
            >
              <Input
                id="profile-emergency-phone"
                name="emergencyContactPhone"
                defaultValue={applicant.profile.emergencyContactPhone ?? ""}
              />
            </Field>
          </div>

          <Field label="Situation actuelle" htmlFor="profile-situation">
            <Textarea
              id="profile-situation"
              name="currentSituation"
              defaultValue={applicant.profile.currentSituation ?? ""}
              rows={4}
            />
          </Field>

          <label className="flex items-center gap-2 rounded-[18px] border border-border px-4 py-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              name="marketingConsent"
              defaultChecked={applicant.profile.marketingConsent}
            />
            Le demandeur accepte de recevoir des rappels d&apos;accompagnement.
          </label>

          <div className="flex justify-end">
            <Button type="submit" disabled={isPending} className="rounded-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Enregistrement...
                </>
              ) : (
                "Mettre a jour le profil"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function CreateCaseCard({
  applicantId,
  advisors,
}: {
  applicantId: string
  advisors: AdvisorOption[]
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await createApplicantCase(applicantId, {
        title: String(formData.get("title") ?? ""),
        serviceName: String(formData.get("serviceName") ?? ""),
        destinationCountry: String(formData.get("destinationCountry") ?? ""),
        visaCategory: String(formData.get("visaCategory") ?? ""),
        status: String(formData.get("status") ?? "INTAKE"),
        summary: String(formData.get("summary") ?? ""),
        currentStep: String(formData.get("currentStep") ?? ""),
        nextActionTitle: String(formData.get("nextActionTitle") ?? ""),
        nextActionDescription: String(formData.get("nextActionDescription") ?? ""),
        nextActionDueAt: String(formData.get("nextActionDueAt") ?? ""),
        advisorId: String(formData.get("advisorId") ?? ""),
      })

      if (result.success) {
        toast.success("Nouvelle procedure creee")
        event.currentTarget.reset()
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de creer la procedure")
      }
    })
  }

  return (
    <Card className="rounded-[28px] border-dashed border-visacore-gold/35 bg-visacore-gold/5 shadow-none">
      <CardHeader>
        <CardTitle>Ouvrir une nouvelle procedure</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
          <Field label="Titre" htmlFor="new-case-title">
            <Input id="new-case-title" name="title" placeholder="Visa tourisme Belgique" required />
          </Field>
          <Field label="Service" htmlFor="new-case-service">
            <Input id="new-case-service" name="serviceName" placeholder="Montage dossier" />
          </Field>
          <Field label="Destination" htmlFor="new-case-destination">
            <Input id="new-case-destination" name="destinationCountry" placeholder="Belgique" required />
          </Field>
          <Field label="Categorie de visa" htmlFor="new-case-visa">
            <Input id="new-case-visa" name="visaCategory" placeholder="Visa court sejour" required />
          </Field>
          <Field label="Statut" htmlFor="new-case-status">
            <NativeSelect id="new-case-status" name="status" defaultValue="INTAKE">
              {procedureStatuses.map((status) => (
                <option key={status} value={status}>
                  {procedureStatusLabels[status]}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Conseiller" htmlFor="new-case-advisor">
            <NativeSelect id="new-case-advisor" name="advisorId" defaultValue="">
              <option value="">Non assigne</option>
              {advisors.map((advisor) => (
                <option key={advisor.id} value={advisor.id}>
                  {advisor.name}
                </option>
              ))}
            </NativeSelect>
          </Field>
          <Field label="Etape actuelle" htmlFor="new-case-step">
            <Input id="new-case-step" name="currentStep" placeholder="Collecte des pieces" />
          </Field>
          <Field label="Echeance" htmlFor="new-case-due">
            <Input id="new-case-due" name="nextActionDueAt" type="date" />
          </Field>
          <div className="lg:col-span-2">
            <Field label="Resume" htmlFor="new-case-summary">
              <Textarea id="new-case-summary" name="summary" rows={3} />
            </Field>
          </div>
          <div className="lg:col-span-2">
            <Field label="Prochaine action" htmlFor="new-case-next-action">
              <Input id="new-case-next-action" name="nextActionTitle" placeholder="Envoyer le passeport scanne" />
            </Field>
            <Textarea
              className="mt-2"
              name="nextActionDescription"
              rows={3}
              placeholder="Ce que le demandeur verra dans son portail."
            />
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <Button type="submit" disabled={isPending} className="rounded-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creation...
                </>
              ) : (
                <>
                  <Plus className="mr-2 size-4" />
                  Ajouter la procedure
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

function ApplicantCaseCard({
  caseItem,
  advisors,
}: {
  caseItem: ApplicantCaseItem
  advisors: AdvisorOption[]
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const progress = getProcedureProgress(caseItem.status)

  function handleUpdate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateApplicantCase(caseItem.id, {
        title: String(formData.get("title") ?? ""),
        serviceName: String(formData.get("serviceName") ?? ""),
        destinationCountry: String(formData.get("destinationCountry") ?? ""),
        visaCategory: String(formData.get("visaCategory") ?? ""),
        status: String(formData.get("status") ?? caseItem.status),
        summary: String(formData.get("summary") ?? ""),
        currentStep: String(formData.get("currentStep") ?? ""),
        nextActionTitle: String(formData.get("nextActionTitle") ?? ""),
        nextActionDescription: String(formData.get("nextActionDescription") ?? ""),
        nextActionDueAt: String(formData.get("nextActionDueAt") ?? ""),
        advisorId: String(formData.get("advisorId") ?? ""),
      })

      if (result.success) {
        toast.success("Procedure mise a jour")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour la procedure")
      }
    })
  }

  function handleDelete() {
    if (!confirm("Supprimer cette procedure ? Les jalons, checklistes et documents associes seront retires.")) {
      return
    }

    startTransition(async () => {
      const result = await deleteApplicantCase(caseItem.id)
      if (result.success) {
        toast.success("Procedure supprimee")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de supprimer la procedure")
      }
    })
  }

  return (
    <Card className="rounded-[30px] border-visacore-navy/8 shadow-none">
      <CardHeader className="space-y-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <CardTitle>{caseItem.title}</CardTitle>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-visacore-gold">
              {caseItem.reference}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <StatusBadge
              status={
                procedureStatusLabels[
                  caseItem.status as keyof typeof procedureStatusLabels
                ] ?? caseItem.status
              }
              variant="blue"
            />
            <StatusBadge
              status={`Maj ${caseItem.updatedAt}`}
              variant="gray"
            />
          </div>
        </div>
        <div className="rounded-[20px] bg-[#F7F8FB] px-4 py-3">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>Progression portail</span>
            <span>{progress.percent}%</span>
          </div>
          <div className="mt-2 h-2 rounded-full bg-white">
            <div
              className="h-full rounded-full bg-[#0A2540]"
              style={{ width: `${progress.percent}%` }}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Titre" htmlFor={`case-title-${caseItem.id}`}>
              <Input id={`case-title-${caseItem.id}`} name="title" defaultValue={caseItem.title} required />
            </Field>
            <Field label="Service" htmlFor={`case-service-${caseItem.id}`}>
              <Input id={`case-service-${caseItem.id}`} name="serviceName" defaultValue={caseItem.serviceName ?? ""} />
            </Field>
            <Field label="Destination" htmlFor={`case-destination-${caseItem.id}`}>
              <Input id={`case-destination-${caseItem.id}`} name="destinationCountry" defaultValue={caseItem.destinationCountry} required />
            </Field>
            <Field label="Categorie" htmlFor={`case-category-${caseItem.id}`}>
              <Input id={`case-category-${caseItem.id}`} name="visaCategory" defaultValue={caseItem.visaCategory} required />
            </Field>
            <Field label="Statut" htmlFor={`case-status-${caseItem.id}`}>
              <NativeSelect id={`case-status-${caseItem.id}`} name="status" defaultValue={caseItem.status}>
                {procedureStatuses.map((status) => (
                  <option key={status} value={status}>
                    {procedureStatusLabels[status]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Conseiller" htmlFor={`case-advisor-${caseItem.id}`}>
              <NativeSelect id={`case-advisor-${caseItem.id}`} name="advisorId" defaultValue={caseItem.advisorId ?? ""}>
                <option value="">Non assigne</option>
                {advisors.map((advisor) => (
                  <option key={advisor.id} value={advisor.id}>
                    {advisor.name}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Etape en cours" htmlFor={`case-step-${caseItem.id}`}>
              <Input id={`case-step-${caseItem.id}`} name="currentStep" defaultValue={caseItem.currentStep ?? ""} />
            </Field>
            <Field label="Echeance visible" htmlFor={`case-due-${caseItem.id}`}>
              <Input id={`case-due-${caseItem.id}`} name="nextActionDueAt" type="date" defaultValue={caseItem.nextActionDueAt ?? ""} />
            </Field>
          </div>

          <Field label="Resume partage" htmlFor={`case-summary-${caseItem.id}`}>
            <Textarea id={`case-summary-${caseItem.id}`} name="summary" defaultValue={caseItem.summary ?? ""} rows={3} />
          </Field>

          <div className="grid gap-4 xl:grid-cols-2">
            <Field label="Prochaine action" htmlFor={`case-next-title-${caseItem.id}`}>
              <Input id={`case-next-title-${caseItem.id}`} name="nextActionTitle" defaultValue={caseItem.nextActionTitle ?? ""} />
            </Field>
            <Field label="Instruction partagee" htmlFor={`case-next-description-${caseItem.id}`}>
              <Textarea
                id={`case-next-description-${caseItem.id}`}
                name="nextActionDescription"
                defaultValue={caseItem.nextActionDescription ?? ""}
                rows={3}
              />
            </Field>
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
              className="rounded-full"
            >
              <Trash2 className="mr-2 size-4" />
              Supprimer la procedure
            </Button>
            <Button type="submit" disabled={isPending} className="rounded-full">
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Mise a jour...
                </>
              ) : (
                "Enregistrer la procedure"
              )}
            </Button>
          </div>
        </form>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <MilestonesPanel caseItem={caseItem} />
          <ChecklistPanel caseItem={caseItem} />
        </div>

        <DocumentsPanel caseItem={caseItem} />
      </CardContent>
    </Card>
  )
}

function MilestonesPanel({
  caseItem,
}: {
  caseItem: ApplicantCaseItem
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await addApplicantMilestone(caseItem.id, {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        status: String(formData.get("status") ?? "PENDING"),
        occurredAt: String(formData.get("occurredAt") ?? ""),
        visibleToApplicant: formData.get("visibleToApplicant") === "on",
      })

      if (result.success) {
        toast.success("Jalon ajoute")
        event.currentTarget.reset()
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'ajouter le jalon")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteApplicantMilestone(id)
      if (result.success) {
        toast.success("Jalon supprime")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de supprimer le jalon")
      }
    })
  }

  return (
    <Card className="rounded-[24px] border-border/90 bg-[#FBFCFD] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Milestone className="size-4 text-visacore-gold" />
          Timeline dossier
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {caseItem.milestones.length === 0 ? (
            <EmptyState text="Aucun jalon n'est encore publie pour cette procedure." />
          ) : (
            caseItem.milestones.map((item) => (
              <div key={item.id} className="rounded-[20px] border border-border bg-white px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-foreground">{item.title}</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.description ?? "Sans commentaire"}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                      {item.occurredAt ?? "Date libre"} ·{" "}
                      {milestoneStatusLabels[
                        item.status as keyof typeof milestoneStatusLabels
                      ] ?? item.status}
                      {item.visibleToApplicant ? " · visible client" : " · interne"}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleCreate} className="space-y-3 rounded-[20px] border border-dashed border-border px-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Titre" htmlFor={`milestone-title-${caseItem.id}`}>
              <Input id={`milestone-title-${caseItem.id}`} name="title" required />
            </Field>
            <Field label="Date" htmlFor={`milestone-date-${caseItem.id}`}>
              <Input id={`milestone-date-${caseItem.id}`} name="occurredAt" type="date" />
            </Field>
            <Field label="Statut" htmlFor={`milestone-status-${caseItem.id}`}>
              <NativeSelect id={`milestone-status-${caseItem.id}`} name="status" defaultValue="PENDING">
                {milestoneStatuses.map((status) => (
                  <option key={status} value={status}>
                    {milestoneStatusLabels[status]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
          </div>
          <Field label="Description" htmlFor={`milestone-description-${caseItem.id}`}>
            <Textarea id={`milestone-description-${caseItem.id}`} name="description" rows={3} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="visibleToApplicant" defaultChecked />
            Visible dans le portail client
          </label>
          <Button type="submit" disabled={isPending} className="rounded-full">
            <Plus className="mr-2 size-4" />
            Ajouter un jalon
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function ChecklistPanel({
  caseItem,
}: {
  caseItem: ApplicantCaseItem
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await createApplicantChecklistItem(caseItem.id, {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        category: String(formData.get("category") ?? ""),
        status: String(formData.get("status") ?? "REQUESTED"),
        dueDate: String(formData.get("dueDate") ?? ""),
        visibleToApplicant: formData.get("visibleToApplicant") === "on",
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      })

      if (result.success) {
        toast.success("Element de checklist ajoute")
        event.currentTarget.reset()
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible d'ajouter l'element")
      }
    })
  }

  function handleUpdate(id: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await updateApplicantChecklistItem(id, {
        title: String(formData.get("title") ?? ""),
        description: String(formData.get("description") ?? ""),
        category: String(formData.get("category") ?? ""),
        status: String(formData.get("status") ?? "REQUESTED"),
        dueDate: String(formData.get("dueDate") ?? ""),
        visibleToApplicant: formData.get("visibleToApplicant") === "on",
        sortOrder: Number(formData.get("sortOrder") ?? 0),
      })

      if (result.success) {
        toast.success("Checklist mise a jour")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour la checklist")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteApplicantChecklistItem(id)
      if (result.success) {
        toast.success("Element supprime")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de supprimer l'element")
      }
    })
  }

  return (
    <Card className="rounded-[24px] border-border/90 bg-[#FBFCFD] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <CheckCheck className="size-4 text-visacore-gold" />
          Checklist applicant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {caseItem.checklistItems.length === 0 ? (
            <EmptyState text="Aucun document requis n'est encore configure." />
          ) : (
            caseItem.checklistItems.map((item) => (
              <form
                key={item.id}
                onSubmit={(event) => handleUpdate(item.id, event)}
                className="space-y-3 rounded-[20px] border border-border bg-white px-4 py-4"
              >
                <div className="grid gap-3 md:grid-cols-2">
                  <Field label="Titre" htmlFor={`checklist-title-${item.id}`}>
                    <Input id={`checklist-title-${item.id}`} name="title" defaultValue={item.title} required />
                  </Field>
                  <Field label="Categorie" htmlFor={`checklist-category-${item.id}`}>
                    <Input id={`checklist-category-${item.id}`} name="category" defaultValue={item.category ?? ""} />
                  </Field>
                  <Field label="Statut" htmlFor={`checklist-status-${item.id}`}>
                    <NativeSelect id={`checklist-status-${item.id}`} name="status" defaultValue={item.status}>
                      {checklistItemStatuses.map((status) => (
                        <option key={status} value={status}>
                          {checklistItemStatusLabels[status]}
                        </option>
                      ))}
                    </NativeSelect>
                  </Field>
                  <Field label="Echeance" htmlFor={`checklist-due-${item.id}`}>
                    <Input id={`checklist-due-${item.id}`} name="dueDate" type="date" defaultValue={item.dueDate ?? ""} />
                  </Field>
                  <Field label="Ordre" htmlFor={`checklist-order-${item.id}`}>
                    <Input id={`checklist-order-${item.id}`} name="sortOrder" type="number" min={0} defaultValue={item.sortOrder} />
                  </Field>
                </div>
                <Field label="Description" htmlFor={`checklist-description-${item.id}`}>
                  <Textarea id={`checklist-description-${item.id}`} name="description" defaultValue={item.description ?? ""} rows={3} />
                </Field>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <label className="flex items-center gap-2 text-sm text-muted-foreground">
                    <input
                      type="checkbox"
                      name="visibleToApplicant"
                      defaultChecked={item.visibleToApplicant}
                    />
                    Visible dans le portail
                  </label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => handleDelete(item.id)}
                      disabled={isPending}
                    >
                      <Trash2 className="mr-2 size-4" />
                      Supprimer
                    </Button>
                    <Button type="submit" disabled={isPending} className="rounded-full">
                      Enregistrer
                    </Button>
                  </div>
                </div>
              </form>
            ))
          )}
        </div>

        <form onSubmit={handleCreate} className="space-y-3 rounded-[20px] border border-dashed border-border px-4 py-4">
          <div className="grid gap-3 md:grid-cols-2">
            <Field label="Titre" htmlFor={`checklist-new-title-${caseItem.id}`}>
              <Input id={`checklist-new-title-${caseItem.id}`} name="title" required />
            </Field>
            <Field label="Categorie" htmlFor={`checklist-new-category-${caseItem.id}`}>
              <Input id={`checklist-new-category-${caseItem.id}`} name="category" />
            </Field>
            <Field label="Statut initial" htmlFor={`checklist-new-status-${caseItem.id}`}>
              <NativeSelect id={`checklist-new-status-${caseItem.id}`} name="status" defaultValue="REQUESTED">
                {checklistItemStatuses.map((status) => (
                  <option key={status} value={status}>
                    {checklistItemStatusLabels[status]}
                  </option>
                ))}
              </NativeSelect>
            </Field>
            <Field label="Echeance" htmlFor={`checklist-new-due-${caseItem.id}`}>
              <Input id={`checklist-new-due-${caseItem.id}`} name="dueDate" type="date" />
            </Field>
            <Field label="Ordre" htmlFor={`checklist-new-order-${caseItem.id}`}>
              <Input id={`checklist-new-order-${caseItem.id}`} name="sortOrder" type="number" min={0} defaultValue={caseItem.checklistItems.length} />
            </Field>
          </div>
          <Field label="Description" htmlFor={`checklist-new-description-${caseItem.id}`}>
            <Textarea id={`checklist-new-description-${caseItem.id}`} name="description" rows={3} />
          </Field>
          <label className="flex items-center gap-2 text-sm text-muted-foreground">
            <input type="checkbox" name="visibleToApplicant" defaultChecked />
            Visible dans le portail client
          </label>
          <Button type="submit" disabled={isPending} className="rounded-full">
            <Plus className="mr-2 size-4" />
            Ajouter a la checklist
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

function DocumentsPanel({
  caseItem,
}: {
  caseItem: ApplicantCaseItem
}) {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function handleReview(id: string, event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)

    startTransition(async () => {
      const result = await reviewApplicantDocument(id, {
        status: String(formData.get("status") ?? "UNDER_REVIEW"),
        reviewNote: String(formData.get("reviewNote") ?? ""),
      })

      if (result.success) {
        toast.success("Document mis a jour")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de mettre a jour le document")
      }
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      const result = await deleteApplicantDocumentByAdmin(id)
      if (result.success) {
        toast.success("Document supprime")
        router.refresh()
      } else {
        toast.error(result.error ?? "Impossible de supprimer le document")
      }
    })
  }

  return (
    <Card className="rounded-[24px] border-border/90 bg-[#FBFCFD] shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileArchive className="size-4 text-visacore-gold" />
          Documents recus
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {caseItem.documents.length === 0 ? (
          <EmptyState text="Aucun document n'a encore ete envoye par le client." />
        ) : (
          caseItem.documents.map((document) => (
            <form
              key={document.id}
              onSubmit={(event) => handleReview(document.id, event)}
              className="space-y-3 rounded-[20px] border border-border bg-white px-4 py-4"
            >
              <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">{document.label}</p>
                  <p className="text-sm text-muted-foreground">
                    {document.originalFilename} · {formatFileSize(document.size)} ·{" "}
                    {document.createdAt}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <a
                    href={`/api/espace-client/documents/${document.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center rounded-full border border-border px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted"
                  >
                    <UploadCloud className="mr-2 size-4" />
                    Ouvrir
                  </a>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => handleDelete(document.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="mr-2 size-4" />
                    Supprimer
                  </Button>
                </div>
              </div>
              <div className="grid gap-3 md:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
                <Field label="Statut" htmlFor={`document-status-${document.id}`}>
                  <NativeSelect
                    id={`document-status-${document.id}`}
                    name="status"
                    defaultValue={document.status}
                  >
                    {applicantDocumentStatuses.map((status) => (
                      <option key={status} value={status}>
                        {applicantDocumentStatusLabels[status]}
                      </option>
                    ))}
                  </NativeSelect>
                </Field>
                <Field label="Note de revision" htmlFor={`document-note-${document.id}`}>
                  <Textarea
                    id={`document-note-${document.id}`}
                    name="reviewNote"
                    defaultValue={document.reviewNote ?? ""}
                    rows={3}
                  />
                </Field>
              </div>
              <div className="flex justify-end">
                <Button type="submit" disabled={isPending} className="rounded-full">
                  <CalendarClock className="mr-2 size-4" />
                  Mettre a jour le document
                </Button>
              </div>
            </form>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="rounded-[20px] border border-dashed border-border px-4 py-6 text-center text-sm text-muted-foreground">
      {text}
    </div>
  )
}

function Field({
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

function NativeSelect({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={`h-10 w-full rounded-xl border border-input bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 ${className}`}
    />
  )
}

function formatFileSize(size: number) {
  if (size < 1024) return `${size} o`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} Ko`
  return `${(size / (1024 * 1024)).toFixed(1)} Mo`
}
