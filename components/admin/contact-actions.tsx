"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { markContactAsRead, updateContactStatus, deleteContactRequest } from "@/actions/contacts"

interface MarkReadButtonProps {
  contactId: string
  isRead: boolean
}

export function MarkReadButton({ contactId, isRead }: MarkReadButtonProps) {
  const [isPending, startTransition] = useTransition()

  if (isRead) return null

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await markContactAsRead(contactId)
        if (result.success) {
          toast.success("Marqué comme lu")
        } else {
          toast.error(result.error || "Erreur")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
    >
      {isPending ? "..." : "Marquer lu"}
    </button>
  )
}

interface ContactStatusSelectProps {
  contactId: string
  currentStatus: string
}

export function ContactStatusSelect({
  contactId,
  currentStatus,
}: ContactStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    startTransition(async () => {
      try {
        const result = await updateContactStatus(contactId, newStatus)
        if (result.success) {
          toast.success("Statut mis à jour")
        } else {
          toast.error(result.error || "Erreur")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <select
      defaultValue={currentStatus}
      onChange={handleChange}
      disabled={isPending}
      className="rounded-lg border border-border bg-background px-2 py-1 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
    >
      <option value="NEW">Nouveau</option>
      <option value="REPLIED">Repondu</option>
      <option value="ARCHIVED">Archive</option>
    </select>
  )
}

interface DeleteContactButtonProps {
  contactId: string
}

export function DeleteContactButton({ contactId }: DeleteContactButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer ce contact ?")) return
    startTransition(async () => {
      try {
        const result = await deleteContactRequest(contactId)
        if (result.success) {
          toast.success("Contact supprimé")
        } else {
          toast.error(result.error || "Erreur")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {isPending ? "..." : "Supprimer"}
    </button>
  )
}
