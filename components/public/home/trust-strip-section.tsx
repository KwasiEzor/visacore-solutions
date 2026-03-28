import { Users, FileCheck, Globe, FolderCheck, Shield, UserCheck } from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import type { ElementType } from "react";

interface TrustCapability {
  icon: ElementType;
  title: string;
  detail: string;
}

const trustCapabilities: TrustCapability[] = [
  {
    icon: FileCheck,
    title: "Étude de dossier",
    detail: "Analyse rigoureuse de votre profil et des pièces déjà disponibles.",
  },
  {
    icon: Globe,
    title: "Stratégie visa",
    detail: "Choix du programme, de la destination et du calendrier les plus cohérents.",
  },
  {
    icon: FolderCheck,
    title: "Préparation documentaire",
    detail: "Structuration claire des preuves pour réduire les zones d'incertitude.",
  },
  {
    icon: Shield,
    title: "Suivi administratif",
    detail: "Pilotage des dépôts, relances et prochaines étapes du dossier.",
  },
  {
    icon: UserCheck,
    title: "Accompagnement humain",
    detail: "Un échange réel avec une équipe qui contextualise chaque décision.",
  },
];

export function TrustStripSection() {
  return (
    <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_100%)] py-10 md:py-16">
      <div className="container-custom">
        <div className="overflow-hidden rounded-[28px] border border-visacore-navy/8 bg-white shadow-[0_25px_80px_-50px_rgba(10,37,64,0.28)] sm:rounded-[36px]">
          <div className="grid grid-cols-1 gap-0 lg:grid-cols-[0.95fr_1.45fr]">
            {/* Left: intro text */}
            <div className="relative border-b border-border/70 p-6 sm:p-10 lg:border-b-0 lg:border-r">
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/45 to-transparent" />
              <ScrollReveal>
                <p className="text-xs font-black uppercase tracking-[0.32em] text-visacore-gold">
                  Notre méthode
                </p>
                <h2 className="mt-4 max-w-sm text-[2rem] font-black leading-[0.95] text-visacore-navy sm:text-4xl">
                  Un pilotage <span className="serif italic text-visacore-gold">premium</span>, de l&apos;analyse au dépôt.
                </h2>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted-foreground sm:mt-5 sm:text-base">
                  Nous ne vendons pas une simple checklist. Nous cadrons votre projet,
                  hiérarchisons les preuves et sécurisons chaque étape pour que le dossier
                  tienne autant sur le fond que sur la forme.
                </p>
                <div className="mt-7 inline-flex items-center gap-3 rounded-full border border-visacore-navy/10 bg-visacore-navy/4 px-4 py-3">
                  <div className="flex size-10 items-center justify-center rounded-full bg-visacore-navy text-visacore-gold">
                    <Users className="size-5" />
                  </div>
                  <div>
                    <p className="text-[11px] font-black uppercase tracking-[0.24em] text-visacore-gold">
                      VisaCore Process
                    </p>
                    <p className="text-sm font-bold text-visacore-navy">
                      Clarté, rigueur, accompagnement.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Right: capability grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2">
              {trustCapabilities.map((item, index) => {
                const Icon = item.icon;
                return (
                  <ScrollReveal key={item.title} delay={index * 0.06}>
                    <div
                      className={`group relative flex h-full min-h-[10.5rem] flex-col justify-between border-border/70 p-6 transition-colors duration-300 hover:bg-visacore-navy hover:text-white sm:min-h-[12rem] sm:p-8 ${
                        index % 2 === 0 ? "sm:border-r" : ""
                      } ${
                        index < trustCapabilities.length - 2 ? "border-b" : ""
                      } ${
                        index === trustCapabilities.length - 1 ? "sm:col-span-2" : ""
                      }`}
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/22 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-2xl bg-visacore-gold/10 text-visacore-gold transition-colors duration-300 group-hover:bg-white/10 group-hover:text-visacore-gold-light">
                          <Icon className="size-5" />
                        </div>
                        <span className="text-[11px] font-black uppercase tracking-[0.24em] text-visacore-navy/35 transition-colors duration-300 group-hover:text-white/30">
                          0{index + 1}
                        </span>
                      </div>
                      <div className="mt-6 sm:mt-8">
                        <h3 className="text-lg font-black tracking-tight text-visacore-navy transition-colors duration-300 group-hover:text-white sm:text-xl">
                          {item.title}
                        </h3>
                        <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground transition-colors duration-300 group-hover:text-white/70 sm:mt-3">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
