import { prisma } from "@/lib/prisma"
import { StatusBadge } from "@/components/admin/status-badge"
import {
  AppointmentStatusSelect,
  AppointmentActionButtons,
} from "@/components/admin/appointment-actions"

export default async function AppointmentsPage() {
  const appointments = await prisma.appointmentRequest.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      assignedTo: {
        select: { name: true },
      },
    },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Rendez-vous
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerez les demandes de rendez-vous.{" "}
          {appointments.length} rendez-vous au total.
        </p>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Nom
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Service
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date/Heure souhaitee
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Demande le
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {appointments.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucun rendez-vous pour le moment.
                  </td>
                </tr>
              ) : (
                appointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="transition-colors hover:bg-muted/50"
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {appt.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {appt.email}
                        </p>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      <div>
                        {appt.serviceType && (
                          <p className="text-sm text-foreground">
                            {appt.serviceType}
                          </p>
                        )}
                        {appt.destinationType && (
                          <p className="text-xs text-muted-foreground">
                            {appt.destinationType}
                          </p>
                        )}
                        {!appt.serviceType && !appt.destinationType && (
                          <span className="italic text-muted-foreground/60">
                            Non specifie
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {appt.preferredDate ? (
                        <div>
                          <p className="text-sm text-foreground">
                            {appt.preferredDate.toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                          {appt.preferredTime && (
                            <p className="text-xs text-muted-foreground">
                              {appt.preferredTime}
                            </p>
                          )}
                        </div>
                      ) : (
                        <span className="italic text-muted-foreground/60">
                          Pas de preference
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col gap-1.5">
                        <StatusBadge status={appt.status} />
                        <AppointmentStatusSelect
                          appointmentId={appt.id}
                          currentStatus={appt.status}
                        />
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {appt.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <AppointmentActionButtons
                        appointmentId={appt.id}
                        currentStatus={appt.status}
                      />
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
