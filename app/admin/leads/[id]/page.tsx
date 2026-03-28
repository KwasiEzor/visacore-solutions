import { notFound } from "next/navigation"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import {
  ArrowLeft,
  Mail,
  Phone,
  Globe,
  MapPin,
  Calendar,
  Briefcase,
  MessageSquare,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  LeadAssigneeSelect,
  LeadStatusSelect,
  LeadNotesForm,
  DeleteLeadButton,
} from "@/components/admin/lead-actions"
import { AILeadInsights } from "@/components/admin/ai-lead-insights"

interface LeadDetailPageProps {
  params: Promise<{ id: string }>
}

export default async function LeadDetailPage({ params }: LeadDetailPageProps) {
  const { id } = await params

  const [lead, users] = await Promise.all([
    prisma.lead.findUnique({
      where: { id },
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

  if (!lead) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="size-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            {lead.fullName}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Lead cree le{" "}
            {lead.createdAt.toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <DeleteLeadButton leadId={lead.id} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Contact info card */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Informations de contact
              </h3>
            </div>
            <div className="grid gap-4 p-6 sm:grid-cols-2">
              <div className="flex items-start gap-3">
                <User className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Nom complet
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.fullName}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Email
                  </p>
                  <a
                    href={`mailto:${lead.email}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    {lead.email}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Telephone
                  </p>
                  <a
                    href={`tel:${lead.phone}`}
                    className="text-sm font-medium text-foreground hover:underline"
                  >
                    {lead.phone}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Globe className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Pays d&apos;origine
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.country}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground">
                    Destination souhaitee
                  </p>
                  <p className="text-sm font-medium text-foreground">
                    {lead.destination}
                  </p>
                </div>
              </div>
              {lead.source && (
                <div className="flex items-start gap-3">
                  <Globe className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Source
                    </p>
                    <p className="text-sm font-medium text-foreground">
                      {lead.source}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Details card */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Details du lead
              </h3>
            </div>
            <div className="space-y-4 p-6">
              {lead.situation && (
                <div className="flex items-start gap-3">
                  <Briefcase className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Situation actuelle
                    </p>
                    <p className="text-sm text-foreground">{lead.situation}</p>
                  </div>
                </div>
              )}
              {lead.serviceNeeded && (
                <div className="flex items-start gap-3">
                  <Calendar className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Service demande
                    </p>
                    <p className="text-sm text-foreground">
                      {lead.serviceNeeded}
                    </p>
                  </div>
                </div>
              )}
              {lead.message && (
                <div className="flex items-start gap-3">
                  <MessageSquare className="mt-0.5 size-5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">
                      Message
                    </p>
                    <p className="whitespace-pre-wrap text-sm text-foreground">
                      {lead.message}
                    </p>
                  </div>
                </div>
              )}
              {lead.tags.length > 0 && (
                <div>
                  <p className="mb-2 text-xs font-medium text-muted-foreground">
                    Tags
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {lead.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Notes internes
              </h3>
            </div>
            <div className="p-6">
              <LeadNotesForm leadId={lead.id} currentNotes={lead.notes} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status card */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Statut
              </h3>
            </div>
            <div className="p-6">
              <LeadStatusSelect
                leadId={lead.id}
                currentStatus={lead.status}
              />
            </div>
          </div>

          {/* Assigned to */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Assigne a
              </h3>
            </div>
            <div className="p-6">
              <LeadAssigneeSelect
                leadId={lead.id}
                currentAssignedToId={lead.assignedToId}
                users={users}
              />

              {lead.assignedTo ? (
                <div className="mt-4 flex items-center gap-3 rounded-2xl border border-border/70 bg-muted/20 p-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
                    {lead.assignedTo.name
                      ? lead.assignedTo.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)
                      : "?"}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {lead.assignedTo.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {lead.assignedTo.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="mt-4 text-sm italic text-muted-foreground">
                  Aucun agent assigne a ce lead.
                </p>
              )}
            </div>
          </div>

          {/* AI Insights */}
          <AILeadInsights
            lead={{
              fullName: lead.fullName,
              email: lead.email,
              phone: lead.phone,
              country: lead.country,
              destination: lead.destination,
              situation: lead.situation,
              serviceNeeded: lead.serviceNeeded,
              message: lead.message,
              status: lead.status,
              createdAt: lead.createdAt.toISOString(),
            }}
          />

          {/* Meta info */}
          <div className="rounded-xl border border-border bg-card shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h3 className="text-base font-semibold text-foreground">
                Metadonnees
              </h3>
            </div>
            <div className="space-y-3 p-6">
              <div>
                <p className="text-xs text-muted-foreground">ID</p>
                <p className="font-mono text-xs text-foreground">{lead.id}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Cree le</p>
                <p className="text-sm text-foreground">
                  {lead.createdAt.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">
                  Derniere modification
                </p>
                <p className="text-sm text-foreground">
                  {lead.updatedAt.toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Consentement</p>
                <p className="text-sm text-foreground">
                  {lead.consent ? "Oui" : "Non"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
