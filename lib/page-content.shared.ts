import { z } from "zod"

const heroContentSchema = z.object({
  eyebrow: z
    .string()
    .trim()
    .min(1, "Le badge du hero est requis")
    .default("Expertise Mondiale • Service Local"),
  primaryCta: z
    .string()
    .trim()
    .min(1, "Le texte du bouton principal est requis"),
  secondaryCta: z
    .string()
    .trim()
    .min(1, "Le texte du bouton secondaire est requis"),
})

const trustStatSchema = z.object({
  value: z.string().trim().min(1, "La valeur du chiffre est requise"),
  label: z.string().trim().min(1, "Le libellé du chiffre est requis"),
})

const trustContentSchema = z.object({
  stats: z
    .array(trustStatSchema)
    .min(1, "Ajoutez au moins un indicateur")
    .max(6, "Limitez-vous à 6 indicateurs"),
})

const richTextContentSchema = z.object({
  text: z.string().trim().min(1, "Le texte de la section est requis"),
})

type PageContentEditorKind = "hero" | "stats" | "richText"

interface PageContentDefinition<TContent> {
  pageKey: string
  sectionKey: string
  pageLabel: string
  sectionLabel: string
  route: string
  component: string
  description: string
  editor: PageContentEditorKind
  contentSchema: z.ZodType<TContent>
  fallback: {
    title: string
    subtitle?: string
    content: TContent
  }
}

export const pageContentDefinitions = [
  {
    pageKey: "home",
    sectionKey: "hero",
    pageLabel: "Page d'accueil",
    sectionLabel: "Hero principal",
    route: "/",
    component: "app/(public)/page.tsx",
    description:
      "Bloc d'ouverture avec message principal et boutons d'action.",
    editor: "hero",
    contentSchema: heroContentSchema,
    fallback: {
      title: "Réalisez Votre Rêve d'Ailleurs",
      subtitle:
        "VisaCore Solutions simplifie l'immigration vers le Canada, les États-Unis et l'Europe. Une approche sur-mesure pour un succès garanti.",
      content: {
        eyebrow: "Expertise Mondiale • Service Local",
        primaryCta: "Évaluation Gratuite",
        secondaryCta: "Parler à un Expert",
      },
    },
  },
  {
    pageKey: "home",
    sectionKey: "trust",
    pageLabel: "Page d'accueil",
    sectionLabel: "Chiffres de confiance",
    route: "/",
    component: "app/(public)/page.tsx",
    description:
      "Statistiques affichées sous les boutons du hero pour renforcer la crédibilité.",
    editor: "stats",
    contentSchema: trustContentSchema,
    fallback: {
      title: "Pourquoi nous faire confiance",
      subtitle: "Des résultats concrets, suivis de près par notre équipe.",
      content: {
        stats: [
          { value: "98%", label: "Réussite" },
          { value: "1k+", label: "Dossiers" },
          { value: "24h", label: "Réponse" },
        ],
      },
    },
  },
  {
    pageKey: "about",
    sectionKey: "story",
    pageLabel: "À propos",
    sectionLabel: "Notre histoire",
    route: "/a-propos",
    component: "app/(public)/a-propos/page.tsx",
    description:
      "Narratif principal qui explique l'origine de VisaCore Solutions.",
    editor: "richText",
    contentSchema: richTextContentSchema,
    fallback: {
      title: "Née d'une Conviction",
      subtitle: "Une histoire locale portée par une ambition internationale.",
      content: {
        text: "Fondée à Lomé, Togo, VisaCore Solutions est née de la conviction que chaque personne mérite un accès équitable aux opportunités internationales. Notre équipe de consultants expérimentés combine expertise locale et connaissance approfondie des systèmes d'immigration mondiaux.",
      },
    },
  },
  {
    pageKey: "about",
    sectionKey: "mission",
    pageLabel: "À propos",
    sectionLabel: "Notre mission",
    route: "/a-propos",
    component: "app/(public)/a-propos/page.tsx",
    description:
      "Mission affichée dans la carte claire de la page À propos.",
    editor: "richText",
    contentSchema: richTextContentSchema,
    fallback: {
      title: "Notre Mission",
      content: {
        text: "Faciliter l'accès aux opportunités internationales pour les Africains en offrant un accompagnement professionnel, transparent et humain dans toutes les démarches d'immigration.",
      },
    },
  },
  {
    pageKey: "about",
    sectionKey: "vision",
    pageLabel: "À propos",
    sectionLabel: "Notre vision",
    route: "/a-propos",
    component: "app/(public)/a-propos/page.tsx",
    description:
      "Vision affichée dans la carte sombre de la page À propos.",
    editor: "richText",
    contentSchema: richTextContentSchema,
    fallback: {
      title: "Notre Vision",
      content: {
        text: "Devenir le partenaire de référence en immigration pour l'Afrique de l'Ouest, reconnu pour l'excellence de son accompagnement et le succès de ses clients à l'international.",
      },
    },
  },
] satisfies PageContentDefinition<unknown>[]

export type PageContentDefinitionItem = (typeof pageContentDefinitions)[number]
export type PageContentRecord = {
  pageKey: string
  sectionKey: string
  title: string | null
  subtitle: string | null
  content: unknown
  published: boolean
  order: number
}

export interface HomePageContent {
  hero: {
    title: string
    subtitle: string
    content: z.infer<typeof heroContentSchema>
  }
  trust: {
    title: string
    subtitle: string
    content: z.infer<typeof trustContentSchema>
  }
}

export interface AboutPageContent {
  story: {
    title: string
    subtitle: string
    content: z.infer<typeof richTextContentSchema>
  }
  mission: {
    title: string
    subtitle: string
    content: z.infer<typeof richTextContentSchema>
  }
  vision: {
    title: string
    subtitle: string
    content: z.infer<typeof richTextContentSchema>
  }
}

function getDefinitionKey(pageKey: string, sectionKey: string) {
  return `${pageKey}.${sectionKey}`
}

function normalizeOptionalText(value: string | null | undefined) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : undefined
}

function buildFieldErrorMap(
  issues: Array<{ path: PropertyKey[]; message: string }>
) {
  return issues.reduce<Record<string, string[]>>((acc, issue) => {
    const key =
      issue.path
        .map((segment) => (typeof segment === "symbol" ? segment.toString() : String(segment)))
        .join(".") || "form"
    if (!acc[key]) acc[key] = []
    acc[key].push(issue.message)
    return acc
  }, {})
}

export function getPageContentDefinition(pageKey: string, sectionKey: string) {
  return pageContentDefinitions.find(
    (definition) =>
      definition.pageKey === pageKey && definition.sectionKey === sectionKey
  )
}

export function getPageContentDefinitionsForPage(pageKey: string) {
  return pageContentDefinitions.filter((definition) => definition.pageKey === pageKey)
}

export function getPageContentDraft(
  pageKey: string,
  sectionKey: string,
  input: unknown
) {
  const definition = getPageContentDefinition(pageKey, sectionKey)
  if (!definition) return input

  const parsed = definition.contentSchema.safeParse(input)
  return parsed.success ? parsed.data : definition.fallback.content
}

export function validatePageContentInput(input: unknown) {
  const baseResult = z
    .object({
      pageKey: z.string().trim().min(1, "La page est requise"),
      sectionKey: z.string().trim().min(1, "La section est requise"),
      title: z.string().optional().nullable(),
      subtitle: z.string().optional().nullable(),
      content: z.unknown().optional(),
      published: z.boolean().default(true),
      order: z.number().int().default(0),
    })
    .safeParse(input)

  if (!baseResult.success) {
    return {
      success: false as const,
      error: "Données invalides",
      details: baseResult.error.flatten().fieldErrors,
    }
  }

  const definition = getPageContentDefinition(
    baseResult.data.pageKey,
    baseResult.data.sectionKey
  )

  if (!definition) {
    return {
      success: false as const,
      error: "Section non prise en charge",
      details: {
        sectionKey: [
          "Cette section n'est pas définie dans la carte de contenu publique.",
        ],
      },
    }
  }

  const title = normalizeOptionalText(baseResult.data.title)
  const subtitle = normalizeOptionalText(baseResult.data.subtitle)

  if (!title) {
    return {
      success: false as const,
      error: "Le titre est requis",
      details: {
        title: ["Le titre de la section est requis."],
      },
    }
  }

  const contentResult = definition.contentSchema.safeParse(
    baseResult.data.content ?? definition.fallback.content
  )

  if (!contentResult.success) {
    return {
      success: false as const,
      error: "Le contenu de la section est invalide",
      details: buildFieldErrorMap(contentResult.error.issues),
    }
  }

  return {
    success: true as const,
    data: {
      ...baseResult.data,
      title,
      subtitle,
      content: contentResult.data,
    },
  }
}

function resolveSectionContent(
  pageKey: string,
  sectionKey: string,
  records: PageContentRecord[]
) {
  const definition = getPageContentDefinition(pageKey, sectionKey)
  if (!definition) {
    throw new Error(`Unknown page content definition: ${pageKey}.${sectionKey}`)
  }

  const record = records.find(
    (item) => item.pageKey === pageKey && item.sectionKey === sectionKey && item.published
  )

  const parsedContent = definition.contentSchema.safeParse(
    record?.content ?? definition.fallback.content
  )

  return {
    title: normalizeOptionalText(record?.title) ?? definition.fallback.title,
    subtitle:
      normalizeOptionalText(record?.subtitle) ?? definition.fallback.subtitle ?? "",
    content: parsedContent.success ? parsedContent.data : definition.fallback.content,
  }
}

export function buildHomePageContent(records: PageContentRecord[]): HomePageContent {
  return {
    hero: resolveSectionContent("home", "hero", records) as HomePageContent["hero"],
    trust: resolveSectionContent("home", "trust", records) as HomePageContent["trust"],
  }
}

export function buildAboutPageContent(records: PageContentRecord[]): AboutPageContent {
  return {
    story: resolveSectionContent("about", "story", records) as AboutPageContent["story"],
    mission: resolveSectionContent(
      "about",
      "mission",
      records
    ) as AboutPageContent["mission"],
    vision: resolveSectionContent("about", "vision", records) as AboutPageContent["vision"],
  }
}

export function groupPageContentRecords(records: PageContentRecord[]) {
  return records.reduce<Record<string, PageContentRecord[]>>((acc, record) => {
    const key = getDefinitionKey(record.pageKey, record.sectionKey)
    if (!acc[key]) acc[key] = []
    acc[key].push(record)
    return acc
  }, {})
}
