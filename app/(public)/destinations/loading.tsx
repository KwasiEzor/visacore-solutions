export default function DestinationsLoading() {
  return (
    <div className="container mx-auto px-4 py-24">
      <div className="mb-12 space-y-4">
        <div className="h-10 w-64 animate-pulse rounded bg-muted" />
        <div className="h-6 w-96 animate-pulse rounded bg-muted" />
      </div>
      
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
            <div className="h-64 w-full animate-pulse bg-muted" />
            <div className="p-6 space-y-4">
              <div className="h-6 w-3/4 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="pt-4">
                <div className="h-10 w-full animate-pulse rounded bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
