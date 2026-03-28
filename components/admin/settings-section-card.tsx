"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { SettingEditor } from "@/components/admin/setting-editor"
import { updateSettingsSection } from "@/actions/settings"
import {
  DEFAULT_AI_MODEL_BY_PROVIDER,
  getAiModelOptions,
  isAiProviderId,
  isValidAiModelForProvider,
} from "@/lib/ai-settings.shared"
import type { SiteSettingCatalogEntry, SiteSettingSectionId } from "@/lib/site-config"
import { Check, Loader2, RotateCcw } from "lucide-react"
import { toast } from "sonner"

type SectionSetting = SiteSettingCatalogEntry & {
  id: string
  value: string
  secretConfigured: boolean
}

interface SectionDraftEntry {
  value: string
  secretConfigured: boolean
  secretMarkedForRemoval: boolean
}

interface SettingsSectionCardProps {
  id: SiteSettingSectionId
  title: string
  description: string
  settings: SectionSetting[]
}

function buildInitialDraft(settings: SectionSetting[]) {
  return Object.fromEntries(
    settings.map((setting) => [
      setting.key,
      {
        value: setting.value,
        secretConfigured: setting.secretConfigured,
        secretMarkedForRemoval: false,
      } satisfies SectionDraftEntry,
    ])
  ) as Record<string, SectionDraftEntry>
}

export function SettingsSectionCard({
  id,
  title,
  description,
  settings,
}: SettingsSectionCardProps) {
  const router = useRouter()
  const [baseline, setBaseline] = useState(() => buildInitialDraft(settings))
  const [drafts, setDrafts] = useState(() => buildInitialDraft(settings))
  const [isPending, startTransition] = useTransition()
  const [justSaved, setJustSaved] = useState(false)

  const providerDraft = drafts.ai_provider?.value
  const currentAiProvider = isAiProviderId(providerDraft) ? providerDraft : "anthropic"

  function updateDraftValue(settingKey: string, nextValue: string) {
    setDrafts((currentDrafts) => {
      const nextDrafts = {
        ...currentDrafts,
        [settingKey]: {
          ...currentDrafts[settingKey],
          value: nextValue,
          secretMarkedForRemoval: false,
        },
      }

      if (settingKey === "ai_provider" && isAiProviderId(nextValue) && nextDrafts.ai_model) {
        const currentModel = nextDrafts.ai_model.value
        if (!isValidAiModelForProvider(nextValue, currentModel)) {
          nextDrafts.ai_model = {
            ...nextDrafts.ai_model,
            value: DEFAULT_AI_MODEL_BY_PROVIDER[nextValue],
          }
        }
      }

      return nextDrafts
    })

    if (justSaved) {
      setJustSaved(false)
    }
  }

  function toggleSecretRemoval(settingKey: string) {
    setDrafts((currentDrafts) => {
      const current = currentDrafts[settingKey]
      return {
        ...currentDrafts,
        [settingKey]: {
          ...current,
          value: current.secretMarkedForRemoval ? current.value : "",
          secretMarkedForRemoval: !current.secretMarkedForRemoval,
        },
      }
    })

    if (justSaved) {
      setJustSaved(false)
    }
  }

  function isSettingDirty(setting: SectionSetting) {
    const draft = drafts[setting.key]
    const saved = baseline[setting.key]

    if (setting.secret) {
      return (
        draft.secretMarkedForRemoval !== saved.secretMarkedForRemoval ||
        draft.secretConfigured !== saved.secretConfigured ||
        draft.value.trim().length > 0
      )
    }

    return draft.value !== saved.value
  }

  const dirtyCount = settings.filter((setting) => isSettingDirty(setting)).length

  function resetSection() {
    setDrafts(baseline)
    setJustSaved(false)
  }

  function saveSection() {
    const payload = settings.map((setting) => {
      const draft = drafts[setting.key]

      if (setting.secret) {
        return {
          key: setting.key,
          type: setting.type,
          value: draft.value,
          secretAction: draft.secretMarkedForRemoval
            ? ("clear" as const)
            : draft.value.trim().length > 0
              ? ("replace" as const)
              : ("keep" as const),
        }
      }

      return {
        key: setting.key,
        type: setting.type,
        value: draft.value,
      }
    })

    startTransition(async () => {
      const result = await updateSettingsSection(payload)
      const resolvedAiModel =
        result.success && "resolvedAiModel" in result ? result.resolvedAiModel : undefined

      if (!result.success) {
        toast.error(result.error ?? "Erreur lors de la mise a jour")
        return
      }

      const nextBaseline = Object.fromEntries(
        settings.map((setting) => {
          const draft = drafts[setting.key]

          if (setting.secret) {
            const willBeConfigured = draft.secretMarkedForRemoval
              ? false
              : draft.value.trim().length > 0
                ? true
                : draft.secretConfigured

            return [
              setting.key,
              {
                value: "",
                secretConfigured: willBeConfigured,
                secretMarkedForRemoval: false,
              } satisfies SectionDraftEntry,
            ]
          }

          if (setting.key === "ai_model" && typeof resolvedAiModel === "string") {
            return [
              setting.key,
              {
                value: resolvedAiModel,
                secretConfigured: false,
                secretMarkedForRemoval: false,
              } satisfies SectionDraftEntry,
            ]
          }

          return [
            setting.key,
            {
              value: draft.value,
              secretConfigured: draft.secretConfigured,
              secretMarkedForRemoval: false,
            } satisfies SectionDraftEntry,
          ]
        })
      ) as Record<string, SectionDraftEntry>

      setBaseline(nextBaseline)
      setDrafts(nextBaseline)
      setJustSaved(true)
      toast.success("Section enregistree")
      router.refresh()
      setTimeout(() => setJustSaved(false), 2000)
    })
  }

  return (
    <Card className="rounded-[28px] border border-visacore-navy/8 bg-white shadow-[0_24px_80px_-56px_rgba(10,37,64,0.25)]">
      <CardHeader className="border-b border-visacore-navy/8 pb-5">
        <CardDescription>{title}</CardDescription>
        <CardTitle className="text-xl text-visacore-navy">{title}</CardTitle>
        <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </CardHeader>
      <CardContent className="space-y-0 pt-0">
        {settings.map((setting) => {
          const draft = drafts[setting.key]
          const options =
            setting.key === "ai_model"
              ? getAiModelOptions(currentAiProvider)
              : setting.options

          return (
            <div
              key={setting.id}
              className="grid gap-4 border-b border-visacore-navy/8 py-5 last:border-b-0 lg:grid-cols-[minmax(0,300px)_minmax(0,1fr)] lg:gap-8"
            >
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-visacore-navy">
                    {setting.label}
                  </p>
                  <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                    {setting.type}
                  </Badge>
                  {setting.secret ? (
                    <Badge variant="outline" className="text-[10px] uppercase tracking-[0.16em]">
                      Secret
                    </Badge>
                  ) : null}
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {setting.description}
                </p>
                <code className="block text-xs text-muted-foreground/80">
                  {setting.key}
                </code>
              </div>
              <div className="min-w-0">
                <SettingEditor
                  value={draft.value}
                  type={setting.type}
                  placeholder={setting.placeholder}
                  inputType={setting.inputType}
                  control={setting.control}
                  rows={setting.rows}
                  options={options}
                  secret={setting.secret}
                  secretConfigured={draft.secretConfigured}
                  secretMarkedForRemoval={draft.secretMarkedForRemoval}
                  disabled={isPending}
                  onChange={(nextValue) => updateDraftValue(setting.key, nextValue)}
                  onToggleSecretRemoval={
                    setting.secret ? () => toggleSecretRemoval(setting.key) : undefined
                  }
                />
              </div>
            </div>
          )
        })}

        <div className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            {justSaved && dirtyCount === 0 ? (
              <p className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                <Check className="size-3.5" />
                Section enregistree
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                {dirtyCount > 0
                  ? `${dirtyCount} modification${dirtyCount > 1 ? "s" : ""} non enregistree${dirtyCount > 1 ? "s" : ""}`
                  : "Aucune modification en attente"}
              </p>
            )}
            <p className="text-xs text-muted-foreground/80">
              {id === "ai_provider"
                ? "Les changements de fournisseur, modele et cles API sont appliques ensemble."
                : "Les changements de cette section ne sont appliques qu'apres validation."}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={resetSection}
              disabled={isPending || dirtyCount === 0}
            >
              <RotateCcw className="mr-1.5 size-3.5" />
              Annuler
            </Button>
            <Button
              type="button"
              onClick={saveSection}
              disabled={isPending || dirtyCount === 0}
            >
              {isPending ? (
                <Loader2 className="mr-1.5 size-3.5 animate-spin" />
              ) : (
                <Check className="mr-1.5 size-3.5" />
              )}
              Enregistrer la section
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
