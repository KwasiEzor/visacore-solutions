import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lightbulb,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/public/scroll-reveal";

export const revalidate = 3600;

export async function generateStaticParams() {
  const destinations = await prisma.destination.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return destinations.map((d) => ({ slug: d.slug }));
}

/* ────────────────────────────────────────────────
   Types for JSON fields
   ──────────────────────────────────────────────── */

interface Opportunity {
  title: string;
  description: string;
}

interface VisaCategory {
  name: string;
  description: string;
  duration?: string;
}

interface WhyChooseItem {
  title: string;
  description: string;
}

/* ────────────────────────────────────────────────
   generateMetadata
   ──────────────────────────────────────────────── */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  try {
    const destination = await prisma.destination.findUnique({
      where: { slug },
    });

    if (!destination) {
      return { title: "Destination introuvable" };
    }

    return {
      title: destination.seoTitle || destination.name,
      description:
        destination.seoDescription ||
        destination.heroDescription ||
        `Immigration vers ${destination.name} - VisaCore Solutions`,
    };
  } catch {
    return { title: "Destination" };
  }
}

/* ────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────── */

export default async function DestinationPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let destination;
  try {
    destination = await prisma.destination.findUnique({
      where: { slug },
    });
  } catch {
    notFound();
  }

  if (!destination || !destination.published) {
    notFound();
  }

  const opportunities = (destination.opportunities as Opportunity[] | null) || [];
  const visaCategories = (destination.visaCategories as VisaCategory[] | null) || [];
  const whyChoose = (destination.whyChoose as WhyChooseItem[] | null) || [];

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 right-0 w-2/3 h-full bg-visacore-gold/10 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 w-96 h-96 bg-visacore-gold/20 rounded-full blur-[120px] opacity-40" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <Link
                href="/destinations"
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors hover:text-visacore-gold"
              >
                <ChevronRight className="size-4 rotate-180" />
                Toutes les destinations
              </Link>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                {destination.heroTitle}
              </h1>
              {destination.heroDescription && (
                <p className="text-xl text-white/60 leading-relaxed font-medium max-w-2xl mx-auto">
                  {destination.heroDescription}
                </p>
              )}
              <div className="mt-10">
                <Link href="/evaluation">
                  <button className="h-16 px-10 rounded-full bg-visacore-gold text-white font-black text-lg shadow-2xl shadow-visacore-gold/30 hover:scale-105 transition-all inline-flex items-center gap-3">
                    Évaluer Mon Profil pour {destination.name}
                    <ArrowRight className="size-5" />
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="text-center mb-20">
              <ScrollReveal>
                <h2 className="text-4xl md:text-6xl font-black text-visacore-navy mb-6">
                  Pourquoi <span className="text-visacore-gold italic serif">{destination.name}</span> ?
                </h2>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {opportunities.map((opp, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="group bg-white border border-border rounded-[30px] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 h-full">
                    <div className="size-14 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center mb-6 group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-500">
                      <Lightbulb className="size-7" />
                    </div>
                    <h3 className="text-xl font-black text-visacore-navy mb-3">
                      {opp.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {opp.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visa Categories */}
      {visaCategories.length > 0 && (
        <section className="section-padding bg-gray-50 border-y border-border">
          <div className="container-custom">
            <div className="text-center mb-20">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-visacore-gold mb-6">
                  Types de Visa
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-visacore-navy">
                  Catégories de Visa
                </h2>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {visaCategories.map((cat, i) => (
                <ScrollReveal key={i} delay={i * 0.08}>
                  <div className="bg-white border border-border rounded-[30px] p-10 shadow-sm hover:shadow-xl transition-shadow duration-500 h-full">
                    <div className="size-14 rounded-2xl bg-visacore-navy flex items-center justify-center mb-6">
                      <FileText className="size-7 text-visacore-gold" />
                    </div>
                    <h3 className="text-xl font-black text-visacore-navy mb-3">
                      {cat.name}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {cat.description}
                    </p>
                    {cat.duration && (
                      <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-visacore-navy/5 px-4 py-2 text-sm font-bold text-visacore-navy">
                        Durée : {cat.duration}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Us */}
      {whyChoose.length > 0 && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-visacore-gold mb-6">
                  Nos Atouts
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-visacore-navy leading-tight">
                  Pourquoi Nous <span className="text-visacore-gold serif italic">Choisir</span> ?
                </h2>
              </ScrollReveal>

              <div className="space-y-8">
                {whyChoose.map((item, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="flex gap-6 group">
                      <div className="size-12 shrink-0 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-500">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-visacore-navy mb-2">
                          {item.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
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
                <h2 className="text-4xl md:text-6xl font-black text-white mb-8 leading-tight">
                  {destination.ctaText ||
                    `Prêt pour ${destination.name} ?`}
                </h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                  Nos experts en immigration vers {destination.name} sont prêts à
                  évaluer votre profil et vous proposer la meilleure stratégie.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link href="/evaluation">
                    <button className="h-16 px-10 rounded-full bg-visacore-gold text-white font-black hover:scale-105 transition-all shadow-2xl shadow-visacore-gold/30 inline-flex items-center gap-3">
                      Évaluation Gratuite
                      <ArrowRight className="size-5" />
                    </button>
                  </Link>
                  <Link href="/contact">
                    <button className="h-16 px-10 rounded-full border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                      Prendre Rendez-vous
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
