import Link from "next/link";
import {
  Users,
  Shield,
  Globe,
  UserCheck,
  FileCheck,
  FolderCheck,
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

const trustCapabilities = [
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
] as const;

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
    <div className="relative overflow-x-clip">
      {/* Background Noise Overlay */}
      <div className="bg-noise fixed inset-0 z-[-1]" />

      {/* ═══════════════════════════════════════════
          HERO SECTION (Full-bleed Cinematic)
          ═══════════════════════════════════════════ */}
      <section className="relative flex min-h-[92svh] items-center overflow-hidden pb-14 pt-24 sm:min-h-screen sm:pb-16 sm:pt-28">
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
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.24em] text-visacore-gold backdrop-blur-sm sm:mb-8 sm:px-5 sm:py-2.5 sm:text-sm sm:tracking-widest">
                <Globe className="size-4" />
                <span>{pageContent.hero.content.eyebrow}</span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.1}>
              <h1 className="mb-6 max-w-5xl text-[2.9rem] font-black leading-[0.94] text-white sm:mb-8 sm:text-5xl md:text-7xl lg:text-8xl">
                {pageContent.hero.title}
              </h1>
            </ScrollReveal>

            <ScrollReveal delay={0.2}>
              <p className="mb-10 max-w-xl text-base leading-relaxed text-white/72 sm:mb-12 sm:max-w-2xl sm:text-xl md:text-2xl">
                {pageContent.hero.subtitle}
              </p>
            </ScrollReveal>

            <ScrollReveal delay={0.3}>
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
                <Link
                  href="/evaluation"
                  className="inline-flex h-14 items-center justify-center gap-3 rounded-full bg-visacore-gold px-7 text-base font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105 hover:bg-visacore-gold-dark sm:h-16 sm:px-10 sm:text-lg"
                >
                  {pageContent.hero.content.primaryCta}
                  <ArrowRight className="size-6" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex h-14 items-center justify-center rounded-full border border-white/30 bg-white/10 px-7 text-base font-bold text-white backdrop-blur-sm transition-all hover:bg-white/20 sm:h-16 sm:px-10 sm:text-lg"
                >
                  {pageContent.hero.content.secondaryCta}
                </Link>
              </div>
            </ScrollReveal>

            {/* Trust badges inline */}
            <ScrollReveal delay={0.4}>
              <div className="mt-12 space-y-4 sm:mt-16">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.26em] text-white/40 sm:text-sm sm:tracking-[0.3em]">
                    {pageContent.trust.title}
                  </p>
                  {pageContent.trust.subtitle && (
                    <p className="mt-2 max-w-xl text-sm text-white/50">
                      {pageContent.trust.subtitle}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-x-5 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:gap-8">
                  {pageContent.trust.content.stats.map((stat) => (
                    <div key={`${stat.value}-${stat.label}`} className="flex flex-col items-start gap-1 sm:flex-row sm:items-center sm:gap-3">
                      <span className="text-2xl font-black text-visacore-gold sm:text-3xl">{stat.value}</span>
                      <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/55 sm:text-sm sm:tracking-widest">{stat.label}</span>
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
      <section className="border-b border-border bg-[linear-gradient(180deg,#ffffff_0%,#f7f8fb_100%)] py-10 md:py-16">
        <div className="container-custom">
          <div className="overflow-hidden rounded-[28px] border border-visacore-navy/8 bg-white shadow-[0_25px_80px_-50px_rgba(10,37,64,0.28)] sm:rounded-[36px]">
            <div className="grid grid-cols-1 gap-0 lg:grid-cols-[0.95fr_1.45fr]">
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

              <div className="grid grid-cols-1 sm:grid-cols-2">
                {trustCapabilities.map((item, index) => (
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
                          <item.icon className="size-5" />
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DESTINATIONS (Modern Grid)
          ═══════════════════════════════════════════ */}
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

      {/* ═══════════════════════════════════════════
          SERVICES (Clean Luxury Grid)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-visacore-navy text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-visacore-gold/5 blur-[120px]" />
        
        <div className="container-custom relative z-10">
          <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-20">
            <ScrollReveal>
              <h2 className="mb-5 text-3xl font-black sm:text-4xl md:text-6xl">Un Accompagnement <br /><span className="text-visacore-gold serif italic">Intégral</span></h2>
              <p className="text-base text-white/58 sm:text-lg">De l&apos;évaluation de votre éligibilité jusqu&apos;à votre accueil à destination.</p>
            </ScrollReveal>
          </div>

          <div className="grid grid-cols-1 gap-4 md:auto-rows-fr md:grid-cols-2 xl:grid-cols-4">
            {services.map((service, i) => {
              const Icon = serviceIconMap[service.icon] || Globe

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
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:gap-8">
            <div className="space-y-6 lg:col-span-2 lg:space-y-8">
              <ScrollReveal>
                <h2 className="text-3xl font-black text-visacore-navy sm:text-4xl md:text-6xl lg:text-7xl">Pourquoi Faire <span className="text-visacore-gold italic serif">Confiance</span> à VisaCore ?</h2>
              </ScrollReveal>
              
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
                {[
                  { icon: Shield, title: "Sécurité & Éthique", text: "Nous traitons vos données et votre dossier avec la plus grande rigueur éthique." },
                  { icon: UserCheck, title: "Suivi Personnalisé", text: "Chaque client bénéficie d'un consultant dédié pour un accompagnement serein." }
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
                 <h3 className="mb-6 text-3xl font-black leading-tight sm:mb-8 sm:text-4xl">Votre Succès est Notre Seule <span className="underline decoration-visacore-navy decoration-4 underline-offset-8">Priorité</span>.</h3>
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

      {/* ═══════════════════════════════════════════
          PROCESS (Modern Minimalist)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-gray-50 border-y border-border">
         <div className="container-custom">
            <div className="mb-12 text-center sm:mb-20">
               <ScrollReveal>
                  <h2 className="mb-5 text-3xl font-black text-visacore-navy sm:text-4xl md:mb-6 md:text-6xl">Un Parcours <span className="text-visacore-gold italic serif">Serein</span></h2>
                  <p className="text-lg text-muted-foreground">Une méthodologie rigoureuse en 4 étapes clés.</p>
               </ScrollReveal>
            </div>

            <div className="relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-12">
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

      {/* ═══════════════════════════════════════════
          TESTIMONIALS (Elegant Slider Style)
          ═══════════════════════════════════════════ */}
      <section className="section-padding bg-background overflow-hidden">
         <div className="container-custom">
            <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-2 lg:items-center lg:gap-20">
               <div>
                  <ScrollReveal>
                    <div className="mb-4 text-[11px] font-black uppercase tracking-[0.24em] text-visacore-gold sm:text-sm sm:tracking-widest">Paroles de Clients</div>
                    <h2 className="mb-8 text-4xl font-black leading-none text-visacore-navy sm:text-5xl md:mb-10 md:text-7xl">Ils ont <br /><span className="text-visacore-gold italic serif">Ouvert</span> une nouvelle porte.</h2>
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
               <div className="relative overflow-hidden rounded-[34px] bg-visacore-navy p-7 text-center sm:rounded-[48px] sm:p-10 md:rounded-[60px] md:p-24">
                  <div className="absolute inset-0 bg-noise opacity-5" />
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />
                  
                  <div className="relative z-10">
                     <h2 className="mb-6 text-3xl font-black leading-[0.92] text-white sm:mb-8 sm:text-5xl md:mb-10 md:text-8xl">Prêt pour le <br /><span className="text-visacore-gold italic serif">Grand</span> Saut ?</h2>
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
                           {[1,2,3,4].map(i => (
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
    </div>
  );
}
