import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  Users,
  Mail,
  Calendar,
  MessageSquare,
  Briefcase,
  HelpCircle,
  ArrowRight,
  Plus,
  Eye,
  TrendingUp,
  BarChart3,
  MessagesSquare,
} from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"

const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacte",
  QUALIFIED: "Qualifie",
  IN_PROGRESS: "En cours",
  CONVERTED: "Converti",
  CLOSED: "Ferme",
}

const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-purple-500",
  IN_PROGRESS: "bg-orange-500",
  CONVERTED: "bg-emerald-500",
  CLOSED: "bg-gray-400",
}

const MONTH_LABELS = [
  "Jan",
  "Fev",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Aout",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
]

export default async function AdminDashboardPage() {
  const [
    totalLeads,
    unreadContacts,
    pendingAppointments,
    publishedTestimonials,
    publishedServices,
    publishedFaqs,
    recentLeads,
    statusCounts,
    recentLeadsForTrend,
  ] = await Promise.all([
    prisma.lead.count(),
    prisma.contactRequest.count({ where: { isRead: false } }),
    prisma.appointmentRequest.count({ where: { status: "PENDING" } }),
    prisma.testimonial.count({ where: { published: true } }),
    prisma.service.count({ where: { published: true } }),
    prisma.fAQ.count({ where: { published: true } }),
    prisma.lead.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        id: true,
        fullName: true,
        email: true,
        destination: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.lead.groupBy({
      by: ["status"],
      _count: { id: true },
    }),
    (() => {
      const sixMonthsAgo = new Date()
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6)
      return prisma.lead.findMany({
        where: { createdAt: { gte: sixMonthsAgo } },
        select: { createdAt: true },
      })
    })(),
  ])

  // Process status distribution data
  const statusData = statusCounts.map((item) => ({
    status: item.status,
    label: STATUS_LABELS[item.status] || item.status,
    count: item._count.id,
    color: STATUS_COLORS[item.status] || "bg-gray-400",
  }))
  const maxStatusCount = Math.max(...statusData.map((d) => d.count), 1)

  // Process monthly trend data
  const monthlyMap = new Map<string, number>()
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    monthlyMap.set(key, 0)
  }
  for (const lead of recentLeadsForTrend) {
    const d = lead.createdAt
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`
    if (monthlyMap.has(key)) {
      monthlyMap.set(key, (monthlyMap.get(key) ?? 0) + 1)
    }
  }
  const monthlyData = Array.from(monthlyMap.entries()).map(([key, count]) => {
    const [, month] = key.split("-")
    return {
      key,
      label: MONTH_LABELS[parseInt(month, 10) - 1],
      count,
    }
  })
  const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1)

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Tableau de bord
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Vue d&apos;ensemble de votre activite VisaCore Solutions.
        </p>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total Leads"
          value={totalLeads}
          icon={Users}
          iconClassName="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
          description="Tous les leads enregistres"
        />
        <StatsCard
          title="Contacts non lus"
          value={unreadContacts}
          icon={Mail}
          iconClassName="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
          description="Messages en attente de lecture"
        />
        <StatsCard
          title="RDV en attente"
          value={pendingAppointments}
          icon={Calendar}
          iconClassName="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
          description="Rendez-vous a confirmer"
        />
        <StatsCard
          title="Temoignages publies"
          value={publishedTestimonials}
          icon={MessageSquare}
          iconClassName="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
          description="Visibles sur le site"
        />
        <StatsCard
          title="Services publies"
          value={publishedServices}
          icon={Briefcase}
          iconClassName="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
          description="Services actifs"
        />
        <StatsCard
          title="FAQ publiees"
          value={publishedFaqs}
          icon={HelpCircle}
          iconClassName="bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400"
          description="Questions repondues"
        />
      </div>

      {/* Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Lead Status Distribution */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <BarChart3 className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Leads par statut
            </h3>
          </div>
          {statusData.length > 0 ? (
            <div className="space-y-3">
              {statusData.map((item) => (
                <div key={item.status} className="flex items-center gap-3">
                  <span className="w-24 shrink-0 text-sm text-muted-foreground">
                    {item.label}
                  </span>
                  <div className="flex-1 h-8 bg-muted rounded-lg overflow-hidden">
                    <div
                      className={`h-full rounded-lg transition-all ${item.color}`}
                      style={{
                        width: `${(item.count / maxStatusCount) * 100}%`,
                        minWidth: item.count > 0 ? "8px" : "0px",
                      }}
                    />
                  </div>
                  <span className="w-8 text-sm font-medium text-foreground text-right">
                    {item.count}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted-foreground">
              Aucun lead enregistre
            </p>
          )}
        </div>

        {/* Monthly Lead Trends */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-6 flex items-center gap-2">
            <TrendingUp className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">
              Leads mensuels
            </h3>
          </div>
          <div className="flex items-end gap-3 h-52">
            {monthlyData.map((item) => (
              <div
                key={item.key}
                className="flex flex-1 flex-col items-center gap-1"
              >
                <span className="text-xs font-medium text-foreground">
                  {item.count}
                </span>
                <div className="flex w-full justify-center items-end h-40">
                  <div
                    className="w-full max-w-12 bg-primary rounded-t-lg transition-all"
                    style={{
                      height: `${maxMonthlyCount > 0 ? Math.max((item.count / maxMonthlyCount) * 100, item.count > 0 ? 3 : 1) : 1}%`,
                    }}
                  />
                </div>
                <span className="text-xs text-muted-foreground">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent leads & Quick actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Leads Table */}
        <div className="lg:col-span-2 rounded-xl border border-border bg-card shadow-sm">
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <h3 className="text-base font-semibold text-foreground">
                Leads recents
              </h3>
              <p className="text-sm text-muted-foreground">
                Les 5 derniers leads enregistres
              </p>
            </div>
            <Link href="/admin/leads">
              <Button variant="outline" size="sm">
                Voir tout
                <ArrowRight className="ml-1 size-4" data-icon="inline-end" />
              </Button>
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Email
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Destination
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Date
                  </th>
                  <th className="px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentLeads.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-12 text-center text-sm text-muted-foreground"
                    >
                      Aucun lead pour le moment.
                    </td>
                  </tr>
                ) : (
                  recentLeads.map((lead) => (
                    <tr
                      key={lead.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-foreground">
                        {lead.fullName}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {lead.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {lead.destination}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <StatusBadge status={lead.status} />
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                        {lead.createdAt.toLocaleDateString("fr-FR", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <Link href={`/admin/leads/${lead.id}`}>
                          <Button variant="ghost" size="icon-sm">
                            <Eye className="size-4" />
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-border bg-card shadow-sm">
          <div className="border-b border-border px-6 py-4">
            <h3 className="text-base font-semibold text-foreground">
              Actions rapides
            </h3>
            <p className="text-sm text-muted-foreground">
              Raccourcis vers les taches courantes
            </p>
          </div>
          <div className="flex flex-col gap-2 p-4">
            <Link href="/admin/leads">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Users className="size-4" />
                Gerer les leads
              </Button>
            </Link>
            <Link href="/admin/contacts">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Mail className="size-4" />
                Voir les contacts
              </Button>
            </Link>
            <Link href="/admin/appointments">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Calendar className="size-4" />
                Gerer les rendez-vous
              </Button>
            </Link>
            <Link href="/admin/destinations">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Plus className="size-4" />
                Ajouter une destination
              </Button>
            </Link>
            <Link href="/admin/services">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Briefcase className="size-4" />
                Gerer les services
              </Button>
            </Link>
            <Link href="/admin/testimonials">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <MessageSquare className="size-4" />
                Moderer les temoignages
              </Button>
            </Link>
            <Link href="/admin/conversations">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <MessagesSquare className="size-4" />
                Relire les conversations
              </Button>
            </Link>
            <Link href="/admin/settings">
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <HelpCircle className="size-4" />
                Parametres du site
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
