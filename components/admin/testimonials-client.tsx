"use client"

import { type ColumnDef } from "@tanstack/react-table"
import { DataTable } from "@/components/admin/data-table"
import { PublishedBadge } from "@/components/admin/status-badge"
import { TestimonialRowActions } from "@/components/admin/testimonial-actions"
import { Button } from "@/components/ui/button"
import { ArrowUpDown, Star } from "lucide-react"
import { exportToCSV } from "@/lib/export-csv"

interface TestimonialRow {
  id: string
  clientName: string
  destination: string
  rating: number
  featured: boolean
  published: boolean
  updatedAt: string
}

const columns: ColumnDef<TestimonialRow>[] = [
  {
    accessorKey: "clientName",
    header: ({ column }) => (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Client <ArrowUpDown className="ml-1 size-3" />
      </Button>
    ),
    cell: ({ row }) => (
      <span className="font-medium">{row.getValue("clientName")}</span>
    ),
  },
  {
    accessorKey: "destination",
    header: "Destination",
    cell: ({ row }) => row.getValue("destination") || <span className="italic text-muted-foreground/60">--</span>,
  },
  {
    accessorKey: "rating",
    header: "Note",
    cell: ({ row }) => {
      const rating = row.getValue("rating") as number
      return (
        <div className="flex gap-0.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`size-3.5 ${
                i < rating
                  ? "fill-[#C9A227] text-[#C9A227]"
                  : "text-gray-200"
              }`}
            />
          ))}
        </div>
      )
    },
  },
  {
    accessorKey: "featured",
    header: "Vedette",
    cell: ({ row }) => (
      <PublishedBadge published={row.getValue("featured")} />
    ),
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
    cell: ({ row }) => (
      <TestimonialRowActions testimonialId={row.original.id} />
    ),
  },
]

export function TestimonialsClient({ data }: { data: TestimonialRow[] }) {
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
                { key: "clientName", label: "Client" },
                { key: "destination", label: "Destination" },
                { key: "rating", label: "Note" },
                { key: "featured", label: "Vedette" },
                { key: "published", label: "Publié" },
                { key: "updatedAt", label: "Modifié le" },
              ],
              "temoignages"
            )
          }
        >
          Exporter CSV
        </Button>
      </div>
      <DataTable
        columns={columns}
        data={data}
        searchKey="clientName"
        searchPlaceholder="Rechercher un témoignage..."
      />
    </div>
  )
}
