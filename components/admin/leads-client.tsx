"use client"

import { useState } from "react"
import Link from "next/link"
import { type ColumnDef } from "@tanstack/react-table"
import { Eye, Search } from "lucide-react"
import { DataTable } from "@/components/admin/data-table"
import { StatusBadge } from "@/components/admin/status-badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  filterLeadRows,
  type LeadTableRow,
} from "@/lib/admin-ux.shared"

const columns: ColumnDef<LeadTableRow>[] = [
  {
    accessorKey: "fullName",
    header: "Nom",
    cell: ({ row }) => (
      <Link
        href={`/admin/leads/${row.original.id}`}
        className="font-medium hover:underline"
      >
        {row.original.fullName}
      </Link>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "assignedToName",
    header: "Assigné à",
    cell: ({ row }) =>
      row.original.assignedToName ?? (
        <span className="italic text-muted-foreground/60">Non assigné</span>
      ),
  },
  {
    accessorKey: "createdAtLabel",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => (
      <Link href={`/admin/leads/${row.original.id}`}>
        <Button variant="ghost" size="icon-sm" aria-label="Voir le détail">
          <Eye className="size-4" />
        </Button>
      </Link>
    ),
  },
]

export function LeadsClient({ data }: { data: LeadTableRow[] }) {
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState("ALL")

  const filteredData = filterLeadRows(data, { query, status })

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher un lead..."
            className="pl-9"
          />
        </div>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="ALL">Tous les statuts</option>
          <option value="NEW">Nouveau</option>
          <option value="CONTACTED">Contacté</option>
          <option value="QUALIFIED">Qualifié</option>
          <option value="IN_PROGRESS">En cours</option>
          <option value="CONVERTED">Converti</option>
          <option value="CLOSED">Fermé</option>
        </select>
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={15} />
    </div>
  )
}
