"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  contactSubmissionSchema,
  type ContactSubmissionData,
} from "@/lib/validations/contact"
import { createContactRequest } from "@/actions/contacts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"
import { toast } from "sonner"
import { getCaptchaPublicConfig } from "@/lib/captcha.shared"
import { TurnstileWidget } from "@/components/public/turnstile-widget"

interface ContactFormProps {
  captchaSiteKey?: string | null
}

export function ContactForm({ captchaSiteKey }: ContactFormProps) {
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
  } = useForm<ContactSubmissionData>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      website: "",
      captchaToken: "",
    },
  })

  async function onSubmit(data: ContactSubmissionData) {
    if (captchaEnabled && !data.captchaToken) {
      setError("captchaToken", {
        type: "manual",
        message: "Veuillez confirmer la vérification anti-spam.",
      })
      return
    }

    try {
      const result = await createContactRequest(data)
      if (result.success) {
        const tone = result.status === "duplicate" ? "info" : "success"
        setSubmittedState({
          title:
            result.status === "duplicate"
              ? "Message déjà reçu"
              : "Message envoyé !",
          message:
            result.message ||
            "Nous vous répondrons dans les plus brefs délais.",
          tone,
        })
        toast.success(result.message || "Message envoyé !")
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
        "Impossible d'envoyer votre message pour le moment. Merci de réessayer dans quelques instants."
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
      <input type="hidden" {...register("captchaToken")} />
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom complet *</Label>
          <Input id="fullName" {...register("fullName")} placeholder="Votre nom" />
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
          <Label htmlFor="phone">Téléphone</Label>
          <Input id="phone" {...register("phone")} placeholder="+228 90 00 00 00" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Sujet *</Label>
          <Input id="subject" {...register("subject")} placeholder="Sujet de votre message" />
          {errors.subject && <p className="text-sm text-destructive">{errors.subject.message}</p>}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="message">Message *</Label>
        <Textarea id="message" {...register("message")} rows={5} placeholder="Votre message..." />
        {errors.message && <p className="text-sm text-destructive">{errors.message.message}</p>}
      </div>
      {captchaEnabled && captchaConfig.siteKey ? (
        <div className="space-y-2">
          <Label className="text-sm">Vérification de sécurité *</Label>
          <TurnstileWidget
            siteKey={captchaConfig.siteKey}
            action="contact_form"
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
        className="w-full bg-[#C9A227] text-white hover:bg-[#A88620]"
      >
        {isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" />Envoi...</> : "Envoyer le message"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Votre message est lu par un conseiller, avec retour attendu dans les plus brefs délais.
      </p>
    </form>
  )
}
