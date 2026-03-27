"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import {
  serviceFormSchema,
  type ServiceFormData,
} from "@/lib/validations/service"
import { createService, updateService } from "@/actions/services"
import type { StructuredCardItem } from "@/lib/content-structures"
import {
  normalizeStructuredCardItemDraft,
  prepareStructuredCardItemsForSubmit,
} from "@/lib/structured-content-editor"
import { FormValidationSummary } from "@/components/admin/form-validation-summary"
import { StructuredCardItemsEditor } from "@/components/admin/structured-card-items-editor"
import { useUnsavedChangesGuard } from "@/components/admin/use-unsaved-changes-guard"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

type ServiceScalarFields = Omit<ServiceFormData, "benefits">

interface ServiceFormInitialData extends ServiceScalarFields {
  id: string
  benefits: StructuredCardItem[]
}

interface ServiceFormProps {
  initialData?: ServiceFormInitialData
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function ServiceForm({ initialData }: ServiceFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData?.id
  const initialBenefits = normalizeStructuredCardItemDraft(initialData?.benefits)
  const [benefits, setBenefits] = useState(() =>
    initialBenefits
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<ServiceScalarFields>({
    resolver: zodResolver(serviceFormSchema.omit({ benefits: true })),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          icon: initialData.icon ?? "",
          description: initialData.description ?? "",
          whoIsItFor: initialData.whoIsItFor ?? "",
          requiredSupport: initialData.requiredSupport ?? "",
          ctaText: initialData.ctaText ?? "",
          published: initialData.published,
          order: initialData.order,
          seoTitle: initialData.seoTitle ?? "",
          seoDescription: initialData.seoDescription ?? "",
        }
      : {
          name: "",
          slug: "",
          icon: "",
          description: "",
          whoIsItFor: "",
          requiredSupport: "",
          ctaText: "",
          published: false,
          order: 0,
          seoTitle: "",
          seoDescription: "",
        },
  })
  const hasUnsavedChanges =
    isDirty || JSON.stringify(benefits) !== JSON.stringify(initialBenefits)
  const { confirmIfDirty } = useUnsavedChangesGuard(
    hasUnsavedChanges && !isPending
  )

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    if (!isEditing) {
      setValue("slug", slugify(name))
    }
  }

  function onSubmit(data: ServiceScalarFields) {
    startTransition(async () => {
      try {
        const benefitsResult = prepareStructuredCardItemsForSubmit(
          benefits,
          "Avantages"
        )
        if (!benefitsResult.success) {
          toast.error(benefitsResult.error)
          return
        }

        const payload = {
          ...data,
          benefits: benefitsResult.value,
        }

        const result = isEditing
          ? await updateService(initialData!.id, payload)
          : await createService(payload)

        if (result.success) {
          toast.success(
            isEditing
              ? "Service mis à jour avec succès"
              : "Service créé avec succès"
          )
          router.push("/admin/services")
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch {
        toast.error("Impossible de sauvegarder le service")
      }
    })
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => confirmIfDirty(() => router.push("/admin/services"))}
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Retour
      </button>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 rounded-xl border bg-card p-6 shadow-sm"
      >
        <FormValidationSummary errors={errors} />

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              Nom *
            </Label>
            <Input
              id="name"
              {...register("name", { onChange: handleNameChange })}
              placeholder="Ex: Immigration Canada"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug *
            </Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="Ex: immigration-canada"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="icon" className="text-sm font-medium">
            Icône
          </Label>
          <Input
            id="icon"
            {...register("icon")}
            placeholder="Ex: globe, briefcase, graduation-cap"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description" className="text-sm font-medium">
            Description
          </Label>
          <Textarea
            id="description"
            {...register("description")}
            rows={4}
            placeholder="Description détaillée du service..."
          />
          {errors.description && (
            <p className="text-sm text-destructive">
              {errors.description.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whoIsItFor" className="text-sm font-medium">
            À qui s&apos;adresse ce service ?
          </Label>
          <Textarea
            id="whoIsItFor"
            {...register("whoIsItFor")}
            rows={3}
            placeholder="Décrivez le public cible..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="requiredSupport" className="text-sm font-medium">
            Accompagnement requis
          </Label>
          <Textarea
            id="requiredSupport"
            {...register("requiredSupport")}
            rows={3}
            placeholder="Décrivez l'accompagnement proposé..."
          />
        </div>

        <StructuredCardItemsEditor
          title="Avantages"
          hint="Ajoutez les bénéfices affichés sur la fiche service."
          items={benefits}
          onChange={setBenefits}
          titlePlaceholder="Ex: Accompagnement complet"
          descriptionPlaceholder="Décrivez cet avantage..."
        />

        <div className="space-y-2">
          <Label htmlFor="ctaText" className="text-sm font-medium">
            Texte CTA
          </Label>
          <Input
            id="ctaText"
            {...register("ctaText")}
            placeholder="Ex: Commencez votre démarche"
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="size-4 rounded border-gray-300"
            />
            <Label htmlFor="published" className="text-sm font-medium">
              Publié
            </Label>
          </div>
          <div className="space-y-2">
            <Label htmlFor="order" className="text-sm font-medium">
              Ordre d&apos;affichage
            </Label>
            <Input
              id="order"
              type="number"
              {...register("order", { valueAsNumber: true })}
              placeholder="0"
            />
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="seoTitle" className="text-sm font-medium">
              SEO Title
            </Label>
            <Input
              id="seoTitle"
              {...register("seoTitle")}
              placeholder="Titre SEO"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="seoDescription" className="text-sm font-medium">
              SEO Description
            </Label>
            <Textarea
              id="seoDescription"
              {...register("seoDescription")}
              rows={3}
              placeholder="Description SEO..."
            />
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isEditing ? "Mettre à jour" : "Créer le service"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => confirmIfDirty(() => router.push("/admin/services"))}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
