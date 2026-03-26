import { cn } from "@/lib/utils"

type StatusVariant =
  | "NEW"
  | "CONTACTED"
  | "QUALIFIED"
  | "IN_PROGRESS"
  | "CONVERTED"
  | "CLOSED"
  | "PENDING"
  | "APPROVED"
  | "CANCELLED"
  | "COMPLETED"
  | "REPLIED"
  | "ARCHIVED"
  | "default"

const statusStyles: Record<StatusVariant, string> = {
  NEW: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  CONTACTED:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  QUALIFIED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  IN_PROGRESS:
    "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  CONVERTED:
    "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  CLOSED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  APPROVED:
    "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  COMPLETED:
    "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  REPLIED:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
  ARCHIVED: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  default: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
}

const statusLabels: Record<string, string> = {
  NEW: "Nouveau",
  CONTACTED: "Contacte",
  QUALIFIED: "Qualifie",
  IN_PROGRESS: "En cours",
  CONVERTED: "Converti",
  CLOSED: "Ferme",
  PENDING: "En attente",
  APPROVED: "Approuve",
  CANCELLED: "Annule",
  COMPLETED: "Termine",
  REPLIED: "Repondu",
  ARCHIVED: "Archive",
}

type ColorVariant = "green" | "red" | "blue" | "yellow" | "gray" | "gold" | "orange" | "emerald" | "indigo"

const colorStyles: Record<ColorVariant, string> = {
  green: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
  red: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  blue: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  yellow: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
  gray: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  gold: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  orange: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400",
  emerald: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  indigo: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
}

interface StatusBadgeProps {
  status: string
  variant?: ColorVariant
  className?: string
  showDot?: boolean
}

export function StatusBadge({ status, variant: colorVariant, className, showDot = true }: StatusBadgeProps) {
  const variant = (status in statusStyles ? status : "default") as StatusVariant
  const label = statusLabels[status] ?? status
  const styles = colorVariant ? colorStyles[colorVariant] : statusStyles[variant]

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        styles,
        className
      )}
    >
      {showDot && (
        <span className="size-1.5 rounded-full bg-current opacity-70" />
      )}
      {label}
    </span>
  )
}

interface PublishedBadgeProps {
  published: boolean
  className?: string
}

export function PublishedBadge({ published, className }: PublishedBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        published
          ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
          : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {published ? "Publie" : "Brouillon"}
    </span>
  )
}

interface ReadBadgeProps {
  isRead: boolean
  className?: string
}

export function ReadBadge({ isRead, className }: ReadBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold",
        isRead
          ? "bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400"
          : "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
        className
      )}
    >
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {isRead ? "Lu" : "Non lu"}
    </span>
  )
}
