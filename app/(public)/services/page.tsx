import Link from "next/link";
import type { Metadata } from "next";
import {
  Globe,
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  FileCheck,
  ArrowRight,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nos Services",
  description:
    "Découvrez les services d'accompagnement en immigration de VisaCore Solutions : visa études, travail, tourisme, affaires, immigration permanente et préparation de dossier.",
};

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  Globe,
  FileCheck,
};

const staticServices = [
  {
    slug: "visa-etudes",
    name: "Visa Études",
    icon: "GraduationCap",
    description:
      "Accompagnement complet pour vos études à l'étranger : recherche d'établissements, dossier d'admission, demande de visa étudiant et préparation au départ. Nous vous guidons vers les meilleures universités du Canada, des États-Unis et de l'Europe.",
  },
  {
    slug: "visa-travail",
    name: "Visa Travail",
    icon: "Briefcase",
    description:
      "Obtenez votre permis de travail et lancez votre carrière internationale. Nous gérons l'ensemble du processus : recherche d'emploi qualifié, EIMT, demande de permis de travail et accompagnement à l'installation.",
  },
  {
    slug: "visa-tourisme",
    name: "Visa Tourisme",
    icon: "Plane",
    description:
      "Préparez vos voyages en toute sérénité avec notre service de visa touristique. Nous optimisons votre dossier pour maximiser vos chances d'approbation pour tout type de visa visiteur.",
  },
  {
    slug: "visa-affaires",
    name: "Visa Affaires",
    icon: "Building2",
    description:
      "Développez vos activités à l'international grâce à nos solutions de visa affaires. Participation à des salons, rencontres professionnelles, missions commerciales - nous facilitons vos déplacements professionnels.",
  },
  {
    slug: "immigration",
    name: "Immigration permanente",
    icon: "Globe",
    description:
      "Programmes d'immigration permanente : résidence permanente, programmes provinciaux, regroupement familial et investisseurs. Nous vous accompagnons dans la construction de votre nouvelle vie à l'étranger.",
  },
  {
    slug: "preparation-dossier",
    name: "Préparation de dossier",
    icon: "FileCheck",
    description:
      "Constitution et vérification minutieuse de votre dossier pour maximiser vos chances d'approbation. Traduction certifiée, authentification des documents et organisation complète de votre demande.",
  },
];

export default async function ServicesPage() {
  let services = staticServices;

  try {
    const dbServices = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (dbServices.length > 0) {
      services = dbServices.map((s) => ({
        slug: s.slug,
        name: s.name,
        icon: s.icon || "Globe",
        description: s.description || "",
      }));
    }
  } catch {
    // Use static fallback
  }

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2540] py-20 sm:py-28">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#0A2540]" />
        <div className="pointer-events-none absolute -top-40 right-0 size-[500px] rounded-full bg-[#C9A227]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-1.5 text-sm font-medium text-[#C9A227]">
              <Sparkles className="size-4" />
              Services
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Nos <span className="text-[#C9A227]">services</span>{" "}
              d&apos;immigration
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Des solutions complètes et personnalisées pour chaque étape de
              votre parcours migratoire. Quel que soit votre projet, nous avons
              l&apos;expertise pour vous accompagner.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = iconMap[service.icon] || Globe;
              return (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2540]/5"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A2540] to-[#C9A227] opacity-0 transition-opacity group-hover:opacity-100" />

                  <div className="p-8">
                    <div className="flex size-14 items-center justify-center rounded-xl bg-[#0A2540] text-white transition-colors group-hover:bg-[#C9A227]">
                      <Icon className="size-7" />
                    </div>

                    <h2 className="mt-6 text-xl font-bold text-[#0A2540]">
                      {service.name}
                    </h2>
                    <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                      {service.description}
                    </p>

                    <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] transition-colors group-hover:text-[#A88620]">
                      En savoir plus
                      <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#0A2540] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">
            Besoin d&apos;un accompagnement{" "}
            <span className="text-[#C9A227]">sur mesure</span> ?
          </h2>
          <p className="mt-4 text-lg text-white/60">
            Chaque situation est unique. Nos consultants analysent votre profil
            gratuitement et vous recommandent le meilleur parcours.
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
