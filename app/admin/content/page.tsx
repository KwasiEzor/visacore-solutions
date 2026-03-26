import { prisma } from "@/lib/prisma"
import { ContentClient } from "@/components/admin/content-client"

export default async function ContentAdminPage() {
  const contents = await prisma.pageContent.findMany({
    orderBy: [{ pageKey: "asc" }, { order: "asc" }],
  })

  const serialized = contents.map((c) => ({
    id: c.id,
    pageKey: c.pageKey,
    sectionKey: c.sectionKey,
    title: c.title,
    subtitle: c.subtitle,
    content: c.content ? JSON.stringify(c.content, null, 2) : null,
    published: c.published,
    order: c.order,
  }))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gestion du contenu</h1>
      <ContentClient data={serialized} />
    </div>
  )
}
