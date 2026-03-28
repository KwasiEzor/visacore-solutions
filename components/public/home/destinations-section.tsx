import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";

interface DestinationItem {
  slug: string;
  name: string;
  heroTitle: string;
  heroDescription: string;
  image: string;
  flag: string;
}

interface DestinationsSectionProps {
  destinations: DestinationItem[];
}

export function DestinationsSection({ destinations }: DestinationsSectionProps) {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="mb-12 flex flex-col gap-5 md:mb-16 md:flex-row md:items-end md:justify-between md:gap-6">
          <div className="max-w-2xl">
            <ScrollReveal>
              <h2 className="mb-4 text-3xl font-black text-visacore-navy sm:text-4xl md:mb-6 md:text-6xl">
                Nos <span className="text-visacore-gold italic serif">Destinations</span> PHARES
              </h2>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-xl">
                Nous maîtrisons les rouages complexes des systèmes d&apos;immigration les plus prisés au monde.
              </p>
            </ScrollReveal>
          </div>
          <ScrollReveal delay={0.2}>
            <Link href="/destinations" className="inline-flex items-center gap-2 font-black text-visacore-gold hover:underline">
              Voir toutes les destinations <ArrowRight className="size-5" />
            </Link>
          </ScrollReveal>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 md:gap-8">
          {destinations.map((dest, i) => (
            <ScrollReveal key={dest.slug} delay={i * 0.1}>
              <Link href={`/destinations/${dest.slug}`} className="group relative block h-[380px] overflow-hidden rounded-[28px] sm:h-[440px] md:h-[500px] md:rounded-3xl">
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${dest.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-visacore-navy via-visacore-navy/20 to-transparent" />
                <div className="absolute bottom-0 left-0 w-full p-6 sm:p-8">
                  <span className="text-4xl mb-4 block">{dest.flag}</span>
                  <h3 className="mb-2 text-[1.8rem] font-black text-white sm:text-3xl">{dest.name}</h3>
                  <p className="mb-5 line-clamp-2 text-sm text-white/70 transition-colors group-hover:text-visacore-gold sm:mb-6 sm:text-base">{dest.heroTitle}</p>
                  <div className="h-12 w-12 rounded-full bg-visacore-gold text-white flex items-center justify-center -translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300">
                    <ArrowRight className="size-6" />
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
