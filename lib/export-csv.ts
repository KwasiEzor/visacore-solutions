export function exportToCSV<T extends object>(
  data: T[],
  columns: { key: keyof T; label: string }[],
  filename: string
) {
  if (data.length === 0) return

  const header = columns.map((c) => c.label).join(",")
  const rows = data.map((row) =>
    columns
      .map((c) => {
        const val = row[c.key]
        const str = val === null || val === undefined ? "" : String(val)
        return `"${str.replace(/"/g, '""')}"`
      })
      .join(",")
  )

  const csv = [header, ...rows].join("\n")
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const link = document.createElement("a")
  link.href = url
  link.download = `${filename}.csv`
  link.click()
  URL.revokeObjectURL(url)
}
