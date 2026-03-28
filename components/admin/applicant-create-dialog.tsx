"use client"

import { useState, useTransition, type FormEvent, type ReactNode } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createApplicant } from "@/actions/applicants"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ApplicantCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const initialState = {
  name: "",
  email: "",
  phone: "",
  countryOfResidence: "",
  nationality: "",
  preferredDestination: "",
  targetService: "",
  currentSituation: "",
  initialCaseTitle: "",
  destinationCountry: "",
  visaCategory: "",
  serviceName: "",
}

export function ApplicantCreateDialog({
  open,
  onOpenChange,
}: ApplicantCreateDialogProps) {
  const [form, setForm] = useState(initialState)
  const [isPending, startTransition] = useTransition()

  function updateField(key: keyof typeof initialState, value: string) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function resetForm() {
    setForm(initialState)
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await createApplicant(form)

      if (result.success) {
        toast.success("Demandeur cree et invitation envoyee")
        resetForm()
        onOpenChange(false)
      } else {
        toast.error(result.error ?? "Impossible de creer le demandeur")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Creer un espace client</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Nom complet" htmlFor="applicant-name">
              <Input
                id="applicant-name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Ex: Amina Diallo"
                required
              />
            </Field>

            <Field label="Email" htmlFor="applicant-email">
              <Input
                id="applicant-email"
                type="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
                placeholder="client@exemple.com"
                required
              />
            </Field>

            <Field label="Telephone" htmlFor="applicant-phone">
              <Input
                id="applicant-phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+228 ..."
              />
            </Field>

            <Field label="Pays de residence" htmlFor="applicant-country">
              <Input
                id="applicant-country"
                value={form.countryOfResidence}
                onChange={(event) =>
                  updateField("countryOfResidence", event.target.value)
                }
                placeholder="Togo"
              />
            </Field>

            <Field label="Nationalite" htmlFor="applicant-nationality">
              <Input
                id="applicant-nationality"
                value={form.nationality}
                onChange={(event) =>
                  updateField("nationality", event.target.value)
                }
                placeholder="Togolaise"
              />
            </Field>

            <Field label="Destination visee" htmlFor="applicant-destination">
              <Input
                id="applicant-destination"
                value={form.preferredDestination}
                onChange={(event) =>
                  updateField("preferredDestination", event.target.value)
                }
                placeholder="Canada"
              />
            </Field>
          </div>

          <Field label="Service envisage" htmlFor="applicant-service">
            <Input
              id="applicant-service"
              value={form.targetService}
              onChange={(event) => updateField("targetService", event.target.value)}
              placeholder="Visa etudes, visa travail..."
            />
          </Field>

          <Field label="Contexte initial" htmlFor="applicant-situation">
            <Textarea
              id="applicant-situation"
              value={form.currentSituation}
              onChange={(event) =>
                updateField("currentSituation", event.target.value)
              }
              placeholder="Situation, niveau d'avancement, pieces deja disponibles..."
              rows={4}
            />
          </Field>

          <div className="rounded-[24px] border border-visacore-navy/8 bg-[#F7F8FB] p-4 sm:p-5">
            <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">
              Premiere procedure
            </p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <Field label="Titre de la procedure" htmlFor="case-title">
                <Input
                  id="case-title"
                  value={form.initialCaseTitle}
                  onChange={(event) =>
                    updateField("initialCaseTitle", event.target.value)
                  }
                  placeholder="Ex: Visa etudes Canada 2026"
                  required
                />
              </Field>

              <Field label="Service retenu" htmlFor="case-service">
                <Input
                  id="case-service"
                  value={form.serviceName}
                  onChange={(event) => updateField("serviceName", event.target.value)}
                  placeholder="Accompagnement dossier complet"
                />
              </Field>

              <Field label="Destination" htmlFor="case-destination">
                <Input
                  id="case-destination"
                  value={form.destinationCountry}
                  onChange={(event) =>
                    updateField("destinationCountry", event.target.value)
                  }
                  placeholder="Canada"
                  required
                />
              </Field>

              <Field label="Categorie de visa" htmlFor="case-visa-category">
                <Input
                  id="case-visa-category"
                  value={form.visaCategory}
                  onChange={(event) =>
                    updateField("visaCategory", event.target.value)
                  }
                  placeholder="Permis d'etudes"
                  required
                />
              </Field>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  Creation...
                </>
              ) : (
                "Creer l'espace client"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
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
