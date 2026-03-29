import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { buildPageMetadata } from "@/lib/metadata";
import { PageHeroBackground } from "@/components/public/page-hero-background";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { getStaticHeroBackground } from "@/lib/public-hero-backgrounds";
import {
  fallbackDestinations,
  getDestinationVisual,
} from "@/lib/public-content";

export const revalidate = 3600;

export const metadata: Metadata = buildPageMetadata({
  path: "/destinations",
  title: "Nos Destinations",
  description:
    "Explorez les pays d'immigration accompagnés par VisaCore Solutions : Canada, États-Unis, Europe.",
});

export default async function DestinationsPage() {
  let destinations = fallbackDestinations;
  const heroBackground = getStaticHeroBackground("destinations")

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
        ...getDestinationVisual(d.slug),
      }));
    }
  } catch {
    // Fallback
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <PageHeroBackground {...heroBackground} />
        
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <MapPin className="size-4" />
                Exploration
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Nos <span className="text-visacore-gold italic serif">Destinations</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                Chaque pays est un nouveau chapitre. Nous maîtrisons les systèmes d&apos;immigration les plus complexes pour faire de votre transition une réussite totale.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest, i) => (
              <ScrollReveal key={dest.slug} delay={i * 0.1}>
                <Link
                  href={`/destinations/${dest.slug}`}
                  className="group block relative overflow-hidden rounded-[40px] bg-white border border-border shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-72 overflow-hidden">
                    <div 
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                      style={{ backgroundImage: `url(${dest.image})` }}
                    />
                    <div className="absolute inset-0 bg-visacore-navy/20 group-hover:bg-transparent transition-colors duration-500" />
                    <div className="absolute top-6 right-6 size-14 rounded-2xl bg-white/90 backdrop-blur-md flex items-center justify-center text-3xl shadow-xl">
                      {dest.flag}
                    </div>
                  </div>

                  <div className="p-10">
                    <h2 className="text-3xl font-black text-visacore-navy group-hover:text-visacore-gold transition-colors">
                      {dest.name}
                    </h2>
                    <p className="mt-4 text-muted-foreground leading-relaxed font-medium line-clamp-3">
                      {dest.heroDescription}
                    </p>

                    <div className="mt-8 flex items-center gap-2 font-black text-visacore-navy group-hover:gap-4 transition-all">
                      Découvrir le programme
                      <ArrowRight className="size-5 text-visacore-gold" />
                    </div>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-visacore-navy relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="bg-white/5 border border-white/10 rounded-[60px] p-12 md:p-20 text-center">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-black text-white mb-8">
                Une autre <span className="text-visacore-gold italic serif">Ambition</span> ?
              </h2>
              <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
                Nos experts étudient également des projets vers d&apos;autres destinations mondiales. Parlons de votre vision.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <Link
                  href="/evaluation"
                  className="inline-flex h-16 items-center rounded-full bg-visacore-gold px-10 font-black text-white transition-all hover:scale-105"
                >
                  Évaluation Personnalisée
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-16 items-center rounded-full border-2 border-white/20 px-10 font-bold text-white transition-all hover:bg-white/10"
                >
                  Nous Contacter
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
