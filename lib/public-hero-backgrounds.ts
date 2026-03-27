export type HeroBackgroundAlign = "left" | "center"

export interface HeroBackgroundConfig {
  image: string
  position?: string
  align?: HeroBackgroundAlign
}

const defaultHeroBackground: HeroBackgroundConfig = {
  image:
    "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000",
  position: "center center",
  align: "left",
}

const pageHeroBackgrounds = {
  about: {
    image:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=2000",
    position: "center 35%",
    align: "left",
  },
  services: {
    image:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "left",
  },
  destinations: {
    image:
      "https://images.unsplash.com/photo-1488085061387-422e29b40080?auto=format&fit=crop&q=80&w=2000",
    position: "center 55%",
    align: "left",
  },
  faq: {
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2000",
    position: "center 35%",
    align: "center",
  },
  evaluation: {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000",
    position: "center 38%",
    align: "center",
  },
  contact: {
    image:
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
  testimonials: {
    image:
      "https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&q=80&w=2000",
    position: "center 35%",
    align: "center",
  },
} as const

const serviceHeroBackgrounds: Record<string, HeroBackgroundConfig> = {
  "etudes-etranger": {
    image:
      "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
  "permis-travail": {
    image:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&q=80&w=2000",
    position: "center 35%",
    align: "center",
  },
  "visa-visiteur": {
    image:
      "https://images.unsplash.com/photo-1436491865332-7a61a109c0f2?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
  "immigration-permanente": {
    image:
      "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
  "montage-dossier-complet": {
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
  "evaluation-gratuite": {
    image:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=2000",
    position: "center 38%",
    align: "center",
  },
}

const destinationHeroBackgrounds: Record<string, HeroBackgroundConfig> = {
  canada: {
    image:
      "https://images.unsplash.com/photo-1503614472-8c93d56e92ce?auto=format&fit=crop&q=80&w=2000",
    position: "center 48%",
    align: "center",
  },
  "etats-unis": {
    image:
      "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&q=80&w=2000",
    position: "center 42%",
    align: "center",
  },
  europe: {
    image:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&q=80&w=2000",
    position: "center center",
    align: "center",
  },
}

export type StaticHeroPageKey = keyof typeof pageHeroBackgrounds

export function getStaticHeroBackground(page: StaticHeroPageKey) {
  return pageHeroBackgrounds[page]
}

export function getServiceHeroBackground(slug: string) {
  return serviceHeroBackgrounds[slug] ?? pageHeroBackgrounds.services
}

export function getDestinationHeroBackground(slug: string) {
  return destinationHeroBackgrounds[slug] ?? pageHeroBackgrounds.destinations
}

export function getDefaultHeroBackground() {
  return defaultHeroBackground
}
