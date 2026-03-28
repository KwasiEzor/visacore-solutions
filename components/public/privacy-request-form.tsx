"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { CheckCircle, Loader2 } from "lucide-react"
import { createDataPrivacyRequest } from "@/actions/privacy-requests"
import { TurnstileWidget } from "@/components/public/turnstile-widget"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getCaptchaPublicConfig } from "@/lib/captcha.shared"
import {
  dataPrivacyRequestTypeLabels,
} from "@/lib/privacy-requests.shared"
import {
  dataPrivacyRequestSubmissionSchema,
  type DataPrivacyRequestSubmissionData,
} from "@/lib/validations/privacy"

interface PrivacyRequestFormProps {
  captchaSiteKey?: string | null
}

export function PrivacyRequestForm({
  captchaSiteKey,
}: PrivacyRequestFormProps) {
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
  } = useForm<DataPrivacyRequestSubmissionData>({
    resolver: zodResolver(dataPrivacyRequestSubmissionSchema),
    defaultValues: {
      requestType: "ACCESS",
      website: "",
      captchaToken: "",
      message: "",
      phone: "",
    },
  })

  async function onSubmit(data: DataPrivacyRequestSubmissionData) {
    if (captchaEnabled && !data.captchaToken) {
      setError("captchaToken", {
        type: "manual",
        message: "Veuillez confirmer la verification anti-spam.",
      })
      return
    }

    try {
      const result = await createDataPrivacyRequest(data)
      if (result.success) {
        const tone = result.status === "duplicate" ? "info" : "success"
        setSubmittedState({
          title:
            result.status === "duplicate"
              ? "Demande deja recue"
              : "Demande RGPD envoyee",
          message:
            result.message ||
            "Votre demande a bien ete enregistree par notre equipe.",
          tone,
        })
        toast.success(result.message || "Demande RGPD envoyee")
      } else {
        if (captchaEnabled) {
          setValue("captchaToken", "", { shouldValidate: true })
          setHasCaptchaToken(false)
          setCaptchaRefreshKey((current) => current + 1)
        }
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch {
      if (captchaEnabled) {
        setValue("captchaToken", "", { shouldValidate: true })
        setHasCaptchaToken(false)
        setCaptchaRefreshKey((current) => current + 1)
      }
      toast.error(
        "Impossible d'envoyer votre demande pour le moment. Merci de reessayer dans quelques instants."
      )
    }
  }

  if (submittedState) {
    return (
      <div
        className={`rounded-2xl border p-8 text-center ${
          submittedState.tone === "info"
            ? "border-amber-200 bg-amber-50"
            : "border-green-200 bg-green-50"
        }`}
      >
        <CheckCircle
          className={`mx-auto mb-4 size-12 ${
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
          className={`mx-auto mt-2 max-w-2xl text-sm sm:text-base ${
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
          <Label htmlFor="privacy-fullName">Nom complet *</Label>
          <Input
            id="privacy-fullName"
            {...register("fullName")}
            placeholder="Votre nom"
          />
          {errors.fullName ? (
            <p className="text-sm text-destructive">
              {errors.fullName.message}
            </p>
          ) : null}
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-email">Email *</Label>
          <Input
            id="privacy-email"
            type="email"
            {...register("email")}
            placeholder="vous@email.com"
          />
          {errors.email ? (
            <p className="text-sm text-destructive">{errors.email.message}</p>
          ) : null}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="privacy-phone">Telephone</Label>
          <Input
            id="privacy-phone"
            {...register("phone")}
            placeholder="+228 90 00 00 00"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="privacy-requestType">Type de demande *</Label>
          <select
            id="privacy-requestType"
            {...register("requestType")}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus:ring-2 focus:ring-ring"
          >
            {Object.entries(dataPrivacyRequestTypeLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
          {errors.requestType ? (
            <p className="text-sm text-destructive">
              {errors.requestType.message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="privacy-message">
          Details utiles
        </Label>
        <Textarea
          id="privacy-message"
          {...register("message")}
          rows={5}
          placeholder="Precisez les donnees concernees, votre besoin ou tout element permettant d'identifier votre dossier."
        />
        {errors.message ? (
          <p className="text-sm text-destructive">{errors.message.message}</p>
        ) : null}
      </div>

      {captchaEnabled && captchaConfig.siteKey ? (
        <div className="space-y-2">
          <Label className="text-sm">Verification de securite *</Label>
          <TurnstileWidget
            siteKey={captchaConfig.siteKey}
            action="privacy_request_form"
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
          {errors.captchaToken ? (
            <p className="text-sm text-destructive">
              {errors.captchaToken.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={isSubmitting || (captchaEnabled && !hasCaptchaToken)}
        className="w-full bg-[#0A2540] text-white hover:bg-[#163C61]"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" />
            Envoi...
          </>
        ) : (
          "Envoyer ma demande RGPD"
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Nous pouvons demander une verification d&apos;identite avant execution.
        Une reponse est apportee sans retard injustifie et au plus tard dans
        un delai d&apos;un mois.
      </p>
    </form>
  )
}
