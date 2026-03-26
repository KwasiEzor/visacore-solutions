"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { PublishedBadge } from "@/components/admin/status-badge"
import { ServiceRowActions } from "@/components/admin/service-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"

interface ServiceRow {
  id: string
  name: string
  slug: string
  icon: string
  published: boolean
  order: number
  updatedAt: string
}

const columns: ColumnDef<ServiceRow>[] = [
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
    accessorKey: "icon",
    header: "Icône",
    cell: ({ row }) => row.getValue("icon") || <span className="italic text-muted-foreground/60">Aucune</span>,
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
    cell: ({ row }) => <ServiceRowActions serviceId={row.original.id} />,
  },
]

export function ServicesClient({ data }: { data: ServiceRow[] }) {
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
              { key: "icon", label: "Icône" },
              { key: "published", label: "Publié" },
              { key: "order", label: "Ordre" },
            ], "services")
          }
        >
          Exporter CSV
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="name" searchPlaceholder="Rechercher un service..." />
    </div>
  )
}
