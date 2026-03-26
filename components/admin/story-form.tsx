"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { storySchema, type StoryFormData } from "@/lib/validations/story"
import { createStory, updateStory } from "@/actions/stories"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface StoryFormProps {
  initialData?: StoryFormData & { id: string }
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
}

export function StoryForm({ initialData }: StoryFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData?.id

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StoryFormData>({
    resolver: zodResolver(storySchema),
    defaultValues: initialData
      ? {
          title: initialData.title,
          slug: initialData.slug,
          clientName: initialData.clientName,
          destination: initialData.destination,
          summary: initialData.summary ?? "",
          content: initialData.content ?? "",
          images: initialData.images ?? "",
          published: initialData.published,
          seoTitle: initialData.seoTitle ?? "",
          seoDescription: initialData.seoDescription ?? "",
        }
      : {
          title: "",
          slug: "",
          clientName: "",
          destination: "",
          summary: "",
          content: "",
          images: "",
          published: false,
          seoTitle: "",
          seoDescription: "",
        },
  })

  function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const title = e.target.value
    if (!isEditing) {
      setValue("slug", slugify(title))
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
    return null
  }

  function onSubmit(data: StoryFormData) {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          images: parseJsonField(data.images),
        }

        const result = isEditing
          ? await updateStory(initialData!.id, payload)
          : await createStory(payload)

        if (result.success) {
          toast.success(
            isEditing
              ? "Story mise à jour avec succès"
              : "Story créée avec succès"
          )
          router.push("/admin/stories")
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch {
        toast.error("Impossible de sauvegarder la story")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/stories"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-6"
      >
        {/* Title & Slug */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Titre *
            </Label>
            <Input
              id="title"
              {...register("title", { onChange: handleTitleChange })}
              placeholder="Ex: De Lomé au Canada en 6 mois"
            />
            {errors.title && (
              <p className="text-sm text-destructive">{errors.title.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug" className="text-sm font-medium">
              Slug *
            </Label>
            <Input
              id="slug"
              {...register("slug")}
              placeholder="Ex: de-lome-au-canada"
            />
            {errors.slug && (
              <p className="text-sm text-destructive">{errors.slug.message}</p>
            )}
          </div>
        </div>

        {/* Client Name & Destination */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="clientName" className="text-sm font-medium">
              Nom du client *
            </Label>
            <Input
              id="clientName"
              {...register("clientName")}
              placeholder="Ex: Jean Dupont"
            />
            {errors.clientName && (
              <p className="text-sm text-destructive">{errors.clientName.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">
              Destination *
            </Label>
            <Input
              id="destination"
              {...register("destination")}
              placeholder="Ex: Canada"
            />
            {errors.destination && (
              <p className="text-sm text-destructive">{errors.destination.message}</p>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-2">
          <Label htmlFor="summary" className="text-sm font-medium">
            Résumé
          </Label>
          <Textarea
            id="summary"
            {...register("summary")}
            rows={3}
            placeholder="Un court résumé de l'histoire..."
          />
          {errors.summary && (
            <p className="text-sm text-destructive">{errors.summary.message}</p>
          )}
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">
            Contenu
          </Label>
          <Textarea
            id="content"
            {...register("content")}
            rows={8}
            placeholder="Le contenu détaillé de la success story..."
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        {/* Images (JSON) */}
        <div className="space-y-2">
          <Label htmlFor="images" className="text-sm font-medium">
            Images (JSON)
          </Label>
          <Textarea
            id="images"
            {...register("images")}
            rows={3}
            placeholder='["https://example.com/img1.jpg", "https://example.com/img2.jpg"]'
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            Format JSON. Laissez vide si aucune image.
          </p>
        </div>

        {/* Published */}
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="published"
            {...register("published")}
            className="size-4 rounded border-gray-300"
          />
          <Label htmlFor="published" className="text-sm font-medium">
            Publiée
          </Label>
        </div>

        {/* SEO Title */}
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

        {/* SEO Description */}
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
              "Créer la story"
            )}
          </Button>
          <Link href="/admin/stories">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
