"use client"

import { Plus, Trash2 } from "lucide-react"
import type { StructuredCardItem } from "@/lib/content-structures"
import { createEmptyStructuredCardItem } from "@/lib/structured-content-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface StructuredCardItemsEditorProps {
  title: string
  hint: string
  items: StructuredCardItem[]
  onChange: (items: StructuredCardItem[]) => void
  titlePlaceholder: string
  descriptionPlaceholder: string
}

export function StructuredCardItemsEditor({
  title,
  hint,
  items,
  onChange,
  titlePlaceholder,
  descriptionPlaceholder,
}: StructuredCardItemsEditorProps) {
  function updateItem(index: number, patch: Partial<StructuredCardItem>) {
    onChange(
      items.map((item, itemIndex) =>
        itemIndex === index ? { ...item, ...patch } : item
      )
    )
  }

  function addItem() {
    onChange([...items, createEmptyStructuredCardItem()])
  }

  function removeItem(index: number) {
    if (items.length === 1) {
      onChange([createEmptyStructuredCardItem()])
      return
    }

    onChange(items.filter((_, itemIndex) => itemIndex !== index))
  }

  return (
    <div className="space-y-3 rounded-xl border p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Label>{title}</Label>
          <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
        </div>
        <Button type="button" size="sm" variant="outline" onClick={addItem}>
          <Plus className="mr-1.5 size-3.5" />
          Ajouter
        </Button>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={`${title}-${index}`} className="rounded-lg border p-4">
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

            <div className="space-y-3">
              <Input
                value={item.title}
                onChange={(e) => updateItem(index, { title: e.target.value })}
                placeholder={titlePlaceholder}
              />
              <Textarea
                rows={3}
                value={item.description}
                onChange={(e) =>
                  updateItem(index, { description: e.target.value })
                }
                placeholder={descriptionPlaceholder}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
