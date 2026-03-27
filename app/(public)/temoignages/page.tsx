import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Star, Quote, ArrowRight, MessageCircle } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"

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

      {/* Testimonials Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <ScrollReveal>
            <h2 className="text-4xl font-black text-visacore-navy mb-16">
              Ce que Disent Nos <span className="text-visacore-gold serif italic">Clients</span>
            </h2>
          </ScrollReveal>

          {testimonials.length > 0 ? (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t, i) => (
                <ScrollReveal key={t.id} delay={i * 0.08}>
                  <div className="group flex flex-col bg-white border border-border rounded-[40px] p-10 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full relative">
                    <Quote className="absolute -top-5 -left-3 size-10 text-visacore-gold fill-visacore-gold opacity-30" />
                    <p className="flex-1 text-lg text-visacore-navy/80 leading-relaxed italic font-medium">
                      &ldquo;{t.content}&rdquo;
                    </p>

                    <div className="mt-6 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={`size-5 ${idx < t.rating ? "fill-visacore-gold text-visacore-gold" : "text-gray-200"}`} />
                      ))}
                    </div>

                    <div className="mt-6 pt-6 border-t border-border flex items-center gap-4">
                      <div className="size-12 rounded-2xl bg-visacore-navy flex items-center justify-center text-visacore-gold text-lg font-black">
                        {t.clientName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div className="font-black text-visacore-navy">{t.clientName}</div>
                        {t.destination && (
                          <span className="text-sm font-bold text-visacore-gold">
                            Visa {t.destination}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="size-20 rounded-full bg-visacore-gold/10 flex items-center justify-center mx-auto mb-6">
                <MessageCircle className="size-10 text-visacore-gold" />
              </div>
              <p className="text-xl text-muted-foreground font-medium">Aucun témoignage pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Success Stories */}
      {stories.length > 0 && (
        <section className="section-padding bg-gray-50 border-y border-border">
          <div className="container-custom">
            <ScrollReveal>
              <h2 className="text-4xl font-black text-visacore-navy mb-16">
                Histoires de <span className="text-visacore-gold serif italic">Réussite</span>
              </h2>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2">
              {stories.map((s, i) => (
                <ScrollReveal key={s.id} delay={i * 0.1}>
                  <div className="bg-white border border-border rounded-[40px] p-10 shadow-sm hover:shadow-2xl transition-shadow duration-500">
                    <span className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-visacore-gold">
                      {s.destination}
                    </span>
                    <h3 className="mt-6 text-2xl font-black text-visacore-navy">{s.title}</h3>
                    <p className="mt-4 text-muted-foreground leading-relaxed font-medium">{s.summary}</p>
                    <p className="mt-6 text-sm font-black text-visacore-navy uppercase tracking-widest">— {s.clientName}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

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
