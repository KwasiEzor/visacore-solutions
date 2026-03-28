import Image from "next/image"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_100%)]">
      <div className="relative hidden lg:flex lg:w-[48%] lg:flex-col lg:justify-between lg:overflow-hidden lg:bg-[#0A2540] lg:p-12 xl:p-14">
        <div className="absolute -right-24 top-12 size-72 rounded-full bg-[#C9A227]/18 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-56 w-full bg-gradient-to-t from-black/18 to-transparent" />

        <div className="relative z-10 inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/6 px-4 py-2 text-xs font-black uppercase tracking-[0.24em] text-white/55">
          Espace securise
        </div>

        <div className="relative z-10 flex flex-1 items-center justify-center py-12">
          <div className="max-w-lg space-y-7 text-center">
            <div className="mx-auto inline-flex rounded-[34px] border border-white/10 bg-white/6 p-6 shadow-[0_24px_90px_-50px_rgba(0,0,0,0.65)]">
              <Image
                src="/images/visacore_solutions_globe_logo.png"
                alt="VisaCore Solutions"
                width={640}
                height={525}
                className="h-auto w-52"
              />
            </div>

            <div className="space-y-4">
              <p className="text-xs font-black uppercase tracking-[0.32em] text-[#C9A227]">
                VisaCore Solutions
              </p>
              <h1 className="text-4xl font-black leading-[0.95] text-white xl:text-5xl">
                Un acces admin plus net, plus calme, plus fiable.
              </h1>
              <p className="mx-auto max-w-md text-lg leading-8 text-white/68">
                Connectez-vous a l&apos;espace d&apos;administration pour suivre les leads,
                les rendez-vous et les contenus dans un environnement securise.
              </p>
            </div>
          </div>
        </div>

        <div className="relative z-10 grid gap-4 text-sm text-white/65">
          <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
            Acces reserve aux collaborateurs autorises et journalisation des actions sensibles.
          </div>
          <div className="rounded-[26px] border border-white/10 bg-white/6 p-5">
            Liens d&apos;invitation et reinitialisation securises pour l&apos;onboarding interne.
          </div>
        </div>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-6 py-12 sm:px-10 lg:px-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,162,39,0.12),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(10,37,64,0.08),transparent_30%)]" />

        <div className="relative z-10 w-full max-w-xl">
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
          </div>

          <div className="rounded-[36px] border border-visacore-navy/8 bg-white/92 p-4 shadow-[0_32px_90px_-56px_rgba(10,37,64,0.35)] backdrop-blur-sm sm:p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
