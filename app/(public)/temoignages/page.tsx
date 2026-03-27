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
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute -bottom-48 right-0 w-96 h-96 bg-visacore-gold/20 rounded-full blur-[120px] opacity-40" />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <MessageCircle className="size-4" />
                Témoignages
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Ils ont <span className="text-visacore-gold italic serif">Réalisé</span> <br />Leur Rêve
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
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
      <section className="section-padding px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="bg-visacore-navy rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-5" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />

              <div className="relative z-10">
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                  Rejoignez Nos Clients <span className="text-visacore-gold serif italic">Satisfaits</span>
                </h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                  Commencez votre parcours vers l&apos;international dès aujourd&apos;hui.
                </p>
                <Link
                  href="/evaluation"
                  className="inline-flex h-16 items-center rounded-full bg-visacore-gold px-10 text-lg font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105"
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
