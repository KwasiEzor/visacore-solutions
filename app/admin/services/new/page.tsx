import { ServiceForm } from "@/components/admin/service-form"

export default function NewServicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Nouveau service</h2>
        <p className="mt-1 text-sm text-muted-foreground">Créez un nouveau service.</p>
      </div>
      <ServiceForm />
    </div>
  )
}
