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
  phone?: string | null
  subject: string
  message: string
  notes?: string | null
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
      [
        row.fullName,
        row.email,
        row.phone ?? "",
        row.subject,
        row.message,
        row.notes ?? "",
      ].some((value) => value.toLowerCase().includes(query))

    return matchesStatus && matchesReadState && matchesQuery
  })
}

export interface AppointmentTableRow {
  id: string
  fullName: string
  email: string
  phone: string
  serviceType: string | null
  destinationType: string | null
  preferredDateLabel: string
  preferredTime: string | null
  message: string | null
  notes: string | null
  status: string
  assignedToId: string | null
  assignedToName: string | null
  createdAtLabel: string
}

export function filterAppointmentRows(
  rows: AppointmentTableRow[],
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
        row.phone,
        row.serviceType ?? "",
        row.destinationType ?? "",
        row.message ?? "",
        row.notes ?? "",
        row.assignedToName ?? "",
      ].some((value) => value.toLowerCase().includes(query))

    return matchesStatus && matchesQuery
  })
}

export interface PrivacyRequestTableRow {
  id: string
  fullName: string
  email: string
  phone: string | null
  requestType: string
  status: string
  resolutionNotes: string | null
  createdAtLabel: string
}

export function filterPrivacyRequestRows(
  rows: PrivacyRequestTableRow[],
  filters: {
    query: string
    requestType: string
    status: string
  }
) {
  const query = filters.query.trim().toLowerCase()

  return rows.filter((row) => {
    const matchesType =
      filters.requestType === "ALL" ||
      row.requestType === filters.requestType

    const matchesStatus =
      filters.status === "ALL" || row.status === filters.status

    const matchesQuery =
      query.length === 0 ||
      [
        row.fullName,
        row.email,
        row.phone ?? "",
        row.requestType,
        row.resolutionNotes ?? "",
      ].some((value) => value.toLowerCase().includes(query))

    return matchesType && matchesStatus && matchesQuery
  })
}

export interface ConversationTableRow {
  id: string
  title: string
  sessionId: string
  updatedAtLabel: string
  latestMessagePreview: string
  messageCount: number
}

export function filterConversationRows<T extends ConversationTableRow>(
  rows: T[],
  query: string
) {
  const normalizedQuery = query.trim().toLowerCase()

  return rows.filter((row) => {
    if (normalizedQuery.length === 0) return true

    return [
      row.title,
      row.sessionId,
      row.latestMessagePreview,
      String(row.messageCount),
    ].some((value) => value.toLowerCase().includes(normalizedQuery))
  })
}
