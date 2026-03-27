import Link from "next/link";
import type { Metadata } from "next";
import { Globe, ArrowRight, Sparkles } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { PageHeroBackground } from "@/components/public/page-hero-background";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { getStaticHeroBackground } from "@/lib/public-hero-backgrounds";
import { fallbackServices, serviceIconMap } from "@/lib/public-content";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Nos Services",
  description:
    "Expertise en visa études, travail, tourisme, affaires et immigration permanente.",
};

export default async function ServicesPage() {
  let services = fallbackServices;
  const heroBackground = getStaticHeroBackground("services")

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
                <Sparkles className="size-4" />
                Savoir-Faire
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white leading-none mb-8">
                Expertises <br /><span className="text-visacore-gold italic serif">Sur Mesure</span>
              </h1>
              <p className="text-xl text-white/60 leading-relaxed font-medium">
                Chaque projet d&apos;immigration est unique. Nous déployons une expertise pointue pour transformer vos ambitions en réalité concrète.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service, i) => {
              const Icon = serviceIconMap[service.icon] || Globe;
              return (
                <ScrollReveal key={service.slug} delay={i * 0.1}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="group flex flex-col bg-white border border-border rounded-[40px] p-10 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 h-full"
                  >
                    <div className="size-16 rounded-2xl bg-visacore-navy text-visacore-gold flex items-center justify-center mb-8 group-hover:bg-visacore-gold group-hover:text-white transition-colors duration-500">
                      <Icon className="size-8" />
                    </div>

                    <h2 className="text-3xl font-black text-visacore-navy group-hover:text-visacore-gold transition-colors mb-4">
                      {service.name}
                    </h2>
                    <p className="text-muted-foreground leading-relaxed font-medium flex-1">
                      {service.description}
                    </p>

                    <div className="mt-10 pt-8 border-t border-border flex items-center justify-between group-hover:border-visacore-gold/30 transition-colors">
                      <span className="font-black text-visacore-navy uppercase tracking-widest text-sm">Découvrir l&apos;offre</span>
                      <div className="size-10 rounded-full bg-visacore-gold/10 text-visacore-gold flex items-center justify-center group-hover:bg-visacore-gold group-hover:text-white transition-all">
                        <ArrowRight className="size-5" />
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Process Section for Services */}
      <section className="section-padding bg-gray-50">
         <div className="container-custom">
            <div className="bg-visacore-navy rounded-[60px] p-12 md:p-24 relative overflow-hidden">
               <div className="absolute inset-0 bg-noise opacity-5" />
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                  <ScrollReveal>
                     <h2 className="text-4xl md:text-6xl font-black text-white leading-tight">
                        Une approche <br /><span className="text-visacore-gold serif italic">Résultat</span>
                     </h2>
                     <p className="mt-8 text-xl text-white/50 leading-relaxed">
                        Notre taux de réussite exceptionnel repose sur une préparation chirurgicale des dossiers et une veille constante des lois d&apos;immigration.
                     </p>
                  </ScrollReveal>
                  
                  <div className="space-y-10">
                     {[
                       { title: "Évaluation 360°", text: "Nous analysons chaque aspect de votre profil pour identifier les failles potentielles." },
                       { title: "Optimisation de Dossier", text: "Nous structurons vos preuves pour qu'elles parlent d'elles-mêmes aux officiers." },
                       { title: "Garantie de Conformité", text: "Zéro erreur tolérée. Chaque document est vérifié par deux experts." }
                     ].map((item, i) => (
                       <ScrollReveal key={i} delay={0.2 + i * 0.1}>
                          <div className="flex gap-6">
                             <div className="text-visacore-gold font-black text-2xl italic">0{i+1}.</div>
                             <div>
                                <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                <p className="text-white/40 leading-relaxed">{item.text}</p>
                             </div>
                          </div>
                       </ScrollReveal>
                     ))}
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  );
}
