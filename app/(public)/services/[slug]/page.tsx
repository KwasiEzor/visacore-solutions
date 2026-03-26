import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  Globe,
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  FileCheck,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Users,
  Handshake,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

/* ────────────────────────────────────────────────
   Types
   ──────────────────────────────────────────────── */

interface Benefit {
  title: string;
  description: string;
}

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  Globe,
  FileCheck,
};

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

  const Icon = iconMap[service.icon || ""] || Globe;
  const benefits = (service.benefits as Benefit[] | null) || [];

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2540] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#0A2540]" />
        <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-[#C9A227]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Link
              href="/services"
              className="mb-6 inline-flex items-center gap-1 text-sm text-white/60 transition-colors hover:text-[#C9A227]"
            >
              <ChevronRight className="size-4 rotate-180" />
              Tous les services
            </Link>

            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/10">
              <Icon className="size-8 text-[#C9A227]" />
            </div>

            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              {service.name}
            </h1>
            {service.description && (
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {service.description}
              </p>
            )}
            <div className="mt-8">
              <Link
                href="/evaluation"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620]"
              >
                Demander ce service
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Who Is It For & Required Support */}
      {(service.whoIsItFor || service.requiredSupport) && (
        <section className="py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {service.whoIsItFor && (
                <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[#0A2540]">
                    <Users className="size-6 text-[#C9A227]" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-[#0A2540]">
                    À qui s&apos;adresse ce service ?
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {service.whoIsItFor}
                  </div>
                </div>
              )}

              {service.requiredSupport && (
                <div className="rounded-2xl border border-border/50 bg-white p-8 shadow-sm">
                  <div className="flex size-12 items-center justify-center rounded-lg bg-[#C9A227]/10">
                    <Handshake className="size-6 text-[#C9A227]" />
                  </div>
                  <h2 className="mt-5 text-2xl font-bold text-[#0A2540]">
                    Notre accompagnement
                  </h2>
                  <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
                    {service.requiredSupport}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits.length > 0 && (
        <section className="bg-gray-50/80 py-20 sm:py-28">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
                Avantages
              </p>
              <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
                Les avantages de notre service
              </h2>
            </div>

            <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10">
                    <CheckCircle2 className="size-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-[#0A2540]">
                      {benefit.title}
                    </h3>
                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                      {benefit.description}
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
            {service.ctaText || `Prêt à bénéficier de notre service ${service.name} ?`}
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Contactez nos experts pour une évaluation gratuite de votre profil
            et un accompagnement personnalisé.
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
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
