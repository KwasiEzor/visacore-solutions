"use client"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen flex items-center justify-center bg-[#0A2540] text-white">
        <div className="text-center max-w-md px-6">
          <h1 className="text-6xl font-black text-[#C9A227] mb-4">Erreur</h1>
          <p className="text-lg text-white/70 mb-8">
            Une erreur inattendue s&apos;est produite. Veuillez réessayer.
          </p>
          {error.digest && (
            <p className="text-sm text-white/40 mb-4">Code: {error.digest}</p>
          )}
          <button
            onClick={reset}
            className="px-8 py-3 rounded-full bg-[#C9A227] text-white font-bold hover:bg-[#b8911f] transition-colors"
          >
            Réessayer
          </button>
        </div>
      </body>
    </html>
  )
}
