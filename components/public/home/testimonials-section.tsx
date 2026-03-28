import Link from "next/link";
import { Quote, ChevronRight } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";

interface TestimonialItem {
  id: string;
  clientName: string;
  destination: string;
  content: string;
  rating: number;
}

interface TestimonialsSectionProps {
  testimonials: TestimonialItem[];
}

export function TestimonialsSection({ testimonials }: TestimonialsSectionProps) {
  return (
    <section className="section-padding bg-background overflow-hidden">
      <div className="container-custom">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
          <div>
            <ScrollReveal>
              <div className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-visacore-gold sm:text-sm sm:tracking-widest">
                Paroles de Clients
              </div>
              <h2 className="mb-8 text-4xl font-black leading-none text-visacore-navy sm:text-5xl md:mb-10 md:text-7xl">
                Ils ont <br /><span className="text-visacore-gold italic serif">Ouvert</span> une nouvelle porte.
              </h2>
              <Link href="/temoignages" className="group inline-flex items-center gap-3 text-lg font-black text-visacore-navy sm:text-xl">
                Voir tous les récits <ChevronRight className="size-6 group-hover:translate-x-2 transition-transform" />
              </Link>
            </ScrollReveal>
          </div>

          <div className="space-y-6 sm:space-y-8">
            {testimonials.map((t, i) => (
              <ScrollReveal key={t.id} delay={i * 0.2}>
                <div className="relative rounded-[30px] border border-border/50 bg-white p-7 shadow-2xl shadow-visacore-navy/5 sm:rounded-[40px] sm:p-12">
                  <Quote className="absolute -left-3 -top-3 size-9 fill-visacore-gold text-visacore-gold sm:-left-6 sm:-top-6 sm:size-12" />
                  <p className="mb-6 text-lg italic leading-relaxed text-visacore-navy sm:mb-8 sm:text-xl">
                    &ldquo;{t.content}&rdquo;
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-visacore-navy text-lg font-black text-visacore-gold sm:size-14 sm:text-xl">
                      {t.clientName.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <div className="font-black text-visacore-navy">{t.clientName}</div>
                      <div className="text-visacore-gold font-bold text-sm">Visa {t.destination}</div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
