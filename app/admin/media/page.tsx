import { prisma } from "@/lib/prisma"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageIcon } from "lucide-react"

export default async function MediaAdminPage() {
  const media = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    include: { uploadedBy: { select: { name: true } } },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Médiathèque</h1>
      </div>

      {media.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {media.map((m) => (
            <Card key={m.id} className="overflow-hidden">
              <div className="flex h-40 items-center justify-center bg-secondary/50">
                {m.mimeType.startsWith("image/") ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.url} alt={m.alt ?? m.filename} className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="size-10 text-muted-foreground/50" />
                )}
              </div>
              <CardContent className="p-3">
                <p className="truncate text-sm font-medium">{m.filename}</p>
                <p className="text-xs text-muted-foreground">
                  {(m.size / 1024).toFixed(1)} KB
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Médiathèque</CardTitle>
          </CardHeader>
          <CardContent className="py-12 text-center">
            <ImageIcon className="mx-auto size-12 text-muted-foreground/30" />
            <p className="mt-4 text-muted-foreground">
              Aucun média téléchargé pour le moment.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
