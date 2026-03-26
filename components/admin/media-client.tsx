"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, Trash2, Loader2 } from "lucide-react"
import { MediaUpload } from "@/components/admin/media-upload"
import { deleteMedia } from "@/actions/media"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface MediaItem {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  createdAt: string
}

interface MediaClientProps {
  data: MediaItem[]
}

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

export function MediaClient({ data }: MediaClientProps) {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function handleDelete(id: string) {
    if (!confirm("Supprimer ce media ? Cette action est irreversible.")) return

    setDeletingId(id)
    try {
      const result = await deleteMedia(id)
      if (!result.success) {
        alert(result.error || "Erreur lors de la suppression")
      }
      router.refresh()
    } catch {
      alert("Erreur lors de la suppression")
    } finally {
      setDeletingId(null)
    }
  }

  function handleUploadComplete() {
    router.refresh()
  }

  return (
    <div className="space-y-6">
      <MediaUpload onUploadComplete={handleUploadComplete} />

      {data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data.map((item) => (
            <div
              key={item.id}
              className="group relative overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Thumbnail */}
              <div className="flex h-40 items-center justify-center bg-secondary/50">
                {item.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={item.url}
                    alt={item.filename}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FileText className="size-10 text-muted-foreground/50" />
                )}
              </div>

              {/* Info */}
              <div className="p-3">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.filename}
                </p>
                <div className="mt-1 flex items-center justify-between">
                  <p className="text-xs text-muted-foreground">
                    {formatSize(item.size)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {item.createdAt}
                  </p>
                </div>
              </div>

              {/* Delete button overlay */}
              <div
                className={cn(
                  "absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100",
                  deletingId === item.id && "opacity-100"
                )}
              >
                <Button
                  variant="destructive"
                  size="icon-sm"
                  onClick={() => handleDelete(item.id)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rounded-xl border border-border bg-card p-12 text-center">
          <FileText className="mx-auto size-12 text-muted-foreground/30" />
          <p className="mt-4 text-muted-foreground">
            Aucun media telecharge pour le moment.
          </p>
        </div>
      )}
    </div>
  )
}
