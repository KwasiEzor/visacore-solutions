"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { updateSetting } from "@/actions/settings"
import { toast } from "sonner"
import { Check, Loader2, RotateCcw, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingEditorProps {
  settingKey: string
  value: string
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"
  placeholder?: string
  inputType?: "text" | "email" | "tel" | "url" | "number" | "password"
  control?: "input" | "textarea" | "select"
  rows?: number
  options?: readonly { value: string; label: string }[]
  secret?: boolean
  secretConfigured?: boolean
}

export function SettingEditor({
  settingKey,
  value: initialValue,
  type,
  placeholder,
  inputType = "text",
  control = "input",
  rows = 4,
  options,
  secret = false,
  secretConfigured = false,
}: SettingEditorProps) {
  const router = useRouter()
  const [value, setValue] = useState(initialValue)
  const [savedValue, setSavedValue] = useState(initialValue)
  const [isPending, startTransition] = useTransition()
  const [justSaved, setJustSaved] = useState(false)
  const [isSecretConfigured, setIsSecretConfigured] = useState(secretConfigured)
  const isDirty = value !== savedValue

  function updateDraft(nextValue: string) {
    setValue(nextValue)
    if (justSaved) {
      setJustSaved(false)
    }
  }

  function save() {
    startTransition(async () => {
      const result = await updateSetting(settingKey, value, type)
      if (result.success) {
        if (secret) {
          setValue("")
          setSavedValue("")
          setIsSecretConfigured(value.trim().length > 0)
        } else {
          setSavedValue(value)
        }
        setJustSaved(true)
        toast.success("Parametre mis a jour")
        router.refresh()
        setTimeout(() => setJustSaved(false), 2000)
      } else {
        toast.error(result.error ?? "Erreur lors de la mise a jour")
      }
    })
  }

  function reset() {
    setValue(savedValue)
  }

  function clearSecret() {
    startTransition(async () => {
      const result = await updateSetting(settingKey, "", type)
      if (result.success) {
        setValue("")
        setSavedValue("")
        setIsSecretConfigured(false)
        toast.success("Secret supprime")
        router.refresh()
      } else {
        toast.error(result.error ?? "Erreur lors de la mise a jour")
      }
    })
  }

  if (type === "BOOLEAN") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => {
              updateDraft(checked ? "true" : "false")
            }}
            disabled={isPending}
          />
          <span className="text-sm text-muted-foreground">
            {value === "true" ? "Actif" : "Inactif"}
          </span>
          {savedValue !== value ? (
            <span className="text-xs text-amber-600">
              Changement en attente d&apos;enregistrement
            </span>
          ) : null}
        </div>
        <SaveBar
          isDirty={isDirty}
          isPending={isPending}
          justSaved={justSaved}
          onSave={save}
          onReset={reset}
        />
        {!isDirty ? (
          <p className="text-xs text-muted-foreground">
            Utilisez les boutons ci-dessous pour enregistrer ou annuler une
            modification.
          </p>
        ) : null}
      </div>
    )
  }

  if (type === "JSON") {
    return (
      <div className="space-y-3">
        <Textarea
          value={value}
          onChange={(e) => updateDraft(e.target.value)}
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
          onChange={(e) => updateDraft(e.target.value)}
          placeholder="URL de l'image"
          disabled={isPending}
        />
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={settingKey}
            className="h-16 w-auto rounded border object-contain"
          />
        ) : null}
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

  if (secret) {
    return (
      <div className="space-y-3">
        <Input
          type="password"
          value={value}
          onChange={(e) => updateDraft(e.target.value)}
          disabled={isPending}
          placeholder={
            isSecretConfigured
              ? "Entrez une nouvelle cle pour remplacer l'existante"
              : placeholder
          }
        />
        <p className="text-xs text-muted-foreground">
          {isSecretConfigured
            ? "Une cle chiffree est deja enregistree dans le dashboard."
            : "Aucune cle chiffree enregistree dans le dashboard."}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            onClick={save}
            disabled={isPending || value.trim().length === 0}
          >
            {isPending ? (
              <Loader2 className="mr-1.5 size-3.5 animate-spin" />
            ) : (
              <Check className="mr-1.5 size-3.5" />
            )}
            {isSecretConfigured ? "Remplacer" : "Enregistrer"}
          </Button>
          {isSecretConfigured ? (
            <Button
              size="sm"
              variant="ghost"
              onClick={clearSecret}
              disabled={isPending}
              className="text-muted-foreground"
            >
              <Trash2 className="mr-1.5 size-3.5" />
              Effacer
            </Button>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {control === "textarea" ? (
        <Textarea
          value={value}
          onChange={(e) => updateDraft(e.target.value)}
          disabled={isPending}
          placeholder={placeholder}
          rows={rows}
        />
      ) : control === "select" && options ? (
        <Select
          value={value}
          onValueChange={(nextValue) => updateDraft(nextValue ?? "")}
        >
          <SelectTrigger className="w-full" disabled={isPending}>
            <SelectValue placeholder={placeholder ?? "Selectionner"} />
          </SelectTrigger>
          <SelectContent align="start">
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      ) : (
        <Input
          type={inputType}
          value={value}
          onChange={(e) => updateDraft(e.target.value)}
          disabled={isPending}
          placeholder={placeholder}
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
      <span className="text-xs text-amber-600">
        Modifications non enregistrees
      </span>
    </div>
  )
}
