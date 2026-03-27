"use client"

import { useTransition } from "react"
import { deleteService } from "@/actions/services"
import { Trash2, Pencil, ExternalLink } from "lucide-react"
import Link from "next/link"

interface ServiceRowActionsProps {
  serviceId: string
  serviceSlug: string
  published: boolean
}

export function ServiceRowActions({
  serviceId,
  serviceSlug,
  published,
}: ServiceRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer ce service ?")) return
    startTransition(async () => {
      await deleteService(serviceId)
    })
  }

  return (
    <div className="flex items-center gap-1">
      {published && (
        <Link
          href={`/services/${serviceSlug}`}
          target="_blank"
          rel="noreferrer"
          className="inline-flex size-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Prévisualiser"
        >
          <ExternalLink className="size-3.5" />
        </Link>
      )}
      <Link
        href={`/admin/services/${serviceId}/edit`}
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
