import type {
  StructuredCardItem,
  VisaCategoryItem,
} from "@/lib/content-structures"

export function createEmptyStructuredCardItem(): StructuredCardItem {
  return {
    title: "",
    description: "",
  }
}

export function createEmptyVisaCategoryItem(): VisaCategoryItem {
  return {
    name: "",
    description: "",
    duration: undefined,
  }
}

export function normalizeStructuredCardItemDraft(
  items: StructuredCardItem[] | null | undefined
) {
  if (!items || items.length === 0) {
    return [createEmptyStructuredCardItem()]
  }

  return items.map((item) => ({
    title: item.title ?? "",
    description: item.description ?? "",
  }))
}

export function normalizeVisaCategoryDraft(
  items: VisaCategoryItem[] | null | undefined
) {
  if (!items || items.length === 0) {
    return [createEmptyVisaCategoryItem()]
  }

  return items.map((item) => ({
    name: item.name ?? "",
    description: item.description ?? "",
    duration: item.duration?.trim() || undefined,
  }))
}

export function prepareStructuredCardItemsForSubmit(
  items: StructuredCardItem[],
  label: string
) {
  const normalized = items
    .map((item) => ({
      title: item.title.trim(),
      description: item.description.trim(),
    }))
    .filter((item) => item.title || item.description)

  if (normalized.some((item) => !item.title)) {
    return {
      success: false as const,
      error: `Chaque ligne de "${label}" doit contenir un titre.`,
    }
  }

  return {
    success: true as const,
    value: normalized.length > 0 ? normalized : null,
  }
}

export function prepareVisaCategoriesForSubmit(items: VisaCategoryItem[]) {
  const normalized = items
    .map((item) => ({
      name: item.name.trim(),
      description: item.description.trim(),
      duration: item.duration?.trim() || undefined,
    }))
    .filter((item) => item.name || item.description || item.duration)

  if (normalized.some((item) => !item.name)) {
    return {
      success: false as const,
      error: 'Chaque ligne de "Catégories de visa" doit contenir un nom.',
    }
  }

  return {
    success: true as const,
    value: normalized.length > 0 ? normalized : null,
  }
}
