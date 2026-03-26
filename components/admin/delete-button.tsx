"use client"

import { useTransition } from "react"
import { Trash2 } from "lucide-react"

interface DeleteButtonProps {
  onDelete: () => Promise<{ error?: string; success?: boolean }>
  confirmMessage?: string
  size?: "sm" | "default"
}

export function DeleteButton({
  onDelete,
  confirmMessage = "Etes-vous sur de vouloir supprimer cet element ?",
  size = "sm",
}: DeleteButtonProps) {
  const [isPending, startTransition] = useTransition()

  function handleClick() {
    if (!confirm(confirmMessage)) return
    startTransition(async () => {
      await onDelete()
    })
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={`inline-flex items-center justify-center rounded-lg text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50 ${
        size === "sm" ? "size-7" : "size-8"
      }`}
      aria-label="Supprimer"
    >
      {isPending ? (
        <span className="size-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
      ) : (
        <Trash2 className={size === "sm" ? "size-3.5" : "size-4"} />
      )}
    </button>
  )
}
