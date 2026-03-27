import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Users,
  Handshake,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import {
  normalizeStructuredCardItems,
} from "@/lib/content-structures";
import { serviceIconMap } from "@/lib/public-content";

export const revalidate = 3600;

export async function generateStaticParams() {
  const services = await prisma.service.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return services.map((s) => ({ slug: s.slug }));
}

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

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
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    if (!service) {
      return { title: "Service introuvable" };
    }

    return {
      title: service.seoTitle || service.name,
      description:
        service.seoDescription ||
        service.description ||
        `${service.name} - VisaCore Solutions`,
    };
  } catch {
    return { title: "Service" };
  }
}

/* ────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────── */

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  let service;
  try {
    service = await prisma.service.findUnique({
      where: { slug },
    });
  } catch {
    notFound();
  }

  if (!service || !service.published) {
    notFound();
  }

  const Icon = serviceIconMap[service.icon || ""] || Globe;
  const benefits = normalizeStructuredCardItems(service.benefits);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-visacore-gold/10 blur-[120px]" />
        <div className="absolute -bottom-48 -left-24 w-96 h-96 bg-visacore-gold/20 rounded-full blur-[120px] opacity-40" />

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <ScrollReveal>
              <Link
                href="/services"
                className="mb-8 inline-flex items-center gap-2 text-sm font-bold text-white/50 transition-colors hover:text-visacore-gold"
              >
                <ChevronRight className="size-4 rotate-180" />
                Tous les services
              </Link>

              <div className="mx-auto mb-8 size-20 rounded-3xl border border-visacore-gold/30 bg-visacore-gold/10 flex items-center justify-center">
                <Icon className="size-10 text-visacore-gold" />
              </div>

              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                {service.name}
              </h1>
              {service.description && (
                <p className="text-xl text-white/60 leading-relaxed font-medium max-w-2xl mx-auto">
                  {service.description}
                </p>
              )}
              <div className="mt-10">
                <Link
                  href="/evaluation"
                  className="inline-flex h-16 items-center gap-3 rounded-full bg-visacore-gold px-10 text-lg font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105"
                >
                  Demander Ce Service
                  <ArrowRight className="size-5" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Who Is It For & Required Support */}
      {(service.whoIsItFor || service.requiredSupport) && (
        <section className="section-padding bg-background">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {service.whoIsItFor && (
                <ScrollReveal>
                  <div className="bg-white border border-border rounded-[40px] p-12 shadow-sm hover:shadow-2xl transition-shadow duration-500 h-full">
                    <div className="size-16 rounded-2xl bg-visacore-navy flex items-center justify-center mb-8">
                      <Users className="size-8 text-visacore-gold" />
                    </div>
                    <h2 className="text-3xl font-black text-visacore-navy mb-6">
                      À Qui s&apos;Adresse Ce Service ?
                    </h2>
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed font-medium">
                      {service.whoIsItFor}
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {service.requiredSupport && (
                <ScrollReveal delay={0.15}>
                  <div className="bg-visacore-navy rounded-[40px] p-12 h-full relative overflow-hidden group">
                    <div className="absolute top-0 right-0 size-48 bg-visacore-gold/10 rounded-full -mr-24 -mt-24 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                    <div className="relative z-10">
                      <div className="size-16 rounded-2xl bg-visacore-gold/10 border border-visacore-gold/20 flex items-center justify-center mb-8">
                        <Handshake className="size-8 text-visacore-gold" />
                      </div>
                      <h2 className="text-3xl font-black text-white mb-6">
                        Notre Accompagnement
                      </h2>
                      <div className="whitespace-pre-line text-white/60 leading-relaxed font-medium">
                        {service.requiredSupport}
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="section-padding bg-gray-50 border-y border-border">
          <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
              <ScrollReveal>
                <div className="inline-flex items-center gap-2 rounded-full bg-visacore-gold/10 px-4 py-1.5 text-xs font-black uppercase tracking-widest text-visacore-gold mb-6">
                  Avantages
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-visacore-navy leading-tight">
                  Les Avantages de Notre <span className="text-visacore-gold serif italic">Service</span>
                </h2>
              </ScrollReveal>

              <div className="space-y-8">
                {benefits.map((benefit, i) => (
                  <ScrollReveal key={i} delay={i * 0.1}>
                    <div className="flex gap-6 group">
                      <div className="size-12 shrink-0 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-500">
                        <CheckCircle2 className="size-6" />
                      </div>
                      <div>
                        <h3 className="text-lg font-black text-visacore-navy mb-2">
                          {benefit.title}
                        </h3>
                        <p className="text-muted-foreground leading-relaxed">
                          {benefit.description}
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
                  {service.ctaText || `Prêt pour ${service.name} ?`}
                </h2>
                <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                  Contactez nos experts pour une évaluation gratuite de votre profil
                  et un accompagnement personnalisé.
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                  <Link
                    href="/evaluation"
                    className="inline-flex h-16 items-center gap-3 rounded-full bg-visacore-gold px-10 font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105"
                  >
                    Évaluation Gratuite
                    <ArrowRight className="size-5" />
                  </Link>
                  <Link
                    href="/contact"
                    className="inline-flex h-16 items-center rounded-full border-2 border-white/20 px-10 font-bold text-white transition-all hover:bg-white/10"
                  >
                    Nous Contacter
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
