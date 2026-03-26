"use client"

import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { faqSchema, type FAQFormData } from "@/lib/validations/faq"
import { createFAQ, updateFAQ } from "@/actions/faqs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface FAQFormProps {
  initialData?: FAQFormData & { id: string }
  destinations: { id: string; name: string }[]
}

const categoryOptions = [
  { value: "GENERAL", label: "Général" },
  { value: "CANADA", label: "Canada" },
  { value: "USA", label: "USA" },
  { value: "EUROPE", label: "Europe" },
  { value: "DOCUMENTATION", label: "Documentation" },
  { value: "PROCESS", label: "Processus" },
]

export function FAQForm({ initialData, destinations }: FAQFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const isEditing = !!initialData?.id

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FAQFormData>({
    resolver: zodResolver(faqSchema),
    defaultValues: initialData
      ? {
          question: initialData.question,
          answer: initialData.answer,
          category: initialData.category,
          destinationId: initialData.destinationId ?? null,
          published: initialData.published,
          order: initialData.order,
        }
      : {
          question: "",
          answer: "",
          category: "GENERAL",
          destinationId: null,
          published: false,
          order: 0,
        },
  })

  function onSubmit(data: FAQFormData) {
    startTransition(async () => {
      try {
        const payload = {
          ...data,
          destinationId: data.destinationId || null,
        }

        const result = isEditing
          ? await updateFAQ(initialData!.id, payload)
          : await createFAQ(payload)

        if (result.success) {
          toast.success(
            isEditing
              ? "FAQ mise à jour avec succès"
              : "FAQ créée avec succès"
          )
          router.push("/admin/faqs")
        } else {
          toast.error(result.error || "Une erreur est survenue")
        }
      } catch {
        toast.error("Impossible de sauvegarder la FAQ")
      }
    })
  }

  return (
    <div className="space-y-6">
      <Link
        href="/admin/faqs"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="size-4" />
        Retour
      </Link>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="rounded-xl border bg-card p-6 shadow-sm space-y-6"
      >
        {/* Question */}
        <div className="space-y-2">
          <Label htmlFor="question" className="text-sm font-medium">
            Question *
          </Label>
          <Input
            id="question"
            {...register("question")}
            placeholder="Ex: Comment obtenir un visa de travail ?"
          />
          {errors.question && (
            <p className="text-sm text-destructive">
              {errors.question.message}
            </p>
          )}
        </div>

        {/* Answer */}
        <div className="space-y-2">
          <Label htmlFor="answer" className="text-sm font-medium">
            Réponse *
          </Label>
          <Textarea
            id="answer"
            {...register("answer")}
            rows={5}
            placeholder="Rédigez la réponse à la question..."
          />
          {errors.answer && (
            <p className="text-sm text-destructive">
              {errors.answer.message}
            </p>
          )}
        </div>

        {/* Category */}
        <div className="space-y-2">
          <Label htmlFor="category" className="text-sm font-medium">
            Catégorie
          </Label>
          <select
            id="category"
            {...register("category")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            {categoryOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {errors.category && (
            <p className="text-sm text-destructive">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* Destination */}
        <div className="space-y-2">
          <Label htmlFor="destinationId" className="text-sm font-medium">
            Destination
          </Label>
          <select
            id="destinationId"
            {...register("destinationId")}
            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          >
            <option value="">Aucune</option>
            {destinations.map((dest) => (
              <option key={dest.id} value={dest.id}>
                {dest.name}
              </option>
            ))}
          </select>
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
              Publiée
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
              "Créer la FAQ"
            )}
          </Button>
          <Link href="/admin/faqs">
            <Button type="button" variant="outline">
              Annuler
            </Button>
          </Link>
        </div>
      </form>
    </div>
  )
}
