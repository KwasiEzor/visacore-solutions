import { prisma } from "@/lib/prisma"
import { MediaClient } from "@/components/admin/media-client"

export default async function MediaAdminPage() {
  const media = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
  })

  const serialized = media.map((m) => ({
    id: m.id,
    filename: m.filename,
    url: m.url,
    mimeType: m.mimeType,
    size: m.size,
    createdAt: m.createdAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Medias</h1>
          <p className="text-sm text-muted-foreground">
            {media.length} fichier{media.length !== 1 ? "s" : ""} telecharge
            {media.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      <MediaClient data={serialized} />
    </div>
  )
}
