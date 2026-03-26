import Link from "next/link";
import {
  Users,
  Award,
  Shield,
  Globe,
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  FileCheck,
  Heart,
  Eye,
  Handshake,
  UserCheck,
  MapPin,
  Search,
  Target,
  FolderOpen,
  Send,
  CheckCircle2,
  Star,
  ArrowRight,
  Quote,
  ChevronRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

/* ────────────────────────────────────────────────
   Static fallback data
   ──────────────────────────────────────────────── */

const staticDestinations = [
  {
    slug: "canada",
    name: "Canada",
    heroTitle: "Immigrez au Canada avec confiance",
    flag: "🇨🇦",
  },
  {
    slug: "etats-unis",
    name: "États-Unis",
    heroTitle: "Concrétisez votre rêve américain",
    flag: "🇺🇸",
  },
  {
    slug: "europe",
    name: "Europe",
    heroTitle: "Découvrez les opportunités en Europe",
    flag: "🇪🇺",
  },
];

const staticServices = [
  {
    slug: "visa-etudes",
    name: "Visa Études",
    icon: "GraduationCap",
    description:
      "Accompagnement complet pour vos études à l'étranger : admission, visa étudiant et installation.",
  },
  {
    slug: "visa-travail",
    name: "Visa Travail",
    icon: "Briefcase",
    description:
      "Obtenez votre permis de travail et lancez votre carrière internationale avec notre expertise.",
  },
  {
    slug: "visa-tourisme",
    name: "Visa Tourisme",
    icon: "Plane",
    description:
      "Préparez vos voyages en toute sérénité avec notre service de visa touristique.",
  },
  {
    slug: "visa-affaires",
    name: "Visa Affaires",
    icon: "Building2",
    description:
      "Développez vos activités à l'international avec nos solutions visa affaires.",
  },
  {
    slug: "immigration",
    name: "Immigration",
    icon: "Globe",
    description:
      "Programmes d'immigration permanente : résidence permanente, regroupement familial et plus.",
  },
  {
    slug: "preparation-dossier",
    name: "Préparation de dossier",
    icon: "FileCheck",
    description:
      "Constitution et vérification de votre dossier pour maximiser vos chances d'approbation.",
  },
];

const staticTestimonials = [
  {
    id: "1",
    clientName: "Kofi Mensah",
    destination: "Canada",
    content:
      "Grâce à VisaCore Solutions, j'ai obtenu mon visa d'études pour le Canada en seulement 3 semaines. L'équipe m'a guidé à chaque étape avec professionnalisme et bienveillance.",
    rating: 5,
  },
  {
    id: "2",
    clientName: "Ama Touré",
    destination: "France",
    content:
      "Un accompagnement exceptionnel du début à la fin. Mon dossier de visa travail pour la France a été approuvé du premier coup. Je recommande vivement !",
    rating: 5,
  },
  {
    id: "3",
    clientName: "Yao Koffi",
    destination: "États-Unis",
    content:
      "VisaCore Solutions a transformé un processus stressant en une expérience sereine. Leur expertise et leur transparence m'ont mis en confiance tout au long du parcours.",
    rating: 5,
  },
];

const staticFAQs = [
  {
    id: "1",
    question: "Quels documents sont nécessaires pour une demande de visa ?",
    answer:
      "Les documents requis varient selon le type de visa et la destination. En général, vous aurez besoin d'un passeport valide, de photos d'identité, de preuves financières, et de documents spécifiques à votre situation (lettre d'admission, contrat de travail, etc.). Nos consultants vous fourniront une liste détaillée adaptée à votre cas.",
  },
  {
    id: "2",
    question: "Combien de temps prend le processus de demande de visa ?",
    answer:
      "Les délais varient selon la destination et le type de visa. En moyenne, comptez 2 à 8 semaines pour un visa tourisme, 4 à 12 semaines pour un visa études ou travail, et plusieurs mois pour une demande d'immigration permanente. Nous optimisons chaque étape pour réduire les délais au maximum.",
  },
  {
    id: "3",
    question: "Quel est le taux de réussite de VisaCore Solutions ?",
    answer:
      "Notre taux de réussite est parmi les plus élevés du secteur grâce à notre expertise approfondie et notre préparation minutieuse de chaque dossier. Nous évaluons soigneusement chaque profil avant de nous engager, ce qui nous permet de maintenir un excellent taux d'approbation.",
  },
  {
    id: "4",
    question: "L'évaluation initiale est-elle vraiment gratuite ?",
    answer:
      "Oui, l'évaluation initiale de votre profil est entièrement gratuite et sans engagement. Elle nous permet d'analyser votre situation, d'identifier les meilleures options pour vous et de vous proposer un plan d'action personnalisé. Contactez-nous pour en bénéficier.",
  },
];

/* ────────────────────────────────────────────────
   Icon helper
   ──────────────────────────────────────────────── */

const iconMap: Record<string, React.ElementType> = {
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  Globe,
  FileCheck,
  Users,
  Award,
  Shield,
};

function ServiceIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = iconMap[name] || Globe;
  return <Icon className={className} />;
}

/* ────────────────────────────────────────────────
   Page Component
   ──────────────────────────────────────────────── */

export default async function HomePage() {
  // Fetch data with fallbacks
  let destinations: typeof staticDestinations = [];
  let services: typeof staticServices = [];
  let testimonials: typeof staticTestimonials = [];
  let faqs: typeof staticFAQs = [];

  try {
    const dbDestinations = await prisma.destination.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
    });
    destinations =
      dbDestinations.length > 0
        ? dbDestinations.map((d) => ({
            slug: d.slug,
            name: d.name,
            heroTitle: d.heroTitle,
            flag: "",
          }))
        : staticDestinations;
  } catch {
    destinations = staticDestinations;
  }

  try {
    const dbServices = await prisma.service.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 6,
    });
    services =
      dbServices.length > 0
        ? dbServices.map((s) => ({
            slug: s.slug,
            name: s.name,
            icon: s.icon || "Globe",
            description: s.description || "",
          }))
        : staticServices;
  } catch {
    services = staticServices;
  }

  try {
    const dbTestimonials = await prisma.testimonial.findMany({
      where: { published: true, featured: true },
      take: 3,
    });
    testimonials =
      dbTestimonials.length > 0
        ? dbTestimonials.map((t) => ({
            id: t.id,
            clientName: t.clientName,
            destination: t.destination || "",
            content: t.content,
            rating: t.rating,
          }))
        : staticTestimonials;
  } catch {
    testimonials = staticTestimonials;
  }

  try {
    const dbFAQs = await prisma.fAQ.findMany({
      where: { published: true },
      orderBy: { order: "asc" },
      take: 4,
    });
    faqs =
      dbFAQs.length > 0
        ? dbFAQs.map((f) => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
          }))
        : staticFAQs;
  } catch {
    faqs = staticFAQs;
  }

  return (
    <>
      {/* ═══════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════ */}
      <section className="relative overflow-hidden bg-[#0A2540] py-24 sm:py-32 lg:py-40">
        {/* Decorative gradient */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#0A2540]" />
        <div className="pointer-events-none absolute -top-40 right-0 size-[600px] rounded-full bg-[#C9A227]/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-40 left-0 size-[400px] rounded-full bg-[#C9A227]/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-4 py-1.5 text-sm font-medium text-[#C9A227]">
              <Globe className="size-4" />
              Experts en immigration depuis Lomé, Togo
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
              Votre avenir à l&apos;international{" "}
              <span className="text-[#C9A227]">commence ici</span>
            </h1>
            <p className="mt-6 text-lg leading-relaxed text-white/70 sm:text-xl">
              Experts en immigration vers le Canada, les États-Unis et
              l&apos;Europe. Nous vous accompagnons à chaque étape de votre
              parcours migratoire avec expertise et transparence.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href="/evaluation"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620] hover:shadow-[#C9A227]/40"
              >
                Obtenir mon évaluation gratuite
                <ArrowRight className="size-5" />
              </Link>
              <Link
                href="/contact"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/5"
              >
                Prendre rendez-vous
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TRUST INDICATORS
          ═══════════════════════════════════════════ */}
      <section className="relative z-10 -mt-8">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              {
                icon: Users,
                label: "+1000 dossiers accompagnés",
                sub: "Depuis notre création",
              },
              {
                icon: Award,
                label: "Taux de réussite élevé",
                sub: "Dossiers approuvés",
              },
              {
                icon: Shield,
                label: "Consultants expérimentés",
                sub: "À votre service",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-4 rounded-xl border border-border/50 bg-white px-6 py-5 shadow-lg shadow-black/5"
              >
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-[#C9A227]/10">
                  <item.icon className="size-6 text-[#C9A227]" />
                </div>
                <div>
                  <p className="font-semibold text-[#0A2540]">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          DESTINATIONS SECTION
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Nos destinations
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
              Où souhaitez-vous aller ?
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Découvrez les opportunités qui vous attendent dans nos
              destinations les plus populaires.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {destinations.map((dest) => (
              <Link
                key={dest.slug}
                href={`/destinations/${dest.slug}`}
                className="group relative overflow-hidden rounded-2xl border border-border/50 bg-white p-8 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2540]/5"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#0A2540] to-[#C9A227] opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="flex size-14 items-center justify-center rounded-xl bg-[#0A2540]/5 text-2xl">
                  {dest.flag || <Globe className="size-7 text-[#0A2540]" />}
                </div>
                <h3 className="mt-5 text-xl font-bold text-[#0A2540]">
                  {dest.name}
                </h3>
                <p className="mt-2 text-muted-foreground">{dest.heroTitle}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#C9A227] transition-colors group-hover:text-[#A88620]">
                  En savoir plus
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES OVERVIEW
          ═══════════════════════════════════════════ */}
      <section className="bg-gray-50/80 py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Nos services
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
              Des solutions adaptées à chaque projet
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              De la préparation du dossier à l&apos;obtention de votre visa,
              nous couvrons tous vos besoins en immigration.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group rounded-2xl border border-border/50 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-[#0A2540]/5"
              >
                <div className="flex size-12 items-center justify-center rounded-lg bg-[#0A2540] text-white transition-colors group-hover:bg-[#C9A227]">
                  <ServiceIcon name={service.icon} className="size-6" />
                </div>
                <h3 className="mt-5 text-lg font-bold text-[#0A2540]">
                  {service.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-[#C9A227]">
                  Découvrir
                  <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/services"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-[#0A2540] px-6 text-sm font-semibold text-[#0A2540] transition-all hover:bg-[#0A2540] hover:text-white"
            >
              Voir tous nos services
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY CHOOSE US
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Pourquoi nous choisir
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
              Votre réussite est notre priorité
            </h2>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Globe,
                title: "Expertise internationale",
                text: "Une connaissance approfondie des systèmes d'immigration de nombreux pays.",
              },
              {
                icon: Heart,
                title: "Accompagnement complet",
                text: "Du premier contact jusqu'à votre installation, nous sommes à vos côtés.",
              },
              {
                icon: Eye,
                title: "Transparence totale",
                text: "Des honoraires clairs, des délais réalistes et une communication constante.",
              },
              {
                icon: UserCheck,
                title: "Suivi personnalisé",
                text: "Chaque dossier est unique. Nous adaptons notre approche à votre situation.",
              },
              {
                icon: MapPin,
                title: "Présence locale à Lomé",
                text: "Un bureau accessible pour des consultations en personne quand vous le souhaitez.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#0A2540]">
                  <item.icon className="size-7 text-[#C9A227]" />
                </div>
                <h3 className="mt-5 text-base font-bold text-[#0A2540]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PROCESS TIMELINE
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0A2540] py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Notre processus
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl">
              5 étapes vers votre réussite
            </h2>
            <p className="mt-4 text-lg text-white/60">
              Un processus structuré et éprouvé pour maximiser vos chances de
              succès.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                icon: Search,
                step: "01",
                title: "Analyse du profil",
                text: "Évaluation complète de votre situation et de vos objectifs.",
              },
              {
                icon: Target,
                step: "02",
                title: "Stratégie personnalisée",
                text: "Élaboration d'un plan d'action adapté à votre profil.",
              },
              {
                icon: FolderOpen,
                step: "03",
                title: "Préparation du dossier",
                text: "Constitution et vérification minutieuse de votre dossier.",
              },
              {
                icon: Send,
                step: "04",
                title: "Soumission officielle",
                text: "Dépôt de votre demande auprès des autorités compétentes.",
              },
              {
                icon: CheckCircle2,
                step: "05",
                title: "Suivi jusqu'à obtention",
                text: "Accompagnement continu jusqu'à la décision finale.",
              },
            ].map((item) => (
              <div key={item.step} className="relative text-center">
                <div className="mx-auto flex size-16 items-center justify-center rounded-2xl border border-[#C9A227]/30 bg-[#C9A227]/10">
                  <item.icon className="size-7 text-[#C9A227]" />
                </div>
                <span className="mt-4 inline-block text-xs font-bold tracking-widest text-[#C9A227]">
                  ÉTAPE {item.step}
                </span>
                <h3 className="mt-2 text-base font-bold text-white">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/50">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          TESTIMONIALS
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Témoignages
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
              Ils nous ont fait confiance
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Découvrez les expériences de nos clients qui ont réalisé leur
              projet d&apos;immigration avec VisaCore Solutions.
            </p>
          </div>

          <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <div
                key={t.id}
                className="relative rounded-2xl border border-border/50 bg-white p-8 shadow-sm"
              >
                <Quote className="absolute right-6 top-6 size-8 text-[#C9A227]/15" />
                <div className="flex items-center gap-1">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star
                      key={i}
                      className="size-4 fill-[#C9A227] text-[#C9A227]"
                    />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.content}&rdquo;
                </p>
                <div className="mt-6 flex items-center gap-3 border-t border-border/50 pt-6">
                  <div className="flex size-10 items-center justify-center rounded-full bg-[#0A2540] text-sm font-bold text-white">
                    {t.clientName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#0A2540]">
                      {t.clientName}
                    </p>
                    {t.destination && (
                      <p className="text-xs text-muted-foreground">
                        {t.destination}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/temoignages"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border-2 border-[#0A2540] px-6 text-sm font-semibold text-[#0A2540] transition-all hover:bg-[#0A2540] hover:text-white"
            >
              Voir tous les témoignages
              <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FAQ PREVIEW
          ═══════════════════════════════════════════ */}
      <section className="bg-gray-50/80 py-20 sm:py-28">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              Questions fréquentes
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-[#0A2540] sm:text-4xl">
              Vos questions, nos réponses
            </h2>
          </div>

          <div className="mt-12">
            <Accordion>
              {faqs.map((faq) => (
                <AccordionItem key={faq.id} value={faq.id}>
                  <AccordionTrigger className="text-left text-base font-semibold text-[#0A2540]">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    <p>{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/faq"
              className="inline-flex items-center gap-1 text-sm font-medium text-[#C9A227] transition-colors hover:text-[#A88620]"
            >
              Voir toutes les questions
              <ChevronRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          LEAD CAPTURE CTA
          ═══════════════════════════════════════════ */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0A2540] via-[#0F3460] to-[#0A2540] px-8 py-16 text-center shadow-2xl sm:px-16">
            <div className="pointer-events-none absolute -right-20 -top-20 size-60 rounded-full bg-[#C9A227]/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-20 size-40 rounded-full bg-[#C9A227]/10 blur-3xl" />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white sm:text-4xl">
                Obtenez votre évaluation gratuite en 24h
              </h2>
              <p className="mt-4 text-lg text-white/70">
                Nos experts analysent votre profil et vous proposent les
                meilleures options d&apos;immigration adaptées à votre
                situation.
              </p>
              <Link
                href="/evaluation"
                className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620] hover:shadow-[#C9A227]/40"
              >
                Commencer mon évaluation
                <ArrowRight className="size-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FINAL CTA
          ═══════════════════════════════════════════ */}
      <section className="bg-[#0A2540] py-20 sm:py-28">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            Faites le premier pas vers{" "}
            <span className="text-[#C9A227]">votre nouvelle vie</span>
          </h2>
          <p className="mt-6 text-lg leading-relaxed text-white/60">
            Des milliers de personnes ont déjà franchi le cap avec VisaCore
            Solutions. Rejoignez-les et concrétisez votre projet
            d&apos;immigration dès aujourd&apos;hui.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/evaluation"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#C9A227] px-8 text-base font-semibold text-white shadow-lg shadow-[#C9A227]/25 transition-all hover:bg-[#A88620] hover:shadow-[#C9A227]/40"
            >
              Obtenir mon évaluation gratuite
              <ArrowRight className="size-5" />
            </Link>
            <Link
              href="/contact"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-2 border-white/30 px-8 text-base font-semibold text-white transition-all hover:border-white hover:bg-white/5"
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
