import {
  Briefcase,
  Building2,
  FileCheck,
  FolderCheck,
  Globe,
  GraduationCap,
  Home,
  MessageSquare,
  Plane,
  type LucideIcon,
} from "lucide-react"

export const defaultDestinationVisual = {
  flag: "🌍",
  image:
    "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=800",
}

export const destinationVisuals: Record<string, { flag: string; image: string }> = {
  canada: {
    flag: "🇨🇦",
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=800",
  },
  "etats-unis": {
    flag: "🇺🇸",
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=800",
  },
  europe: {
    flag: "🇪🇺",
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=800",
  },
}

export function getDestinationVisual(slug: string) {
  return destinationVisuals[slug] ?? defaultDestinationVisual
}

export const serviceIconMap: Record<string, LucideIcon> = {
  GraduationCap,
  Briefcase,
  Plane,
  Building2,
  Globe,
  FileCheck,
  Home,
  FolderCheck,
  MessageSquare,
}

export const fallbackDestinations = [
  {
    slug: "canada",
    name: "Canada",
    heroTitle: "Immigrez au Canada avec confiance",
    heroDescription:
      "Le Canada offre d'excellentes opportunités avec ses programmes variés : Entrée express, PVT, visa études et regroupement familial.",
    ...getDestinationVisual("canada"),
  },
  {
    slug: "etats-unis",
    name: "États-Unis",
    heroTitle: "Concrétisez votre rêve américain",
    heroDescription:
      "Les États-Unis restent une destination de choix. Nous vous guidons à travers les différentes catégories de visas disponibles.",
    ...getDestinationVisual("etats-unis"),
  },
  {
    slug: "europe",
    name: "Europe",
    heroTitle: "Découvrez les opportunités en Europe",
    heroDescription:
      "L'Europe offre un cadre de vie exceptionnel et de nombreuses opportunités professionnelles. France, Allemagne, Belgique et plus.",
    ...getDestinationVisual("europe"),
  },
]

export const fallbackServices = [
  {
    slug: "etudes-etranger",
    name: "Études à l'étranger",
    icon: "GraduationCap",
    description:
      "Accompagnement complet pour vos études : admission, visa et installation.",
  },
  {
    slug: "permis-travail",
    name: "Permis de travail",
    icon: "Briefcase",
    description:
      "Obtenez votre permis de travail et lancez votre carrière internationale.",
  },
  {
    slug: "visa-visiteur",
    name: "Visa visiteur",
    icon: "Plane",
    description: "Préparez vos voyages en toute sérénité avec notre service dédié.",
  },
  {
    slug: "immigration-permanente",
    name: "Immigration permanente",
    icon: "Home",
    description: "Programmes de résidence permanente et regroupement familial.",
  },
]

export const fallbackTestimonials = [
  {
    id: "fallback-1",
    clientName: "Kofi Mensah",
    destination: "Canada",
    content:
      "Grâce à VisaCore Solutions, j'ai obtenu mon visa d'études en seulement 3 semaines. L'équipe m'a guidé avec un professionnalisme exemplaire.",
    rating: 5,
  },
  {
    id: "fallback-2",
    clientName: "Ama Touré",
    destination: "France",
    content:
      "Un accompagnement exceptionnel du début à la fin. Mon dossier de visa travail a été approuvé du premier coup. Je recommande vivement !",
    rating: 5,
  },
]
