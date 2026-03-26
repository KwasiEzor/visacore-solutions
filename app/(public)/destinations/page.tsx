import Link from "next/link";
import type { Metadata } from "next";
import { Globe, ArrowRight, ChevronRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Nos Destinations",
  description:
    "Découvrez les destinations d'immigration accompagnées par VisaCore Solutions : Canada, États-Unis, Europe et bien plus.",
};

const staticDestinations = [
  {
    slug: "canada",
    name: "Canada",
    heroTitle: "Immigrez au Canada avec confiance",
    heroDescription:
      "Le Canada offre d'excellentes opportunités d'immigration avec ses programmes variés : Entrée express, PVT, visa études, regroupement familial et plus encore.",
    flag: "🇨🇦",
  },
  {
    slug: "etats-unis",
    name: "États-Unis",
    heroTitle: "Concrétisez votre rêve américain",
    heroDescription:
      "Les États-Unis restent une destination de choix pour les études, le travail et l'immigration. Nous vous guidons à travers les différentes catégories de visas disponibles.",
    flag: "🇺🇸",
  },
  {
    slug: "europe",
    name: "Europe",
    heroTitle: "Découvrez les opportunités en Europe",
    heroDescription:
      "L'Europe offre un cadre de vie exceptionnel et de nombreuses opportunités professionnelles et académiques. France, Allemagne, Belgique et bien d'autres destinations.",
    flag: "🇪🇺",
  },
];

export default async function DestinationsPage() {
  let destinations = staticDestinations;

  try {
    const dbDestinations = await prisma.destination.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    if (dbDestinations.length > 0) {
      destinations = dbDestinations.map((d) => ({
        slug: d.slug,
        name: d.name,
        heroTitle: d.heroTitle,
        heroDescription: d.heroDescription || "",
        flag: "",
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
              <MapPin className="size-4" />
              Destinations
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              Nos <span className="text-[#C9A227]">destinations</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Explorez les pays où nous accompagnons nos clients. Chaque
              destination a ses spécificités, et nous maîtrisons les processus
              d&apos;immigration de chacune d&apos;entre elles.
            </p>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2540]/5"
              >
                {/* Top accent */}
                <div className="h-2 bg-gradient-to-r from-[#0A2540] to-[#C9A227]" />

                <div className="p-8">
                  <div className="flex size-16 items-center justify-center rounded-2xl bg-[#0A2540]/5 text-3xl">
                    {dest.flag || (
                      <Globe className="size-8 text-[#0A2540]" />
                    )}
                  </div>

                  <h2 className="mt-6 text-2xl font-bold text-[#0A2540]">
                    {dest.name}
                  </h2>
                  <p className="mt-1 text-base font-medium text-[#C9A227]">
                    {dest.heroTitle}
                  </p>

                  {dest.heroDescription && (
                    <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                      {dest.heroDescription}
                    </p>
                  )}

                  <span className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#C9A227] transition-colors group-hover:text-[#A88620]">
                    Découvrir cette destination
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gray-50/80 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
            Vous ne trouvez pas votre destination ?
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Contactez-nous pour discuter de votre projet. Nous pouvons vous
            accompagner vers d&apos;autres pays non listés ici.
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
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-[#0A2540] px-8 text-base font-semibold text-[#0A2540] transition-all hover:bg-[#0A2540] hover:text-white"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
