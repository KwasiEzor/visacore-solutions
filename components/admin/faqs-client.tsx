"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { PublishedBadge } from "@/components/admin/status-badge"
import { FAQRowActions } from "@/components/admin/faq-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"

interface FAQRow {
  id: string
  question: string
  category: string
  published: boolean
  order: number
  updatedAt: string
}

const columns: ColumnDef<FAQRow>[] = [
  {
    accessorKey: "question",
    header: ({ column }) => (
      <Button variant="ghost" size="sm" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        Question <ArrowUpDown className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="max-w-md truncate font-medium">{row.getValue("question")}</span>
    ),
  },
  {
    accessorKey: "category",
    header: "Catégorie",
    cell: ({ row }) => (
      <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
        {row.getValue("category")}
      </span>
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
    cell: ({ row }) => <FAQRowActions faqId={row.original.id} />,
  },
]

export function FAQsClient({ data }: { data: FAQRow[] }) {
  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            exportToCSV(data, [
              { key: "question", label: "Question" },
              { key: "category", label: "Catégorie" },
              { key: "published", label: "Publié" },
              { key: "order", label: "Ordre" },
            ], "faqs")
          }
        >
          Exporter CSV
        </Button>
      </div>
      <DataTable columns={columns} data={data} searchKey="question" searchPlaceholder="Rechercher une FAQ..." />
    </div>
  )
}
