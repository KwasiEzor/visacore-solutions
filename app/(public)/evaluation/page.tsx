import type { Metadata } from "next"
import { LeadForm } from "@/components/public/lead-form"
import { Shield, Clock, CheckCircle, Sparkles, Star, Users } from "lucide-react"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getCaptchaServerConfig } from "@/lib/captcha.server"

export const metadata: Metadata = {
  title: "Évaluation gratuite",
  description: "Obtenez une évaluation gratuite de votre profil d'immigration en 24 heures. Découvrez vos options pour le Canada, les États-Unis et l'Europe.",
}

export default function EvaluationPage() {
  const captchaConfig = getCaptchaServerConfig()

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-visacore-gold/10 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 w-96 h-96 bg-visacore-gold/20 rounded-full blur-[120px] opacity-40" />

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
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
            {/* Left: Benefits */}
            <div className="lg:col-span-2">
              <ScrollReveal>
                <h2 className="text-4xl font-black text-visacore-navy mb-6">
                  Pourquoi Nous <span className="text-visacore-gold serif italic">Choisir</span> ?
                </h2>
                <p className="text-lg text-muted-foreground font-medium mb-12 leading-relaxed">
                  Votre évaluation est le premier pas vers un nouveau chapitre. Voici ce qui nous distingue.
                </p>

                <div className="space-y-8">
                  {[
                    { number: "Clair", label: "Diagnostic Structuré", text: "Nous analysons votre situation de manière lisible pour identifier les options les plus pertinentes." },
                    { number: "Humain", label: "Accompagnement Réel", text: "Vous échangez avec une équipe qui contextualise votre projet et vos documents." },
                    { number: "24h", label: "Délai de Réponse", text: "Votre profil sera analysé et vous recevrez un retour expert sous 24 heures." },
                  ].map((stat, i) => (
                    <ScrollReveal key={stat.label} delay={i * 0.1}>
                      <div className="flex gap-6">
                        <div className="size-16 shrink-0 rounded-2xl bg-visacore-navy flex items-center justify-center">
                          <span className="text-xl font-black text-visacore-gold">{stat.number}</span>
                        </div>
                        <div>
                          <h4 className="text-lg font-black text-visacore-navy">{stat.label}</h4>
                          <p className="text-muted-foreground text-sm mt-1">{stat.text}</p>
                        </div>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>

                {/* Trust Strip */}
                <ScrollReveal delay={0.4}>
                  <div className="mt-16 p-8 rounded-[40px] bg-visacore-gold text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 size-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-3xl" />
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-4">
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
                      <p className="mt-2 text-sm font-bold text-white/70">Approche structurée et confidentielle</p>
                    </div>
                  </div>
                </ScrollReveal>
              </ScrollReveal>
            </div>

            {/* Right: Form */}
            <div className="lg:col-span-3">
              <ScrollReveal delay={0.2}>
                <div className="rounded-[50px] bg-white border border-border p-10 md:p-16 shadow-2xl shadow-visacore-navy/5">
                  <h2 className="text-3xl font-black text-visacore-navy mb-2 text-center">
                    Évaluation en 24h
                  </h2>
                  <p className="text-muted-foreground font-medium text-center mb-12">
                    Tous les champs marqués d&apos;un * sont obligatoires.
                  </p>
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
