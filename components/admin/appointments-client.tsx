"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"
import {
  AppointmentActionButtons,
  AppointmentAssigneeSelect,
  AppointmentDetailsDialog,
  AppointmentStatusSelect,
} from "@/components/admin/appointment-actions"
import { Input } from "@/components/ui/input"
import {
  filterAppointmentRows,
  type AppointmentTableRow,
} from "@/lib/admin-ux.shared"

interface AppointmentAssigneeOption {
  id: string
  name: string | null
  email: string
}

interface AppointmentsClientProps {
  data: AppointmentTableRow[]
  users: AppointmentAssigneeOption[]
}

export function AppointmentsClient({
  data,
  users,
}: AppointmentsClientProps) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ALL")

  const filteredData = useMemo(
    () => filterAppointmentRows(data, { query, status }),
    [data, query, status]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un rendez-vous..."
            className="pl-9"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="PENDING">En attente</option>
          <option value="APPROVED">Approuvé</option>
          <option value="CANCELLED">Annulé</option>
          <option value="COMPLETED">Terminé</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-[28px] border border-border/70 bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1120px]">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Demandeur
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Projet
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Disponibilité
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Statut
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Assignation
                </th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredData.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucun rendez-vous correspondant.
                  </td>
                </tr>
              ) : (
                filteredData.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="align-top transition-colors hover:bg-muted/25"
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium text-foreground">
                          {appointment.fullName}
                        </p>
                        <a
                          href={`mailto:${appointment.email}`}
                          className="mt-1 block text-xs text-muted-foreground hover:underline"
                        >
                          {appointment.email}
                        </a>
                        <a
                          href={`tel:${appointment.phone}`}
                          className="text-xs text-muted-foreground hover:underline"
                        >
                          {appointment.phone}
                        </a>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1.5">
                        <p className="text-sm font-medium text-foreground">
                          {appointment.serviceType || "Service à qualifier"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.destinationType || "Destination non précisée"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Demandé le {appointment.createdAtLabel}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-foreground">
                          {appointment.preferredDateLabel}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appointment.preferredTime || "Horaire flexible"}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <AppointmentStatusSelect
                        appointmentId={appointment.id}
                        currentStatus={appointment.status}
                      />
                    </td>
                    <td className="px-5 py-4">
                      <div className="w-[210px]">
                        <AppointmentAssigneeSelect
                          appointmentId={appointment.id}
                          currentAssignedToId={appointment.assignedToId}
                          users={users}
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex min-w-[280px] flex-wrap items-center gap-2">
                        <AppointmentDetailsDialog appointment={appointment} />
                        <AppointmentActionButtons
                          appointmentId={appointment.id}
                          currentStatus={appointment.status}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
