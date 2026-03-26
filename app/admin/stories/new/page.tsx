import { StoryForm } from "@/components/admin/story-form"

export default function NewStoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Nouvelle story
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Créez une nouvelle success story.
        </p>
      </div>
      <StoryForm />
    </div>
  )
}
