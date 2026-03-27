import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { ArrowRight, MessageCircle } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { SocialProofShowcase } from "@/components/public/social-proof-showcase"

export const revalidate = 3600

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
    <div className="pt-16 sm:pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-14 sm:py-18 lg:py-22">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute -bottom-48 right-0 w-96 h-96 bg-visacore-gold/20 rounded-full blur-[120px] opacity-40" />

        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-[0.28em] text-visacore-gold sm:text-sm">
                <MessageCircle className="size-4" />
                Témoignages
              </div>
              <h1 className="mb-6 text-4xl font-black leading-[0.92] text-white sm:text-5xl lg:text-6xl">
                Ils ont <span className="text-visacore-gold italic serif">Réalisé</span>
                <br />
                Leur Rêve
              </h1>
              <p className="mx-auto max-w-2xl text-base font-medium leading-relaxed text-white/80 sm:text-lg lg:text-xl">
                Découvrez les histoires de ceux qui nous ont fait confiance et ont concrétisé leur projet d&apos;immigration.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <SocialProofShowcase
        testimonials={testimonials.map((item) => ({
          id: item.id,
          clientName: item.clientName,
          destination: item.destination,
          content: item.content,
          rating: item.rating,
          featured: item.featured,
        }))}
        stories={stories.map((item) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          clientName: item.clientName,
          destination: item.destination,
          summary: item.summary,
          content: item.content,
        }))}
      />

      {/* CTA */}
      <section className="bg-gradient-to-b from-visacore-navy via-visacore-navy/10 to-background px-4 pb-14 pt-8 sm:pb-16 sm:pt-10 lg:pb-20 lg:pt-12">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-[32px] bg-visacore-navy p-8 text-center shadow-[0_30px_90px_-40px_rgba(10,37,64,0.8)] sm:rounded-[42px] sm:p-10 lg:rounded-[52px] lg:p-14">
              <div className="absolute inset-0 bg-noise opacity-5" />
              <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />

              <div className="relative z-10">
                <h2 className="text-2xl font-black text-white sm:text-4xl lg:text-5xl">
                  Rejoignez Nos Clients <span className="text-visacore-gold serif italic">Satisfaits</span>
                </h2>
                <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-white/76 sm:text-base lg:text-lg">
                  Commencez votre parcours vers l&apos;international dès aujourd&apos;hui.
                </p>
                <Link
                  href="/evaluation"
                  className="mt-8 inline-flex h-14 items-center rounded-full bg-visacore-gold px-7 text-base font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:-translate-y-0.5 hover:scale-[1.02] sm:h-16 sm:px-10 sm:text-lg"
                >
                  Obtenir Mon Évaluation Gratuite
                  <ArrowRight className="ml-3 size-5" />
                </Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
