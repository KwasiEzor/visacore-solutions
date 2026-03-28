import Link from "next/link";
import { ArrowRight, CheckCircle2, Compass, ShieldCheck } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { buildHomePageContent } from "@/lib/page-content.shared";

type PageContent = ReturnType<typeof buildHomePageContent>;

interface HeroSectionProps {
  pageContent: PageContent;
}

const assurancePoints = [
  "Orientation stratégique avant tout dépôt",
  "Lecture claire des preuves et des risques",
  "Accompagnement humain du premier échange au suivi",
] as const;

export function HeroSection({ pageContent }: HeroSectionProps) {
  const primaryStats = pageContent.trust.content.stats.slice(0, 3);

  return (
    <section className="relative overflow-hidden bg-visacore-navy pb-14 pt-24 sm:pb-16 sm:pt-28">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.22),transparent_34%),radial-gradient(circle_at_78%_18%,rgba(255,255,255,0.11),transparent_20%),linear-gradient(135deg,#0A2540_0%,#102f4e_48%,#07192B_100%)]" />
      <div className="absolute inset-y-0 right-[-14rem] hidden w-[36rem] rounded-full bg-visacore-gold/12 blur-[120px] lg:block" />
      <div className="absolute left-[-10rem] top-20 size-[24rem] rounded-full border border-white/10 lg:size-[30rem]" />
      <div className="absolute right-10 top-28 hidden size-32 rounded-full border border-white/8 lg:block" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:7.5rem_7.5rem] opacity-[0.14]" />

      <div className="container-custom relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.1fr)_26rem] lg:gap-14 xl:grid-cols-[minmax(0,1.1fr)_29rem]">
          <div className="max-w-4xl">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/8 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-visacore-gold backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-widest">
                <Compass className="size-4" />
                <span>{pageContent.hero.content.eyebrow}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.08}>
              <h1 className="max-w-5xl text-balance text-[2.9rem] font-black leading-[0.92] text-white sm:text-5xl md:text-7xl lg:text-[5.25rem]">
                {pageContent.hero.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.16}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/74 sm:mt-8 sm:text-xl md:text-[1.45rem]">
                {pageContent.hero.subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.24}>
              <div className="mt-8 flex flex-col gap-4 sm:mt-10 sm:flex-row sm:gap-5">
                <Link
                  href="/evaluation"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-visacore-gold px-7 text-base font-black text-white shadow-[0_24px_60px_-28px_rgba(201,162,39,0.6)] transition-all hover:-translate-y-0.5 hover:bg-visacore-gold-dark sm:h-16 sm:px-10 sm:text-lg"
                >
                  {pageContent.hero.content.primaryCta}
                  <ArrowRight className="size-5 sm:size-6" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/16 bg-white/8 px-7 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/12 sm:h-16 sm:px-10 sm:text-lg"
                >
                  {pageContent.hero.content.secondaryCta}
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.32}>
              <div className="mt-10 grid gap-3 sm:mt-12 sm:max-w-2xl sm:grid-cols-3">
                {primaryStats.map((stat) => (
                  <div
                    key={`${stat.value}-${stat.label}`}
                    className="rounded-[24px] border border-white/12 bg-white/[0.07] px-5 py-4 backdrop-blur-sm"
                  >
                    <p className="text-2xl font-black text-visacore-gold sm:text-[1.95rem]">
                      {stat.value}
                    </p>
                    <p className="mt-1 text-[11px] font-black uppercase tracking-[0.22em] text-white/58 sm:text-xs">
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

          <ScrollReveal delay={0.18} className="hidden lg:block">
            <div className="relative overflow-hidden rounded-[34px] border border-white/12 bg-white/[0.08] p-6 shadow-[0_30px_110px_-48px_rgba(0,0,0,0.58)] backdrop-blur-xl xl:p-7">
              <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/50 to-transparent" />
              <div className="flex items-center gap-3">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-visacore-gold/14 text-visacore-gold">
                  <ShieldCheck className="size-6" />
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/82">
                    Cadre de confiance
                  </p>
                  <h2 className="mt-2 text-2xl font-black text-white">
                    Un démarrage plus net, avant les démarches lourdes.
                  </h2>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {assurancePoints.map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3 rounded-[24px] border border-white/10 bg-visacore-navy/38 px-4 py-4"
                  >
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-visacore-gold" />
                    <p className="text-sm leading-6 text-white/72">{item}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-[28px] border border-visacore-gold/18 bg-gradient-to-br from-white/10 to-white/[0.04] p-5">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/72">
                  Prochaine étape
                </p>
                <p className="mt-3 text-lg font-black leading-tight text-white">
                  Évaluez votre profil, puis verrouillez un rendez-vous si le projet mérite un cadrage approfondi.
                </p>
                <div className="mt-5 flex flex-wrap gap-3 text-sm font-bold text-white/68">
                  <span className="rounded-full border border-white/10 px-3 py-2">Éligibilité</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Documents</span>
                  <span className="rounded-full border border-white/10 px-3 py-2">Calendrier</span>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
