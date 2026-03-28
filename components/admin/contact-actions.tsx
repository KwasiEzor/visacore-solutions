"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { FileText, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  deleteContactRequest,
  markContactAsRead,
  updateContactNotes,
  updateContactStatus,
} from "@/actions/contacts"
import { ContactRequestStatus } from "@/lib/generated/prisma/client"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"

interface MarkReadButtonProps {
  contactId: string
  isRead: boolean
}

interface ContactStatusSelectProps {
  contactId: string
  currentStatus: string
}

interface DeleteContactButtonProps {
  contactId: string
}

interface ContactDetailsDialogProps {
  contact: {
    id: string
    fullName: string
    email: string
    phone?: string | null
    subject: string
    message: string
    notes?: string | null
    status: string
    createdAtLabel: string
  }
}

export function MarkReadButton({ contactId, isRead }: MarkReadButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (isRead) return null

  function handleClick() {
    startTransition(async () => {
      try {
        const result = await markContactAsRead(contactId)
        if (result.success) {
          toast.success("Marqué comme lu")
          router.refresh()
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
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
    >
      {isPending ? "..." : "Marquer lu"}
    </button>
  )
}

export function ContactStatusSelect({
  contactId,
  currentStatus,
}: ContactStatusSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    startTransition(async () => {
      try {
        const result = await updateContactStatus(contactId, newStatus as ContactRequestStatus)
        if (result.success) {
          toast.success("Statut mis à jour")
          router.refresh()
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
      <option value="REPLIED">Répondu</option>
      <option value="ARCHIVED">Archivé</option>
    </select>
  )
}

export function ContactDetailsDialog({ contact }: ContactDetailsDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(contact.notes ?? "")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateContactNotes(contact.id, notes)
      if (!result.success) {
        toast.error(result.error || "Impossible d'enregistrer les notes")
        return
      }

      toast.success("Notes du contact enregistrées")
      router.refresh()
    })
  }

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="gap-1.5"
      >
        <FileText className="size-3.5" />
        Voir
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Message de contact</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 lg:grid-cols-[1.05fr,0.95fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-base font-semibold text-foreground">
                  {contact.fullName}
                </p>
                <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    <a href={`mailto:${contact.email}`} className="hover:underline">
                      {contact.email}
                    </a>
                  </p>
                  {contact.phone ? (
                    <p>
                      <a href={`tel:${contact.phone}`} className="hover:underline">
                        {contact.phone}
                      </a>
                    </p>
                  ) : null}
                  <p>Reçu le {contact.createdAtLabel}</p>
                </div>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Sujet
                </p>
                <p className="mt-2 text-sm font-medium text-foreground">
                  {contact.subject}
                </p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Message complet
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {contact.message}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Notes internes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Suivez ici la prise en charge, la réponse envoyée et les prochaines actions commerciales.
                </p>
              </div>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={10}
                disabled={isPending}
                placeholder="Expliquer le besoin, l'état de réponse et la prochaine relance."
              />
              <Button
                type="button"
                onClick={handleSave}
                disabled={isPending}
                className="w-full"
              >
                {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
                Enregistrer les notes
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

export function DeleteContactButton({ contactId }: DeleteContactButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer ce contact ?")) return
    startTransition(async () => {
      try {
        const result = await deleteContactRequest(contactId)
        if (result.success) {
          toast.success("Contact supprimé")
          router.refresh()
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
      type="button"
      onClick={handleDelete}
      disabled={isPending}
      className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
    >
      {isPending ? "..." : "Supprimer"}
    </button>
  )
}
