import type { Metadata } from "next"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { HelpCircle, ArrowRight, MessageCircle } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"

export const revalidate = 3600

export const metadata: Metadata = {
  title: "FAQ",
  description: "Retrouvez les réponses aux questions les plus fréquentes sur l'immigration et nos services.",
}

const categoryLabels: Record<string, string> = {
  GENERAL: "Général",
  CANADA: "Canada",
  USA: "États-Unis",
  EUROPE: "Europe",
  DOCUMENTATION: "Documentation",
  PROCESS: "Processus & Consultation",
}

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { published: true },
    orderBy: { order: "asc" },
  })

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, faq) => {
    const cat = faq.category
    if (!acc[cat]) acc[cat] = []
    acc[cat].push(faq)
    return acc
  }, {})

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-visacore-gold/15 rounded-full blur-[120px]" />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <HelpCircle className="size-4" />
                FAQ
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Questions <span className="text-visacore-gold italic serif">Fréquentes</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                Retrouvez les réponses aux questions les plus courantes sur nos services et les démarches d&apos;immigration.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="section-padding bg-background">
        <div className="container-custom max-w-4xl">
          {Object.entries(grouped).length > 0 ? (
            Object.entries(grouped).map(([category, items], catIdx) => (
              <ScrollReveal key={category} delay={catIdx * 0.1}>
                <div className="mb-16 last:mb-0">
                  <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-visacore-gold mb-8">
                    {categoryLabels[category] ?? category}
                  </div>

                  <div className="bg-white border border-border rounded-[40px] p-8 md:p-12 shadow-sm">
                    <Accordion>
                      {items.map((faq) => (
                        <AccordionItem key={faq.id} value={faq.id} className="border-b border-border/50 last:border-0">
                          <AccordionTrigger className="text-left text-lg font-black text-visacore-navy hover:text-visacore-gold transition-colors py-6">
                            {faq.question}
                          </AccordionTrigger>
                          <AccordionContent className="text-muted-foreground leading-relaxed font-medium pb-6">
                            {faq.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </ScrollReveal>
            ))
          ) : (
            <div className="text-center py-20">
              <div className="size-20 rounded-full bg-visacore-gold/10 flex items-center justify-center mx-auto mb-6">
                <HelpCircle className="size-10 text-visacore-gold" />
              </div>
              <p className="text-xl text-muted-foreground font-medium">Aucune FAQ disponible pour le moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="section-padding bg-gray-50 border-t border-border">
        <div className="container-custom">
          <div className="bg-white border border-border rounded-[60px] p-12 md:p-20 text-center shadow-sm">
            <ScrollReveal>
              <div className="size-16 rounded-full bg-visacore-gold/10 flex items-center justify-center mx-auto mb-8">
                <MessageCircle className="size-8 text-visacore-gold" />
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-visacore-navy mb-6">
                Pas Trouvé Votre <span className="text-visacore-gold serif italic">Réponse</span> ?
              </h2>
              <p className="text-lg text-muted-foreground mb-12 max-w-xl mx-auto font-medium">
                Notre équipe est disponible pour répondre à toutes vos questions personnellement.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/contact"
                  className="inline-flex h-16 items-center rounded-full bg-visacore-navy px-10 font-black text-white transition-all hover:bg-visacore-navy-light"
                >
                  Nous Contacter
                </Link>
                <Link
                  href="/evaluation"
                  className="inline-flex h-16 items-center rounded-full bg-visacore-gold px-10 font-black text-white shadow-lg shadow-visacore-gold/20 transition-all hover:scale-105"
                >
                  Évaluation Gratuite
                  <ArrowRight className="ml-2 size-5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  )
}
