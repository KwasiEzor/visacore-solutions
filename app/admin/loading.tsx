export default function AdminLoading() {
  return (
    <div className="flex h-full w-full items-center justify-center p-8">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#C9A227] border-t-transparent" />
        <p className="text-sm font-medium text-muted-foreground animate-pulse">
          Chargement de l&apos;espace administration...
        </p>
      </div>
    </div>
  )
}
