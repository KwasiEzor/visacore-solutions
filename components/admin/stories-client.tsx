"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { PublishedBadge } from "@/components/admin/status-badge"
import { StoryRowActions } from "@/components/admin/story-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"

interface StoryRow {
  id: string
  title: string
  clientName: string
  destination: string
  published: boolean
  updatedAt: string
}

const columns: ColumnDef<StoryRow>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Titre <ArrowUpDown className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("title")}</span>
    ),
  },
  {
    accessorKey: "clientName",
    header: "Client",
  },
  {
    accessorKey: "destination",
    header: "Destination",
  },
  {
    accessorKey: "published",
    header: "Statut",
    cell: ({ row }) => (
      <PublishedBadge published={row.getValue("published")} />
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Modifié le",
  },
  {
    id: "actions",
    cell: ({ row }) => <StoryRowActions storyId={row.original.id} />,
  },
]

export function StoriesClient({ data }: { data: StoryRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportToCSV(
              data,
              [
                { key: "title", label: "Titre" },
                { key: "clientName", label: "Client" },
                { key: "destination", label: "Destination" },
                { key: "published", label: "Publié" },
                { key: "updatedAt", label: "Modifié le" },
              ],
              "success-stories"
            )
          }
        >
          Exporter CSV
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="title"
        searchPlaceholder="Rechercher une story..."
      />
    </div>
  )
}
