import { prisma } from "@/lib/prisma"
import { ContentClient } from "@/components/admin/content-client"
import { getPageContentDefinition, pageContentDefinitions } from "@/lib/page-content.shared"

export default async function ContentAdminPage() {
  const contents = await prisma.pageContent.findMany({
    orderBy: [{ pageKey: "asc" }, { order: "asc" }],
  })

  const contentMap = new Map(
    contents.map((content) => [
      `${content.pageKey}.${content.sectionKey}`,
      content,
    ])
  )

  const supportedSections = pageContentDefinitions.map((definition) => {
    const content = contentMap.get(`${definition.pageKey}.${definition.sectionKey}`)

    return {
      id: content?.id ?? `${definition.pageKey}.${definition.sectionKey}`,
      pageKey: definition.pageKey,
      sectionKey: definition.sectionKey,
      pageLabel: definition.pageLabel,
      sectionLabel: definition.sectionLabel,
      route: definition.route,
      component: definition.component,
      description: definition.description,
      title: content?.title ?? definition.fallback.title,
      subtitle: content?.subtitle ?? definition.fallback.subtitle ?? null,
      content: content?.content ?? definition.fallback.content,
      published: content?.published ?? true,
      order: content?.order ?? 0,
      existsInDatabase: !!content,
    }
  })

  const unsupportedSections = contents
    .filter((content) => !getPageContentDefinition(content.pageKey, content.sectionKey))
    .map((content) => ({
      id: content.id,
      pageKey: content.pageKey,
      sectionKey: content.sectionKey,
      title: content.title,
    }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion du contenu</h1>
      <ContentClient data={supportedSections} unsupportedSections={unsupportedSections} />
    </div>
  )
}
