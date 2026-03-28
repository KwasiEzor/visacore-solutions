"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ArrowRight,
  Briefcase,
  Calendar,
  ChevronDown,
  Clock3,
  FileText,
  Globe,
  MapPin,
  Menu,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
} from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  formatDisplayPhoneNumber,
  getTelHref,
  type PublicSiteConfig,
} from "@/lib/site-config.shared";
import { cn } from "@/lib/utils";

type HeaderServiceLink = {
  slug: string;
  name: string;
};

type HeaderDestinationLink = {
  slug: string;
  name: string;
  flag: string;
};

type NavigationLink = {
  href: string;
  label: string;
  description: string;
};

type MenuId = "destinations" | "services" | "project" | "portal" | "about";

interface HeaderProps {
  siteConfig: PublicSiteConfig;
  services: HeaderServiceLink[];
  destinations: HeaderDestinationLink[];
}

const desktopMenus: Array<{ id: MenuId; label: string; matchers: string[] }> = [
  {
    id: "destinations",
    label: "Destinations",
    matchers: ["/destinations"],
  },
  {
    id: "services",
    label: "Services",
    matchers: ["/services"],
  },
  {
    id: "project",
    label: "Votre projet",
    matchers: ["/rendez-vous", "/evaluation"],
  },
  {
    id: "portal",
    label: "Espace client",
    matchers: ["/espace-client", "/recuperer-acces"],
  },
  {
    id: "about",
    label: "À propos",
    matchers: ["/a-propos", "/temoignages", "/faq", "/privacy", "/terms"],
  },
] as const;

const desktopDirectLinks = [
  {
    href: "/",
    label: "Accueil",
    matchers: ["/"],
  },
  {
    href: "/contact",
    label: "Contact",
    matchers: ["/contact"],
  },
] as const;

const OPEN_DELAY_MS = 320;
const CLOSE_DELAY_MS = 180;

export function Header({ siteConfig, services, destinations }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<MenuId | null>(null);
  const pathname = usePathname();
  const desktopNavRef = useRef<HTMLDivElement | null>(null);
  const openTimerRef = useRef<number | null>(null);
  const closeTimerRef = useRef<number | null>(null);
  const isHome = pathname === "/";

  const destinationLinks: NavigationLink[] = [
    {
      href: "/destinations",
      label: "Toutes les destinations",
      description: "Vue d'ensemble des pays et programmes que nous accompagnons.",
    },
    ...destinations.map((destination) => ({
      href: `/destinations/${destination.slug}`,
      label: `${destination.flag} ${destination.name}`,
      description: `Explorer les parcours et options d'immigration vers ${destination.name}.`,
    })),
  ];

  const serviceLinks: NavigationLink[] = [
    {
      href: "/services",
      label: "Tous les services",
      description: "Comparer nos expertises et les accompagnements disponibles.",
    },
    ...services.map((service) => ({
      href: `/services/${service.slug}`,
      label: service.name,
      description: `Découvrir notre accompagnement pour ${service.name.toLowerCase()}.`,
    })),
  ];

  const projectLinks: NavigationLink[] = [
    {
      href: "/evaluation",
      label: "Évaluation gratuite",
      description: "Obtenez une première lecture stratégique de votre profil.",
    },
    {
      href: "/rendez-vous",
      label: "Prendre rendez-vous",
      description: "Choisissez un créneau avec un conseiller pour cadrer votre projet.",
    },
    {
      href: "/contact",
      label: "Nous écrire",
      description: "Partagez votre situation et recevez une réponse officielle.",
    },
    {
      href: "/faq",
      label: "FAQ pratique",
      description: "Préparez votre échange avec les réponses aux questions fréquentes.",
    },
  ];

  const portalLinks: NavigationLink[] = [
    {
      href: "/espace-client/connexion",
      label: "Connexion client",
      description: "Accéder à votre portail pour suivre les étapes, documents et mises à jour.",
    },
    {
      href: "/evaluation",
      label: "Demander un accès",
      description: "Ouvrir votre dossier pour recevoir ensuite vos accès sécurisés au portail.",
    },
    {
      href: "/recuperer-acces",
      label: "Première connexion / accès perdu",
      description: "Recevoir un lien sécurisé pour activer ou récupérer votre compte client.",
    },
    {
      href: "/rendez-vous",
      label: "Parler à un conseiller",
      description: "Réserver un échange si vous avez besoin d’aide avant l’ouverture du dossier.",
    },
  ];

  const aboutLinks: NavigationLink[] = [
    {
      href: "/a-propos",
      label: "Notre cabinet",
      description: "Valeurs, méthode de travail et niveau d'accompagnement proposé.",
    },
    {
      href: "/temoignages",
      label: "Témoignages clients",
      description: "Consultez les retours d'expérience de profils déjà accompagnés.",
    },
    {
      href: "/privacy",
      label: "Confidentialité",
      description: "Comprendre le traitement des données personnelles et vos droits.",
    },
    {
      href: "/terms",
      label: "Mentions légales",
      description: "Informations réglementaires, éditeur du site et conditions d'usage.",
    },
  ];

  const visibleDestinations = destinationLinks.slice(0, 5);
  const visibleServices = serviceLinks.slice(0, 5);
  const displayedPhone = formatDisplayPhoneNumber(siteConfig.contactPhone);

  const useSolidHeader = !isHome || isScrolled || mobileOpen || activeMenu !== null;

  const clearOpenTimer = () => {
    if (openTimerRef.current !== null) {
      window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }
  };

  const clearCloseTimer = () => {
    if (closeTimerRef.current !== null) {
      window.clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  };

  const openMenu = (menuId: MenuId, immediate = false) => {
    clearOpenTimer();
    clearCloseTimer();

    if (immediate || activeMenu !== null) {
      setActiveMenu(menuId);
      return;
    }

    openTimerRef.current = window.setTimeout(() => {
      setActiveMenu(menuId);
      openTimerRef.current = null;
    }, OPEN_DELAY_MS);
  };

  const scheduleClose = (delay = CLOSE_DELAY_MS) => {
    clearOpenTimer();
    clearCloseTimer();
    closeTimerRef.current = window.setTimeout(() => {
      setActiveMenu(null);
      closeTimerRef.current = null;
    }, delay);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) {
        setActiveMenu(null);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveMenu(null);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    return () => {
      clearOpenTimer();
      clearCloseTimer();
    };
  }, []);

  const isRouteActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const isMatcherActive = (matchers: readonly string[]) =>
    matchers.some((matcher) => isRouteActive(matcher));

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 animate-in slide-in-from-top-4 duration-500 transition-all",
        useSolidHeader
          ? "border-b border-visacore-navy/8 bg-white/92 py-2 shadow-[0_14px_50px_-36px_rgba(10,37,64,0.55)] backdrop-blur-xl sm:py-3"
          : "bg-transparent py-3 sm:py-5"
      )}
    >
      <div className="mx-auto flex max-w-[96rem] items-center justify-between gap-3 px-4 sm:px-6 xl:px-8">
        <Link href="/" className="relative z-10 shrink-0 transition-transform duration-300 hover:scale-[1.02]">
          <Image
            src="/images/visacore_solution_logo.png"
            alt="VisaCore Solutions"
            width={1094}
            height={315}
            className={cn(
              "w-auto transition-all duration-500",
              useSolidHeader
                ? "h-10 sm:h-11 lg:h-12 xl:h-14"
                : "h-11 sm:h-12 lg:h-14 xl:h-16 brightness-0 invert"
            )}
          />
        </Link>

        <div
          ref={desktopNavRef}
          className="relative hidden flex-1 items-center justify-center lg:flex"
          onMouseEnter={clearCloseTimer}
          onMouseLeave={() => scheduleClose()}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget as Node | null;
            if (!nextTarget || !event.currentTarget.contains(nextTarget)) {
              scheduleClose(0);
            }
          }}
        >
          <nav
            aria-label="Navigation principale"
            className={cn(
              "flex items-center gap-1 rounded-full border px-2 py-2 transition-all duration-300",
              useSolidHeader
                ? "border-visacore-navy/8 bg-visacore-navy/[0.03] shadow-[inset_0_1px_0_rgba(255,255,255,0.75)]"
                : "border-white/16 bg-white/10 shadow-[inset_0_1px_0_rgba(255,255,255,0.14)] backdrop-blur-md"
            )}
          >
            {desktopMenus.map((menu) => {
              const isActive = activeMenu === menu.id || isMatcherActive(menu.matchers);

              return (
                <button
                  key={menu.id}
                  type="button"
                  aria-expanded={activeMenu === menu.id}
                  aria-controls={`desktop-panel-${menu.id}`}
                  className={cn(
                    "group relative inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-[13px] font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-visacore-gold/35 xl:px-4 xl:text-sm",
                    isActive
                      ? "bg-visacore-gold/12 text-visacore-gold"
                      : useSolidHeader
                        ? "text-visacore-navy hover:bg-visacore-navy/[0.05] hover:text-visacore-gold"
                        : "text-white hover:bg-white/10 hover:text-visacore-gold"
                  )}
                  onMouseEnter={() => openMenu(menu.id)}
                  onFocus={() => openMenu(menu.id, true)}
                  onClick={() => setActiveMenu((current) => (current === menu.id ? null : menu.id))}
                >
                  <span>{menu.label}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 transition-transform duration-200",
                      activeMenu === menu.id && "rotate-180"
                    )}
                  />
                  {isActive && (
                    <span className="absolute inset-x-5 bottom-1 h-0.5 rounded-full bg-visacore-gold" />
                  )}
                </button>
              );
            })}

            {desktopDirectLinks.map((link) => {
              const isActive = isMatcherActive(link.matchers);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setActiveMenu(null)}
                  className={cn(
                    "relative rounded-full px-3.5 py-2.5 text-[13px] font-black transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-visacore-gold/35 xl:px-4 xl:text-sm",
                    isActive
                      ? "bg-visacore-gold/12 text-visacore-gold"
                      : useSolidHeader
                        ? "text-visacore-navy hover:bg-visacore-navy/[0.05] hover:text-visacore-gold"
                        : "text-white hover:bg-white/10 hover:text-visacore-gold"
                  )}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute inset-x-5 bottom-1 h-0.5 rounded-full bg-visacore-gold" />
                  )}
                </Link>
              );
            })}
          </nav>

          {activeMenu ? (
            <div
              id={`desktop-panel-${activeMenu}`}
              className="absolute top-full z-30 mt-4 w-[min(72rem,calc(100vw-2.5rem))] animate-in fade-in-0 slide-in-from-top-3 duration-200 xl:w-[min(74rem,calc(100vw-4rem))]"
              onMouseEnter={clearCloseTimer}
              onMouseLeave={() => scheduleClose()}
            >
              {renderDesktopPanel({
                activeMenu,
                aboutLinks,
                displayedPhone,
                destinationLinks: visibleDestinations,
                onNavigate: () => setActiveMenu(null),
                portalLinks,
                projectLinks,
                serviceLinks: visibleServices,
                siteConfig,
              })}
            </div>
          ) : null}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/espace-client/connexion"
            className={cn(
              "inline-flex items-center rounded-full border px-4 py-3 text-sm font-black transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-visacore-gold/35",
              isMatcherActive(["/espace-client", "/recuperer-acces"])
                ? "border-visacore-gold/25 bg-visacore-gold/10 text-visacore-gold"
                : useSolidHeader
                  ? "border-visacore-navy/10 bg-white text-visacore-navy hover:border-visacore-gold/30 hover:text-visacore-gold"
                  : "border-white/16 bg-white/8 text-white backdrop-blur-md hover:border-visacore-gold/35 hover:text-visacore-gold"
            )}
          >
            Espace client
          </Link>
          <Link
            href="/evaluation"
            className={cn(
              "inline-flex items-center rounded-full px-4 py-3 text-sm font-black transition-all duration-300 shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-visacore-gold/35 xl:px-6 xl:py-4",
              useSolidHeader
                ? "bg-visacore-gold text-white hover:bg-visacore-gold-dark hover:shadow-visacore-gold/20"
                : "bg-white text-visacore-navy hover:bg-visacore-gold hover:text-white"
            )}
          >
            Évaluation gratuite
            <ArrowRight className="ml-2 size-4" />
          </Link>
        </div>

        <div className="lg:hidden">
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "rounded-full transition-colors",
                    useSolidHeader
                      ? "text-visacore-navy hover:bg-visacore-navy/5"
                      : "text-white hover:bg-white/10"
                  )}
                />
              }
            >
              <Menu className="size-6" />
            </SheetTrigger>

            <SheetContent side="right" className="w-full border-l-0 bg-visacore-navy p-0 sm:max-w-xl">
              <div className="flex h-full flex-col">
                <SheetHeader className="border-b border-white/10 p-6">
                  <SheetTitle className="flex items-center justify-between gap-4">
                    <Image
                      src="/images/visacore_solution_logo.png"
                      alt="VisaCore Solutions"
                      width={1094}
                      height={315}
                      className="h-10 w-auto brightness-0 invert sm:h-12"
                    />
                    <span className="rounded-full border border-white/10 bg-white/6 px-3 py-1 text-xs font-black uppercase tracking-[0.24em] text-white/55">
                      Navigation
                    </span>
                  </SheetTitle>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto px-6 pb-8 pt-6">
                  <div className="rounded-[32px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_80px_-42px_rgba(0,0,0,0.65)]">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/75">
                      Commencez ici
                    </p>
                    <h2 className="mt-3 text-3xl font-black leading-tight text-white">
                      Une navigation pensée pour passer vite de l&apos;idée au dossier.
                    </h2>
                    <div className="mt-5 grid gap-3 sm:grid-cols-2">
                      <MobileActionLink
                        href="/evaluation"
                        label="Évaluation gratuite"
                        description="Premier diagnostic de votre profil."
                      />
                      <MobileActionLink
                        href="/rendez-vous"
                        label="Prendre rendez-vous"
                        description="Réserver un échange avec un conseiller."
                      />
                      <MobileActionLink
                        href="/espace-client/connexion"
                        label="Connexion client"
                        description="Accéder à votre espace client sécurisé."
                      />
                      <MobileActionLink
                        href="/evaluation"
                        label="Demander un accès"
                        description="Ouvrir un dossier pour recevoir vos identifiants."
                      />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    <MobileQuickLink href="/" label="Accueil" />
                    <MobileQuickLink href="/contact" label="Contact" />
                    <MobileQuickLink href="/espace-client/connexion" label="Espace client" />
                    <MobileQuickLink href="/evaluation" label="Ouvrir mon dossier" />
                  </div>

                  <Accordion className="mt-6 rounded-[28px] border border-white/10 bg-white/5 px-5 py-2">
                    <AccordionItem value="destinations" className="border-white/10">
                      <AccordionTrigger className="py-4 text-base font-black text-white hover:no-underline">
                        Destinations
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          {destinationLinks.map((link) => (
                            <MobileDisclosureLink key={link.href} link={link} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="services" className="border-white/10">
                      <AccordionTrigger className="py-4 text-base font-black text-white hover:no-underline">
                        Services
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          {serviceLinks.map((link) => (
                            <MobileDisclosureLink key={link.href} link={link} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="project" className="border-white/10">
                      <AccordionTrigger className="py-4 text-base font-black text-white hover:no-underline">
                        Votre projet
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          {projectLinks.map((link) => (
                            <MobileDisclosureLink key={link.href} link={link} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="portal" className="border-white/10">
                      <AccordionTrigger className="py-4 text-base font-black text-white hover:no-underline">
                        Espace client
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          {portalLinks.map((link) => (
                            <MobileDisclosureLink key={link.href} link={link} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="about" className="border-white/10">
                      <AccordionTrigger className="py-4 text-base font-black text-white hover:no-underline">
                        À propos
                      </AccordionTrigger>
                      <AccordionContent className="pb-4">
                        <div className="space-y-3">
                          {aboutLinks.map((link) => (
                            <MobileDisclosureLink key={link.href} link={link} />
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>

                <div className="border-t border-white/10 px-6 py-6">
                  <div className="rounded-[28px] border border-white/10 bg-white/6 p-5">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/75">
                      Contact officiel
                    </p>
                    <div className="mt-4 space-y-3 text-sm text-white/72">
                      <a
                        href={getTelHref(siteConfig.contactPhone)}
                        className="flex items-center gap-3 font-bold text-white transition-colors hover:text-visacore-gold"
                      >
                        <PhoneCall className="size-4 text-visacore-gold" />
                        {displayedPhone}
                      </a>
                      <p className="flex items-start gap-3">
                        <MapPin className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
                        <span>{siteConfig.officeAddress}</span>
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
                    <SheetClose
                      render={<Link href="/privacy" className="transition-colors hover:text-visacore-gold" />}
                    >
                      Confidentialité
                    </SheetClose>
                    <SheetClose
                      render={<Link href="/terms" className="transition-colors hover:text-visacore-gold" />}
                    >
                      Mentions légales
                    </SheetClose>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

function renderDesktopPanel({
  activeMenu,
  aboutLinks,
  destinationLinks,
  displayedPhone,
  onNavigate,
  portalLinks,
  projectLinks,
  serviceLinks,
  siteConfig,
}: {
  activeMenu: MenuId;
  aboutLinks: NavigationLink[];
  destinationLinks: NavigationLink[];
  displayedPhone: string;
  onNavigate: () => void;
  portalLinks: NavigationLink[];
  projectLinks: NavigationLink[];
  serviceLinks: NavigationLink[];
  siteConfig: PublicSiteConfig;
}) {
  if (activeMenu === "destinations") {
    return (
      <DesktopPanelFrame>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.15fr_1.45fr_1fr]">
          <DesktopFeatureCard
            icon={Globe}
            onNavigate={onNavigate}
            eyebrow="Explorer"
            title="Des destinations regroupées pour aller plus vite vers la bonne filière."
            description="Les pays restent visibles en un coup d'oeil, pendant que l'accès au rendez-vous et à l'évaluation reste toujours à portée."
            primaryHref="/destinations"
            primaryLabel="Voir toutes les destinations"
            secondaryHref="/evaluation"
            secondaryLabel="Évaluation gratuite"
          />

          <DesktopLinkGrid
            title="Pays accompagnés"
            description="Accès rapide aux pages clés sans encombrer la barre principale."
            links={destinationLinks}
            onNavigate={onNavigate}
          />

          <DesktopInfoCard
            eyebrow="Canal officiel"
            title="Vous hésitez entre plusieurs pays ?"
            description="Un conseiller peut cadrer la bonne destination selon votre profil, votre budget et votre calendrier."
            detailLabel="Téléphone"
            detailValue={displayedPhone}
            detailHref={getTelHref(siteConfig.contactPhone)}
            footer={siteConfig.businessHours}
          />
        </div>
      </DesktopPanelFrame>
    );
  }

  if (activeMenu === "services") {
    return (
      <DesktopPanelFrame>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.1fr_1.5fr_1fr]">
          <DesktopFeatureCard
            icon={Briefcase}
            onNavigate={onNavigate}
            eyebrow="Expertise"
            title="Les services sont regroupés comme un catalogue d'accompagnement, pas comme une simple liste."
            description="Chaque offre reste trouvable rapidement, avec un accès direct à la page service et un chemin clair vers la prise de contact."
            primaryHref="/services"
            primaryLabel="Explorer les services"
            secondaryHref="/rendez-vous"
            secondaryLabel="Prendre rendez-vous"
          />

          <DesktopLinkGrid
            title="Accompagnements"
            description="Visas, études, travail et installation dans une vue structurée."
            links={serviceLinks}
            onNavigate={onNavigate}
          />

          <DesktopTrustCard
            eyebrow="Méthode"
            title="Une navigation orientée conversion"
            items={[
              "Les services restent regroupés par mission pour réduire la surcharge visuelle.",
              "L'évaluation et le rendez-vous servent de sorties claires depuis chaque section.",
              "Le contenu secondaire reste dans le panel au lieu d'étirer la barre principale.",
            ]}
          />
        </div>
      </DesktopPanelFrame>
    );
  }

  if (activeMenu === "project") {
    return (
      <DesktopPanelFrame>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.05fr_1.45fr_1fr]">
          <DesktopFeatureCard
            icon={Calendar}
            onNavigate={onNavigate}
            eyebrow="Votre projet"
            title="Les actions de démarrage sont rassemblées dans un espace unique et évident."
            description="Au lieu de disperser rendez-vous, évaluation, FAQ et contact sur toute la barre, ce panel concentre les actions à forte intention."
            primaryHref="/evaluation"
            primaryLabel="Lancer mon évaluation"
            secondaryHref="/rendez-vous"
            secondaryLabel="Réserver un créneau"
          />

          <DesktopActionGrid links={projectLinks} onNavigate={onNavigate} />

          <DesktopInfoCard
            eyebrow="Réassurance"
            title="Un point d'entrée net pour les prospects"
            description="La hiérarchie sépare exploration, conseil initial et prise de contact, ce qui améliore la lisibilité sur grand écran comme en mobile."
            detailLabel="Horaires"
            detailValue={siteConfig.businessHours}
            footer={siteConfig.contactEmail}
          />
        </div>
      </DesktopPanelFrame>
    );
  }

  if (activeMenu === "portal") {
    return (
      <DesktopPanelFrame>
        <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.1fr_1.4fr_1fr]">
          <DesktopFeatureCard
            icon={ShieldCheck}
            onNavigate={onNavigate}
            eyebrow="Portail client"
            title="Un point d’entrée clair pour suivre votre procédure sans encombrer la navigation principale."
            description="Les clients déjà accompagnés se connectent directement. Les nouveaux profils démarrent par l’ouverture du dossier pour recevoir ensuite un accès sécurisé."
            primaryHref="/espace-client/connexion"
            primaryLabel="Connexion client"
            secondaryHref="/evaluation"
            secondaryLabel="Demander un accès"
          />

          <DesktopLinkGrid
            title="Accès et suivi"
            description="Les bons raccourcis selon votre stade d’avancement."
            links={portalLinks}
            onNavigate={onNavigate}
          />

          <DesktopInfoCard
            eyebrow="Sécurité"
            title="Vous n’avez pas encore d’identifiants ?"
            description="Les accès sont activés après l’ouverture ou la prise en charge du dossier pour protéger les données de procédure."
            detailLabel="Activation"
            detailValue="Ouverture du dossier ou invitation VisaCore"
            footer="Si votre dossier existe déjà, utilisez “Récupérer l’accès”. Sinon, démarrez par une évaluation ou un rendez-vous."
          />
        </div>
      </DesktopPanelFrame>
    );
  }

  return (
    <DesktopPanelFrame>
      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-[1.05fr_1.45fr_1fr]">
        <DesktopFeatureCard
          icon={ShieldCheck}
          onNavigate={onNavigate}
          eyebrow="VisaCore"
          title="Les pages de confiance et d'information restent accessibles sans diluer les parcours business."
          description="À propos, preuves sociales et pages réglementaires vivent ensemble dans une structure plus stable et plus extensible."
          primaryHref="/a-propos"
          primaryLabel="Découvrir le cabinet"
          secondaryHref="/temoignages"
          secondaryLabel="Voir les témoignages"
        />

        <DesktopLinkGrid
          title="Ressources & confiance"
          description="Tout ce qui aide à comprendre l'entreprise et ses engagements."
          links={aboutLinks}
          onNavigate={onNavigate}
        />

        <DesktopInfoCard
          eyebrow="Adresse"
          title={siteConfig.siteName}
          description="Cabinet d'accompagnement en immigration internationale depuis Lomé."
          detailLabel="Bureau"
          detailValue={siteConfig.officeAddress}
          footer={displayedPhone}
        />
      </div>
    </DesktopPanelFrame>
  );
}

function DesktopPanelFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-[32px] border border-visacore-navy/10 bg-white p-5 shadow-[0_30px_120px_-48px_rgba(10,37,64,0.55)] xl:rounded-[36px] xl:p-6">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/45 to-transparent" />
      {children}
    </div>
  );
}

function DesktopFeatureCard({
  description,
  eyebrow,
  icon: Icon,
  onNavigate,
  primaryHref,
  primaryLabel,
  secondaryHref,
  secondaryLabel,
  title,
}: {
  description: string;
  eyebrow: string;
  icon: typeof Globe;
  onNavigate: () => void;
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
  title: string;
}) {
  return (
    <div className="rounded-[26px] bg-gradient-to-br from-visacore-navy via-visacore-navy-light to-[#0f3558] p-5 text-white xl:rounded-[28px] xl:p-6">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-visacore-gold">
        <Icon className="size-6" />
      </div>
      <p className="mt-5 text-xs font-black uppercase tracking-[0.24em] text-visacore-gold/80">{eyebrow}</p>
      <h3 className="mt-3 text-2xl font-black leading-tight">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-white/68">{description}</p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={primaryHref}
          onClick={onNavigate}
          className="inline-flex items-center rounded-full bg-visacore-gold px-4 py-3 text-sm font-black text-white transition-colors hover:bg-visacore-gold-dark"
        >
          {primaryLabel}
          <ArrowRight className="ml-2 size-4" />
        </Link>
        <Link
          href={secondaryHref}
          onClick={onNavigate}
          className="inline-flex items-center rounded-full border border-white/12 px-4 py-3 text-sm font-black text-white transition-colors hover:bg-white/10"
        >
          {secondaryLabel}
        </Link>
      </div>
    </div>
  );
}

function DesktopLinkGrid({
  description,
  links,
  onNavigate,
  title,
}: {
  description: string;
  links: NavigationLink[];
  onNavigate: () => void;
  title: string;
}) {
  return (
    <div className="rounded-[26px] border border-visacore-navy/8 bg-visacore-navy/[0.03] p-5 xl:rounded-[28px]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">{title}</p>
      <p className="mt-3 max-w-xl text-sm leading-6 text-visacore-navy/72">{description}</p>
      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        {links.map((link) => (
          <DesktopPanelLink key={link.href} link={link} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

function DesktopActionGrid({
  links,
  onNavigate,
}: {
  links: NavigationLink[];
  onNavigate: () => void;
}) {
  return (
    <div className="grid gap-3 rounded-[26px] border border-visacore-navy/8 bg-visacore-navy/[0.03] p-5 xl:rounded-[28px]">
      {links.map((link, index) => {
        const icons = [FileText, Calendar, MessageSquare, ShieldCheck];
        const Icon = icons[index] ?? FileText;

        return (
          <Link
            key={link.href}
            href={link.href}
            onClick={onNavigate}
            className="group rounded-[22px] border border-visacore-navy/8 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-visacore-gold/35 hover:shadow-[0_18px_50px_-34px_rgba(10,37,64,0.4)]"
          >
            <div className="flex items-start gap-4">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-visacore-gold/12 text-visacore-gold">
                <Icon className="size-5" />
              </div>
              <div>
                <p className="text-base font-black text-visacore-navy transition-colors group-hover:text-visacore-gold">
                  {link.label}
                </p>
                <p className="mt-2 text-sm leading-6 text-visacore-navy/68">{link.description}</p>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}

function DesktopInfoCard({
  description,
  detailHref,
  detailLabel,
  detailValue,
  eyebrow,
  footer,
  title,
}: {
  description: string;
  detailHref?: string;
  detailLabel: string;
  detailValue: string;
  eyebrow: string;
  footer: string;
  title: string;
}) {
  return (
    <div className="rounded-[26px] border border-visacore-gold/18 bg-visacore-gold/[0.08] p-5 xl:rounded-[28px]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-black leading-tight text-visacore-navy">{title}</h3>
      <p className="mt-3 text-sm leading-6 text-visacore-navy/72">{description}</p>

      <div className="mt-6 rounded-[22px] border border-visacore-gold/18 bg-white/85 p-4">
        <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-navy/48">{detailLabel}</p>
        {detailHref ? (
          <a
            href={detailHref}
            className="mt-3 inline-flex items-center gap-2 text-base font-black text-visacore-navy transition-colors hover:text-visacore-gold"
          >
            <PhoneCall className="size-4 text-visacore-gold" />
            {detailValue}
          </a>
        ) : (
          <p className="mt-3 text-base font-black leading-7 text-visacore-navy">{detailValue}</p>
        )}
      </div>

      <div className="mt-4 flex items-start gap-3 rounded-[22px] border border-visacore-navy/8 bg-white/65 p-4 text-sm text-visacore-navy/68">
        <Clock3 className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
        <span>{footer}</span>
      </div>
    </div>
  );
}

function DesktopTrustCard({
  eyebrow,
  items,
  title,
}: {
  eyebrow: string;
  items: string[];
  title: string;
}) {
  return (
    <div className="rounded-[26px] border border-visacore-navy/8 bg-white p-5 shadow-[0_24px_50px_-40px_rgba(10,37,64,0.45)] xl:rounded-[28px]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-visacore-gold">{eyebrow}</p>
      <h3 className="mt-3 text-xl font-black leading-tight text-visacore-navy">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.map((item) => (
          <div
            key={item}
            className="flex items-start gap-3 rounded-[22px] border border-visacore-navy/8 bg-visacore-navy/[0.03] p-4 text-sm leading-6 text-visacore-navy/72"
          >
            <ShieldCheck className="mt-0.5 size-4 shrink-0 text-visacore-gold" />
            <span>{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DesktopPanelLink({
  link,
  onNavigate,
}: {
  link: NavigationLink;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={link.href}
      onClick={onNavigate}
      className="group rounded-[22px] border border-visacore-navy/8 bg-white px-4 py-4 transition-all duration-200 hover:-translate-y-0.5 hover:border-visacore-gold/35 hover:shadow-[0_18px_50px_-34px_rgba(10,37,64,0.4)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-base font-black text-visacore-navy transition-colors group-hover:text-visacore-gold">
            {link.label}
          </p>
          <p className="mt-2 text-sm leading-6 text-visacore-navy/68">{link.description}</p>
        </div>
        <ArrowRight className="mt-0.5 size-4 shrink-0 text-visacore-gold transition-transform group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}

function MobileActionLink({
  description,
  href,
  label,
}: {
  description: string;
  href: string;
  label: string;
}) {
  return (
    <SheetClose
      render={
        <Link
          href={href}
          className="group rounded-[24px] border border-white/10 bg-white/7 p-4 text-left transition-all duration-200 hover:border-visacore-gold/35 hover:bg-white/9"
        />
      }
    >
      <p className="text-base font-black text-white transition-colors group-hover:text-visacore-gold">{label}</p>
      <p className="mt-2 text-sm leading-6 text-white/62">{description}</p>
    </SheetClose>
  );
}

function MobileQuickLink({ href, label }: { href: string; label: string }) {
  return (
    <SheetClose
      render={
        <Link
          href={href}
          className="rounded-full border border-white/10 bg-white/5 px-4 py-3 text-center text-sm font-black text-white transition-colors hover:border-visacore-gold/35 hover:text-visacore-gold"
        />
      }
    >
      {label}
    </SheetClose>
  );
}

function MobileDisclosureLink({ link }: { link: NavigationLink }) {
  return (
    <SheetClose
      render={
        <Link
          href={link.href}
          className="block rounded-[22px] border border-white/10 bg-white/6 px-4 py-4 transition-colors hover:border-visacore-gold/35 hover:bg-white/8"
        />
      }
    >
      <p className="text-sm font-black text-white">{link.label}</p>
      <p className="mt-2 text-sm leading-6 text-white/62">{link.description}</p>
    </SheetClose>
  );
}
