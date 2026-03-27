export function parseOptionalJsonField(label: string, value: unknown) {
  if (typeof value !== "string" || value.trim() === "") {
    return { success: true as const, value: null }
  }

  try {
    return { success: true as const, value: JSON.parse(value) }
  } catch {
    return {
      success: false as const,
      error: `Le champ "${label}" contient un JSON invalide.`,
    }
  }
}

export function extractValidationMessages(value: unknown): string[] {
  const messages = new Set<string>()

  function walk(entry: unknown) {
    if (!entry) return

    if (typeof entry === "string") {
      const trimmed = entry.trim()
      if (trimmed) {
        messages.add(trimmed)
      }
      return
    }

    if (Array.isArray(entry)) {
      for (const item of entry) {
        walk(item)
      }
      return
    }

    if (typeof entry === "object") {
      for (const [key, objectValue] of Object.entries(entry)) {
        if (key === "message" && typeof objectValue === "string") {
          const trimmed = objectValue.trim()
          if (trimmed) {
            messages.add(trimmed)
          }
        } else {
          walk(objectValue)
        }
      }
    }
  }

  walk(value)
  return [...messages]
}

export interface LeadTableRow {
  id: string
  fullName: string
  email: string
  destination: string
  status: string
  assignedToName: string | null
  createdAtLabel: string
}

export function filterLeadRows(
  rows: LeadTableRow[],
  filters: {
    query: string
    status: string
  }
) {
  const query = filters.query.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesStatus =
      filters.status === "ALL" || row.status === filters.status

    const matchesQuery =
      query.length === 0 ||
      [
        row.fullName,
        row.email,
        row.destination,
        row.assignedToName ?? "",
      ].some((value) => value.toLowerCase().includes(query))

    return matchesStatus && matchesQuery
  })
}

export interface ContactTableRow {
  id: string
  fullName: string
  email: string
  subject: string
  message: string
  status: string
  isRead: boolean
  createdAtLabel: string
}

export function filterContactRows(
  rows: ContactTableRow[],
  filters: {
    query: string
    status: string
    readState: "ALL" | "READ" | "UNREAD"
  }
) {
  const query = filters.query.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesStatus =
      filters.status === "ALL" || row.status === filters.status

    const matchesReadState =
      filters.readState === "ALL" ||
      (filters.readState === "READ" && row.isRead) ||
      (filters.readState === "UNREAD" && !row.isRead)

    const matchesQuery =
      query.length === 0 ||
      [row.fullName, row.email, row.subject, row.message].some((value) =>
        value.toLowerCase().includes(query)
      )

    return matchesStatus && matchesReadState && matchesQuery
  })
}
