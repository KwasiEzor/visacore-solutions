"use client"

import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { updateUserRole, deleteUser } from "@/actions/users"
import { toast } from "sonner"
import { Loader2, Trash2 } from "lucide-react"

interface UserActionsProps {
  userId: string
  currentRole: string
  isSelf: boolean
}

export function UserActions({ userId, currentRole, isSelf }: UserActionsProps) {
  const [isPending, startTransition] = useTransition()

  function handleRoleChange(newRole: string) {
    if (newRole === currentRole) return

    startTransition(async () => {
      const result = await updateUserRole(userId, newRole)
      if (result.success) {
        toast.success("Role mis a jour")
      } else {
        toast.error(result.error ?? "Erreur lors de la mise a jour du role")
      }
    })
  }

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer cet utilisateur ? Cette action est irreversible.")) {
      return
    }

    startTransition(async () => {
      const result = await deleteUser(userId)
      if (result.success) {
        toast.success("Utilisateur supprime")
      } else {
        toast.error(result.error ?? "Erreur lors de la suppression")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <select
        value={currentRole}
        onChange={(e) => handleRoleChange(e.target.value)}
        disabled={isPending || isSelf}
        className="h-7 rounded-md border border-input bg-transparent px-2 text-xs outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <option value="EDITOR">Editeur</option>
        <option value="ADMIN">Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>

      {!isSelf && (
        <Button
          variant="destructive"
          size="icon-xs"
          onClick={handleDelete}
          disabled={isPending}
          title="Supprimer l'utilisateur"
        >
          {isPending ? (
            <Loader2 className="size-3 animate-spin" />
          ) : (
            <Trash2 className="size-3" />
          )}
        </Button>
      )}
    </div>
  )
}
