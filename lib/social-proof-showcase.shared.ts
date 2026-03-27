export interface ShowcaseTestimonialItem {
  id: string
  clientName: string
  destination: string | null
  content: string
  rating: number
  featured: boolean
}

export interface ShowcaseStoryItem {
  id: string
  title: string
  slug: string
  clientName: string
  destination: string
  summary: string | null
  content: string | null
}

export function wrapCarouselIndex(index: number, length: number) {
  if (length <= 0) {
    return 0
  }

  return ((index % length) + length) % length
}

export function buildStoryExcerpt(
  summary?: string | null,
  content?: string | null,
  maxLength = 180
) {
  const source = summary?.trim() || content?.trim() || ""

  if (!source) {
    return "Un parcours structuré, accompagné de bout en bout par VisaCore Solutions."
  }

  if (source.length <= maxLength) {
    return source
  }

  return `${source.slice(0, maxLength).trimEnd()}…`
}

export function buildStoryReadTime(content?: string | null) {
  const words = content?.trim().split(/\s+/).filter(Boolean).length ?? 0
  const minutes = Math.max(1, Math.round(words / 160))

  return `${minutes} min`
}
