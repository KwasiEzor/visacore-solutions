import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, MapPin } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { ScrollReveal } from "@/components/public/scroll-reveal";

export const metadata: Metadata = {
  title: "Nos Destinations",
  description:
    "Explorez les pays d'immigration accompagnés par VisaCore Solutions : Canada, États-Unis, Europe.",
};

const staticDestinations = [
  {
    slug: "canada",
    name: "Canada",
    heroTitle: "Immigrez au Canada avec confiance",
    heroDescription:
      "Le Canada offre d'excellentes opportunités avec ses programmes variés : Entrée express, PVT, visa études et regroupement familial.",
    flag: "🇨🇦",
    image: "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "etats-unis",
    name: "États-Unis",
    heroTitle: "Concrétisez votre rêve américain",
    heroDescription:
      "Les États-Unis restent une destination de choix. Nous vous guidons à travers les différentes catégories de visas disponibles.",
    flag: "🇺🇸",
    image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
  },
  {
    slug: "europe",
    name: "Europe",
    heroTitle: "Découvrez les opportunités en Europe",
    heroDescription:
      "L'Europe offre un cadre de vie exceptionnel et de nombreuses opportunités professionnelles. France, Allemagne, Belgique et plus.",
    flag: "🇪🇺",
    image: "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
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
      destinations = dbDestinations.map((d, i) => ({
        slug: d.slug,
        name: d.name,
        heroTitle: d.heroTitle,
        heroDescription: d.heroDescription || "",
        flag: staticDestinations[i]?.flag || "🌍",
        image: staticDestinations[i]?.image || "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=800",
      }));
    }
  } catch {
    // Fallback
  }

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <div className="absolute inset-0 bg-noise opacity-5" />
        <div className="absolute top-0 right-0 w-1/2 h-full bg-visacore-gold/10 blur-[120px]" />
        
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
                <Link href="/evaluation">
                  <button className="h-16 px-10 rounded-full bg-visacore-gold text-white font-black hover:scale-105 transition-all">
                    Évaluation Personnalisée
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="h-16 px-10 rounded-full border-2 border-white/20 text-white font-bold hover:bg-white/10 transition-all">
                    Nous Contacter
                  </button>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>
    </div>
  );
}
