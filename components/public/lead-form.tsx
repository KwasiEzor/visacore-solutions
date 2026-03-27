"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  leadSubmissionSchema,
  type LeadSubmissionData,
} from "@/lib/validations/lead"
import { createLead } from "@/actions/leads"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const destinations = [
  { value: "Canada", label: "Canada" },
  { value: "États-Unis", label: "États-Unis" },
  { value: "Europe", label: "Europe" },
  { value: "Autre", label: "Autre" },
]

const servicesOptions = [
  { value: "Études à l'étranger", label: "Études à l'étranger" },
  { value: "Permis de travail", label: "Permis de travail" },
  { value: "Immigration permanente", label: "Immigration permanente" },
  { value: "Visa visiteur", label: "Visa visiteur" },
  { value: "Montage de dossier", label: "Montage de dossier complet" },
  { value: "Consultation", label: "Consultation personnalisée" },
]

export function LeadForm() {
  const [submittedState, setSubmittedState] = useState<{
    title: string
    message: string
    tone: "success" | "info"
  } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LeadSubmissionData>({
    resolver: zodResolver(leadSubmissionSchema),
    defaultValues: { consent: false, website: "" },
  })

  async function onSubmit(data: LeadSubmissionData) {
    try {
      const result = await createLead(data)
      if (result.success) {
        const tone = result.status === "duplicate" ? "info" : "success"
        setSubmittedState({
          title:
            result.status === "duplicate"
              ? "Demande déjà reçue"
              : "Demande envoyée !",
          message:
            result.message ||
            "Nous analyserons votre profil et vous répondrons dans les 24 heures ouvrées.",
          tone,
        })
        toast.success(
          result.message || "Demande envoyée avec succès !"
        )
      } else {
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch {
      toast.error(
        "Impossible d'envoyer votre demande pour le moment. Merci de réessayer dans quelques instants."
      )
    }
  }

  if (submittedState) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl p-8 text-center ${
          submittedState.tone === "info"
            ? "bg-amber-50"
            : "bg-green-50"
        }`}
      >
        <CheckCircle
          className={`mb-4 size-12 ${
            submittedState.tone === "info"
              ? "text-amber-600"
              : "text-green-600"
          }`}
        />
        <h3
          className={`text-xl font-semibold ${
            submittedState.tone === "info"
              ? "text-amber-900"
              : "text-green-900"
          }`}
        >
          {submittedState.title}
        </h3>
        <p
          className={`mt-2 ${
            submittedState.tone === "info"
              ? "text-amber-700"
              : "text-green-700"
          }`}
        >
          {submittedState.message}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <input
        type="text"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
        {...register("website")}
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet *</Label>
          <Input id="fullName" {...register("fullName")} placeholder="Votre nom complet" />
          {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email *</Label>
          <Input id="email" type="email" {...register("email")} placeholder="votre@email.com" />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone / WhatsApp *</Label>
          <Input id="phone" {...register("phone")} placeholder="+228 90 00 00 00" />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Pays de résidence *</Label>
          <Input id="country" {...register("country")} placeholder="Togo" />
          {errors.country && <p className="text-sm text-destructive">{errors.country.message}</p>}
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="destination">Destination souhaitée *</Label>
          <select
            id="destination"
            {...register("destination")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Sélectionner...</option>
            {destinations.map((d) => (
              <option key={d.value} value={d.value}>{d.label}</option>
            ))}
          </select>
          {errors.destination && <p className="text-sm text-destructive">{errors.destination.message}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceNeeded">Service souhaité</Label>
          <select
            id="serviceNeeded"
            {...register("serviceNeeded")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Sélectionner...</option>
            {servicesOptions.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="situation">Votre situation actuelle</Label>
        <Input id="situation" {...register("situation")} placeholder="Ex: Ingénieur avec 5 ans d'expérience" />
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message complémentaire</Label>
        <Textarea id="message" {...register("message")} rows={4} placeholder="Décrivez brièvement votre projet..." />
      </div>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          id="consent"
          {...register("consent")}
          className="mt-1 size-4 rounded border-gray-300"
        />
        <Label htmlFor="consent" className="text-sm font-normal text-muted-foreground">
          J&apos;accepte que mes données soient traitées par VisaCore Solutions dans le cadre de ma demande d&apos;évaluation. *
        </Label>
      </div>
      {errors.consent && <p className="text-sm text-destructive">{errors.consent.message}</p>}
      <Button type="submit" disabled={isSubmitting} size="lg" className="w-full bg-[#C9A227] text-white hover:bg-[#A88620]">
        {isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" />Envoi...</> : "Obtenir mon évaluation gratuite"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Réponse humaine sous 24 heures ouvrées, avec les prochaines étapes adaptées à votre profil.
      </p>
    </form>
  )
}
