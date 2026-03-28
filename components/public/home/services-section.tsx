import Link from "next/link";
import { Globe, ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { serviceIconMap } from "@/lib/public-content";

interface ServiceItem {
  slug: string;
  name: string;
  icon: string;
  description: string;
}

interface ServicesSectionProps {
  services: ServiceItem[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <section className="section-padding bg-visacore-navy text-white overflow-hidden relative">
      <div className="absolute top-0 right-0 w-1/3 h-full bg-visacore-gold/5 blur-[120px]" />

      <div className="container-custom relative z-10">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-20">
          <ScrollReveal>
            <h2 className="mb-5 text-3xl font-black sm:text-4xl md:text-6xl">
              Un Accompagnement <br /><span className="text-visacore-gold serif italic">Intégral</span>
            </h2>
            <p className="text-base text-white/58 sm:text-lg">
              De l&apos;évaluation de votre éligibilité jusqu&apos;à votre accueil à destination.
            </p>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-4">
          {services.map((service, i) => {
            const Icon = serviceIconMap[service.icon] || Globe;
            return (
              <ScrollReveal key={service.slug} delay={i * 0.1}>
                <div className="group flex h-full min-h-[21rem] flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 transition-all duration-500 hover:-translate-y-2 hover:bg-visacore-gold sm:min-h-[23rem] sm:p-8 md:min-h-[24rem] md:rounded-3xl md:p-10">
                  <div className="mb-8 flex size-16 items-center justify-center rounded-2xl bg-visacore-gold text-white transition-colors group-hover:bg-visacore-navy group-hover:text-visacore-gold">
                    <Icon className="size-8" />
                  </div>
                  <h3 className="min-h-[4.5rem] text-balance text-xl font-black leading-tight sm:text-2xl md:min-h-[6rem]">
                    {service.name}
                  </h3>
                  <p className="mb-7 mt-4 line-clamp-6 text-sm leading-relaxed text-white/68 transition-colors group-hover:text-visacore-navy/82 sm:mb-8 sm:text-base">
                    {service.description}
                  </p>
                  <Link
                    href={`/services/${service.slug}`}
                    className="mt-auto inline-flex items-center gap-2 pt-2 text-base font-black group-hover:text-visacore-navy"
                  >
                    Détails <ArrowRight className="size-4" />
                  </Link>
                </div>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
