"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { deleteDestination } from "@/actions/destinations"
import { Trash2, Pencil } from "lucide-react"
import Link from "next/link"

interface DestinationRowActionsProps {
  destinationId: string
}

export function DestinationRowActions({ destinationId }: DestinationRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer cette destination ?")) return
    startTransition(async () => {
      try {
        const result = await deleteDestination(destinationId)
        if (result.success) {
          toast.success("Destination supprimée")
        } else {
          toast.error(result.error || "Erreur lors de la suppression")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/destinations/${destinationId}/edit`}
        className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Modifier"
      >
        <Pencil className="size-3.5" />
      </Link>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex size-7 items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
        aria-label="Supprimer"
      >
        {isPending ? (
          <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
      </button>
    </div>
  )
}
