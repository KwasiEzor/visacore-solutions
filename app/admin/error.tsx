"use client"

import { AlertTriangle } from "lucide-react"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center max-w-md w-full">
        <div className="inline-flex size-16 items-center justify-center rounded-full bg-red-50 mb-6">
          <AlertTriangle className="size-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Erreur du tableau de bord
        </h2>
        <p className="text-gray-500 mb-6">
          Une erreur s&apos;est produite lors du chargement de cette section.
        </p>
        {error.digest && (
          <p className="text-xs text-gray-400 mb-4 font-mono">Réf: {error.digest}</p>
        )}
        <button
          onClick={reset}
          className="px-6 py-2.5 rounded-lg bg-visacore-navy text-white font-semibold hover:bg-visacore-navy/90 transition-colors"
        >
          Réessayer
        </button>
      </div>
    </div>
  )
}
