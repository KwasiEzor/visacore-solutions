import type { ReactNode } from "react"

interface LegalPageShellProps {
  eyebrow: string
  title: string
  description: string
  updatedAt: string
  children: ReactNode
  aside?: ReactNode
}

export function LegalPageShell({
  aside,
  children,
  description,
  eyebrow,
  title,
  updatedAt,
}: LegalPageShellProps) {
  return (
    <div className="overflow-hidden bg-[linear-gradient(180deg,#f7f8fb_0%,#ffffff_18%,#ffffff_100%)] pb-20 pt-32 sm:pb-24 sm:pt-36">
      <div className="container-custom">
        <div className="relative overflow-hidden rounded-[36px] border border-visacore-navy/8 bg-white px-6 py-8 shadow-[0_28px_90px_-56px_rgba(10,37,64,0.35)] sm:px-8 sm:py-10 lg:px-12 lg:py-12">
          <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-visacore-gold/40 to-transparent" />
          <div className="absolute -right-24 top-0 size-64 rounded-full bg-visacore-gold/10 blur-[120px]" />
          <div className="relative max-w-3xl">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-visacore-gold">
              {eyebrow}
            </p>
            <h1 className="mt-5 text-4xl font-black leading-[0.95] text-visacore-navy sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.2em] text-visacore-navy/42">
              {updatedAt}
            </p>
            <p className="mt-6 max-w-2xl text-base leading-8 text-visacore-navy/74 sm:text-lg">
              {description}
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(300px,0.88fr)] lg:gap-10">
          <div className="space-y-6">{children}</div>
          {aside ? <aside className="lg:sticky lg:top-28 lg:self-start">{aside}</aside> : null}
        </div>
      </div>
    </div>
  )
}
