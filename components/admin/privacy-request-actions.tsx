"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import {
  anonymizeDataPrivacyRequestData,
  exportDataPrivacyRequestData,
  updateDataPrivacyRequest,
} from "@/actions/privacy-requests"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import {
  dataPrivacyRequestStatusLabels,
  dataPrivacyRequestStatuses,
  formatDataPrivacyRequestType,
} from "@/lib/privacy-requests.shared"

interface PrivacyRequestActionsProps {
  requestId: string
  requestType: string
  currentStatus: string
  currentNotes: string | null
}

export function PrivacyRequestActions({
  requestId,
  requestType,
  currentStatus,
  currentNotes,
}: PrivacyRequestActionsProps) {
  const [status, setStatus] = useState(currentStatus)
  const [notes, setNotes] = useState(currentNotes ?? "")
  const [isPending, startTransition] = useTransition()
  const canAnonymize = requestType === "ERASURE"

  function handleSave(nextStatus = status) {
    startTransition(async () => {
      const result = await updateDataPrivacyRequest(requestId, {
        status: nextStatus,
        resolutionNotes: notes,
      })

      if (!result.success) {
        toast.error(result.error || "Impossible de mettre a jour la demande")
        return
      }

      setStatus(nextStatus)
      toast.success("Demande RGPD mise a jour")
    })
  }

  function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextStatus = event.target.value
    setStatus(nextStatus)
    handleSave(nextStatus)
  }

  function handleExport() {
    startTransition(async () => {
      const result = await exportDataPrivacyRequestData(requestId)
      if (!result.success || !result.fileName || !result.data) {
        toast.error(result.error || "Export impossible")
        return
      }

      const blob = new Blob([JSON.stringify(result.data, null, 2)], {
        type: "application/json;charset=utf-8",
      })
      const url = URL.createObjectURL(blob)
      const link = document.createElement("a")
      link.href = url
      link.download = result.fileName
      link.click()
      URL.revokeObjectURL(url)
      toast.success("Export des donnees genere")
    })
  }

  function handleAnonymize() {
    if (!canAnonymize) return

    if (
      !confirm(
        "Confirmez-vous l'anonymisation technique des leads, contacts et rendez-vous lies a cette demande d'effacement ?"
      )
    ) {
      return
    }

    startTransition(async () => {
      const result = await anonymizeDataPrivacyRequestData(requestId)
      if (!result.success) {
        toast.error(result.error || "Anonymisation impossible")
        return
      }

      setStatus("FULFILLED")
      toast.success(result.message)
    })
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <select
          value={status}
          onChange={handleStatusChange}
          disabled={isPending}
          className="rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
        >
          {dataPrivacyRequestStatuses.map((value) => (
            <option key={value} value={value}>
              {dataPrivacyRequestStatusLabels[value]}
            </option>
          ))}
        </select>

        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={() => handleSave()}
        >
          Sauver les notes
        </Button>
      </div>

      <Textarea
        value={notes}
        onChange={(event) => setNotes(event.target.value)}
        disabled={isPending}
        rows={4}
        placeholder="Verification d'identite, echanges, justification de la reponse..."
        className="min-h-[110px]"
      />

      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          type="button"
          size="sm"
          variant="outline"
          disabled={isPending}
          onClick={handleExport}
        >
          Export JSON
        </Button>
        <Button
          type="button"
          size="sm"
          variant={canAnonymize ? "destructive" : "outline"}
          disabled={isPending || !canAnonymize}
          onClick={handleAnonymize}
        >
          Anonymiser
        </Button>
      </div>

      <p className="text-xs text-muted-foreground">
        {canAnonymize
          ? "L'anonymisation est disponible uniquement pour les demandes d'effacement."
          : `Action destructive indisponible pour la demande "${formatDataPrivacyRequestType(
              requestType
            )}".`}
      </p>
    </div>
  )
}
