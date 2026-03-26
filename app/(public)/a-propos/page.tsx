import type { Metadata } from "next"
import { Target, Eye, Heart, Globe, MapPin, Users, Award, Shield } from "lucide-react"

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez VisaCore Solutions, votre partenaire de confiance pour l'immigration internationale depuis Lomé, Togo.",
}

const values = [
  { icon: Shield, title: "Confiance", description: "Nous bâtissons des relations durables basées sur la transparence et l'intégrité." },
  { icon: Award, title: "Excellence", description: "Nous visons l'excellence dans chaque dossier que nous traitons." },
  { icon: Heart, title: "Humanité", description: "Chaque client est unique et mérite un accompagnement personnalisé." },
  { icon: Globe, title: "Ouverture", description: "Nous croyons en un monde où chacun peut saisir les opportunités internationales." },
  { icon: Users, title: "Expertise", description: "Notre équipe combine expertise locale et connaissance approfondie des systèmes d'immigration." },
  { icon: MapPin, title: "Proximité", description: "Basés à Lomé, nous sommes proches de vous pour un accompagnement de qualité." },
]

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[#0A2540] px-4 py-20 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-bold md:text-5xl">À propos de VisaCore Solutions</h1>
          <p className="mt-4 text-lg text-white/70">
            Votre partenaire de confiance pour l&apos;immigration internationale depuis Lomé, Togo.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="mx-auto max-w-4xl px-4 py-16">
        <h2 className="text-3xl font-bold text-[#0A2540]">Notre histoire</h2>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Fondée à Lomé, Togo, VisaCore Solutions est née de la conviction que chaque personne mérite un accès
          équitable aux opportunités internationales. Notre équipe de consultants expérimentés combine expertise
          locale et connaissance approfondie des systèmes d&apos;immigration mondiaux pour offrir un accompagnement
          de qualité supérieure.
        </p>
        <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
          Depuis notre création, nous avons accompagné plus de 1000 personnes dans leurs projets d&apos;immigration
          vers le Canada, les États-Unis et l&apos;Europe. Notre taux de réussite élevé témoigne de notre engagement
          envers l&apos;excellence et notre dévouement à chaque client.
        </p>
      </section>

      {/* Mission & Vision */}
      <section className="bg-secondary/30 px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-2">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#0A2540]">
              <Target className="size-6 text-[#C9A227]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A2540]">Notre mission</h3>
            <p className="mt-3 text-muted-foreground">
              Faciliter l&apos;accès aux opportunités internationales pour les Africains en offrant un accompagnement
              professionnel, transparent et humain dans toutes les démarches d&apos;immigration.
            </p>
          </div>
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-[#0A2540]">
              <Eye className="size-6 text-[#C9A227]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0A2540]">Notre vision</h3>
            <p className="mt-3 text-muted-foreground">
              Devenir le partenaire de référence en immigration pour l&apos;Afrique de l&apos;Ouest, reconnu pour
              l&apos;excellence de son accompagnement et le succès de ses clients à l&apos;international.
            </p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center text-3xl font-bold text-[#0A2540]">Nos valeurs</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border p-6 transition-shadow hover:shadow-md">
              <value.icon className="size-8 text-[#C9A227]" />
              <h3 className="mt-4 text-lg font-semibold text-[#0A2540]">{value.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Local Presence */}
      <section className="bg-[#0A2540] px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl">
          <MapPin className="mx-auto size-10 text-[#C9A227]" />
          <h2 className="mt-4 text-3xl font-bold">Présence locale à Lomé</h2>
          <p className="mt-4 text-lg text-white/70">
            Notre bureau situé sur le Boulevard du 13 Janvier à Lomé vous accueille du lundi au vendredi
            de 8h à 18h et le samedi de 9h à 13h. Venez nous rencontrer pour discuter de votre projet.
          </p>
        </div>
      </section>
    </>
  )
}
