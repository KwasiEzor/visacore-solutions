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

export function buildVisiblePaginationIndices(
  length: number,
  selectedIndex: number,
  maxVisible = 5
) {
  if (length <= 0 || maxVisible <= 0) {
    return []
  }

  const safeSelectedIndex = wrapCarouselIndex(selectedIndex, length)
  const visibleCount = Math.min(length, maxVisible)

  if (visibleCount === length) {
    return Array.from({ length }, (_, index) => index)
  }

  const halfWindow = Math.floor(visibleCount / 2)
  let start = safeSelectedIndex - halfWindow
  let end = start + visibleCount

  if (start < 0) {
    start = 0
    end = visibleCount
  }

  if (end > length) {
    end = length
    start = length - visibleCount
  }

  return Array.from({ length: visibleCount }, (_, offset) => start + offset)
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

export function buildTestimonialExcerpt(content: string, maxLength = 240) {
  const source = content.trim()

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
