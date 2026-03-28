import Image from "next/image";
import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { buildHomePageContent } from "@/lib/page-content.shared";

type PageContent = ReturnType<typeof buildHomePageContent>;

interface HeroSectionProps {
  pageContent: PageContent;
}

export function HeroSection({ pageContent }: HeroSectionProps) {
  return (
    <section className="relative flex min-h-[92svh] items-center overflow-hidden pb-14 pt-24 sm:min-h-screen sm:pb-16 sm:pt-28">
      {/* Full-bleed Background Image */}
      <div className="absolute inset-0 z-0">
        {/* priority flag enables LCP preload */}
        <Image
          src="https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center scale-105"
        />
        <div className="absolute inset-0 bg-visacore-navy/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-visacore-navy via-visacore-navy/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-visacore-navy to-transparent" />
        <div className="absolute -bottom-48 right-1/4 w-[600px] h-[600px] bg-visacore-gold/15 rounded-full blur-[150px]" />
      </div>

      <div className="container-custom relative z-10">
        <div className="max-w-4xl">
          <ScrollReveal>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-visacore-gold backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-widest">
              <Globe className="size-4" />
              <span>{pageContent.hero.content.eyebrow}</span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={0.1}>
            <h1 className="mb-6 max-w-5xl text-[2.9rem] font-black leading-[0.94] text-white sm:mb-8 sm:text-5xl md:text-7xl lg:text-8xl">
              {pageContent.hero.title}
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={0.2}>
            <p className="mb-10 max-w-xl text-base leading-relaxed text-white/72 sm:mb-12 sm:max-w-2xl sm:text-xl md:text-2xl">
              {pageContent.hero.subtitle}
            </p>
          </ScrollReveal>

          <ScrollReveal delay={0.3}>
            <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
              <Link
                href="/evaluation"
                className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-visacore-gold px-7 text-base font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105 hover:bg-visacore-gold-dark sm:h-16 sm:px-10 sm:text-lg"
              >
                {pageContent.hero.content.primaryCta}
                <ArrowRight className="size-6" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:h-16 sm:px-10 sm:text-lg"
              >
                {pageContent.hero.content.secondaryCta}
              </Link>
            </div>
          </ScrollReveal>

          {/* Trust stats */}
          <ScrollReveal delay={0.4}>
            <div className="mt-12 space-y-4 sm:mt-16">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/40 sm:text-sm sm:tracking-[0.3em]">
                  {pageContent.trust.title}
                </p>
                {pageContent.trust.subtitle && (
                  <p className="mt-2 max-w-xl text-sm text-white/50">
                    {pageContent.trust.subtitle}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-8">
                {pageContent.trust.content.stats.map((stat) => (
                  <div key={`${stat.value}-${stat.label}`} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                    <span className="text-2xl font-black text-visacore-gold sm:text-3xl">{stat.value}</span>
                    <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55 sm:text-sm sm:tracking-widest">{stat.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Scroll</span>
          <div className="w-px h-12 bg-gradient-to-b from-visacore-gold to-transparent animate-pulse" />
        </div>
      </div>
    </section>
  );
}
