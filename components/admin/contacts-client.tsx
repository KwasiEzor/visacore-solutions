"use client"

import { useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { DataTable } from "@/components/admin/data-table"
import { ContactStatusSelect, DeleteContactButton, MarkReadButton } from "@/components/admin/contact-actions"
import { ReadBadge } from "@/components/admin/status-badge"
import { Input } from "@/components/ui/input"
import {
  filterContactRows,
  type ContactTableRow,
} from "@/lib/admin-ux.shared"

const columns: ColumnDef<ContactTableRow>[] = [
  {
    accessorKey: "fullName",
    header: "Nom",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.fullName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
      </div>
    ),
  },
  {
    accessorKey: "subject",
    header: "Sujet",
    cell: ({ row }) => (
      <div>
        <p className="max-w-xs truncate text-sm text-foreground">
          {row.original.subject}
        </p>
        <p className="max-w-xs truncate text-xs text-muted-foreground">
          {row.original.message}
        </p>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => (
      <ContactStatusSelect
        contactId={row.original.id}
        currentStatus={row.original.status}
      />
    ),
  },
  {
    accessorKey: "isRead",
    header: "Lecture",
    cell: ({ row }) => <ReadBadge isRead={row.original.isRead} />,
  },
  {
    accessorKey: "createdAtLabel",
    header: "Date",
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <MarkReadButton contactId={row.original.id} isRead={row.original.isRead} />
        <DeleteContactButton contactId={row.original.id} />
      </div>
    ),
  },
]

export function ContactsClient({ data }: { data: ContactTableRow[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ALL")
  const [readState, setReadState] = useState<"ALL" | "READ" | "UNREAD">("ALL")

  const filteredData = filterContactRows(data, {
    query,
    status,
    readState,
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un contact..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">Tous les statuts</option>
            <option value="NEW">Nouveau</option>
            <option value="REPLIED">Répondu</option>
            <option value="ARCHIVED">Archivé</option>
          </select>

          <select
            value={readState}
            onChange={(event) =>
              setReadState(event.target.value as "ALL" | "READ" | "UNREAD")
            }
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">Tous les états</option>
            <option value="UNREAD">Non lus</option>
            <option value="READ">Lus</option>
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={15} />
    </div>
  )
}
