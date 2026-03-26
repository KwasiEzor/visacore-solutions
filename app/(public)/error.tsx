"use client"

import Link from "next/link"

export default function PublicError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-lg">
        <div className="inline-flex size-20 items-center justify-center rounded-full bg-visacore-navy/5 mb-8">
          <span className="text-4xl">⚠</span>
        </div>
        <h1 className="text-3xl font-black text-visacore-navy mb-4">
          Oups, quelque chose s&apos;est mal passé
        </h1>
        <p className="text-lg text-visacore-navy/60 mb-8">
          Nous nous excusons pour ce désagrément. Veuillez réessayer ou retourner à la page d&apos;accueil.
        </p>
        {error.digest && (
          <p className="text-sm text-visacore-navy/30 mb-6">Réf: {error.digest}</p>
        )}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full bg-visacore-gold text-white font-bold hover:bg-visacore-gold-dark transition-colors"
          >
            Réessayer
          </button>
          <Link
            href="/"
            className="px-8 py-3 rounded-full border-2 border-visacore-navy/20 text-visacore-navy font-bold hover:border-visacore-navy/40 transition-colors"
          >
            Accueil
          </Link>
        </div>
      </div>
    </div>
  )
}
