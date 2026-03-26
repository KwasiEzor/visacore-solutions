import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { StoryForm } from "@/components/admin/story-form"

export default async function EditStoryPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const story = await prisma.successStory.findUnique({
    where: { id },
  })

  if (!story) notFound()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Modifier la story
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Modifiez l&apos;histoire de {story.clientName}.
        </p>
      </div>
      <StoryForm
        initialData={{
          id: story.id,
          title: story.title,
          slug: story.slug,
          clientName: story.clientName,
          destination: story.destination,
          summary: story.summary || "",
          content: story.content || "",
          images: story.images ? JSON.stringify(story.images, null, 2) : "",
          published: story.published,
          seoTitle: story.seoTitle || "",
          seoDescription: story.seoDescription || "",
        }}
      />
    </div>
  )
}
