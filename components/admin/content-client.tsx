"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PublishedBadge } from "@/components/admin/status-badge"
import { ContentEditor } from "@/components/admin/content-editor"
import { Pencil, Route, TriangleAlert } from "lucide-react"

interface PageContentItem {
  id: string
  pageKey: string
  sectionKey: string
  pageLabel: string
  sectionLabel: string
  route: string
  component: string
  description: string
  title: string | null
  subtitle: string | null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any
  published: boolean
  order: number
  existsInDatabase: boolean
}

interface UnsupportedPageContentItem {
  id: string
  pageKey: string
  sectionKey: string
  title: string | null
}

interface ContentClientProps {
  data: PageContentItem[]
  unsupportedSections: UnsupportedPageContentItem[]
}

export function ContentClient({ data, unsupportedSections }: ContentClientProps) {
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
            <CardTitle>{sections[0]?.pageLabel ?? pageKey}</CardTitle>
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
                      {!section.existsInDatabase && (
                        <span className="rounded bg-amber-100 px-1.5 py-0.5 text-xs font-medium text-amber-700">
                          Fallback actif
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 font-semibold">{section.sectionLabel}</p>
                    <p className="text-sm text-muted-foreground">
                      {section.description}
                    </p>
                    <p className="mt-2 text-sm font-medium">
                      {section.title ?? "Sans titre"}
                    </p>
                    {section.subtitle && (
                      <p className="text-sm text-muted-foreground">
                        {section.subtitle}
                      </p>
                    )}
                    <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Route className="size-3" />
                        {section.route}
                      </span>
                      <span className="font-mono">{section.component}</span>
                    </div>
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

      {unsupportedSections.length > 0 && (
        <Card className="border-amber-200 bg-amber-50/40">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-900">
              <TriangleAlert className="size-4" />
              Sections non prises en charge
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-amber-900">
            <p>
              Ces entrées existent en base mais ne sont reliées à aucun composant
              public. Elles ne sont donc pas éditables depuis l&apos;interface.
            </p>
            {unsupportedSections.map((section) => (
              <div
                key={section.id}
                className="rounded-lg border border-amber-200 bg-white/70 px-3 py-2 font-mono text-xs"
              >
                {section.pageKey}.{section.sectionKey}
                {section.title ? ` — ${section.title}` : ""}
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {data.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            Aucun contenu de page configure.
          </CardContent>
        </Card>
      )}

      {editingItem && (
        <ContentEditor
          key={editingItem.id}
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
