import Link from "next/link";
import Image from "next/image";
import { Mail, MapPin, Phone, MessageCircle } from "lucide-react";

const quickLinks = [
  { href: "/", label: "Accueil" },
  { href: "/destinations", label: "Destinations" },
  { href: "/a-propos", label: "\u00C0 propos" },
  { href: "/temoignages", label: "T\u00E9moignages" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
] as const;

const serviceLinks = [
  { href: "/services#visa-etudes", label: "Visa \u00E9tudes" },
  { href: "/services#visa-travail", label: "Visa travail" },
  { href: "/services#visa-tourisme", label: "Visa tourisme" },
  { href: "/services#visa-affaires", label: "Visa affaires" },
  { href: "/services#immigration", label: "Immigration" },
  { href: "/evaluation", label: "\u00C9valuation gratuite" },
] as const;

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#0A2540] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="inline-block">
              <Image
                src="/images/visacore_solution_logo.png"
                alt="VisaCore Solutions"
                width={140}
                height={40}
                className="h-10 w-auto brightness-0 invert"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
              VisaCore Solutions est votre partenaire de confiance pour tous vos
              projets d&apos;immigration et de visa. Nous vous accompagnons
              \u00E0 chaque \u00E9tape de votre parcours vers l&apos;international.
            </p>
            {/* Social links placeholder */}
            <div className="mt-6 flex items-center gap-3">
              <a
                href="#"
                aria-label="Facebook"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A227]"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="LinkedIn"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A227]"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Instagram"
                className="flex size-9 items-center justify-center rounded-full bg-white/10 transition-colors hover:bg-[#C9A227]"
              >
                <svg
                  className="size-4"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Liens rapides
            </h3>
            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#C9A227]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Nos services
            </h3>
            <ul className="mt-4 space-y-3">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-white/70 transition-colors hover:text-[#C9A227]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact info */}
          <div>
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Contact
            </h3>
            <ul className="mt-4 space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 size-4 shrink-0 text-[#C9A227]" />
                <span className="text-sm text-white/70">
                  Boulevard du 13 Janvier,
                  <br />
                  Lom\u00E9, Togo
                </span>
              </li>
              <li>
                <a
                  href="tel:+22890000000"
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#C9A227]"
                >
                  <Phone className="size-4 shrink-0 text-[#C9A227]" />
                  +228 90 00 00 00
                </a>
              </li>
              <li>
                <a
                  href="mailto:contact@visacore-solutions.com"
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#C9A227]"
                >
                  <Mail className="size-4 shrink-0 text-[#C9A227]" />
                  contact@visacore-solutions.com
                </a>
              </li>
              <li>
                <a
                  href="https://wa.me/22890000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-sm text-white/70 transition-colors hover:text-[#C9A227]"
                >
                  <MessageCircle className="size-4 shrink-0 text-[#C9A227]" />
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider & copyright */}
        <div className="mt-12 border-t border-white/10 pt-8">
          <p className="text-center text-sm text-white/50">
            &copy; {currentYear} VisaCore Solutions. Tous droits r\u00E9serv\u00E9s.
          </p>
        </div>
      </div>
    </footer>
  );
}
