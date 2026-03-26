import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Globe,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  FileText,
  Lightbulb,
  Star,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

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
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2540] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#0A2540]" />
        <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-[#C9A227]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/destinations"
              className="mb-6 inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#C9A227]"
            >
              <ChevronRight className="size-4 rotate-180" />
              Toutes les destinations
            </Link>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {destination.heroTitle}
            </h1>
            {destination.heroDescription && (
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {destination.heroDescription}
              </p>
            )}
            <div className="mt-8">
              <Link
                href="/evaluation"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620]"
              >
                Évaluer mon profil pour {destination.name}
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Opportunities */}
      {opportunities.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
                Opportunités
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
                Pourquoi choisir {destination.name} ?
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {opportunities.map((opp, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 bg-white p-7 shadow-sm"
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[#C9A227]/10">
                    <Lightbulb className="size-6 text-[#C9A227]" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#0A2540]">
                    {opp.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {opp.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Visa Categories */}
      {visaCategories.length > 0 && (
        <section className="bg-gray-50/80 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
                Types de visa
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
                Catégories de visa pour {destination.name}
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visaCategories.map((cat, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-border/50 bg-white p-7 shadow-sm"
                >
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[#0A2540]">
                    <FileText className="size-6 text-[#C9A227]" />
                  </div>
                  <h3 className="mt-5 text-lg font-bold text-[#0A2540]">
                    {cat.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {cat.description}
                  </p>
                  {cat.duration && (
                    <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-[#0A2540]/5 px-3 py-1 text-xs font-medium text-[#0A2540]">
                      Durée : {cat.duration}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose */}
      {whyChoose.length > 0 && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
                Nos atouts
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
                Pourquoi nous choisir pour {destination.name}
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {whyChoose.map((item, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10">
                    <CheckCircle2 className="size-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A2540]">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {item.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#0A2540] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            {destination.ctaText ||
              `Prêt à commencer votre aventure vers ${destination.name} ?`}
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Nos experts en immigration vers {destination.name} sont prêts à
            évaluer votre profil et vous proposer la meilleure stratégie.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/evaluation"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620]"
            >
              Évaluation gratuite
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/5"
            >
              Prendre rendez-vous
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
