import { DestinationForm } from "@/components/admin/destination-form"

export default function NewDestinationPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Nouvelle destination
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Créez une nouvelle destination d&apos;immigration.
        </p>
      </div>
      <DestinationForm />
    </div>
  )
}
