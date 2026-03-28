import { ScrollReveal } from "@/components/public/scroll-reveal";

const STEPS = [
  { step: "01", title: "Diagnostic", text: "Analyse approfondie de votre situation et choix de la meilleure stratégie." },
  { step: "02", title: "Constitution", text: "Préparation méticuleuse de chaque document requis." },
  { step: "03", title: "Soumission", text: "Dépôt officiel et suivi constant auprès des autorités." },
  { step: "04", title: "Succès", text: "Obtention de votre visa et préparation au départ." },
] as const;

export function ProcessSection() {
  return (
    <section className="section-padding bg-gray-50 border-y border-border">
      <div className="container-custom">
        <div className="mb-12 text-center sm:mb-20">
          <ScrollReveal>
            <h2 className="mb-5 text-3xl font-black text-visacore-navy sm:text-4xl md:mb-6 md:text-6xl">
              Un Parcours <span className="text-visacore-gold italic serif">Serein</span>
            </h2>
            <p className="text-lg text-muted-foreground">Une méthodologie rigoureuse en 4 étapes clés.</p>
          </ScrollReveal>
        </div>

        <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
          {/* Connecting Line (Desktop) */}
          <div className="absolute top-12 left-0 w-full h-px bg-visacore-gold/20 hidden md:block" />

          {STEPS.map((item, i) => (
            <ScrollReveal key={item.step} delay={i * 0.1}>
              <div className="relative z-10">
                <div className="mx-auto mb-6 flex size-20 items-center justify-center rounded-full border-2 border-visacore-gold bg-white text-2xl font-black text-visacore-navy shadow-xl shadow-visacore-gold/5 sm:mb-8 sm:size-24 sm:text-3xl">
                  {item.step}
                </div>
                <h3 className="mb-3 text-center text-xl font-black text-visacore-navy sm:mb-4 sm:text-2xl">{item.title}</h3>
                <p className="text-muted-foreground text-center text-sm leading-relaxed">{item.text}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
