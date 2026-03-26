import { type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface StatsCardProps {
  title: string
  value: number | string
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    label: string
  }
  className?: string
  iconClassName?: string
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  description,
  trend,
  className,
  iconClassName,
}: StatsCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-muted-foreground">
            {title}
          </span>
          <span className="text-3xl font-bold tracking-tight text-foreground">
            {value}
          </span>
          {description && (
            <span className="text-xs text-muted-foreground">{description}</span>
          )}
          {trend && (
            <div className="mt-1 flex items-center gap-1">
              <span
                className={cn(
                  "text-xs font-medium",
                  trend.value >= 0 ? "text-emerald-600" : "text-red-600"
                )}
              >
                {trend.value >= 0 ? "+" : ""}
                {trend.value}%
              </span>
              <span className="text-xs text-muted-foreground">
                {trend.label}
              </span>
            </div>
          )}
        </div>
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg",
            iconClassName ?? "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  )
}
