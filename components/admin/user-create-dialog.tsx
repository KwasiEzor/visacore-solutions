"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createUser } from "@/actions/users"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface UserCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserCreateDialog({ open, onOpenChange }: UserCreateDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [role, setRole] = useState<"SUPER_ADMIN" | "ADMIN" | "EDITOR">("EDITOR")
  const [isPending, startTransition] = useTransition()

  function resetForm() {
    setName("")
    setEmail("")
    setPassword("")
    setRole("EDITOR")
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    startTransition(async () => {
      const result = await createUser({ name, email, password, role })

      if (result.success) {
        toast.success("Utilisateur cree avec succes")
        resetForm()
        onOpenChange(false)
      } else {
        toast.error(result.error ?? "Erreur lors de la creation")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => onOpenChange(value)}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nouvel utilisateur</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="uc-name">Nom</Label>
            <Input
              id="uc-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nom complet"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uc-email">Email</Label>
            <Input
              id="uc-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemple.com"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uc-password">Mot de passe</Label>
            <Input
              id="uc-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 8 caracteres"
              required
              minLength={8}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="uc-role">Role</Label>
            <select
              id="uc-role"
              value={role}
              onChange={(e) => setRole(e.target.value as "SUPER_ADMIN" | "ADMIN" | "EDITOR")}
              className="h-8 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            >
              <option value="EDITOR">Editeur</option>
              <option value="ADMIN">Admin</option>
              <option value="SUPER_ADMIN">Super Admin</option>
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Creer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
