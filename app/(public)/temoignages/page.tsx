import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Button } from "@/components/ui/button"
import { Star, Quote } from "lucide-react"

export const metadata: Metadata = {
  title: "Témoignages",
  description: "Découvrez les témoignages de nos clients satisfaits qui ont réalisé leur projet d'immigration avec VisaCore Solutions.",
}

export default async function TestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })

  const stories = await prisma.successStory.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <>
      <section className="bg-[#0A2540] px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">Témoignages</h1>
        <p className="mt-4 text-lg text-white/70">
          Ils nous ont fait confiance et ont réalisé leur rêve d&apos;immigration.
        </p>
      </section>

      {/* Testimonials Grid */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold text-[#0A2540]">Ce que disent nos clients</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.id} className="flex flex-col rounded-xl border p-6 shadow-sm">
              <Quote className="size-8 text-[#C9A227]/30" />
              <p className="mt-3 flex-1 text-muted-foreground">{t.content}</p>
              <div className="mt-4 flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`size-4 ${i < t.rating ? "fill-[#C9A227] text-[#C9A227]" : "text-gray-200"}`} />
                ))}
              </div>
              <div className="mt-3 border-t pt-3">
                <p className="font-semibold text-[#0A2540]">{t.clientName}</p>
                {t.destination && (
                  <span className="mt-1 inline-block rounded-full bg-[#0A2540]/10 px-2.5 py-0.5 text-xs font-medium text-[#0A2540]">
                    {t.destination}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
        {testimonials.length === 0 && (
          <p className="mt-8 text-center text-muted-foreground">Aucun témoignage pour le moment.</p>
        )}
      </section>

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="bg-secondary/30 px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <h2 className="text-2xl font-bold text-[#0A2540]">Histoires de réussite</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2">
              {stories.map((s) => (
                <div key={s.id} className="rounded-xl border bg-white p-6 shadow-sm">
                  <span className="inline-block rounded-full bg-[#C9A227]/10 px-3 py-1 text-xs font-medium text-[#C9A227]">
                    {s.destination}
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-[#0A2540]">{s.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{s.summary}</p>
                  <p className="mt-2 text-sm font-medium text-[#0A2540]">— {s.clientName}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-[#0A2540]">
          Rejoignez nos clients satisfaits
        </h2>
        <p className="mt-2 text-muted-foreground">
          Commencez votre parcours vers l&apos;international dès aujourd&apos;hui.
        </p>
        <Link href="/evaluation" className="mt-6 inline-block">
          <Button size="lg" className="bg-[#C9A227] text-white hover:bg-[#A88620]">
            Obtenir mon évaluation gratuite
          </Button>
        </Link>
      </section>
    </>
  )
}
