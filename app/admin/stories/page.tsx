import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StoriesClient } from "@/components/admin/stories-client"

export default async function StoriesAdminPage() {
  const stories = await prisma.successStory.findMany({
    orderBy: { createdAt: "desc" },
  })

  const data = stories.map((s) => ({
    id: s.id,
    title: s.title,
    clientName: s.clientName,
    destination: s.destination,
    published: s.published,
    updatedAt: s.updatedAt.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }),
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Success Stories
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les histoires de réussite.{" "}
            {stories.length} story
            {stories.length !== 1 ? "s" : ""}.
          </p>
        </div>
        <Link href="/admin/stories/new">
          <Button>
            <Plus className="size-4" data-icon="inline-start" />
            Nouvelle story
          </Button>
        </Link>
      </div>

      <StoriesClient data={data} />
    </div>
  )
}
