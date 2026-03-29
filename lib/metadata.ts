import type { Metadata } from "next"

const DEFAULT_SITE_URL = "https://visacore-solutions.com"
const DEFAULT_SITE_NAME = "VisaCore Solutions"
const DEFAULT_DESCRIPTION =
  "Experts en immigration vers le Canada, les États-Unis et l'Europe. Accompagnement complet pour vos projets d'immigration depuis Lomé, Togo."

function normalizeSiteUrl(url: string) {
  return url.endsWith("/") ? url.slice(0, -1) : url
}

export function getSiteUrl() {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL)
}

export function getMetadataBase() {
  return new URL(getSiteUrl())
}

export function getAbsoluteUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${getSiteUrl()}${normalizedPath}`
}

function getShareTitle(title?: string) {
  return title ? `${title} | ${DEFAULT_SITE_NAME}` : DEFAULT_SITE_NAME
}

interface BuildPageMetadataInput {
  path: string
  title?: string
  description?: string
  imagePath?: string
  imageAlt?: string
  type?: "website" | "article"
}

export function buildPageMetadata({
  path,
  title,
  description = DEFAULT_DESCRIPTION,
  imagePath = "/opengraph-image",
  imageAlt,
  type = "website",
}: BuildPageMetadataInput): Metadata {
  const url = getAbsoluteUrl(path)
  const imageUrl = getAbsoluteUrl(imagePath)
  const shareTitle = getShareTitle(title)

  return {
    title,
    description,
    alternates: {
      canonical: path,
    },
    openGraph: {
      type,
      locale: "fr_FR",
      siteName: DEFAULT_SITE_NAME,
      url,
      title: shareTitle,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt || shareTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: shareTitle,
      description,
      images: [imageUrl],
    },
  }
}

