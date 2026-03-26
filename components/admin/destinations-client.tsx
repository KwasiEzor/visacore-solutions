"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { PublishedBadge } from "@/components/admin/status-badge"
import { DestinationRowActions } from "@/components/admin/destination-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"

interface DestinationRow {
  id: string
  name: string
  slug: string
  published: boolean
  order: number
  updatedAt: string
}

const columns: ColumnDef<DestinationRow>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Nom <ArrowUpDown className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => <span className="font-medium">{row.getValue("name")}</span>,
  },
  {
    accessorKey: "slug",
    header: "Slug",
    cell: ({ row }) => (
      <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
        /{row.getValue("slug")}
      </code>
    ),
  },
  {
    accessorKey: "published",
    header: "Statut",
    cell: ({ row }) => <PublishedBadge published={row.getValue("published")} />,
  },
  {
    accessorKey: "order",
    header: "Ordre",
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
  },
  {
    id: "actions",
    cell: ({ row }) => <DestinationRowActions destinationId={row.original.id} />,
  },
]

export function DestinationsClient({ data }: { data: DestinationRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportToCSV(data, [
              { key: "name", label: "Nom" },
              { key: "slug", label: "Slug" },
              { key: "published", label: "Publié" },
              { key: "order", label: "Ordre" },
              { key: "updatedAt", label: "Modifié le" },
            ], "destinations")
          }
        >
          Exporter CSV
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Rechercher une destination..." />
    </div>
  )
}
