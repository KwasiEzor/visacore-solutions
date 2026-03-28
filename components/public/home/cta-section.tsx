import Link from "next/link";
import { Users } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";

export function CtaSection() {
  return (
    <section className="section-padding px-4">
      <div className="max-w-6xl mx-auto">
        <ScrollReveal>
          <div className="relative overflow-hidden rounded-[34px] bg-visacore-navy p-7 text-center sm:rounded-[48px] sm:p-10 md:rounded-[60px] md:p-24">
            <div className="absolute inset-0 bg-noise opacity-5" />
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />

            <div className="relative z-10">
              <h2 className="mb-6 text-3xl font-black leading-[0.92] text-white sm:mb-8 sm:text-5xl md:mb-10 md:text-8xl">
                Prêt pour le <br /><span className="text-visacore-gold italic serif">Grand</span> Saut ?
              </h2>
              <p className="mx-auto mb-10 max-w-2xl text-base text-white/58 sm:mb-12 sm:text-xl md:mb-16 md:text-2xl">
                Votre évaluation est le premier pas. Rapide, gratuite et sans engagement.
              </p>

              <div className="flex flex-col items-center justify-center gap-8 md:flex-row">
                <Link
                  href="/evaluation"
                  className="inline-flex h-14 items-center rounded-full bg-visacore-gold px-8 text-base font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105 sm:h-16 sm:px-10 sm:text-lg md:h-20 md:px-12 md:text-xl"
                >
                  Démarrer Mon Dossier
                </Link>
                <div className="flex flex-col items-center gap-4 sm:flex-row sm:gap-0">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="size-14 rounded-full border-4 border-visacore-navy bg-visacore-gold/20 backdrop-blur-sm flex items-center justify-center text-visacore-gold font-black">
                        <Users className="size-6" />
                      </div>
                    ))}
                  </div>
                  <div className="flex flex-col items-center justify-center sm:pl-6 sm:items-start">
                    <span className="text-xl font-black text-white">Conseil</span>
                    <span className="text-white/40 text-sm font-bold uppercase tracking-widest leading-none">personnalisé</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
