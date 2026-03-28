"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  appointmentSubmissionSchema,
  type AppointmentSubmissionData,
} from "@/lib/validations/appointment"
import { createAppointment } from "@/actions/appointments"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { getCaptchaPublicConfig } from "@/lib/captcha.shared"
import { TurnstileWidget } from "@/components/public/turnstile-widget"

const serviceOptions = [
  "Consultation stratégique",
  "Études à l'étranger",
  "Permis de travail",
  "Immigration permanente",
  "Montage de dossier",
]

const destinationOptions = ["Canada", "États-Unis", "Europe", "Autre"]

interface AppointmentFormProps {
  captchaSiteKey?: string | null
}

export function AppointmentForm({ captchaSiteKey }: AppointmentFormProps) {
  const captchaConfig = getCaptchaPublicConfig({
    ...process.env,
    NEXT_PUBLIC_TURNSTILE_SITE_KEY:
      captchaSiteKey ?? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY,
  })
  const captchaEnabled = captchaConfig.enabled && Boolean(captchaConfig.siteKey)
  const [submittedState, setSubmittedState] = useState<{
    title: string
    message: string
    tone: "success" | "info"
  } | null>(null)
  const [captchaRefreshKey, setCaptchaRefreshKey] = useState(0)
  const [hasCaptchaToken, setHasCaptchaToken] = useState(false)
  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AppointmentSubmissionData>({
    resolver: zodResolver(appointmentSubmissionSchema),
    defaultValues: {
      website: "",
      captchaToken: "",
    },
  })

  async function onSubmit(data: AppointmentSubmissionData) {
    if (captchaEnabled && !data.captchaToken) {
      setError("captchaToken", {
        type: "manual",
        message: "Veuillez confirmer la vérification anti-spam.",
      })
      return
    }

    try {
      const result = await createAppointment(data)
      if (result.success) {
        const tone = result.status === "duplicate" ? "info" : "success"
        setSubmittedState({
          title:
            result.status === "duplicate"
              ? "Demande déjà reçue"
              : "Demande envoyée",
          message:
            result.message ||
            "Notre équipe reviendra vers vous rapidement pour confirmer la meilleure disponibilité.",
          tone,
        })
        toast.success(result.message || "Demande de rendez-vous envoyée")
        return
      }

      if (captchaEnabled) {
        setValue("captchaToken", "", { shouldValidate: true })
        setHasCaptchaToken(false)
        setCaptchaRefreshKey((current) => current + 1)
      }
      toast.error(result.error || "Une erreur est survenue")
    } catch {
      if (captchaEnabled) {
        setValue("captchaToken", "", { shouldValidate: true })
        setHasCaptchaToken(false)
        setCaptchaRefreshKey((current) => current + 1)
      }
      toast.error(
        "Impossible d'envoyer votre demande pour le moment. Merci de réessayer."
      )
    }
  }

  if (submittedState) {
    return (
      <div
        className={`flex flex-col items-center justify-center rounded-xl p-8 text-center ${
          submittedState.tone === "info" ? "bg-amber-50" : "bg-green-50"
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
      <input type="hidden" {...register("captchaToken")} />

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
          <Label htmlFor="preferredDate">Date souhaitée</Label>
          <Input id="preferredDate" type="date" {...register("preferredDate")} />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="preferredTime">Heure souhaitée</Label>
          <Input id="preferredTime" type="time" {...register("preferredTime")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="serviceType">Type d&apos;accompagnement</Label>
          <select
            id="serviceType"
            {...register("serviceType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Sélectionner...</option>
            {serviceOptions.map((service) => (
              <option key={service} value={service}>
                {service}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="destinationType">Destination ciblée</Label>
        <select
          id="destinationType"
          {...register("destinationType")}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">Sélectionner...</option>
          {destinationOptions.map((destination) => (
            <option key={destination} value={destination}>
              {destination}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Contexte de votre demande</Label>
        <Textarea
          id="message"
          {...register("message")}
          rows={5}
          placeholder="Expliquez votre objectif, votre delai ideal et tout element utile pour preparer l'entretien."
        />
      </div>

      {captchaEnabled && captchaConfig.siteKey ? (
        <div className="space-y-2">
          <Label className="text-sm">Vérification de sécurité *</Label>
          <TurnstileWidget
            siteKey={captchaConfig.siteKey}
            action="appointment_form"
            refreshKey={captchaRefreshKey}
            onTokenChange={(token) => {
              setValue("captchaToken", token, {
                shouldDirty: true,
                shouldValidate: true,
              })
              setHasCaptchaToken(Boolean(token))
              if (token) {
                clearErrors("captchaToken")
              }
            }}
            onErrorMessage={(message) => {
              setValue("captchaToken", "", { shouldValidate: true })
              setHasCaptchaToken(false)
              if (message) {
                setError("captchaToken", {
                  type: "manual",
                  message,
                })
                return
              }
              clearErrors("captchaToken")
            }}
          />
          {errors.captchaToken && (
            <p className="text-sm text-destructive">
              {errors.captchaToken.message}
            </p>
          )}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || (captchaEnabled && !hasCaptchaToken)}
        size="lg"
        className="w-full bg-[#C9A227] text-white hover:bg-[#A88620]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Envoi...
          </>
        ) : (
          "Demander un rendez-vous"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Un conseiller vous confirme par email la meilleure disponibilité après vérification.
      </p>
    </form>
  )
}
