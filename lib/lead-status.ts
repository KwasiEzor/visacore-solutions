/**
 * Centralised lead status display constants.
 * Import from here instead of defining locally in each page.
 */

export const STATUS_LABELS: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacté",
  QUALIFIED: "Qualifié",
  IN_PROGRESS: "En cours",
  CONVERTED: "Converti",
  CLOSED: "Fermé",
}

export const STATUS_COLORS: Record<string, string> = {
  NEW: "bg-blue-500",
  CONTACTED: "bg-yellow-500",
  QUALIFIED: "bg-purple-500",
  IN_PROGRESS: "bg-orange-500",
  CONVERTED: "bg-emerald-500",
  CLOSED: "bg-gray-400",
}

export const MONTH_LABELS = [
  "Jan",
  "Fév",
  "Mar",
  "Avr",
  "Mai",
  "Juin",
  "Juil",
  "Août",
  "Sep",
  "Oct",
  "Nov",
  "Déc",
]
