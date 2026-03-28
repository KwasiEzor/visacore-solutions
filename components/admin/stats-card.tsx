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
        "rounded-[24px] border border-visacore-navy/8 bg-white p-6 shadow-[0_22px_50px_-42px_rgba(10,37,64,0.32)] transition-all hover:-translate-y-0.5 hover:shadow-[0_30px_70px_-42px_rgba(10,37,64,0.38)]",
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-xs font-black uppercase tracking-[0.18em] text-muted-foreground">
            {title}
          </span>
          <span className="text-3xl font-black tracking-tight text-foreground">
            {value}
          </span>
          {description && (
            <span className="max-w-[20rem] text-sm leading-6 text-muted-foreground">{description}</span>
          )}
          {trend && (
            <div className="mt-2 flex items-center gap-1">
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
            "flex size-12 shrink-0 items-center justify-center rounded-2xl",
            iconClassName ?? "bg-primary/10 text-primary"
          )}
        >
          <Icon className="size-6" />
        </div>
      </div>
    </div>
  )
}
