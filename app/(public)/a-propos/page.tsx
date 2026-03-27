import type { Metadata } from "next"
import Link from "next/link"
import { Target, Eye, Heart, Globe, MapPin, Users, Award, Shield } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getAboutPageContent } from "@/lib/page-content"

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez VisaCore Solutions, votre partenaire de confiance pour l'immigration internationale depuis Lomé, Togo.",
}

const values = [
  { icon: Shield, title: "Confiance", description: "Nous bâtissons des relations durables basées sur la transparence et l'intégrité." },
  { icon: Award, title: "Excellence", description: "Nous visons l'excellence dans chaque dossier que nous traitons." },
  { icon: Heart, title: "Humanité", description: "Chaque client est unique et mérite un accompagnement personnalisé." },
  { icon: Globe, title: "Ouverture", description: "Nous croyons en un monde où chacun peut saisir les opportunités internationales." },
  { icon: Users, title: "Expertise", description: "Notre équipe combine expertise locale et connaissance approfondie des systèmes d'immigration." },
  { icon: MapPin, title: "Proximité", description: "Basés à Lomé, nous sommes proches de vous pour un accompagnement de qualité." },
]

export default async function AboutPage() {
  const pageContent = await getAboutPageContent()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 left-0 w-1/2 h-full bg-visacore-gold/10 blur-[120px]" />

        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <Users className="size-4" />
                Notre Histoire
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Une Passion <br /><span className="text-visacore-gold italic serif">Humaine</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                Votre partenaire de confiance pour l&apos;immigration internationale depuis Lomé, Togo. Chaque dossier est une histoire que nous écrivons ensemble.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-black text-visacore-navy leading-tight">
                {pageContent.story.title}
              </h2>
              {pageContent.story.subtitle && (
                <p className="mt-6 text-sm font-bold uppercase tracking-[0.3em] text-visacore-gold">
                  {pageContent.story.subtitle}
                </p>
              )}
              <p className="mt-8 text-lg text-muted-foreground leading-relaxed font-medium">
                {pageContent.story.content.text}
              </p>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed font-medium">
                Depuis notre création, nous avons accompagné plus de 1000 personnes dans leurs projets d&apos;immigration
                vers le Canada, les États-Unis et l&apos;Europe. Notre taux de réussite élevé témoigne de notre engagement
                envers l&apos;excellence.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="grid grid-cols-2 gap-6">
                {[
                  { number: "1k+", label: "Dossiers Approuvés" },
                  { number: "98%", label: "Taux de Réussite" },
                  { number: "3+", label: "Destinations" },
                  { number: "5+", label: "Années d'Expérience" },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-border rounded-[30px] p-8 text-center shadow-sm hover:shadow-xl transition-shadow duration-500">
                    <div className="text-4xl font-black text-visacore-gold">{stat.number}</div>
                    <div className="mt-2 text-sm font-bold text-visacore-navy uppercase tracking-widest">{stat.label}</div>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-gray-50 border-y border-border">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ScrollReveal>
              <div className="bg-white rounded-[40px] p-12 shadow-sm border border-border h-full hover:shadow-2xl transition-shadow duration-500">
                <div className="size-16 rounded-2xl bg-visacore-navy flex items-center justify-center mb-8">
                  <Target className="size-8 text-visacore-gold" />
                </div>
                <h3 className="text-3xl font-black text-visacore-navy mb-4">
                  {pageContent.mission.title}
                </h3>
                <p className="text-lg text-muted-foreground leading-relaxed font-medium">
                  {pageContent.mission.content.text}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="bg-visacore-navy rounded-[40px] p-12 h-full relative overflow-hidden group">
                <div className="absolute top-0 right-0 size-48 bg-visacore-gold/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                <div className="relative z-10">
                  <div className="size-16 rounded-2xl bg-visacore-gold/10 border border-visacore-gold/20 flex items-center justify-center mb-8">
                    <Eye className="size-8 text-visacore-gold" />
                  </div>
                  <h3 className="text-3xl font-black text-white mb-4">
                    {pageContent.vision.title}
                  </h3>
                  <p className="text-lg text-white/60 leading-relaxed font-medium">
                    {pageContent.vision.content.text}
                  </p>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="text-center mb-20">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-black text-visacore-navy mb-6">
                Nos <span className="text-visacore-gold italic serif">Valeurs</span>
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto font-medium">
                Les principes qui guident chacune de nos actions et décisions.
              </p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, i) => (
              <ScrollReveal key={value.title} delay={i * 0.08}>
                <div className="group bg-white border border-border rounded-[30px] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500">
                  <div className="size-14 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center mb-6 group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-500">
                    <value.icon className="size-7" />
                  </div>
                  <h3 className="text-xl font-black text-visacore-navy mb-3">{value.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{value.description}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Local Presence CTA */}
      <section className="section-padding px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="bg-visacore-navy rounded-[60px] p-12 md:p-24 relative overflow-hidden">
              <div className="absolute inset-0 bg-noise opacity-5" />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />

              <div className="relative z-10 text-center">
                <div className="size-20 rounded-full bg-visacore-gold/10 border border-visacore-gold/20 flex items-center justify-center mx-auto mb-8">
                  <MapPin className="size-10 text-visacore-gold" />
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                  Basés à <span className="text-visacore-gold italic serif">Lomé</span>
                </h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                  Notre bureau situé sur le Boulevard du 13 Janvier à Lomé vous accueille du lundi au vendredi
                  de 8h à 18h et le samedi de 9h à 13h.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/contact">
                    <button className="h-16 px-10 rounded-full bg-visacore-gold text-white font-black hover:scale-105 transition-all shadow-2xl shadow-visacore-gold/30">
                      Prendre Rendez-vous
                    </button>
                  </Link>
                  <Link href="/evaluation">
                    <button className="h-16 px-10 rounded-full border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                      Évaluation en Ligne
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}
