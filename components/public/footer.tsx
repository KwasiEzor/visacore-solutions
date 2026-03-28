import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import type { PublicSiteConfig } from "@/lib/site-config";
import { getTelHref } from "@/lib/site-config";

const quickLinks = [
  { href: "/", label: "Accueil" },
  { href: "/destinations", label: "Destinations" },
  { href: "/rendez-vous", label: "Rendez-vous" },
  { href: "/a-propos", label: "À propos" },
  { href: "/temoignages", label: "Témoignages" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

interface FooterProps {
  siteConfig: PublicSiteConfig;
  services: Array<{
    slug: string;
    name: string;
  }>;
}

export function Footer({ siteConfig, services }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const serviceLinks = [
    ...services.map((service) => ({
      href: `/services/${service.slug}`,
      label: service.name,
    })),
    { href: "/evaluation", label: "Évaluation gratuite" },
  ]

  const socialLinks = [
    {
      href: siteConfig.facebookUrl,
      label: "Facebook",
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      href: siteConfig.linkedinUrl,
      label: "LinkedIn",
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      ),
    },
    {
      href: siteConfig.instagramUrl,
      label: "Instagram",
      icon: (
        <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      ),
    },
  ].filter((socialLink) => socialLink.href)

  return (
    <footer className="relative overflow-hidden bg-visacore-navy pb-10 pt-14 text-white sm:pb-12 sm:pt-20">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-visacore-gold/30 to-transparent" />
      <div className="absolute -bottom-24 -right-24 size-96 bg-visacore-gold/5 rounded-full blur-[100px]" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 gap-8 sm:gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          {/* Company info */}
          <div className="lg:pr-8">
            <Link href="/" className="inline-block transition-transform hover:scale-105">
              <Image
                src="/images/visacore_solution_logo.png"
                alt="VisaCore Solutions"
                width={1094}
                height={315}
                className="h-16 w-auto brightness-0 invert sm:h-20"
              />
            </Link>
            <p className="mt-5 max-w-sm text-sm font-medium leading-relaxed text-white/70 sm:mt-8 sm:text-lg">
              Votre pont vers l&apos;international. Expertise, transparence et succès pour vos projets d&apos;immigration à Lomé.
            </p>
            {/* Social links */}
            {socialLinks.length > 0 && (
              <div className="mt-6 flex items-center gap-3 sm:mt-10 sm:gap-4">
                {socialLinks.map((socialLink) => (
                  <a
                    key={socialLink.label}
                    href={socialLink.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={socialLink.label}
                    className="flex size-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 transition-all hover:-translate-y-1 hover:bg-visacore-gold hover:text-white sm:size-12"
                  >
                    {socialLink.icon}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Quick links */}
          <div>
            <h3 className="mb-5 text-lg font-black italic text-visacore-gold serif sm:mb-8 sm:text-xl">Navigation</h3>
            <ul className="grid grid-cols-2 gap-x-4 gap-y-3 sm:grid-cols-1 sm:space-y-4 sm:gap-y-0">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-white/72 transition-colors hover:text-visacore-gold sm:text-base"
                  >
                    <ArrowRight className="size-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="font-bold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-5 text-lg font-black italic text-visacore-gold serif sm:mb-8 sm:text-xl">Expertises</h3>
            <ul className="grid grid-cols-1 gap-y-3 sm:space-y-4 sm:gap-y-0">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-white/72 transition-colors hover:text-visacore-gold sm:text-base"
                  >
                    <ArrowRight className="size-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    <span className="font-bold">{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="mb-5 text-lg font-black italic text-visacore-gold serif sm:mb-8 sm:text-xl">Contact</h3>
            <ul className="space-y-4 sm:space-y-6">
              <li className="flex items-start gap-3 sm:gap-4">
                <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 sm:size-10">
                  <MapPin className="size-5 text-visacore-gold" />
                </div>
                <span className="pt-0.5 text-sm font-medium leading-relaxed text-white/72 sm:pt-1 sm:text-base">
                  {siteConfig.officeAddress}
                </span>
              </li>
              <li>
                <a
                  href={getTelHref(siteConfig.contactPhone)}
                  className="group flex items-center gap-3 text-sm text-white/72 transition-colors hover:text-visacore-gold sm:gap-4 sm:text-base"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-visacore-gold/20 sm:size-10">
                    <Phone className="size-5 text-visacore-gold" />
                  </div>
                  <span className="font-bold">{siteConfig.contactPhone}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.contactEmail}`}
                  className="group flex items-center gap-3 text-sm text-white/72 transition-colors hover:text-visacore-gold sm:gap-4 sm:text-base"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/5 transition-colors group-hover:bg-visacore-gold/20 sm:size-10">
                    <Mail className="size-5 text-visacore-gold" />
                  </div>
                  <span className="font-bold truncate">{siteConfig.contactEmail}</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & copyright */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:mt-20 md:flex-row md:gap-6 md:pt-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-white/34 sm:text-sm sm:tracking-widest md:text-left">
            &copy; {currentYear} VisaCore Solutions. Designed for Excellence.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-white/24 sm:gap-8 sm:text-xs sm:tracking-widest">
             <Link href="/privacy" className="hover:text-visacore-gold transition-colors">Confidentialité</Link>
             <Link href="/terms" className="hover:text-visacore-gold transition-colors">Mentions Légales</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
