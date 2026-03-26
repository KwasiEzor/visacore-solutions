"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { testimonialSchema, type TestimonialFormData } from "@/lib/validations/testimonial"
import { createTestimonial, updateTestimonial } from "@/actions/testimonials"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface TestimonialFormProps {
  initialData?: TestimonialFormData & { id: string }
  destinations?: { id: string; name: string }[]
}

export function TestimonialForm({ initialData, destinations = [] }: TestimonialFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData?.id

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: initialData
      ? {
          clientName: initialData.clientName,
          clientImage: initialData.clientImage ?? "",
          destination: initialData.destination ?? "",
          destinationId: initialData.destinationId ?? null,
          content: initialData.content,
          rating: initialData.rating,
          featured: initialData.featured,
          published: initialData.published,
        }
      : {
          clientName: "",
          clientImage: "",
          destination: "",
          destinationId: null,
          content: "",
          rating: 5,
          featured: false,
          published: false,
        },
  })

  function onSubmit(data: TestimonialFormData) {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          destinationId: data.destinationId || null,
        }

        const result = isEditing
          ? await updateTestimonial(initialData!.id, payload)
          : await createTestimonial(payload)

        if (result.success) {
          toast.success(
            isEditing
              ? "Témoignage mis à jour avec succès"
              : "Témoignage créé avec succès"
          )
          router.push("/admin/testimonials")
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch {
        toast.error("Impossible de sauvegarder le témoignage")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/testimonials"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-6"
      >
        {/* Client Name & Client Image */}
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
            <Label htmlFor="clientImage" className="text-sm font-medium">
              Photo du client (URL)
            </Label>
            <Input
              id="clientImage"
              {...register("clientImage")}
              placeholder="https://example.com/photo.jpg"
            />
            {errors.clientImage && (
              <p className="text-sm text-destructive">{errors.clientImage.message}</p>
            )}
          </div>
        </div>

        {/* Destination text & Destination select */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="destination" className="text-sm font-medium">
              Destination
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
          <div className="space-y-2">
            <Label htmlFor="destinationId" className="text-sm font-medium">
              Destination liée
            </Label>
            <select
              id="destinationId"
              {...register("destinationId")}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Aucune</option>
              {destinations.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <Label htmlFor="content" className="text-sm font-medium">
            Contenu du témoignage *
          </Label>
          <Textarea
            id="content"
            {...register("content")}
            rows={5}
            placeholder="Le témoignage du client..."
          />
          {errors.content && (
            <p className="text-sm text-destructive">{errors.content.message}</p>
          )}
        </div>

        {/* Rating */}
        <div className="space-y-2">
          <Label htmlFor="rating" className="text-sm font-medium">
            Note (1-5) *
          </Label>
          <Input
            id="rating"
            type="number"
            min={1}
            max={5}
            {...register("rating", { valueAsNumber: true })}
          />
          {errors.rating && (
            <p className="text-sm text-destructive">{errors.rating.message}</p>
          )}
        </div>

        {/* Featured & Published */}
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="size-4 rounded border-gray-300"
            />
            <Label htmlFor="featured" className="text-sm font-medium">
              Mis en avant
            </Label>
          </div>
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
              "Créer le témoignage"
            )}
          </Button>
          <Link href="/admin/testimonials">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
