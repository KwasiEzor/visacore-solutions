"use client"

import { useTransition } from "react"
import { updateLeadStatus } from "@/actions/leads"
import { StatusBadge } from "@/components/admin/status-badge"

const LEAD_STATUSES = [
  "NEW",
  "CONTACTED",
  "QUALIFIED",
  "IN_PROGRESS",
  "CONVERTED",
  "CLOSED",
] as const

interface LeadStatusSelectProps {
  leadId: string
  currentStatus: string
}

export function LeadStatusSelect({
  leadId,
  currentStatus,
}: LeadStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    startTransition(async () => {
      await updateLeadStatus(leadId, newStatus)
    })
  }

  return (
    <div className="flex items-center gap-3">
      <StatusBadge status={currentStatus} />
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        {LEAD_STATUSES.map((status) => (
          <option key={status} value={status}>
            {status.replace("_", " ")}
          </option>
        ))}
      </select>
      {isPending && (
        <span className="text-xs text-muted-foreground">Mise a jour...</span>
      )}
    </div>
  )
}

interface LeadNotesFormProps {
  leadId: string
  currentNotes: string | null
}

export function LeadNotesForm({ leadId, currentNotes }: LeadNotesFormProps) {
  const [isPending, startTransition] = useTransition()

  function handleSubmit(formData: FormData) {
    const notes = formData.get("notes") as string
    startTransition(async () => {
      const { updateLeadNotes } = await import("@/actions/leads")
      await updateLeadNotes(leadId, notes)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-3">
      <textarea
        name="notes"
        defaultValue={currentNotes ?? ""}
        placeholder="Ajoutez vos notes ici..."
        rows={5}
        className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring"
      />
      <button
        type="submit"
        disabled={isPending}
        className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {isPending ? "Enregistrement..." : "Sauvegarder les notes"}
      </button>
    </form>
  )
}

interface DeleteLeadButtonProps {
  leadId: string
}

export function DeleteLeadButton({ leadId }: DeleteLeadButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer ce lead ?")) return
    startTransition(async () => {
      const { deleteLead } = await import("@/actions/leads")
      await deleteLead(leadId)
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center justify-center rounded-lg bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
    >
      {isPending ? "Suppression..." : "Supprimer ce lead"}
    </button>
  )
}
