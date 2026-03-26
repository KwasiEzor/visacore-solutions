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
import { Loader2 } from "lucide-react"

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

interface ContentEditorProps {
  content: PageContentItem
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ContentEditor({ content, open, onOpenChange }: ContentEditorProps) {
  const [title, setTitle] = useState(content.title ?? "")
  const [subtitle, setSubtitle] = useState(content.subtitle ?? "")
  const [contentJson, setContentJson] = useState(content.content ?? "")
  const [published, setPublished] = useState(content.published)
  const [order, setOrder] = useState(content.order)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: FormEvent) {
    e.preventDefault()

    let parsedContent: unknown = undefined
    if (contentJson.trim()) {
      try {
        parsedContent = JSON.parse(contentJson)
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

          <div className="space-y-1.5">
            <Label htmlFor="ce-content">Contenu (JSON)</Label>
            <Textarea
              id="ce-content"
              value={contentJson}
              onChange={(e) => setContentJson(e.target.value)}
              placeholder='{"text": "..."}'
              rows={5}
              className="font-mono text-xs"
            />
          </div>

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
