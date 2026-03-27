import Link from "next/link";
import {
  Users,
  Shield,
  Globe,
  UserCheck,
  ArrowRight,
  Quote,
  ChevronRight,
} from "lucide-react";
import { ScrollReveal } from "@/components/public/scroll-reveal";
import { prisma } from "@/lib/prisma";
import { getHomePageContent } from "@/lib/page-content";
import { buildHomePageContent } from "@/lib/page-content.shared";
import {
  fallbackDestinations,
  fallbackServices,
  fallbackTestimonials,
  getDestinationVisual,
  serviceIconMap,
} from "@/lib/public-content";

export const revalidate = 3600;

export default async function HomePage() {
  const pageContentPromise = getHomePageContent()
  let pageContent = buildHomePageContent([])
  let destinations = fallbackDestinations;
  let services = fallbackServices;
  let testimonials = fallbackTestimonials;

  try {
    const [resolvedPageContent, dbDestinations, dbServices, dbTestimonials] =
      await Promise.all([
        pageContentPromise,
        prisma.destination.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
          take: 3,
          select: {
            slug: true,
            name: true,
            heroTitle: true,
            heroDescription: true,
          },
        }),
        prisma.service.findMany({
          where: { published: true },
          orderBy: { order: "asc" },
          take: 4,
          select: {
            slug: true,
            name: true,
            icon: true,
            description: true,
          },
        }),
        prisma.testimonial.findMany({
          where: { published: true },
          orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
          take: 2,
          select: {
            id: true,
            clientName: true,
            destination: true,
            content: true,
            rating: true,
          },
        }),
      ]);

    pageContent = resolvedPageContent

    if (dbDestinations.length > 0) {
      destinations = dbDestinations.map((destination) => ({
        slug: destination.slug,
        name: destination.name,
        heroTitle: destination.heroTitle,
        heroDescription: destination.heroDescription || "",
        ...getDestinationVisual(destination.slug),
      }));
    }

    if (dbServices.length > 0) {
      services = dbServices.map((service) => ({
        slug: service.slug,
        name: service.name,
        icon: service.icon || "Globe",
        description: service.description || "",
      }));
    }

    if (dbTestimonials.length > 0) {
      testimonials = dbTestimonials.map((testimonial) => ({
        ...testimonial,
        destination: testimonial.destination || "Internationale",
      }));
    }
  } catch {
    // Fall back to static content when database reads are unavailable.
  }

  return (
    <div className="relative">
      {/* Background Noise Overlay */}
      <div className="bg-noise fixed inset-0 z-[-1]" />

      {/* ═══════════════════════════════════════════
          HERO SECTION (Full-bleed Cinematic)
          ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Full-bleed Background Image */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000")',
            }}
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-visacore-navy/70" />
          {/* Gradient overlay from left for text area */}
          <div className="absolute inset-0 bg-gradient-to-r from-visacore-navy via-visacore-navy/80 to-transparent" />
          {/* Bottom gradient for smooth transition */}
          <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-visacore-navy to-transparent" />
          {/* Gold accent glow */}
          <div className="absolute -bottom-48 right-1/4 w-[600px] h-[600px] bg-visacore-gold/15 rounded-full blur-[150px]" />
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl">
            <ScrollReveal>
              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-visacore-gold text-sm font-bold uppercase tracking-widest mb-8">
                <Globe className="size-4" />
                <span>{pageContent.hero.content.eyebrow}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white leading-[0.9] mb-8 max-w-5xl">
                {pageContent.hero.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed mb-12">
                {pageContent.hero.subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col sm:flex-row gap-6">
                <Link
                  href="/evaluation"
                  className="inline-flex h-16 items-center gap-3 rounded-full bg-visacore-gold px-10 text-lg font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105 hover:bg-visacore-gold-dark"
                >
                  {pageContent.hero.content.primaryCta}
                  <ArrowRight className="size-6" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-16 items-center rounded-full border border-white/30 bg-white/10 px-10 text-lg font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20"
                >
                  {pageContent.hero.content.secondaryCta}
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust badges inline */}
            <ScrollReveal delay={0.4}>
              <div className="mt-16 space-y-4">
                <div>
                  <p className="text-sm font-black text-white/40 uppercase tracking-[0.3em]">
                    {pageContent.trust.title}
                  </p>
                  {pageContent.trust.subtitle && (
                    <p className="mt-2 text-sm text-white/50">
                      {pageContent.trust.subtitle}
                    </p>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-8">
                  {pageContent.trust.content.stats.map((stat) => (
                    <div key={`${stat.value}-${stat.label}`} className="flex items-center gap-3">
                      <span className="text-3xl font-black text-visacore-gold">{stat.value}</span>
                      <span className="text-sm font-bold text-white/50 uppercase tracking-widest">{stat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-bold text-white/30 uppercase tracking-widest">Scroll</span>
            <div className="w-px h-12 bg-gradient-to-b from-visacore-gold to-transparent animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST STRIP
          ═══════════════════════════════════════════ */}
      <section className="bg-white py-12 border-b border-border">
        <div className="container-custom">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-700">
             <span className="text-xl font-black tracking-tighter">ÉTUDE DE DOSSIER</span>
             <span className="text-xl font-black tracking-tighter">STRATÉGIE VISA</span>
             <span className="text-xl font-black tracking-tighter">PRÉPARATION DOCUMENTAIRE</span>
             <span className="text-xl font-black tracking-tighter">SUIVI ADMINISTRATIF</span>
             <span className="text-xl font-black tracking-tighter">ACCOMPAGNEMENT HUMAIN</span>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DESTINATIONS (Modern Grid)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div className="max-w-2xl">
              <ScrollReveal>
                <h2 className="text-4xl md:text-6xl font-black text-visacore-navy mb-6">
                  Nos <span className="text-visacore-gold italic serif">Destinations</span> PHARES
                </h2>
                <p className="text-xl text-muted-foreground leading-relaxed">
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {destinations.map((dest, i) => (
              <ScrollReveal key={dest.slug} delay={i * 0.1}>
                <Link href={`/destinations/${dest.slug}`} className="group block relative overflow-hidden rounded-3xl h-[500px]">
                  <div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                    style={{ backgroundImage: `url(${dest.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-visacore-navy via-visacore-navy/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-8 w-full">
                    <span className="text-4xl mb-4 block">{dest.flag}</span>
                    <h3 className="text-3xl font-black text-white mb-2">{dest.name}</h3>
                    <p className="text-white/70 line-clamp-2 mb-6 group-hover:text-visacore-gold transition-colors">{dest.heroTitle}</p>
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

      {/* ═══════════════════════════════════════════
          SERVICES (Clean Luxury Grid)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-visacore-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-visacore-gold/5 blur-[120px]" />
        
        <div className="container-custom relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <ScrollReveal>
              <h2 className="text-4xl md:text-6xl font-black mb-6">Un Accompagnement <br /><span className="text-visacore-gold serif italic">Intégral</span></h2>
              <p className="text-lg text-white/50">De l&apos;évaluation de votre éligibilité jusqu&apos;à votre accueil à destination.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {services.map((service, i) => {
              const Icon = serviceIconMap[service.icon] || Globe

              return (
                <ScrollReveal key={service.slug} delay={i * 0.1}>
                  <div className="group bg-white/5 border border-white/10 p-10 rounded-3xl h-full hover:bg-visacore-gold transition-all duration-500 hover:-translate-y-2">
                    <div className="size-16 rounded-2xl bg-visacore-gold text-white flex items-center justify-center mb-8 group-hover:bg-visacore-navy group-hover:text-visacore-gold transition-colors">
                      <Icon className="size-8" />
                    </div>
                    <h3 className="text-2xl font-black mb-4">{service.name}</h3>
                    <p className="text-white/50 group-hover:text-visacore-navy/80 transition-colors mb-8">{service.description}</p>
                    <Link href={`/services/${service.slug}`} className="inline-flex items-center gap-2 font-bold group-hover:text-visacore-navy">
                      Détails <ArrowRight className="size-4" />
                    </Link>
                  </div>
                </ScrollReveal>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY US (Bento Box Style)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ScrollReveal>
                <h2 className="text-4xl md:text-7xl font-black text-visacore-navy">Pourquoi Faire <span className="text-visacore-gold italic serif">Confiance</span> à VisaCore ?</h2>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[
                  { icon: Shield, title: "Sécurité & Éthique", text: "Nous traitons vos données et votre dossier avec la plus grande rigueur éthique." },
                  { icon: UserCheck, title: "Suivi Personnalisé", text: "Chaque client bénéficie d'un consultant dédié pour un accompagnement serein." }
                ].map((item, i) => (
                  <ScrollReveal key={item.title} delay={i * 0.1}>
                    <div className="flex gap-6">
                      <div className="size-14 shrink-0 rounded-2xl bg-visacore-gold/10 text-visacore-gold flex items-center justify-center">
                        <item.icon className="size-7" />
                      </div>
                      <div>
                        <h4 className="text-xl font-black text-visacore-navy mb-2">{item.title}</h4>
                        <p className="text-muted-foreground">{item.text}</p>
                      </div>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>

            <ScrollReveal delay={0.3} className="h-full">
              <div className="bg-visacore-gold rounded-[40px] p-12 text-white h-full relative overflow-hidden group">
                 <div className="absolute top-0 right-0 size-40 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-150 transition-transform duration-700" />
                 <h3 className="text-4xl font-black mb-8 leading-tight">Votre Succès est Notre Seule <span className="underline decoration-visacore-navy decoration-4 underline-offset-8">Priorité</span>.</h3>
                 <div className="space-y-6">
                    <div className="flex items-center gap-4">
                       <span className="text-5xl font-black text-visacore-navy">Clair</span>
                       <span className="font-bold leading-tight opacity-80">Un cadre de <br /> décision lisible</span>
                    </div>
                    <div className="flex items-center gap-4">
                       <span className="text-5xl font-black text-visacore-navy">Suivi</span>
                       <span className="font-bold leading-tight opacity-80">Un accompagnement <br /> à chaque étape</span>
                    </div>
                 </div>
                 <Link
                    href="/evaluation"
                    className="mt-12 inline-flex h-14 items-center rounded-full bg-visacore-navy px-8 font-bold text-white transition-all hover:bg-visacore-navy-light"
                 >
                    Commencer l&apos;Évaluation
                 </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROCESS (Modern Minimalist)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-gray-50 border-y border-border">
         <div className="container-custom">
            <div className="text-center mb-20">
               <ScrollReveal>
                  <h2 className="text-4xl md:text-6xl font-black text-visacore-navy mb-6">Un Parcours <span className="text-visacore-gold italic serif">Serein</span></h2>
                  <p className="text-lg text-muted-foreground">Une méthodologie rigoureuse en 4 étapes clés.</p>
               </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative">
               {/* Connecting Line (Desktop) */}
               <div className="absolute top-12 left-0 w-full h-px bg-visacore-gold/20 hidden md:block" />
               
               {[
                 { step: "01", title: "Diagnostic", text: "Analyse approfondie de votre situation et choix de la meilleure stratégie." },
                 { step: "02", title: "Constitution", text: "Préparation méticuleuse de chaque document requis." },
                 { step: "03", title: "Soumission", text: "Dépôt officiel et suivi constant auprès des autorités." },
                 { step: "04", title: "Succès", text: "Obtention de votre visa et préparation au départ." }
               ].map((item, i) => (
                 <ScrollReveal key={item.step} delay={i * 0.1}>
                    <div className="relative z-10">
                       <div className="size-24 rounded-full bg-white border-2 border-visacore-gold flex items-center justify-center text-3xl font-black text-visacore-navy mb-8 mx-auto shadow-xl shadow-visacore-gold/5">
                          {item.step}
                       </div>
                       <h3 className="text-2xl font-black text-visacore-navy text-center mb-4">{item.title}</h3>
                       <p className="text-muted-foreground text-center text-sm leading-relaxed">{item.text}</p>
                    </div>
                 </ScrollReveal>
               ))}
            </div>
         </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS (Elegant Slider Style)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-background overflow-hidden">
         <div className="container-custom">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
               <div>
                  <ScrollReveal>
                    <div className="text-visacore-gold font-black tracking-widest uppercase mb-4">Paroles de Clients</div>
                    <h2 className="text-5xl md:text-7xl font-black text-visacore-navy mb-10 leading-none">Ils ont <br /><span className="text-visacore-gold italic serif">Ouvert</span> une nouvelle porte.</h2>
                    <Link href="/temoignages" className="group inline-flex items-center gap-3 text-xl font-black text-visacore-navy">
                       Voir tous les récits <ChevronRight className="size-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                  </ScrollReveal>
               </div>
               
               <div className="space-y-8">
                  {testimonials.map((t, i) => (
                    <ScrollReveal key={t.id} delay={i * 0.2}>
                       <div className="bg-white p-12 rounded-[40px] shadow-2xl shadow-visacore-navy/5 border border-border/50 relative">
                          <Quote className="absolute -top-6 -left-6 size-12 text-visacore-gold fill-visacore-gold" />
                          <p className="text-xl italic text-visacore-navy mb-8 leading-relaxed">
                             &ldquo;{t.content}&rdquo;
                          </p>
                          <div className="flex items-center gap-4">
                             <div className="size-14 rounded-2xl bg-visacore-navy flex items-center justify-center text-visacore-gold text-xl font-black">
                                {t.clientName.split(' ').map(n => n[0]).join('')}
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

      {/* ═══════════════════════════════════════════
          FINAL CALL TO ACTION (Magnetic)
          ═══════════════════════════════════════════ */}
      <section className="section-padding px-4">
         <div className="max-w-6xl mx-auto">
            <ScrollReveal>
               <div className="bg-visacore-navy rounded-[60px] p-12 md:p-24 text-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-noise opacity-5" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />
                  
                  <div className="relative z-10">
                     <h2 className="text-4xl md:text-8xl font-black text-white mb-10 leading-[0.9]">Prêt pour le <br /><span className="text-visacore-gold italic serif">Grand</span> Saut ?</h2>
                     <p className="text-xl md:text-2xl text-white/50 mb-16 max-w-2xl mx-auto">
                        Votre évaluation est le premier pas. Rapide, gratuite et sans engagement.
                     </p>
                     
                     <div className="flex flex-col md:flex-row items-center justify-center gap-8">
                        <Link
                           href="/evaluation"
                           className="inline-flex h-20 items-center rounded-full bg-visacore-gold px-12 text-xl font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105"
                        >
                           Démarrer Mon Dossier
                        </Link>
                        <div className="flex -space-x-4">
                           {[1,2,3,4].map(i => (
                             <div key={i} className="size-14 rounded-full border-4 border-visacore-navy bg-visacore-gold/20 backdrop-blur-sm flex items-center justify-center text-visacore-gold font-black">
                                <Users className="size-6" />
                             </div>
                           ))}
                           <div className="pl-6 flex flex-col items-start justify-center">
                              <span className="text-white font-black text-xl">Conseil</span>
                              <span className="text-white/40 text-sm font-bold uppercase tracking-widest leading-none">personnalisé</span>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </ScrollReveal>
         </div>
      </section>
    </div>
  );
}
