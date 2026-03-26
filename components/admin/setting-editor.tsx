"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { updateSetting } from "@/actions/settings"
import { toast } from "sonner"
import { Check, Loader2, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingEditorProps {
  settingKey: string
  value: string
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"
}

export function SettingEditor({ settingKey, value: initialValue, type }: SettingEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const [justSaved, setJustSaved] = useState(false)
  const isDirty = value !== savedValue

  function save() {
    startTransition(async () => {
      const result = await updateSetting(settingKey, value, type)
      if (result.success) {
        setSavedValue(value)
        setJustSaved(true)
        toast.success("Parametre mis a jour")
        setTimeout(() => setJustSaved(false), 2000)
      } else {
        toast.error(result.error ?? "Erreur lors de la mise a jour")
      }
    })
  }

  function reset() {
    setValue(savedValue)
  }

  if (type === "BOOLEAN") {
    return (
      <div className="flex items-center gap-3">
        <Switch
          checked={value === "true"}
          onCheckedChange={(checked) => {
            const newVal = checked ? "true" : "false"
            setValue(newVal)
            startTransition(async () => {
              const result = await updateSetting(settingKey, newVal, type)
              if (result.success) {
                setSavedValue(newVal)
                toast.success("Parametre mis a jour")
              } else {
                toast.error(result.error ?? "Erreur lors de la mise a jour")
              }
            })
          }}
          disabled={isPending}
        />
        <span className="text-sm text-muted-foreground">
          {value === "true" ? "Actif" : "Inactif"}
        </span>
        {isPending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
      </div>
    )
  }

  if (type === "JSON") {
    return (
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          className="font-mono text-xs"
          disabled={isPending}
        />
        <SaveBar
          isDirty={isDirty}
          isPending={isPending}
          justSaved={justSaved}
          onSave={save}
          onReset={reset}
        />
      </div>
    )
  }

  if (type === "IMAGE") {
    return (
      <div className="space-y-3">
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="URL de l'image"
          disabled={isPending}
        />
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={settingKey}
            className="h-16 w-auto rounded border object-contain"
          />
        )}
        <SaveBar
          isDirty={isDirty}
          isPending={isPending}
          justSaved={justSaved}
          onSave={save}
          onReset={reset}
        />
      </div>
    )
  }

  // TEXT (default)
  return (
    <div className="space-y-3">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={isPending}
      />
      <SaveBar
        isDirty={isDirty}
        isPending={isPending}
        justSaved={justSaved}
        onSave={save}
        onReset={reset}
      />
    </div>
  )
}

function SaveBar({
  isDirty,
  isPending,
  justSaved,
  onSave,
  onReset,
}: {
  isDirty: boolean
  isPending: boolean
  justSaved: boolean
  onSave: () => void
  onReset: () => void
}) {
  if (justSaved && !isDirty) {
    return (
      <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
        <Check className="size-3.5" />
        Enregistre
      </p>
    )
  }

  if (!isDirty) return null

  return (
    <div className="flex items-center gap-2">
      <Button size="sm" onClick={onSave} disabled={isPending}>
        {isPending ? (
          <Loader2 className="mr-1.5 size-3.5 animate-spin" />
        ) : (
          <Check className="mr-1.5 size-3.5" />
        )}
        Enregistrer
      </Button>
      <Button
        size="sm"
        variant="ghost"
        onClick={onReset}
        disabled={isPending}
        className={cn("text-muted-foreground")}
      >
        <RotateCcw className="mr-1.5 size-3" />
        Annuler
      </Button>
      <span className="text-xs text-amber-600">Modifications non enregistrees</span>
    </div>
  )
}
