"use client"

import { AlertCircle } from "lucide-react"
import { extractValidationMessages } from "@/lib/admin-ux.shared"

interface FormValidationSummaryProps {
  errors: unknown
}

export function FormValidationSummary({
  errors,
}: FormValidationSummaryProps) {
  const messages = extractValidationMessages(errors)

  if (messages.length === 0) {
    return null
  }

  return (
    <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-4 text-sm">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 size-4 shrink-0 text-destructive" />
        <div>
          <p className="font-semibold text-destructive">
            Corrigez les points suivants avant d&apos;enregistrer.
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-destructive/90">
            {messages.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
