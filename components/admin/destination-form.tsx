"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import {
  destinationFormSchema,
  type DestinationFormData,
} from "@/lib/validations/destination"
import { createDestination, updateDestination } from "@/actions/destinations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface DestinationFormProps {
  initialData?: DestinationFormData & { id: string }
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DestinationFormData>({
    resolver: zodResolver(destinationFormSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          heroTitle: initialData.heroTitle,
          heroDescription: initialData.heroDescription ?? "",
          heroImage: initialData.heroImage ?? "",
          opportunities: initialData.opportunities ?? "",
          visaCategories: initialData.visaCategories ?? "",
          whyChoose: initialData.whyChoose ?? "",
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
          opportunities: "",
          visaCategories: "",
          whyChoose: "",
          ctaText: "",
          published: false,
          order: 0,
          seoTitle: "",
          seoDescription: "",
        },
  })

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const name = e.target.value
    if (!isEditing) {
      setValue("slug", slugify(name))
    }
  }

  function parseJsonField(label: string, value: unknown) {
    if (typeof value !== "string" || value.trim() === "") {
      return { success: true as const, value: null }
    }

    try {
      return { success: true as const, value: JSON.parse(value) }
    } catch {
      return {
        success: false as const,
        error: `Le champ "${label}" contient un JSON invalide.`,
      }
    }
  }

  function onSubmit(data: DestinationFormData) {
    startTransition(async () => {
      try {
        const opportunities = parseJsonField("Opportunités", data.opportunities)
        if (!opportunities.success) {
          toast.error(opportunities.error)
          return
        }

        const visaCategories = parseJsonField(
          "Catégories de visa",
          data.visaCategories
        )
        if (!visaCategories.success) {
          toast.error(visaCategories.error)
          return
        }

        const whyChoose = parseJsonField("Pourquoi choisir", data.whyChoose)
        if (!whyChoose.success) {
          toast.error(whyChoose.error)
          return
        }

        const payload = {
          ...data,
          opportunities: opportunities.value,
          visaCategories: visaCategories.value,
          whyChoose: whyChoose.value,
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
      <Link
        href="/admin/destinations"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-6"
      >
        {/* Name & Slug */}
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
            <Input
              id="slug"
              {...register("slug")}
              placeholder="Ex: canada"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Hero Title */}
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

        {/* Hero Description */}
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

        {/* Hero Image */}
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

        {/* CTA Text */}
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

        {/* JSON fields */}
        <div className="space-y-2">
          <Label htmlFor="opportunities" className="text-sm font-medium">
            Opportunites (JSON)
          </Label>
          <Textarea
            id="opportunities"
            {...register("opportunities")}
            rows={4}
            placeholder='[{"title": "Travail", "description": "..."}]'
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Format JSON. Laissez vide si aucune donnee.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="visaCategories" className="text-sm font-medium">
            Categories de Visa (JSON)
          </Label>
          <Textarea
            id="visaCategories"
            {...register("visaCategories")}
            rows={4}
            placeholder='[{"name": "Visa etudiant", "description": "..."}]'
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Format JSON. Laissez vide si aucune donnee.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="whyChoose" className="text-sm font-medium">
            Pourquoi choisir (JSON)
          </Label>
          <Textarea
            id="whyChoose"
            {...register("whyChoose")}
            rows={4}
            placeholder='[{"title": "Accompagnement complet", "description": "..."}]'
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Format JSON. Laissez vide si aucune donnee.
          </p>
        </div>

        {/* Published & Order */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="published"
              {...register("published")}
              className="size-4 rounded border-gray-300"
            />
            <Label htmlFor="published" className="text-sm font-medium">
              Publiee
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
            {errors.order && (
              <p className="text-sm text-destructive">
                {errors.order.message}
              </p>
            )}
          </div>
        </div>

        {/* SEO */}
        <div className="space-y-2">
          <Label htmlFor="seoTitle" className="text-sm font-medium">
            Titre SEO
          </Label>
          <Input
            id="seoTitle"
            {...register("seoTitle")}
            placeholder="Titre pour les moteurs de recherche"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="seoDescription" className="text-sm font-medium">
            Description SEO
          </Label>
          <Textarea
            id="seoDescription"
            {...register("seoDescription")}
            rows={2}
            placeholder="Description pour les moteurs de recherche..."
          />
        </div>

        {/* Submit */}
        <div className="flex items-center gap-3 pt-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                Sauvegarde...
              </>
            ) : isEditing ? (
              "Mettre a jour"
            ) : (
              "Creer la destination"
            )}
          </Button>
          <Link href="/admin/destinations">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
