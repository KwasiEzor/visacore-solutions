"use client"

import { useMemo, useState } from "react"
import { type ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { DataTable } from "@/components/admin/data-table/data-table"
import { PrivacyRequestActions } from "@/components/admin/privacy-request-actions"
import { StatusBadge } from "@/components/admin/status-badge"
import { Input } from "@/components/ui/input"
import {
  dataPrivacyRequestStatusLabels,
  dataPrivacyRequestTypeLabels,
} from "@/lib/privacy-requests.shared"
import {
  filterPrivacyRequestRows,
  type PrivacyRequestTableRow,
} from "@/lib/admin-ux.shared"

const columns: ColumnDef<PrivacyRequestTableRow>[] = [
  {
    accessorKey: "fullName",
    header: "Demandeur",
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-foreground">{row.original.fullName}</p>
        <p className="text-xs text-muted-foreground">{row.original.email}</p>
        {row.original.phone ? (
          <p className="text-xs text-muted-foreground">{row.original.phone}</p>
        ) : null}
      </div>
    ),
  },
  {
    accessorKey: "requestType",
    header: "Type",
    cell: ({ row }) => (
      <StatusBadge
        status={dataPrivacyRequestTypeLabels[
          row.original.requestType as keyof typeof dataPrivacyRequestTypeLabels
        ] ?? row.original.requestType}
        variant="blue"
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Statut",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "createdAtLabel",
    header: "Date",
  },
  {
    accessorKey: "resolutionNotes",
    header: "Notes",
    cell: ({ row }) => (
      <p className="max-w-sm whitespace-pre-wrap text-xs text-muted-foreground">
        {row.original.resolutionNotes || "Aucune note interne"}
      </p>
    ),
  },
  {
    id: "actions",
    header: "Traitement",
    cell: ({ row }) => (
      <div className="min-w-[280px]">
        <PrivacyRequestActions
          requestId={row.original.id}
          requestType={row.original.requestType}
          currentStatus={row.original.status}
          currentNotes={row.original.resolutionNotes}
        />
      </div>
    ),
  },
]

export function PrivacyRequestsClient({
  data,
}: {
  data: PrivacyRequestTableRow[]
}) {
  const [query, setQuery] = useState("")
  const [requestType, setRequestType] = useState("ALL")
  const [status, setStatus] = useState("ALL")

  const filteredData = useMemo(
    () =>
      filterPrivacyRequestRows(data, {
        query,
        requestType,
        status,
      }),
    [data, query, requestType, status]
  )

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="relative w-full xl:max-w-sm">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Rechercher une demande RGPD..."
            className="pl-9"
          />
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <select
            value={requestType}
            onChange={(event) => setRequestType(event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">Tous les types</option>
            {Object.entries(dataPrivacyRequestTypeLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>

          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="ALL">Tous les statuts</option>
            {Object.entries(dataPrivacyRequestStatusLabels).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      <DataTable columns={columns} data={filteredData} pageSize={10} />
    </div>
  )
}
