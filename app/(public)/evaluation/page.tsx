import type { Metadata } from "next"
import { LeadForm } from "@/components/public/lead-form"
import { Shield, Clock, CheckCircle, Sparkles, Star, Users } from "lucide-react"
import { PageHeroBackground } from "@/components/public/page-hero-background"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getCaptchaServerConfig } from "@/lib/captcha.server"
import { buildPageMetadata } from "@/lib/metadata"
import { getStaticHeroBackground } from "@/lib/public-hero-backgrounds"

export const metadata: Metadata = buildPageMetadata({
  path: "/evaluation",
  title: "Évaluation gratuite",
  description:
    "Obtenez une évaluation gratuite de votre profil d'immigration en 24 heures. Découvrez vos options pour le Canada, les États-Unis et l'Europe.",
})

export default function EvaluationPage() {
  const captchaConfig = getCaptchaServerConfig()
  const heroBackground = getStaticHeroBackground("evaluation")

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <PageHeroBackground {...heroBackground} />

        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <Sparkles className="size-4" />
                Évaluation Gratuite
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Votre Avenir <br /><span className="text-visacore-gold italic serif">Commence</span> Ici
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium max-w-2xl mx-auto">
                Remplissez le formulaire et nos experts analyseront votre profil pour identifier les meilleures options d&apos;immigration pour vous.
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <div className="mt-12 flex flex-wrap items-center justify-center gap-8">
                {[
                  { icon: Clock, label: "Réponse en 24h" },
                  { icon: Shield, label: "100% confidentiel" },
                  { icon: CheckCircle, label: "Sans engagement" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-6 py-3">
                    <item.icon className="size-5 text-visacore-gold" />
                    <span className="text-sm font-bold text-white/80">{item.label}</span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-5 lg:gap-16">
            {/* Left: Benefits */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <p className="text-xs font-black uppercase tracking-[0.28em] text-visacore-gold">
                  Ce que vous obtenez
                </p>
                <h2 className="mt-4 text-4xl font-black text-visacore-navy mb-5">
                  Pourquoi Nous <span className="text-visacore-gold serif italic">Choisir</span> ?
                </h2>
                <p className="max-w-xl text-lg leading-relaxed text-muted-foreground mb-10">
                  Votre evaluation doit clarifier les options, les risques et les priorites. Nous avons resserre cette page autour de ce premier objectif.
                </p>

                <div className="space-y-7">
                  {[
                    { number: "Clair", label: "Diagnostic Structuré", text: "Nous analysons votre situation de manière lisible pour identifier les options les plus pertinentes." },
                    { number: "Humain", label: "Accompagnement Réel", text: "Vous échangez avec une équipe qui contextualise votre projet et vos documents." },
                    { number: "24h", label: "Délai de Réponse", text: "Votre profil sera analysé et vous recevrez un retour expert sous 24 heures." },
                  ].map((stat, i) => (
                    <ScrollReveal key={stat.label} delay={i * 0.1}>
                      <div className="grid grid-cols-[minmax(5.5rem,auto)_1fr] items-start gap-5 sm:gap-6">
                        <div className="flex min-h-16 min-w-[5.5rem] items-center justify-center rounded-[1.75rem] bg-visacore-navy px-4 py-3 text-center shadow-lg shadow-visacore-navy/10">
                          <span className="text-[clamp(1.7rem,2.6vw,2.5rem)] font-black leading-none tracking-tight text-visacore-gold">
                            {stat.number}
                          </span>
                        </div>
                        <div className="pt-1">
                          <h4 className="text-balance text-lg font-black text-visacore-navy sm:text-xl">
                            {stat.label}
                          </h4>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
                            {stat.text}
                          </p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Trust Strip */}
                <ScrollReveal delay={0.4}>
                  <div className="mt-12 rounded-[34px] bg-visacore-gold p-7 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="relative z-10">
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex -space-x-3">
                          {[1,2,3].map(i => (
                            <div key={i} className="size-10 rounded-full border-3 border-visacore-gold bg-white/20 backdrop-blur-sm flex items-center justify-center">
                              <Users className="size-4" />
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-1">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className="size-4 fill-white text-white" />
                          ))}
                        </div>
                      </div>
                      <p className="font-black text-lg leading-tight">
                        Un échange clair en amont permet de cadrer le projet, les risques et les documents attendus.
                      </p>
                      <p className="mt-2 text-sm font-bold text-white/70">Approche structuree et confidentielle</p>
                    </div>
                  </div>
                </ScrollReveal>
              </ScrollReveal>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.2}>
                <div className="rounded-[42px] border border-visacore-navy/8 bg-white p-8 shadow-[0_28px_90px_-56px_rgba(10,37,64,0.3)] md:p-12">
                  <div className="mb-10 text-center">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
                      Formulaire
                    </p>
                    <h2 className="mt-4 text-3xl font-black text-visacore-navy mb-2 text-center">
                    Évaluation en 24h
                    </h2>
                    <p className="mx-auto max-w-xl text-center text-sm leading-6 text-muted-foreground">
                      Tous les champs marques d&apos;un * sont obligatoires. Plus vos informations sont precises, plus notre retour sera utile.
                    </p>
                  </div>
                  <LeadForm captchaSiteKey={captchaConfig.siteKey} />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
