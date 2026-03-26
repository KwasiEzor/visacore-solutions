"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { serviceSchema, type ServiceFormData } from "@/lib/validations/service"
import { createService, updateService } from "@/actions/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ServiceFormProps {
  initialData?: ServiceFormData & { id: string }
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

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: initialData
      ? {
          name: initialData.name,
          slug: initialData.slug,
          icon: initialData.icon ?? "",
          description: initialData.description ?? "",
          whoIsItFor: initialData.whoIsItFor ?? "",
          requiredSupport: initialData.requiredSupport ?? "",
          benefits: initialData.benefits ?? "",
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
          benefits: "",
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

  function parseJsonField(value: unknown): unknown {
    if (typeof value === "string" && value.trim() !== "") {
      try {
        return JSON.parse(value)
      } catch {
        return null
      }
    }
    return value ?? null
  }

  function onSubmit(data: ServiceFormData) {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          benefits: parseJsonField(data.benefits),
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
      <Link
        href="/admin/services"
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

        {/* Icon */}
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

        {/* Description */}
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

        {/* Who Is It For */}
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

        {/* Required Support */}
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

        {/* Benefits (JSON) */}
        <div className="space-y-2">
          <Label htmlFor="benefits" className="text-sm font-medium">
            Avantages (JSON)
          </Label>
          <Textarea
            id="benefits"
            {...register("benefits")}
            rows={4}
            placeholder='[{"title": "Accompagnement complet", "description": "..."}]'
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Format JSON. Laissez vide si aucune donnée.
          </p>
        </div>

        {/* CTA Text */}
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
              "Mettre à jour"
            ) : (
              "Créer le service"
            )}
          </Button>
          <Link href="/admin/services">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
