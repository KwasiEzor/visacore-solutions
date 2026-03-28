import { prisma } from "@/lib/prisma"
import { ContactsClient } from "@/components/admin/contacts-client"

export default async function ContactsPage() {
  const contacts = await prisma.contactRequest.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data = contacts.map((contact) => ({
    id: contact.id,
    fullName: contact.fullName,
    email: contact.email,
    phone: contact.phone,
    subject: contact.subject,
    message: contact.message,
    notes: contact.notes,
    status: contact.status,
    isRead: contact.isRead,
    createdAtLabel: contact.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Demandes de contact
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerez les messages recus via le formulaire de contact.{" "}
          {contacts.length} message{contacts.length !== 1 ? "s" : ""} au total.
        </p>
      </div>

      <ContactsClient data={data} />
    </div>
  )
}
