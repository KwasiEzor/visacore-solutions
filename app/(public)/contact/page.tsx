import type { Metadata } from "next"
import Link from "next/link"
import { ContactForm } from "@/components/public/contact-form"
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  MessageCircle,
  Send,
  Shield,
  Zap,
  HeadphonesIcon,
} from "lucide-react"
import { PageHeroBackground } from "@/components/public/page-hero-background"
import { ScrollReveal } from "@/components/public/scroll-reveal"
import {
  formatDisplayPhoneNumber,
  getBusinessHoursRows,
  getPublicSiteConfig,
  getTelHref,
  getWhatsAppHref,
} from "@/lib/site-config"
import { getCaptchaServerConfig } from "@/lib/captcha.server"
import { getStaticHeroBackground } from "@/lib/public-hero-backgrounds"

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez VisaCore Solutions à Lomé, Togo. Nous sommes disponibles pour répondre à vos questions sur l'immigration.",
}

interface ContactChannel {
  icon: typeof Phone
  label: string
  value: string
  href?: string
  description: string
  color: string
}

const guarantees = [
  {
    icon: Zap,
    title: "Réponse en 24h",
    description:
      "Chaque message reçoit une réponse personnalisée sous 24 heures ouvrées.",
  },
  {
    icon: Shield,
    title: "Confidentialité totale",
    description:
      "Vos données personnelles sont protégées et ne sont jamais partagées.",
  },
  {
    icon: HeadphonesIcon,
    title: "Support multicanal",
    description:
      "Contactez-nous par téléphone, email, WhatsApp ou en personne.",
  },
]

export default async function ContactPage() {
  const heroBackground = getStaticHeroBackground("contact")
  const siteConfig = await getPublicSiteConfig()
  const captchaConfig = getCaptchaServerConfig()
  const businessHours = getBusinessHoursRows(siteConfig.businessHours)
  const whatsappHref = getWhatsAppHref(siteConfig.whatsappNumber)
  const contactChannels: ContactChannel[] = [
    {
      icon: Phone,
      label: "Appelez-nous",
      value: formatDisplayPhoneNumber(siteConfig.contactPhone),
      href: getTelHref(siteConfig.contactPhone),
      description: "Du lundi au vendredi, 8h-18h",
      color: "bg-blue-50 text-blue-600",
    },
    {
      icon: Mail,
      label: "Écrivez-nous",
      value: siteConfig.contactEmail,
      href: `mailto:${siteConfig.contactEmail}`,
      description: "Réponse sous 24 heures",
      color: "bg-emerald-50 text-emerald-600",
    },
    {
      icon: MessageCircle,
      label: "WhatsApp",
      value: formatDisplayPhoneNumber(siteConfig.whatsappNumber),
      href: getWhatsAppHref(siteConfig.whatsappNumber),
      description: "Réponse instantanée",
      color: "bg-green-50 text-green-600",
    },
    {
      icon: MapPin,
      label: "Visitez-nous",
      value: siteConfig.officeAddress,
      description: siteConfig.businessHours,
      color: "bg-amber-50 text-amber-600",
    },
  ]

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="relative overflow-hidden bg-visacore-navy py-24 sm:py-32">
        <PageHeroBackground {...heroBackground} />

        <div className="container-custom relative z-10">
          <div className="mx-auto max-w-3xl text-center">
            <ScrollReveal>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-visacore-gold/30 bg-visacore-gold/10 px-4 py-1.5 text-sm font-black uppercase tracking-widest text-visacore-gold">
                <Send className="size-4" />
                Contact
              </div>
              <h1 className="mb-8 text-4xl font-black leading-none text-white sm:text-5xl md:text-7xl">
                Parlons de Votre{" "}
                <br />
                <span className="serif italic text-visacore-gold">Projet</span>
              </h1>
              <p className="mx-auto max-w-xl text-lg leading-relaxed text-white/60 sm:text-xl">
                Une question ? Un doute ? Notre équipe d&apos;experts est à
                votre entière disposition pour éclairer votre parcours
                d&apos;immigration.
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Contact channels strip — overlaps hero */}
      <section className="relative z-10 -mt-10 px-4 sm:-mt-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:auto-rows-fr xl:grid-cols-4">
            {contactChannels.map((channel, i) => (
              <ScrollReveal key={channel.label} delay={i * 0.08}>
                <ContactChannelCard channel={channel} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Main content: Form + Sidebar */}
      <section className="section-padding bg-background">
        <div className="container-custom">
          <div className="grid items-start gap-12 lg:grid-cols-5 lg:gap-20">
            {/* Sidebar info */}
            <div className="order-2 lg:order-1 lg:col-span-2">
              <ScrollReveal>
                <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
                  Coordonnees utiles
                </p>
                <h2 className="mb-4 mt-4 text-3xl font-black text-visacore-navy sm:text-4xl">
                  Nos{" "}
                  <span className="serif italic text-visacore-gold">
                    Coordonnées
                  </span>
                </h2>
                <p className="mb-10 text-lg leading-relaxed text-muted-foreground">
                  Passez nous voir à notre bureau de Lomé ou contactez-nous par
                  le canal qui vous convient le mieux.
                </p>

                {/* Business hours card */}
                <div className="mb-8 rounded-[30px] border border-visacore-navy/8 bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)] p-6 shadow-[0_24px_70px_-52px_rgba(10,37,64,0.28)] sm:p-8">
                  <div className="mb-5 flex items-center gap-3">
                    <div className="flex size-11 items-center justify-center rounded-xl bg-visacore-navy text-visacore-gold">
                      <Clock className="size-5" />
                    </div>
                    <h3 className="text-lg font-black text-visacore-navy">
                      Horaires d&apos;ouverture
                    </h3>
                  </div>
                  <div className="space-y-3 text-sm">
                    {businessHours.map((item) => (
                      <div
                        key={`${item.label}-${item.value}`}
                        className="flex items-center justify-between rounded-xl bg-white px-4 py-3"
                      >
                        <span className="font-semibold text-visacore-navy">
                          {item.label}
                        </span>
                        <span className="font-bold text-visacore-gold">
                          {item.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Map card */}
                <div className="group relative overflow-hidden rounded-[30px] border border-visacore-navy/8 shadow-[0_24px_70px_-54px_rgba(10,37,64,0.22)]">
                  <div className="relative h-48 bg-visacore-navy sm:h-56">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=800')] bg-cover bg-center opacity-30 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-50 group-hover:grayscale-0" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/90 px-5 py-3 shadow-2xl backdrop-blur-md sm:px-6 sm:py-4">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-visacore-gold text-white">
                          <MapPin className="size-5" />
                        </div>
                        <div>
                          <p className="text-sm font-black uppercase tracking-wider text-visacore-navy">
                            Lomé, Togo
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {siteConfig.officeAddress}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            {/* Form */}
            <div className="order-1 lg:order-2 lg:col-span-3">
              <ScrollReveal delay={0.1}>
                <div className="rounded-3xl border border-visacore-navy/8 bg-white p-6 shadow-[0_28px_90px_-56px_rgba(10,37,64,0.3)] sm:rounded-[40px] sm:p-10 md:p-14">
                  <div className="mb-8 text-center sm:mb-10">
                    <p className="text-xs font-black uppercase tracking-[0.24em] text-visacore-gold">
                      Message
                    </p>
                    <h2 className="mt-4 text-2xl font-black text-visacore-navy sm:text-3xl md:text-4xl">
                      Envoyez-nous un{" "}
                      <span className="serif italic text-visacore-gold">
                        Message
                      </span>
                    </h2>
                    <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
                      Remplissez le formulaire ci-dessous et nous vous
                      répondrons dans les plus brefs délais.
                    </p>
                  </div>
                  <ContactForm captchaSiteKey={captchaConfig.siteKey} />
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantees */}
      <section className="section-padding border-t border-border bg-gray-50">
        <div className="container-custom">
          <ScrollReveal>
            <div className="mb-12 text-center sm:mb-16">
              <h2 className="text-3xl font-black text-visacore-navy sm:text-4xl md:text-5xl">
                Notre{" "}
                <span className="serif italic text-visacore-gold">
                  Engagement
                </span>
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
                Nous traitons chaque demande avec rigueur, confidentialité et
                rapidité.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 sm:gap-8">
            {guarantees.map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div className="group rounded-[30px] border border-border bg-white p-8 text-center shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl sm:p-10">
                  <div className="mx-auto mb-6 flex size-14 items-center justify-center rounded-2xl bg-visacore-gold/10 text-visacore-gold transition-colors duration-500 group-hover:bg-visacore-gold group-hover:text-white sm:size-16">
                    <item.icon className="size-6 sm:size-7" />
                  </div>
                  <h3 className="mb-3 text-lg font-black text-visacore-navy sm:text-xl">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                    {item.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA banner */}
      <section className="section-padding px-4">
        <div className="mx-auto max-w-5xl">
          <ScrollReveal>
            <div className="relative overflow-hidden rounded-3xl bg-visacore-navy p-10 sm:rounded-[50px] sm:p-12 md:p-20">
              <div className="absolute inset-0 bg-noise opacity-5" />
              <div className="absolute left-0 top-0 h-full w-full bg-gradient-to-br from-visacore-gold/20 to-transparent blur-[120px]" />

              <div className="relative z-10 text-center">
                <h2 className="mb-6 text-2xl font-black text-white sm:text-3xl md:text-5xl">
                  Prêt à Commencer Votre{" "}
                  <span className="serif italic text-visacore-gold">
                    Aventure
                  </span>{" "}
                  ?
                </h2>
                <p className="mx-auto mb-10 max-w-xl text-base text-white/50 sm:text-lg">
                  Obtenez une évaluation gratuite de votre profil et découvrez
                  les options qui s&apos;offrent à vous.
                </p>
                <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
                  <Link
                    href="/evaluation"
                    className="inline-flex h-12 items-center rounded-full bg-visacore-gold px-8 text-sm font-black text-white shadow-2xl shadow-visacore-gold/30 transition-all hover:scale-105 sm:h-16 sm:px-10 sm:text-base"
                  >
                    Évaluation Gratuite
                  </Link>
                  {whatsappHref ? (
                    <Link
                      href={whatsappHref}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-12 items-center gap-2 rounded-full border-2 border-white/20 px-8 text-sm font-bold text-white transition-all hover:bg-white/10 sm:h-16 sm:px-10 sm:text-base"
                    >
                      <MessageCircle className="size-5" />
                      WhatsApp
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  )
}

function ContactChannelCard({
  channel,
}: {
  channel: ContactChannel
}) {
  const Wrapper = channel.href ? "a" : "div"
  const wrapperProps = channel.href
    ? {
        href: channel.href,
        target: channel.href.startsWith("http") ? "_blank" : undefined,
        rel: channel.href.startsWith("http")
          ? "noopener noreferrer"
          : undefined,
      }
    : {}

  return (
    <Wrapper
      {...wrapperProps}
      className="group flex h-full min-h-[12rem] flex-col justify-between rounded-[28px] border border-border bg-white p-6 text-left shadow-lg shadow-visacore-navy/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:min-h-[13rem] sm:p-7"
    >
      <div
        className={`flex size-12 items-center justify-center rounded-2xl ${channel.color} transition-transform duration-300 group-hover:scale-110`}
      >
        <channel.icon className="size-5" />
      </div>
      <div className="mt-6 space-y-3">
        <p className="text-[11px] font-black uppercase tracking-[0.24em] text-muted-foreground">
          {channel.label}
        </p>
        <p className="text-balance break-words text-xl font-black leading-snug text-visacore-navy">
          {channel.value}
        </p>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {channel.description}
        </p>
      </div>
    </Wrapper>
  )
}
