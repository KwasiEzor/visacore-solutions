"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { contactSchema, type ContactFormData } from "@/lib/validations/contact"
import { createContactRequest } from "@/actions/contacts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle } from "lucide-react"

export function ContactForm() {
  const [submitted, setSubmitted] = useState(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  async function onSubmit(data: ContactFormData) {
    const result = await createContactRequest(data)
    if (result.success) setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl bg-green-50 p-8 text-center">
        <CheckCircle className="mb-4 size-12 text-green-600" />
        <h3 className="text-xl font-semibold text-green-900">Message envoyé !</h3>
        <p className="mt-2 text-green-700">
          Nous vous répondrons dans les plus brefs délais.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
    </form>
  )
}
