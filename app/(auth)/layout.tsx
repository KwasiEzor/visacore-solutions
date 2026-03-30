import Image from "next/image"
import { ArrowUpRight, BadgeCheck, FileLock2, ShieldCheck, UserRoundSearch } from "lucide-react"

const trustPoints = [
  {
    title: "Etapes partagees en temps reel",
    description:
      "Consultez l'avancement de votre procedure, les validations recues et les prochaines actions attendues.",
    icon: UserRoundSearch,
  },
  {
    title: "Documents transmis en espace protege",
    description:
      "Les pieces demandees et les retours de controle restent centralises dans votre espace client securise.",
    icon: FileLock2,
  },
  {
    title: "Suivi trace par VisaCore",
    description:
      "Chaque mise a jour importante est historisee pour garder un dossier clair, lisible et fiable.",
    icon: BadgeCheck,
  },
]

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]">
      <div className="relative hidden lg:flex lg:w-[51%] lg:flex-col lg:justify-between lg:overflow-hidden lg:bg-[#0A2540] lg:px-10 lg:py-9 xl:px-14 xl:py-12">
        <div className="absolute -right-24 top-12 size-72 rounded-full bg-[#C9A227]/18 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-black/18 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-px bg-white/8" />

        <div className="relative z-10 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/62">
          <ShieldCheck className="size-3.5 text-[#C9A227]" />
          Espace securise
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-10">
          <div className="max-w-xl space-y-8">
            <div className="inline-flex rounded-[34px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_90px_-50px_rgba(0,0,0,0.65)]">
              <Image
                src="/images/visacore_solutions_globe_logo.png"
                alt="VisaCore Solutions"
                width={640}
                height={525}
                className="h-auto w-52"
                style={{
                  filter: "brightness(1.18) invert(0.03) contrast(1.08) saturate(1.1)",
                }}
              />
            </div>

            <div className="max-w-lg space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#C9A227]">
                VisaCore Solutions
              </p>
              <h1 className="text-4xl font-black leading-[0.95] text-white xl:text-[3.35rem]">
                Suivez votre procedure dans un espace calme, securise et parfaitement lisible.
              </h1>
              <p className="max-w-lg text-lg leading-8 text-white/68">
                Acces client et suivi interne restent coordonnes dans le meme environnement:
                etapes partagees, documents demandes, mises a jour dossier et liens d&apos;activation traces.
              </p>
            </div>

            <div className="grid gap-4">
              {trustPoints.map((point) => {
                const Icon = point.icon
                return (
                  <div
                    key={point.title}
                    className="grid grid-cols-[auto_1fr] gap-4 rounded-[28px] border border-white/10 bg-white/6 px-5 py-4 shadow-[0_20px_60px_-46px_rgba(0,0,0,0.7)]"
                  >
                    <div className="mt-1 inline-flex size-10 items-center justify-center rounded-2xl bg-[#C9A227]/16 text-[#F4CC57]">
                      <Icon className="size-4.5" />
                    </div>
                    <div className="space-y-1.5">
                      <h2 className="text-sm font-bold text-white">{point.title}</h2>
                      <p className="text-sm leading-6 text-white/62">{point.description}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 text-sm text-white/68 xl:grid-cols-[1.2fr_1fr]">
          <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4">
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1">
                <p className="text-xs font-black uppercase tracking-[0.24em] text-white/42">
                  Acces temporaire
                </p>
                <p className="leading-6">
                  Premiere connexion et recuperation d&apos;acces passent par des liens securises et expires.
                </p>
              </div>
              <ArrowUpRight className="size-4 shrink-0 text-[#C9A227]" />
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-white/6 px-5 py-4 text-white/60">
            Vos documents et informations sensibles restent visibles uniquement dans les espaces autorises.
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-5 py-10 sm:px-10 lg:px-12 xl:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(10,37,64,0.08),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-5xl">
          <div className="mb-8 space-y-3 text-center lg:hidden">
            <Image
              src="/images/visacore_solution_logo.png"
              alt="VisaCore Solutions"
              width={1094}
              height={315}
              className="mx-auto h-12 w-auto"
            />
            <p className="text-sm font-bold uppercase tracking-[0.24em] text-visacore-gold">
              Espace securise
            </p>
            <p className="mx-auto max-w-md text-sm leading-6 text-muted-foreground">
              Consultez vos etapes, transmettez vos documents et retrouvez les mises a jour partagees par votre conseiller.
            </p>
          </div>

          <div className="rounded-[38px] border border-visacore-navy/8 bg-white/94 p-4 shadow-[0_32px_90px_-56px_rgba(10,37,64,0.35)] backdrop-blur-sm sm:p-6 lg:p-7">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
