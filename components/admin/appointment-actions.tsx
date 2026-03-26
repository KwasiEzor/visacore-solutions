"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import {
  updateAppointmentStatus,
  deleteAppointment,
} from "@/actions/appointments"

interface AppointmentStatusSelectProps {
  appointmentId: string
  currentStatus: string
}

export function AppointmentStatusSelect({
  appointmentId,
  currentStatus,
}: AppointmentStatusSelectProps) {
  const [isPending, startTransition] = useTransition()

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newStatus = e.target.value
    if (newStatus === currentStatus) return
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(appointmentId, newStatus)
        if (result.success) {
          toast.success("Statut mis à jour")
        } else {
          toast.error(result.error || "Erreur lors de la mise à jour")
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
      <option value="PENDING">En attente</option>
      <option value="APPROVED">Approuve</option>
      <option value="CANCELLED">Annule</option>
      <option value="COMPLETED">Termine</option>
    </select>
  )
}

interface AppointmentActionButtonsProps {
  appointmentId: string
  currentStatus: string
}

export function AppointmentActionButtons({
  appointmentId,
  currentStatus,
}: AppointmentActionButtonsProps) {
  const [isPending, startTransition] = useTransition()

  function handleApprove() {
    startTransition(async () => {
      try {
        const result = await updateAppointmentStatus(appointmentId, "APPROVED")
        if (result.success) {
          toast.success("Rendez-vous approuvé")
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
        } else {
          toast.error(result.error || "Erreur lors de la suppression")
        }
      } catch {
        toast.error("Une erreur est survenue")
      }
    })
  }

  return (
    <div className="flex items-center gap-1.5">
      {currentStatus === "PENDING" && (
        <>
          <button
            onClick={handleApprove}
            disabled={isPending}
            className="inline-flex items-center rounded-lg bg-green-50 px-2.5 py-1 text-xs font-medium text-green-700 transition-colors hover:bg-green-100 disabled:opacity-50 dark:bg-green-900/20 dark:text-green-400 dark:hover:bg-green-900/30"
          >
            {isPending ? "..." : "Approuver"}
          </button>
          <button
            onClick={handleCancel}
            disabled={isPending}
            className="inline-flex items-center rounded-lg bg-red-50 px-2.5 py-1 text-xs font-medium text-red-700 transition-colors hover:bg-red-100 disabled:opacity-50 dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/30"
          >
            {isPending ? "..." : "Annuler"}
          </button>
        </>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="inline-flex items-center rounded-lg px-2.5 py-1 text-xs font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:opacity-50"
      >
        {isPending ? "..." : "Supprimer"}
      </button>
    </div>
  )
}
