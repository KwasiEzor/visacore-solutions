"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { CalendarDays, FileText, Loader2, Trash2, UserRound } from "lucide-react"
import { toast } from "sonner"
import {
  assignAppointment,
  deleteAppointment,
  updateAppointmentNotes,
  updateAppointmentStatus,
} from "@/actions/appointments"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { StatusBadge } from "@/components/admin/status-badge"

interface AppointmentStatusSelectProps {
  appointmentId: string
  currentStatus: string
}

interface AppointmentAssigneeOption {
  id: string
  name: string | null
  email: string
}

interface AppointmentAssigneeSelectProps {
  appointmentId: string
  currentAssignedToId: string | null
  users: AppointmentAssigneeOption[]
}

interface AppointmentDetailsDialogProps {
  appointment: {
    id: string
    fullName: string
    email: string
    phone: string
    serviceType: string | null
    destinationType: string | null
    preferredDateLabel: string
    preferredTime: string | null
    message: string | null
    notes: string | null
    status: string
    createdAtLabel: string
  }
}

interface AppointmentActionButtonsProps {
  appointmentId: string
  currentStatus: string
}

export function AppointmentStatusSelect({
  appointmentId,
  currentStatus,
}: AppointmentStatusSelectProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(appointmentId, newStatus)
        if (result.success) {
          toast.success("Statut mis à jour")
          router.refresh()
        } else {
          toast.error(result.error || "Erreur lors de la mise à jour")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <div className="flex items-center gap-2">
      <StatusBadge status={currentStatus} />
      <select
        defaultValue={currentStatus}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
      >
        <option value="PENDING">En attente</option>
        <option value="APPROVED">Approuvé</option>
        <option value="CANCELLED">Annulé</option>
        <option value="COMPLETED">Terminé</option>
      </select>
    </div>
  )
}

export function AppointmentAssigneeSelect({
  appointmentId,
  currentAssignedToId,
  users,
}: AppointmentAssigneeSelectProps) {
  const router = useRouter()
  const [selectedUserId, setSelectedUserId] = useState(currentAssignedToId ?? "")
  const [isPending, startTransition] = useTransition()

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const nextUserId = event.target.value
    setSelectedUserId(nextUserId)

    startTransition(async () => {
      const result = await assignAppointment(
        appointmentId,
        nextUserId.length > 0 ? nextUserId : null
      )

      if (!result.success) {
        toast.error(result.error || "Impossible de mettre à jour l'assignation")
        setSelectedUserId(currentAssignedToId ?? "")
        return
      }

      toast.success(
        nextUserId.length > 0
          ? "Rendez-vous assigné"
          : "Assignation retirée"
      )
      router.refresh()
    })
  }

  return (
    <label className="flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3 py-2">
      <UserRound className="size-4 text-muted-foreground" />
      <select
        value={selectedUserId}
        onChange={handleChange}
        disabled={isPending}
        className="min-w-0 flex-1 bg-transparent text-xs text-foreground outline-none disabled:opacity-50"
      >
        <option value="">Non assigné</option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name ?? user.email}
          </option>
        ))}
      </select>
    </label>
  )
}

export function AppointmentDetailsDialog({
  appointment,
}: AppointmentDetailsDialogProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(appointment.notes ?? "")
  const [isPending, startTransition] = useTransition()

  function handleSave() {
    startTransition(async () => {
      const result = await updateAppointmentNotes(appointment.id, notes)
      if (!result.success) {
        toast.error(result.error || "Impossible d'enregistrer les notes")
        return
      }

      toast.success("Notes du rendez-vous enregistrées")
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
        Détails
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Suivi du rendez-vous</DialogTitle>
          </DialogHeader>

          <div className="grid gap-5 lg:grid-cols-[1.1fr,0.9fr]">
            <div className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-4">
                <p className="text-base font-semibold text-foreground">
                  {appointment.fullName}
                </p>
                <div className="mt-2 space-y-1.5 text-sm text-muted-foreground">
                  <p>
                    <a href={`mailto:${appointment.email}`} className="hover:underline">
                      {appointment.email}
                    </a>
                  </p>
                  <p>
                    <a href={`tel:${appointment.phone}`} className="hover:underline">
                      {appointment.phone}
                    </a>
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={<CalendarDays className="size-4 text-visacore-gold" />}
                  label="Créneau souhaité"
                  value={[
                    appointment.preferredDateLabel,
                    appointment.preferredTime,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                />
                <InfoCard
                  icon={<StatusBadge status={appointment.status} />}
                  label="Demande reçue"
                  value={appointment.createdAtLabel}
                />
                <InfoCard
                  label="Service"
                  value={appointment.serviceType || "Non renseigné"}
                />
                <InfoCard
                  label="Destination"
                  value={appointment.destinationType || "Non renseignée"}
                />
              </div>

              <div className="rounded-2xl border border-border/70 bg-background p-4">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Message du client
                </p>
                <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-foreground">
                  {appointment.message?.trim() || "Aucun message complémentaire."}
                </p>
              </div>
            </div>

            <div className="space-y-3 rounded-2xl border border-border/70 bg-background p-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Notes internes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Conservez ici le contexte d’échange, les actions à mener et les disponibilités validées.
                </p>
              </div>
              <Textarea
                value={notes}
                onChange={(event) => setNotes(event.target.value)}
                rows={10}
                disabled={isPending}
                placeholder="Résumer l'appel, les points de qualification et les prochaines étapes."
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

export function AppointmentActionButtons({
  appointmentId,
  currentStatus,
}: AppointmentActionButtonsProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(appointmentId, "APPROVED")
        if (result.success) {
          toast.success("Rendez-vous approuvé")
          router.refresh()
        } else {
          toast.error(result.error || "Erreur lors de l'approbation")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  function handleCancel() {
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(appointmentId, "CANCELLED")
        if (result.success) {
          toast.success("Rendez-vous annulé")
          router.refresh()
        } else {
          toast.error(result.error || "Erreur lors de l'annulation")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  function handleDelete() {
    if (!confirm("Etes-vous sur de vouloir supprimer ce rendez-vous ?")) return
    startTransition(async () => {
      try {
        const result = await deleteAppointment(appointmentId)
        if (result.success) {
          toast.success("Rendez-vous supprimé")
          router.refresh()
        } else {
          toast.error(result.error || "Erreur lors de la suppression")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      {currentStatus === "PENDING" && (
        <>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isPending}
            className="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            {isPending ? "..." : "Approuver"}
          </button>
          <button
            type="button"
            onClick={handleCancel}
            disabled={isPending}
            className="inline-flex items-center rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            {isPending ? "..." : "Annuler"}
          </button>
        </>
      )}
      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
        className="gap-1.5"
      >
        {isPending ? (
          <Loader2 className="size-3.5 animate-spin" />
        ) : (
          <Trash2 className="size-3.5" />
        )}
        Supprimer
      </Button>
    </div>
  )
}

function InfoCard({
  label,
  value,
  icon,
}: {
  label: string
  value: string
  icon?: import("react").ReactNode
}) {
  return (
    <div className="rounded-2xl border border-border/70 bg-muted/20 p-3">
      <div className="flex items-center gap-2">
        {icon ?? null}
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-2 text-sm font-medium text-foreground">
        {value}
      </p>
    </div>
  )
}
