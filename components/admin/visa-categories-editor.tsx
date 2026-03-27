"use client"

import { Plus, Trash2 } from "lucide-react"
import type { VisaCategoryItem } from "@/lib/content-structures"
import { createEmptyVisaCategoryItem } from "@/lib/structured-content-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface VisaCategoriesEditorProps {
  items: VisaCategoryItem[]
  onChange: (items: VisaCategoryItem[]) => void
}

export function VisaCategoriesEditor({
  items,
  onChange,
}: VisaCategoriesEditorProps) {
  function updateItem(index: number, patch: Partial<VisaCategoryItem>) {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  function addItem() {
    onChange([...items, createEmptyVisaCategoryItem()])
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      onChange([createEmptyVisaCategoryItem()])
      return
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>Catégories de visa</Label>
          <p className="mt-1 text-xs text-muted-foreground">
            Ajoutez les catégories publiées sur la page destination.
          </p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <Plus className="mr-1.5 size-3.5" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`visa-category-${index}`} className="rounded-lg border p-4">
            <div className="mb-3 flex items-center justify-between gap-4">
              <p className="text-sm font-medium text-foreground">
                Ligne {index + 1}
              </p>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeItem(index)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Input
                value={item.name}
                onChange={(e) => updateItem(index, { name: e.target.value })}
                placeholder="Ex: Permis d'études"
              />
              <Input
                value={item.duration ?? ""}
                onChange={(e) =>
                  updateItem(index, { duration: e.target.value || undefined })
                }
                placeholder="Ex: 2 à 4 ans"
              />
            </div>

            <Textarea
              rows={3}
              className="mt-3"
              value={item.description}
              onChange={(e) =>
                updateItem(index, { description: e.target.value })
              }
              placeholder="Décrivez cette catégorie de visa..."
            />
          </div>
        ))}
      </div>
    </div>
  )
}
