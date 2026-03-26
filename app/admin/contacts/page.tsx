import { prisma } from "@/lib/prisma"
import { StatusBadge, ReadBadge } from "@/components/admin/status-badge"
import {
  MarkReadButton,
  ContactStatusSelect,
  DeleteContactButton,
} from "@/components/admin/contact-actions"

export default async function ContactsPage() {
  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Demandes de contact
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerez les messages recus via le formulaire de contact.{" "}
          {contacts.length} message{contacts.length !== 1 ? "s" : ""} au total.
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
                  Sujet
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Statut
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Lecture
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </th>
                <th className="px-6 py-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {contacts.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-sm text-muted-foreground"
                  >
                    Aucune demande de contact.
                  </td>
                </tr>
              ) : (
                contacts.map((contact) => (
                  <tr
                    key={contact.id}
                    className={`transition-colors hover:bg-muted/50 ${
                      !contact.isRead ? "bg-blue-50/50 dark:bg-blue-950/10" : ""
                    }`}
                  >
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {contact.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {contact.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="max-w-xs truncate text-sm text-foreground">
                        {contact.subject}
                      </p>
                      <p className="max-w-xs truncate text-xs text-muted-foreground">
                        {contact.message}
                      </p>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <ContactStatusSelect
                        contactId={contact.id}
                        currentStatus={contact.status}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <ReadBadge isRead={contact.isRead} />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {contact.createdAt.toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-2">
                        <MarkReadButton
                          contactId={contact.id}
                          isRead={contact.isRead}
                        />
                        <DeleteContactButton contactId={contact.id} />
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
