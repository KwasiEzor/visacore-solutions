"use client"

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
import { RotateCcw, Trash2 } from "lucide-react"

interface SettingEditorProps {
  value: string
  type: "TEXT" | "IMAGE" | "JSON" | "BOOLEAN"
  placeholder?: string
  inputType?: "text" | "email" | "tel" | "url" | "number" | "password"
  control?: "input" | "textarea" | "select"
  rows?: number
  options?: readonly { value: string; label: string }[]
  secret?: boolean
  secretConfigured?: boolean
  secretMarkedForRemoval?: boolean
  disabled?: boolean
  onChange: (value: string) => void
  onToggleSecretRemoval?: () => void
}

export function SettingEditor({
  value,
  type,
  placeholder,
  inputType = "text",
  control = "input",
  rows = 4,
  options,
  secret = false,
  secretConfigured = false,
  secretMarkedForRemoval = false,
  disabled = false,
  onChange,
  onToggleSecretRemoval,
}: SettingEditorProps) {
  if (type === "BOOLEAN") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) => {
              onChange(checked ? "true" : "false")
            }}
            disabled={disabled}
          />
          <span className="text-sm text-muted-foreground">
            {value === "true" ? "Actif" : "Inactif"}
          </span>
        </div>
      </div>
    )
  }

  if (type === "JSON") {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        className="font-mono text-xs"
        disabled={disabled}
      />
    )
  }

  if (type === "IMAGE") {
    return (
      <div className="space-y-3">
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="URL de l'image"
          disabled={disabled}
        />
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={value}
            alt={placeholder ?? "Apercu"}
            className="h-16 w-auto rounded border object-contain"
          />
        ) : null}
      </div>
    )
  }

  if (secret) {
    const hasPendingReplacement = value.trim().length > 0 && !secretMarkedForRemoval

    return (
      <div className="space-y-3">
        <Input
          type="password"
          value={secretMarkedForRemoval ? "" : value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || secretMarkedForRemoval}
          placeholder={
            secretConfigured
              ? "Entrez une nouvelle cle pour remplacer l'existante"
              : placeholder
          }
        />
        <p className="text-xs text-muted-foreground">
          {secretMarkedForRemoval
            ? "Cette cle sera effacee quand vous enregistrerez la section."
            : hasPendingReplacement
              ? "Une nouvelle cle est prete a etre enregistree avec cette section."
              : secretConfigured
                ? "Une cle chiffree est deja enregistree dans le dashboard."
                : "Aucune cle chiffree enregistree dans le dashboard."}
        </p>
        {onToggleSecretRemoval && secretConfigured ? (
          <div className="flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={onToggleSecretRemoval}
              disabled={disabled}
              className="text-muted-foreground"
            >
              {secretMarkedForRemoval ? (
                <RotateCcw className="mr-1.5 size-3.5" />
              ) : (
                <Trash2 className="mr-1.5 size-3.5" />
              )}
              {secretMarkedForRemoval ? "Conserver la cle" : "Effacer la cle"}
            </Button>
          </div>
        ) : null}
      </div>
    )
  }

  if (control === "textarea") {
    return (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        rows={rows}
      />
    )
  }

  if (control === "select" && options) {
    return (
      <Select value={value} onValueChange={(nextValue) => onChange(nextValue ?? "")}>
        <SelectTrigger className="w-full" disabled={disabled}>
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
    )
  }

  return (
    <Input
      type={inputType}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      placeholder={placeholder}
    />
  )
}
