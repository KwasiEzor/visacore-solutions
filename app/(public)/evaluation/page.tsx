import type { Metadata } from "next"
import { LeadForm } from "@/components/public/lead-form"
import { Shield, Clock, CheckCircle } from "lucide-react"

export const metadata: Metadata = {
  title: "Évaluation gratuite",
  description: "Obtenez une évaluation gratuite de votre profil d'immigration en 24 heures. Découvrez vos options pour le Canada, les États-Unis et l'Europe.",
}

export default function EvaluationPage() {
  return (
    <>
      <section className="bg-[#0A2540] px-4 py-20 text-center text-white">
        <h1 className="text-4xl font-bold md:text-5xl">
          Évaluation gratuite de votre profil
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-lg text-white/70">
          Remplissez le formulaire ci-dessous et nos experts analyseront votre profil
          pour identifier les meilleures options d&apos;immigration pour vous.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-8">
          <div className="flex items-center gap-2 text-[#C9A227]">
            <Clock className="size-5" />
            <span className="text-sm text-white/80">Réponse en 24h</span>
          </div>
          <div className="flex items-center gap-2 text-[#C9A227]">
            <Shield className="size-5" />
            <span className="text-sm text-white/80">100% confidentiel</span>
          </div>
          <div className="flex items-center gap-2 text-[#C9A227]">
            <CheckCircle className="size-5" />
            <span className="text-sm text-white/80">Sans engagement</span>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-16">
        <div className="rounded-xl border p-6 shadow-sm lg:p-8">
          <h2 className="text-2xl font-bold text-[#0A2540]">
            Obtenez votre évaluation gratuite en 24h
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Tous les champs marqués d&apos;un * sont obligatoires.
          </p>
          <div className="mt-6">
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  )
}
