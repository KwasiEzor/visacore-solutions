"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { deleteTestimonial } from "@/actions/testimonials"
import { Trash2, Pencil } from "lucide-react"
import Link from "next/link"

interface TestimonialRowActionsProps {
  testimonialId: string
}

export function TestimonialRowActions({ testimonialId }: TestimonialRowActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce témoignage ?")) return
    startTransition(async () => {
      const result = await deleteTestimonial(testimonialId)
      if (result.success) toast.success("Témoignage supprimé")
      else toast.error(result.error || "Erreur")
    })
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href={`/admin/testimonials/${testimonialId}/edit`}
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
