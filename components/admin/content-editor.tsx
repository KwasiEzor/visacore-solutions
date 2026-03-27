"use client"

import { useState, useTransition, type FormEvent } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { upsertPageContent } from "@/actions/content"
import { toast } from "sonner"
import { Loader2, Plus, Trash2 } from "lucide-react"
import {
  getPageContentDefinition,
  getPageContentDraft,
} from "@/lib/page-content.shared"

interface PageContentItem {
  id: string
  pageKey: string
  sectionKey: string
  title: string | null
  subtitle: string | null
  content: unknown
  published: boolean
  order: number
}

interface ContentEditorProps {
  content: PageContentItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContentEditor({ content, open, onOpenChange }: ContentEditorProps) {
  const definition = getPageContentDefinition(content.pageKey, content.sectionKey)
  const initialDraft = definition
    ? getPageContentDraft(content.pageKey, content.sectionKey, content.content)
    : content.content
  const [title, setTitle] = useState(content.title ?? "")
  const [subtitle, setSubtitle] = useState(content.subtitle ?? "")
  const [published, setPublished] = useState(content.published)
  const [order, setOrder] = useState(content.order)
  const [fallbackJson, setFallbackJson] = useState(
    content.content ? JSON.stringify(content.content, null, 2) : ""
  )
  const [heroContent, setHeroContent] = useState(() =>
    definition?.editor === "hero"
      ? (initialDraft as {
          eyebrow: string
          primaryCta: string
          secondaryCta: string
        })
      : {
          eyebrow: "",
          primaryCta: "",
          secondaryCta: "",
        }
  )
  const [statsContent, setStatsContent] = useState(() =>
    definition?.editor === "stats"
      ? (initialDraft as { stats: Array<{ value: string; label: string }> })
      : {
          stats: [{ value: "", label: "" }],
        }
  )
  const [textContent, setTextContent] = useState(() =>
    definition?.editor === "richText"
      ? (initialDraft as { text: string })
      : { text: "" }
  )
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    let parsedContent: unknown

    if (definition?.editor === "hero") {
      parsedContent = heroContent
    } else if (definition?.editor === "stats") {
      parsedContent = statsContent
    } else if (definition?.editor === "richText") {
      parsedContent = textContent
    } else if (fallbackJson.trim()) {
      try {
        parsedContent = JSON.parse(fallbackJson)
      } catch {
        toast.error("Le contenu JSON est invalide")
        return
      }
    }

    startTransition(async () => {
      const result = await upsertPageContent({
        pageKey: content.pageKey,
        sectionKey: content.sectionKey,
        title: title || undefined,
        subtitle: subtitle || undefined,
        content: parsedContent,
        published,
        order,
      })

      if (result.success) {
        toast.success("Contenu mis à jour avec succès")
        onOpenChange(false)
      } else {
        toast.error(result.error ?? "Erreur lors de la mise à jour")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(value) => onOpenChange(value)}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Modifier le contenu</DialogTitle>
        </DialogHeader>

        <div className="mb-3 flex gap-3 text-xs">
          <span className="rounded bg-secondary px-2 py-1 font-mono text-muted-foreground">
            {content.pageKey}
          </span>
          <span className="rounded bg-secondary px-2 py-1 font-mono text-muted-foreground">
            {content.sectionKey}
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="ce-title">Titre</Label>
            <Input
              id="ce-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre de la section"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="ce-subtitle">Sous-titre</Label>
            <Input
              id="ce-subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Sous-titre"
            />
          </div>

          {definition?.editor === "hero" && (
            <div className="space-y-4 rounded-xl border p-4">
              <div className="space-y-1.5">
                <Label htmlFor="ce-eyebrow">Badge hero</Label>
                <Input
                  id="ce-eyebrow"
                  value={heroContent.eyebrow}
                  onChange={(e) =>
                    setHeroContent((current) => ({
                      ...current,
                      eyebrow: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce-primary-cta">Bouton principal</Label>
                <Input
                  id="ce-primary-cta"
                  value={heroContent.primaryCta}
                  onChange={(e) =>
                    setHeroContent((current) => ({
                      ...current,
                      primaryCta: e.target.value,
                    }))
                  }
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ce-secondary-cta">Bouton secondaire</Label>
                <Input
                  id="ce-secondary-cta"
                  value={heroContent.secondaryCta}
                  onChange={(e) =>
                    setHeroContent((current) => ({
                      ...current,
                      secondaryCta: e.target.value,
                    }))
                  }
                />
              </div>
            </div>
          )}

          {definition?.editor === "stats" && (
            <div className="space-y-3 rounded-xl border p-4">
              <div className="flex items-center justify-between">
                <Label>Indicateurs</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    setStatsContent((current) => ({
                      stats: [...current.stats, { value: "", label: "" }],
                    }))
                  }
                >
                  <Plus className="mr-1.5 size-3.5" />
                  Ajouter
                </Button>
              </div>
              <div className="space-y-3">
                {statsContent.stats.map((stat, index) => (
                  <div key={`${index}-${stat.label}`} className="grid grid-cols-[1fr_1fr_auto] gap-2">
                    <Input
                      value={stat.value}
                      onChange={(e) =>
                        setStatsContent((current) => ({
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, value: e.target.value }
                              : item
                          ),
                        }))
                      }
                      placeholder="98%"
                    />
                    <Input
                      value={stat.label}
                      onChange={(e) =>
                        setStatsContent((current) => ({
                          stats: current.stats.map((item, itemIndex) =>
                            itemIndex === index
                              ? { ...item, label: e.target.value }
                              : item
                          ),
                        }))
                      }
                      placeholder="Réussite"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setStatsContent((current) => ({
                          stats:
                            current.stats.length === 1
                              ? [{ value: "", label: "" }]
                              : current.stats.filter((_, itemIndex) => itemIndex !== index),
                        }))
                      }
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {definition?.editor === "richText" && (
            <div className="space-y-1.5">
              <Label htmlFor="ce-content-text">Texte</Label>
              <Textarea
                id="ce-content-text"
                value={textContent.text}
                onChange={(e) =>
                  setTextContent({
                    text: e.target.value,
                  })
                }
                rows={8}
              />
            </div>
          )}

          {!definition && (
            <div className="space-y-1.5">
              <Label htmlFor="ce-content">Contenu (JSON)</Label>
              <Textarea
                id="ce-content"
                value={fallbackJson}
                onChange={(e) => setFallbackJson(e.target.value)}
                placeholder='{"text": "..."}'
                rows={6}
                className="font-mono text-xs"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="ce-order">Ordre</Label>
            <Input
              id="ce-order"
              type="number"
              value={order}
              onChange={(e) => setOrder(parseInt(e.target.value) || 0)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Checkbox
              id="ce-published"
              checked={published}
              onCheckedChange={(checked) => setPublished(checked === true)}
            />
            <Label htmlFor="ce-published">Publié</Label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-1.5 size-4 animate-spin" />}
              Enregistrer
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
