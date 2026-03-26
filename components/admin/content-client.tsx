"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PublishedBadge } from "@/components/admin/status-badge"
import { ContentEditor } from "@/components/admin/content-editor"
import { Pencil } from "lucide-react"

interface PageContentItem {
  id: string
  pageKey: string
  sectionKey: string
  title: string | null
  subtitle: string | null
  content: string | null
  published: boolean
  order: number
}

interface ContentClientProps {
  data: PageContentItem[]
}

const pageLabels: Record<string, string> = {
  home: "Page d'accueil",
  about: "A propos",
  services: "Services",
  destinations: "Destinations",
  contact: "Contact",
}

export function ContentClient({ data }: ContentClientProps) {
  const [editingItem, setEditingItem] = useState<PageContentItem | null>(null)

  const grouped = data.reduce<Record<string, PageContentItem[]>>((acc, item) => {
    if (!acc[item.pageKey]) acc[item.pageKey] = []
    acc[item.pageKey].push(item)
    return acc
  }, {})

  return (
    <>
      {Object.entries(grouped).map(([pageKey, sections]) => (
        <Card key={pageKey}>
          <CardHeader>
            <CardTitle>{pageLabels[pageKey] ?? pageKey}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sections.map((section) => (
                <div
                  key={section.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded bg-secondary px-1.5 py-0.5 font-mono text-xs text-muted-foreground">
                        {section.sectionKey}
                      </span>
                      <PublishedBadge published={section.published} />
                    </div>
                    <p className="mt-1.5 font-semibold">
                      {section.title ?? "Sans titre"}
                    </p>
                    {section.subtitle && (
                      <p className="text-sm text-muted-foreground">
                        {section.subtitle}
                      </p>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingItem(section)}
                  >
                    <Pencil className="mr-1.5 size-3.5" />
                    Modifier
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      {data.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun contenu de page configure.
          </CardContent>
        </Card>
      )}

      {editingItem && (
        <ContentEditor
          content={editingItem}
          open={!!editingItem}
          onOpenChange={(open) => {
            if (!open) setEditingItem(null)
          }}
        />
      )}
    </>
  )
}
