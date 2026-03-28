import { prisma } from "@/lib/prisma"
import { AppointmentsClient } from "@/components/admin/appointments-client"

export default async function AppointmentsPage() {
  const [appointments, users] = await Promise.all([
    prisma.appointmentRequest.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        assignedTo: {
          select: { id: true, name: true, email: true },
        },
      },
    }),
    prisma.user.findMany({
      orderBy: [{ role: "asc" }, { name: "asc" }],
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ])

  const data = appointments.map((appointment) => ({
    id: appointment.id,
    fullName: appointment.fullName,
    email: appointment.email,
    phone: appointment.phone,
    serviceType: appointment.serviceType,
    destinationType: appointment.destinationType,
    preferredDateLabel: appointment.preferredDate
      ? appointment.preferredDate.toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "Date flexible",
    preferredTime: appointment.preferredTime,
    message: appointment.message,
    notes: appointment.notes,
    status: appointment.status,
    assignedToId: appointment.assignedToId,
    assignedToName: appointment.assignedTo?.name ?? null,
    createdAtLabel: appointment.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Rendez-vous
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Qualifiez les demandes entrantes, affectez-les à un conseiller et
          consignez le suivi interne. {appointments.length} rendez-vous au total.
        </p>
      </div>

      <AppointmentsClient data={data} users={users} />
    </div>
  )
}
