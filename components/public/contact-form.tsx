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

export function ContactForm() {
  const [submittedState, setSubmittedState] = useState<{
    title: string
    message: string
    tone: "success" | "info"
  } | null>(null)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactSubmissionData>({
    resolver: zodResolver(contactSubmissionSchema),
    defaultValues: {
      website: "",
    },
  })

  async function onSubmit(data: ContactSubmissionData) {
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
        toast.error(result.error || "Une erreur est survenue")
      }
    } catch {
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
      <Button type="submit" disabled={isSubmitting} className="w-full bg-[#C9A227] text-white hover:bg-[#A88620]">
        {isSubmitting ? <><Loader2 className="mr-2 size-4 animate-spin" />Envoi...</> : "Envoyer le message"}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Votre message est lu par un conseiller, avec retour attendu dans les plus brefs délais.
      </p>
    </form>
  )
}
