"use client"

import { useState, useTransition } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { updateSetting } from "@/actions/settings"
import { toast } from "sonner"
import { Check, Loader2 } from "lucide-react"

interface SettingEditorProps {
  settingKey: string
  value: string
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"
}

export function SettingEditor({ settingKey, value: initialValue, type }: SettingEditorProps) {
  const [value, setValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const isDirty = value !== initialValue

  function save() {
    startTransition(async () => {
      const result = await updateSetting(settingKey, value, type)
      if (result.success) {
        toast.success(`Parametre "${settingKey}" mis a jour`)
      } else {
        toast.error(result.error ?? "Erreur lors de la mise a jour")
      }
    })
  }

  if (type === "BOOLEAN") {
    return (
      <div className="flex items-center gap-2">
        <Switch
          checked={value === "true"}
          onCheckedChange={(checked) => {
            const newVal = checked ? "true" : "false"
            setValue(newVal)
            startTransition(async () => {
              const result = await updateSetting(settingKey, newVal, type)
              if (result.success) {
                toast.success(`Parametre "${settingKey}" mis a jour`)
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
      <div className="space-y-2">
        <Textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => {
            if (isDirty) save()
          }}
          rows={4}
          className="font-mono text-xs"
          disabled={isPending}
        />
        {isDirty && (
          <Button size="sm" onClick={save} disabled={isPending}>
            {isPending ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Check className="mr-1.5 size-3.5" />
            )}
            Enregistrer
          </Button>
        )}
      </div>
    )
  }

  if (type === "IMAGE") {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={() => {
              if (isDirty) save()
            }}
            placeholder="URL de l'image"
            disabled={isPending}
            className="flex-1"
          />
          {isDirty && (
            <Button size="sm" onClick={save} disabled={isPending}>
              {isPending ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Check className="size-3.5" />
              )}
            </Button>
          )}
        </div>
        {value && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={settingKey}
            className="h-16 w-auto rounded border object-contain"
          />
        )}
      </div>
    )
  }

  // TEXT (default)
  return (
    <div className="flex items-center gap-2">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={() => {
          if (isDirty) save()
        }}
        disabled={isPending}
        className="flex-1"
      />
      {isDirty && (
        <Button size="sm" onClick={save} disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Check className="size-3.5" />
          )}
        </Button>
      )}
      {isPending && !isDirty && (
        <Loader2 className="size-3.5 animate-spin text-muted-foreground" />
      )}
    </div>
  )
}
