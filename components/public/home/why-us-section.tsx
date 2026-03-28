import Link from "next/link";
import { Shield, UserCheck } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";

export function WhyUsSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-custom">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
          <div className="space-y-6 lg:col-span-2 lg:space-y-8">
            <ScrollReveal>
              <h2 className="text-3xl font-black text-visacore-navy sm:text-4xl md:text-6xl lg:text-7xl">
                Pourquoi Faire <span className="text-visacore-gold italic serif">Confiance</span> à VisaCore ?
              </h2>
            </ScrollReveal>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
              {[
                { icon: Shield, title: "Sécurité & Éthique", text: "Nous traitons vos données et votre dossier avec la plus grande rigueur éthique." },
                { icon: UserCheck, title: "Suivi Personnalisé", text: "Chaque client bénéficie d'un consultant dédié pour un accompagnement serein." },
              ].map((item, i) => (
                <ScrollReveal key={item.title} delay={i * 0.1}>
                  <div className="flex gap-4 sm:gap-6">
                    <div className="size-14 shrink-0 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center">
                      <item.icon className="size-7" />
                    </div>
                    <div>
                      <h4 className="mb-2 text-lg font-black text-visacore-navy sm:text-xl">{item.title}</h4>
                      <p className="text-muted-foreground">{item.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>

          <ScrollReveal delay={0.3} className="h-full">
            <div className="group relative h-full overflow-hidden rounded-[32px] bg-visacore-gold p-8 text-white sm:rounded-[40px] sm:p-12">
              <div className="absolute top-0 right-0 size-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="mb-6 text-3xl font-black leading-tight sm:mb-8 sm:text-4xl">
                Votre Succès est Notre Seule <span className="underline decoration-visacore-navy decoration-4 underline-offset-8">Priorité</span>.
              </h3>
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-visacore-navy sm:text-5xl">Clair</span>
                  <span className="font-bold leading-tight opacity-80">Un cadre de <br /> décision lisible</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-4xl font-black text-visacore-navy sm:text-5xl">Suivi</span>
                  <span className="font-bold leading-tight opacity-80">Un accompagnement <br /> à chaque étape</span>
                </div>
              </div>
              <Link
                href="/evaluation"
                className="mt-10 inline-flex h-14 items-center rounded-full bg-visacore-navy px-8 text-sm font-bold text-white transition-all hover:bg-visacore-navy-light sm:mt-12 sm:text-base"
              >
                Commencer l&apos;Évaluation
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
