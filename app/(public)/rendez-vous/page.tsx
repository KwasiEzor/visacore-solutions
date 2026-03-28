import type { Metadata } from "next"
import Link from "next/link"
import { CalendarDays, Clock3, ShieldCheck, Sparkles } from "lucide-react"
import { AppointmentForm } from "@/components/public/appointment-form"
import { PageHeroBackground } from "@/components/public/page-hero-background"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import { getCaptchaServerConfig } from "@/lib/captcha.server"
import { getStaticHeroBackground } from "@/lib/public-hero-backgrounds"

export const metadata: Metadata = {
  title: "Rendez-vous",
  description:
    "Demandez un rendez-vous avec VisaCore Solutions pour cadrer votre projet d'immigration avec un conseiller.",
}

const commitments = [
  {
    icon: CalendarDays,
    title: "Validation rapide",
    description:
      "Chaque demande est relue par un conseiller avant confirmation du créneau.",
  },
  {
    icon: ShieldCheck,
    title: "Échange confidentiel",
    description:
      "Votre situation est étudiée avec discrétion et dans un cadre professionnel.",
  },
  {
    icon: Clock3,
    title: "Préparation utile",
    description:
      "Nous préparons l'entretien pour aller directement aux options concrètes.",
  },
]

export default async function AppointmentPage() {
  const heroBackground = getStaticHeroBackground("contact")
  const captchaConfig = getCaptchaServerConfig()

  return (
    <div className="pt-20">
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <PageHeroBackground {...heroBackground} />

        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <CalendarDays className="size-4" />
                Rendez-vous
              </div>
              <h1 className="mb-8 text-4xl font-black leading-none text-white sm:text-5xl md:text-7xl">
                Réservez un{" "}
                <span className="serif italic text-visacore-gold">
                  Temps Stratégique
                </span>
              </h1>
              <p className="mx-auto max-w-2xl text-lg leading-relaxed text-white/65 sm:text-xl">
                Partagez votre contexte, vos objectifs et vos disponibilités.
                Nous revenons vers vous avec un créneau pertinent et les
                prochaines étapes adaptées à votre dossier.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-20">
            <div className="lg:col-span-2">
              <ScrollReveal>
                <div className="rounded-[32px] border border-border bg-gray-50 p-8">
                  <h2 className="text-3xl font-black text-visacore-navy">
                    Pourquoi passer par un{" "}
                    <span className="serif italic text-visacore-gold">
                      rendez-vous
                    </span>
                    ?
                  </h2>
                  <p className="mt-4 text-base leading-relaxed text-muted-foreground">
                    Ce format est idéal si votre projet demande un cadrage
                    personnalisé, une revue de stratégie ou une orientation sur
                    les étapes prioritaires.
                  </p>

                  <div className="mt-8 space-y-4">
                    {commitments.map((item, index) => (
                      <ScrollReveal key={item.title} delay={index * 0.08}>
                        <div className="rounded-2xl bg-white p-5 shadow-sm">
                          <div className="mb-3 flex size-11 items-center justify-center rounded-xl bg-visacore-gold/10 text-visacore-gold">
                            <item.icon className="size-5" />
                          </div>
                          <h3 className="text-lg font-black text-visacore-navy">
                            {item.title}
                          </h3>
                          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </ScrollReveal>
                    ))}
                  </div>

                  <div className="mt-8 rounded-2xl bg-visacore-navy p-5 text-white">
                    <div className="flex items-center gap-3">
                      <Sparkles className="size-5 text-visacore-gold" />
                      <p className="text-sm font-bold uppercase tracking-wide text-visacore-gold">
                        Conseil
                      </p>
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-white/75">
                      Si votre besoin est encore exploratoire, vous pouvez aussi
                      commencer par une{" "}
                      <Link
                        href="/evaluation"
                        className="font-semibold text-visacore-gold underline"
                      >
                        évaluation gratuite
                      </Link>
                      .
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="lg:col-span-3">
              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-border bg-white p-6 shadow-2xl shadow-visacore-navy/5 sm:rounded-[40px] sm:p-10 md:p-14">
                  <div className="mb-8 text-center sm:mb-10">
                    <h2 className="text-2xl font-black text-visacore-navy sm:text-3xl md:text-4xl">
                      Demande de{" "}
                      <span className="serif italic text-visacore-gold">
                        rendez-vous
                      </span>
                    </h2>
                    <p className="mt-2 text-sm text-muted-foreground sm:mt-3 sm:text-base">
                      Plus votre demande est précise, plus nous pouvons vous
                      proposer un échange utile dès le premier contact.
                    </p>
                  </div>

                  <AppointmentForm captchaSiteKey={captchaConfig.siteKey} />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
