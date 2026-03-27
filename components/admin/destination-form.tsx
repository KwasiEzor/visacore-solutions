"use client"

import { useState, useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import {
  destinationFormSchema,
  type DestinationFormData,
} from "@/lib/validations/destination"
import { createDestination, updateDestination } from "@/actions/destinations"
import type {
  StructuredCardItem,
  VisaCategoryItem,
} from "@/lib/content-structures"
import {
  normalizeStructuredCardItemDraft,
  normalizeVisaCategoryDraft,
  prepareStructuredCardItemsForSubmit,
  prepareVisaCategoriesForSubmit,
} from "@/lib/structured-content-editor"
import { FormValidationSummary } from "@/components/admin/form-validation-summary"
import { StructuredCardItemsEditor } from "@/components/admin/structured-card-items-editor"
import { useUnsavedChangesGuard } from "@/components/admin/use-unsaved-changes-guard"
import { VisaCategoriesEditor } from "@/components/admin/visa-categories-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

type DestinationScalarFields = Omit<
  DestinationFormData,
  "opportunities" | "visaCategories" | "whyChoose"
>

interface DestinationFormInitialData extends DestinationScalarFields {
  id: string
  opportunities: StructuredCardItem[]
  visaCategories: VisaCategoryItem[]
  whyChoose: StructuredCardItem[]
}

interface DestinationFormProps {
  initialData?: DestinationFormInitialData
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function DestinationForm({ initialData }: DestinationFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData?.id
  const initialOpportunities = normalizeStructuredCardItemDraft(
    initialData?.opportunities
  )
  const initialVisaCategories = normalizeVisaCategoryDraft(
    initialData?.visaCategories
  )
  const initialWhyChoose = normalizeStructuredCardItemDraft(
    initialData?.whyChoose
  )
  const [opportunities, setOpportunities] = useState(() =>
    initialOpportunities
  )
  const [visaCategories, setVisaCategories] = useState(() =>
    initialVisaCategories
  )
  const [whyChoose, setWhyChoose] = useState(() =>
    initialWhyChoose
  )

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isDirty },
  } = useForm<DestinationScalarFields>({
    resolver: zodResolver(
      destinationFormSchema.omit({
        opportunities: true,
        visaCategories: true,
        whyChoose: true,
      })
    ),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          heroTitle: initialData.heroTitle,
          heroDescription: initialData.heroDescription ?? "",
          heroImage: initialData.heroImage ?? "",
          ctaText: initialData.ctaText ?? "",
          published: initialData.published,
          order: initialData.order,
          seoTitle: initialData.seoTitle ?? "",
          seoDescription: initialData.seoDescription ?? "",
        }
      : {
          name: "",
          slug: "",
          heroTitle: "",
          heroDescription: "",
          heroImage: "",
          ctaText: "",
          published: false,
          order: 0,
          seoTitle: "",
          seoDescription: "",
        },
  })
  const hasUnsavedChanges =
    isDirty ||
    JSON.stringify(opportunities) !== JSON.stringify(initialOpportunities) ||
    JSON.stringify(visaCategories) !== JSON.stringify(initialVisaCategories) ||
    JSON.stringify(whyChoose) !== JSON.stringify(initialWhyChoose)
  const { confirmIfDirty } = useUnsavedChangesGuard(
    hasUnsavedChanges && !isPending
  )

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    if (!isEditing) {
      setValue("slug", slugify(name))
    }
  }

  function onSubmit(data: DestinationScalarFields) {
    startTransition(async () => {
      try {
        const opportunitiesResult = prepareStructuredCardItemsForSubmit(
          opportunities,
          "Opportunités"
        )
        if (!opportunitiesResult.success) {
          toast.error(opportunitiesResult.error)
          return
        }

        const visaCategoriesResult = prepareVisaCategoriesForSubmit(
          visaCategories
        )
        if (!visaCategoriesResult.success) {
          toast.error(visaCategoriesResult.error)
          return
        }

        const whyChooseResult = prepareStructuredCardItemsForSubmit(
          whyChoose,
          "Pourquoi choisir"
        )
        if (!whyChooseResult.success) {
          toast.error(whyChooseResult.error)
          return
        }

        const payload = {
          ...data,
          opportunities: opportunitiesResult.value,
          visaCategories: visaCategoriesResult.value,
          whyChoose: whyChooseResult.value,
        }

        const result = isEditing
          ? await updateDestination(initialData!.id, payload)
          : await createDestination(payload)

        if (result.success) {
          toast.success(
            isEditing
              ? "Destination mise à jour avec succes"
              : "Destination creee avec succes"
          )
          router.push("/admin/destinations")
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch {
        toast.error("Impossible de sauvegarder la destination")
      }
    })
  }

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => confirmIfDirty(() => router.push("/admin/destinations"))}
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
              placeholder="Ex: Canada"
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug *
            </Label>
            <Input id="slug" {...register("slug")} placeholder="Ex: canada" />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroTitle" className="text-sm font-medium">
            Titre Hero *
          </Label>
          <Input
            id="heroTitle"
            {...register("heroTitle")}
            placeholder="Ex: Immigrez au Canada avec VisaCore"
          />
          {errors.heroTitle && (
            <p className="text-sm text-destructive">
              {errors.heroTitle.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroDescription" className="text-sm font-medium">
            Description Hero
          </Label>
          <Textarea
            id="heroDescription"
            {...register("heroDescription")}
            rows={3}
            placeholder="Description affichee dans la section hero..."
          />
          {errors.heroDescription && (
            <p className="text-sm text-destructive">
              {errors.heroDescription.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="heroImage" className="text-sm font-medium">
            Image Hero (URL)
          </Label>
          <Input
            id="heroImage"
            {...register("heroImage")}
            placeholder="https://example.com/image.jpg"
          />
          {errors.heroImage && (
            <p className="text-sm text-destructive">
              {errors.heroImage.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="ctaText" className="text-sm font-medium">
            Texte CTA
          </Label>
          <Input
            id="ctaText"
            {...register("ctaText")}
            placeholder="Ex: Commencez votre demarche"
          />
        </div>

        <StructuredCardItemsEditor
          title="Opportunités"
          hint="Ajoutez les opportunités ou atouts affichés sur la page destination."
          items={opportunities}
          onChange={setOpportunities}
          titlePlaceholder="Ex: Travail"
          descriptionPlaceholder="Décrivez cette opportunité..."
        />

        <VisaCategoriesEditor
          items={visaCategories}
          onChange={setVisaCategories}
        />

        <StructuredCardItemsEditor
          title="Pourquoi choisir"
          hint="Ajoutez les raisons mises en avant pour cette destination."
          items={whyChoose}
          onChange={setWhyChoose}
          titlePlaceholder="Ex: Expertise locale"
          descriptionPlaceholder="Décrivez cet argument..."
        />

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
            {isEditing ? "Mettre à jour" : "Créer la destination"}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              confirmIfDirty(() => router.push("/admin/destinations"))
            }
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
}
